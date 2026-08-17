import logging

from postgrest.exceptions import APIError as PostgrestExceptionAPIError

from dao.dao_base import DAOBase

logger = logging.getLogger(__name__)

# Postgres unique_violation. Raised by uniq_review_order_overall / uniq_review_order_item
# when the same order is reviewed twice — the API turns this into a 409.
PG_UNIQUE_VIOLATION = "23505"


class ReviewAlreadyExists(Exception):
    """The order (or one of its dishes) has already been reviewed."""


class DAOReviews(DAOBase):

    def __init__(self):
        super().__init__()
        self._table_name = "reviews"

    def create_reviews(self, rows: list):
        """Insert the overall row + the per-dish rows in one statement (all or nothing)."""
        try:
            result = self._supabase_client.table(self._table_name) \
                .insert(rows) \
                .execute()

            return result.data if result and result.data else None

        except PostgrestExceptionAPIError as e:
            if e.code == PG_UNIQUE_VIOLATION:
                raise ReviewAlreadyExists()
            raise Exception(f"Supabase error - create_reviews: {e}")
        except Exception as e:
            raise Exception(f"error create_reviews: {e}")

    def read_reviews_by_order_id(self, order_id: str, user_id: str):
        """The buyer's own rows for one order — drives the 'already reviewed' state."""
        try:
            result = self._supabase_client.table(self._table_name) \
                .select("id, food_item_id, rating, comment, created_at") \
                .eq("order_id", order_id) \
                .eq("user_id", user_id) \
                .execute()

            return result.data or []

        except PostgrestExceptionAPIError as e:
            raise Exception(f"Supabase error - read_reviews_by_order_id: {e}")
        except Exception as e:
            raise Exception(f"error read_reviews_by_order_id: {e}")

    def read_reviews_by_food_item_id(self, food_item_id: str, limit: int = 20, offset: int = 0):
        """Public list for a dish. Comment-less rows are returned too — a bare 5★ still counts."""
        try:
            result = self._supabase_client.table(self._table_name) \
                .select("id, rating, comment, created_at, users(name, avatar_url)") \
                .eq("food_item_id", food_item_id) \
                .order("created_at", desc=True) \
                .range(offset, offset + limit - 1) \
                .execute()

            return result.data or []

        except PostgrestExceptionAPIError as e:
            raise Exception(f"Supabase error - read_reviews_by_food_item_id: {e}")
        except Exception as e:
            raise Exception(f"error read_reviews_by_food_item_id: {e}")

    def read_reviews_by_seller_id(self, seller_id: str, limit: int = 20, offset: int = 0):
        """Seller dashboard: every review of this store, overall rows included."""
        try:
            result = self._supabase_client.table(self._table_name) \
                .select("id, order_id, food_item_id, rating, comment, created_at, "
                        "users(name, avatar_url), food_items(name)") \
                .eq("seller_id", seller_id) \
                .order("created_at", desc=True) \
                .range(offset, offset + limit - 1) \
                .execute()

            return result.data or []

        except PostgrestExceptionAPIError as e:
            raise Exception(f"Supabase error - read_reviews_by_seller_id: {e}")
        except Exception as e:
            raise Exception(f"error read_reviews_by_seller_id: {e}")
