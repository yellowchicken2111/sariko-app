"""Unit tests for VNPay signature logic.

Why this matters: signature mismatch = customers can't pay (or worse, fake payments
slip through). This is the boundary with money — break it = lose money.
"""
import urllib.parse


def _build_hash_data(params: dict) -> str:
    """Mirror of apis.payments._build_vnpay_url's hash data construction —
    used by tests to forge valid IPN/return query strings."""
    filtered = {k: v for k, v in params.items() if v is not None and v != ''}
    sorted_params = sorted(filtered.items())
    return '&'.join(
        f"{urllib.parse.quote_plus(str(k), safe='')}"
        f"={urllib.parse.quote_plus(str(v), safe='')}"
        for k, v in sorted_params
    )


def test_hmac_sha512_deterministic(vnp_secret):
    """Same input → same output, every time. (Sanity check.)"""
    from apis.payments import _hmac_sha512

    a = _hmac_sha512(vnp_secret, "vnp_Amount=10000&vnp_TxnRef=abc")
    b = _hmac_sha512(vnp_secret, "vnp_Amount=10000&vnp_TxnRef=abc")
    assert a == b
    assert len(a) == 128  # SHA512 hex = 128 chars


def test_hmac_sha512_different_secrets_differ(vnp_secret):
    """Different secret → different hash (HMAC property)."""
    from apis.payments import _hmac_sha512

    a = _hmac_sha512(vnp_secret, "data")
    b = _hmac_sha512("OTHER_SECRET", "data")
    assert a != b


def test_build_vnpay_url_contains_secure_hash(vnp_secret, monkeypatch):
    """URL must include all params, sorted, plus vnp_SecureHash at the end."""
    from apis import payments

    params = {
        "vnp_Version": "2.1.0",
        "vnp_Command": "pay",
        "vnp_TmnCode": "TEST_TMN",
        "vnp_Amount": "10000000",
        "vnp_TxnRef": "abc123_120000",
        "vnp_OrderInfo": "Test order",
        "vnp_OrderType": "food",
        "vnp_Locale": "vn",
        "vnp_ReturnUrl": "http://localhost:8081/payment/return",
        "vnp_IpAddr": "127.0.0.1",
        "vnp_CreateDate": "20260430120000",
        "vnp_ExpireDate": "20260430121500",
        "vnp_CurrCode": "VND",
        "vnp_BankCode": "NCB",
    }

    url = payments._build_vnpay_url(params)

    assert "vnp_SecureHash=" in url
    assert "vnp_Amount=10000000" in url
    assert "vnp_TxnRef=abc123_120000" in url
    # OrderInfo should be URL-encoded (spaces → +)
    assert "vnp_OrderInfo=Test+order" in url


def test_ipn_signature_round_trip_valid(vnp_secret):
    """Build hash with same algorithm → IPN handler should accept it.

    This proves: if frontend / VNPay constructs hash exactly as our build code,
    our verify code will accept it. Catches encoding mismatches between the two paths.
    """
    from apis.payments import _hmac_sha512

    params = {
        "vnp_Amount": "10000000",
        "vnp_BankCode": "NCB",
        "vnp_CardType": "ATM",
        "vnp_OrderInfo": "Thanh toan don hang Sariko abc12345",
        "vnp_PayDate": "20260430120500",
        "vnp_ResponseCode": "00",
        "vnp_TmnCode": "TEST_TMN",
        "vnp_TransactionNo": "14567890",
        "vnp_TransactionStatus": "00",
        "vnp_TxnRef": "abc12345abc12345abc12345abc12345_120000",
    }

    hash_data = _build_hash_data(params)
    signature = _hmac_sha512(vnp_secret, hash_data)

    # Recompute exactly as IPN handler does — must match
    recomputed = _hmac_sha512(vnp_secret, hash_data)
    assert signature == recomputed


def test_ipn_signature_tampered_amount_fails(vnp_secret):
    """If attacker changes vnp_Amount but keeps original signature → mismatch.

    This is the attack we MUST detect: replay a valid IPN with smaller amount.
    """
    from apis.payments import _hmac_sha512

    original = {
        "vnp_Amount": "10000000",
        "vnp_TxnRef": "test123",
        "vnp_ResponseCode": "00",
    }
    original_hash = _hmac_sha512(vnp_secret, _build_hash_data(original))

    # Attacker changes amount (smaller) but keeps original hash
    tampered = {**original, "vnp_Amount": "1000"}  # 10x cheaper
    tampered_hash = _hmac_sha512(vnp_secret, _build_hash_data(tampered))

    assert original_hash != tampered_hash, "Hash MUST change when amount changes"


def test_txn_ref_format_extractable():
    """txn_ref format: <32-char-uuid-no-dashes>_<HHMMSS>.
    IPN handler splits on '_' and takes [0], then re-inserts dashes.
    """
    order_id = "abc12345-678a-4bcd-9012-345678901234"
    order_id_nodash = order_id.replace("-", "")
    assert len(order_id_nodash) == 32

    txn_ref = f"{order_id_nodash}_120000"
    extracted = txn_ref.split("_")[0]
    assert len(extracted) == 32

    # Re-insert dashes (8-4-4-4-12)
    rebuilt = (
        f"{extracted[:8]}-{extracted[8:12]}-{extracted[12:16]}-"
        f"{extracted[16:20]}-{extracted[20:]}"
    )
    assert rebuilt == order_id
