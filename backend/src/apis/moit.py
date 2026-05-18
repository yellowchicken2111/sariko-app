import os
import hmac
import logging
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from dao.dao_moit_report import DAOMoitReport

router = APIRouter(prefix="/moit")
logger = logging.getLogger(__name__)


class MoitAuthBody(BaseModel):
    UserName: str
    PassWord: str


def _verify_credentials(body: MoitAuthBody) -> None:
    expected_user = os.environ.get("MOIT_API_USERNAME", "")
    expected_pass = os.environ.get("MOIT_API_PASSWORD", "")
    if not expected_user or not expected_pass:
        logger.error("MOIT_API_USERNAME / MOIT_API_PASSWORD not configured")
        raise HTTPException(status_code=500, detail="Server not configured")
    user_ok = hmac.compare_digest(body.UserName, expected_user)
    pass_ok = hmac.compare_digest(body.PassWord, expected_pass)
    if not (user_ok and pass_ok):
        raise HTTPException(status_code=401, detail="Invalid credentials")


@router.post("/report")
def moit_report(body: MoitAuthBody):
    _verify_credentials(body)

    year_start = datetime(datetime.now(timezone.utc).year, 1, 1, tzinfo=timezone.utc).isoformat()

    dao = DAOMoitReport()

    so_luong_truy_cap = dao.count_users_total()
    so_nguoi_ban = dao.count_sellers_total()
    so_nguoi_ban_moi = dao.count_sellers_new(year_start)
    tong_so_san_pham = dao.count_food_items_total()
    so_san_pham_moi = dao.count_food_items_new(year_start)
    so_luong_giao_dich = dao.count_orders_total(year_start)
    tong_so_don_thanh_cong = dao.count_orders_done(year_start)
    tong_so_don_khong_thanh_cong = dao.count_orders_cancelled(year_start)
    tong_gia_tri_giao_dich = dao.sum_done_orders_value(year_start)

    return {
        "soLuongTruyCap": so_luong_truy_cap,
        "soNguoiBan": so_nguoi_ban,
        "soNguoiBanMoi": so_nguoi_ban_moi,
        "tongSoSanPham": tong_so_san_pham,
        "soSanPhamMoi": so_san_pham_moi,
        "soLuongGiaoDich": so_luong_giao_dich,
        "tongSoDonHangThanhCong": tong_so_don_thanh_cong,
        "tongSoDonHangKhongThanhCong": tong_so_don_khong_thanh_cong,
        "tongGiaTriGiaoDich": tong_gia_tri_giao_dich,
    }
