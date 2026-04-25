import logging
from dao.dao_base import DAOBase

logger = logging.getLogger(__name__)


class DAOMenuCategories(DAOBase):

    def __init__(self):
        super().__init__()
        self._table_name = "menu_categories"

    def read_by_seller_id(self, seller_id: str):
        result = (
            self._supabase_client.table(self._table_name)
            .select("*")
            .eq("seller_id", seller_id)
            .order("sort_order")
            .execute()
        )
        return result.data or []

    def create(self, seller_id: str, name: str, sort_order: int = 0):
        result = (
            self._supabase_client.table(self._table_name)
            .insert({"seller_id": seller_id, "name": name, "sort_order": sort_order})
            .execute()
        )
        return result.data[0] if result.data else None

    def update(self, category_id: str, seller_id: str, fields: dict):
        result = (
            self._supabase_client.table(self._table_name)
            .update(fields)
            .eq("id", category_id)
            .eq("seller_id", seller_id)
            .execute()
        )
        return result.data[0] if result.data else None

    def delete(self, category_id: str, seller_id: str):
        result = (
            self._supabase_client.table(self._table_name)
            .delete()
            .eq("id", category_id)
            .eq("seller_id", seller_id)
            .execute()
        )
        return result.data
