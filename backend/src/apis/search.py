import logging

from fastapi import APIRouter, Query

from dao.dao_food_items import DAOFoodItems
from dao.dao_menu_categories import DAOMenuCategories

router = APIRouter(prefix="/search")
logger = logging.getLogger(__name__)


def _escape_ilike(s: str) -> str:
    # Escape ILIKE wildcards so user input '%' and '_' don't act as patterns.
    return s.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")


def _format_food(row: dict) -> dict:
    seller = row.get("seller_profiles") or {}
    category = row.get("menu_categories") or {}
    return {
        "id": row.get("id"),
        "name": row.get("name"),
        "image_url": row.get("image_url"),
        "preorder_day": row.get("preorder_day") or 0,
        "category": category.get("name"),
        "seller": {
            "slug": seller.get("slug"),
            "store_name": seller.get("store_name"),
            "avatar_url": seller.get("avatar_url"),
        }
    }


def _format_category(row: dict) -> dict:
    seller = row.get("seller_profiles") or {}
    return {
        "name": row.get("name"),
        "seller": {
            "slug": seller.get("slug"),
            "store_name": seller.get("store_name"),
            "avatar_url": seller.get("avatar_url"),
        }
    }


@router.get("")
def search(q: str = Query(default="", max_length=100)):
    q = q.strip()
    if not q:
        return {"foods": [], "categories": []}

    escaped = _escape_ilike(q)

    foods_raw = DAOFoodItems().search_by_name(escaped)
    categories_raw = DAOMenuCategories().search_by_name(escaped)

    return {
        "foods": [_format_food(r) for r in foods_raw],
        "categories": [_format_category(r) for r in categories_raw],
    }
