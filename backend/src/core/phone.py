import re


def to_e164_vn(phone: str) -> str:
    """Normalize a Vietnamese phone number to E.164 (+84...).

    Raises ValueError if the input cannot be normalized to a valid VN mobile.
    Never returns a placeholder — callers must surface the error to the user.
    """
    if not phone:
        raise ValueError("Phone is required")
    digits = re.sub(r"\D", "", phone)
    if digits.startswith("84"):
        digits = digits[2:]
    elif digits.startswith("0"):
        digits = digits[1:]
    if not re.fullmatch(r"\d{9,10}", digits):
        raise ValueError(f"Invalid VN phone: {phone!r}")
    return "+84" + digits
