import os
import hmac
import hashlib
import logging
import uuid
from datetime import datetime, timedelta, timezone

import requests
from fastapi import APIRouter, HTTPException, Header, status

from dao.dao_refunds import DAORefunds
from dao.dao_payments import DAOPayments

router = APIRouter(prefix="/admin/refunds")
logger = logging.getLogger(__name__)

ADMIN_API_KEY = os.getenv("ADMIN_API_KEY", "")
VNPAY_TMN_CODE = os.getenv("VNPAY_TMN_CODE", "")
VNPAY_HASH_SECRET = os.getenv("VNPAY_HASH_SECRET", "")
VNPAY_API_URL = os.getenv(
    "VNPAY_API_URL",
    "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction",
)


def _verify_admin_key(x_api_key: str = Header(...)):
    if not ADMIN_API_KEY or x_api_key != ADMIN_API_KEY:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")


def _hmac_sha512(key: str, data: str) -> str:
    return hmac.new(key.encode(), data.encode(), hashlib.sha512).hexdigest()


def _build_refund_hash(fields: list[str]) -> str:
    # VNPay refund hash: pipe-separated in fixed field order (not alphabetical)
    return _hmac_sha512(VNPAY_HASH_SECRET, "|".join(fields))


def _call_vnpay_refund(refund: dict) -> dict:
    """Call VNPay Refund API. Returns VNPay response dict."""
    ipn_data = refund.get("ipn_data") or {}

    now = datetime.now(timezone.utc) + timedelta(hours=7)
    create_date = now.strftime("%Y%m%d%H%M%S")
    request_id = uuid.uuid4().hex[:16].upper()

    txn_ref = refund.get("original_txn_ref") or ""
    amount = str(int(float(refund["amount"])) * 100)
    transaction_no = ipn_data.get("vnp_TransactionNo", "0")
    transaction_date = refund.get("payment_create_date") or ipn_data.get("vnp_PayDate", create_date)
    order_info = f"Hoan tien don hang {refund['order_id'][:8]}"

    hash_fields = [
        request_id,
        "2.1.0",
        "refund",
        VNPAY_TMN_CODE,
        "02",  # full refund
        txn_ref,
        amount,
        transaction_no,
        transaction_date,
        "admin",       # vnp_CreateBy — must come BEFORE vnp_CreateDate per spec §2.5.5
        create_date,   # vnp_CreateDate
        "127.0.0.1",
        order_info,
    ]
    secure_hash = _build_refund_hash(hash_fields)

    payload = {
        "vnp_RequestId": request_id,
        "vnp_Version": "2.1.0",
        "vnp_Command": "refund",
        "vnp_TmnCode": VNPAY_TMN_CODE,
        "vnp_TransactionType": "02",
        "vnp_TxnRef": txn_ref,
        "vnp_Amount": amount,
        "vnp_OrderInfo": order_info,
        "vnp_TransactionNo": transaction_no,
        "vnp_TransactionDate": transaction_date,
        "vnp_CreateDate": create_date,
        "vnp_CreateBy": "admin",
        "vnp_IpAddr": "127.0.0.1",
        "vnp_SecureHash": secure_hash,
    }

    resp = requests.post(VNPAY_API_URL, json=payload, timeout=15)
    resp.raise_for_status()
    return resp.json()


@router.get("")
def list_refunds(status_filter: str = "pending", x_api_key: str = Header(...)):
    _verify_admin_key(x_api_key)
    dao = DAORefunds()
    refunds = dao.read_refunds(status=status_filter if status_filter != "all" else None)
    return {"success": True, "refunds": refunds}


@router.post("/{refund_id}/process")
def process_refund(refund_id: str, x_api_key: str = Header(...)):
    _verify_admin_key(x_api_key)

    dao = DAORefunds()
    refund = dao.read_refund_by_id(refund_id)

    if not refund:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Refund not found")

    if refund["status"] != "pending":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Refund already {refund['status']}")

    if not refund.get("original_txn_ref"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Missing original_txn_ref — cannot call VNPay")

    try:
        vnpay_resp = _call_vnpay_refund(refund)
    except Exception as e:
        logger.error(f"[Refund] VNPay API call failed for refund={refund_id}: {e}")
        dao.update_refund_failed(refund_id, note=str(e))
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=f"VNPay error: {e}")

    response_code = vnpay_resp.get("vnp_ResponseCode", "")
    dao_payments = DAOPayments()
    if response_code == "00":
        vnpay_refund_ref = vnpay_resp.get("vnp_TransactionNo", "")
        dao.update_refund_processed(refund_id, vnpay_refund_ref=vnpay_refund_ref)
        dao_payments.create_payment(
            order_id=refund["order_id"],
            method="vnpay",
            amount=float(refund["amount"]),
            status="succeeded",
            transaction_ref=vnpay_refund_ref,
            type="refund",
            vnp_transaction_no=vnpay_refund_ref,
            refund_id=refund_id,
        )
        logger.warning(f"[Refund] Processed refund={refund_id} vnpay_ref={vnpay_refund_ref}")
        return {"success": True, "vnpay_response": vnpay_resp}
    else:
        note = f"VNPay ResponseCode={response_code} Message={vnpay_resp.get('vnp_Message', '')}"
        dao.update_refund_failed(refund_id, note=note)
        dao_payments.create_payment(
            order_id=refund["order_id"],
            method="vnpay",
            amount=float(refund["amount"]),
            status="failed",
            transaction_ref=refund.get("original_txn_ref", ""),
            type="refund",
            refund_id=refund_id,
        )
        logger.warning(f"[Refund] Failed refund={refund_id}: {note}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=note)
