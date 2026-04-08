import logging

from postgrest.exceptions import APIError as PostgrestExceptionAPIError

from dao.dao_base import DAOBase

logger = logging.getLogger(__name__)


class DAOOrders(DAOBase):

    def __init__(self):
        super().__init__()
        self._table_name = "orders"

    def create_order(self, user_id: str, seller_id: str, total_amount: float,
                     delivery_method: str, delivery_address: str = None, note: str = None):
        try:
            data = {
                "user_id": user_id,
                "seller_id": seller_id,
                "total_amount": total_amount,
                "delivery_method": delivery_method,
                "delivery_address": delivery_address,
                "note": note,
                "status": "pending",
                "payment_status": "pending",
            }

            result = self._supabase_client.table(self._table_name) \
                .insert(data) \
                .execute()

            if result and result.data:
                return result.data[0]

            return None

        except PostgrestExceptionAPIError as e:
            raise Exception(f"Supabase error - create_order: {e}")
        except Exception as e:
            raise Exception(f"error create_order: {e}")

    def read_orders_by_user_id(self, user_id: str):
        try:
            result = self._supabase_client.table(self._table_name) \
                .select("id, seller_id, status, total_amount, delivery_fee, payment_status, delivery_method, created_at, seller_profiles(store_name, slug, avatar_url)") \
                .eq("user_id", user_id) \
                .order("created_at", desc=True) \
                .execute()

            if result and result.data:
                return result.data

            return []

        except PostgrestExceptionAPIError as e:
            raise Exception(f"Supabase error - read_orders_by_user_id: {e}")
        except Exception as e:
            raise Exception(f"error read_orders_by_user_id: {e}")

    def read_order_by_id(self, order_id: str, user_id: str):
        try:
            result = self._supabase_client.table(self._table_name) \
                .select("id, status, total_amount, delivery_fee, payment_status, delivery_method, delivery_address, note, created_at, seller_profiles(store_name, slug, avatar_url), order_items(id, food_item_id, name_snapshot, price_snapshot, unit_label_snapshot, quantity)") \
                .eq("id", order_id) \
                .eq("user_id", user_id) \
                .maybe_single() \
                .execute()

            if result and result.data:
                return result.data

            return None

        except PostgrestExceptionAPIError as e:
            raise Exception(f"Supabase error - read_order_by_id: {e}")
        except Exception as e:
            raise Exception(f"error read_order_by_id: {e}")

    def read_orders_by_seller_id(self, seller_id: str):
        try:
            result = self._supabase_client.table(self._table_name) \
                .select("id, user_id, status, total_amount, delivery_fee, payment_status, delivery_method, delivery_address, note, created_at, users(name, email), order_items(id, name_snapshot, price_snapshot, quantity)") \
                .eq("seller_id", seller_id) \
                .eq("payment_status", "paid") \
                .order("created_at", desc=True) \
                .execute()

            return result.data if result and result.data else []

        except PostgrestExceptionAPIError as e:
            raise Exception(f"Supabase error - read_orders_by_seller_id: {e}")
        except Exception as e:
            raise Exception(f"error read_orders_by_seller_id: {e}")

    def read_order_by_id_for_seller(self, order_id: str, seller_id: str):
        try:
            result = self._supabase_client.table(self._table_name) \
                .select("id, user_id, status, total_amount, delivery_fee, payment_status, delivery_method, delivery_address, note, created_at, users(name, email), order_items(id, name_snapshot, price_snapshot, unit_label_snapshot, quantity)") \
                .eq("id", order_id) \
                .eq("seller_id", seller_id) \
                .maybe_single() \
                .execute()

            return result.data if result and result.data else None

        except PostgrestExceptionAPIError as e:
            raise Exception(f"Supabase error - read_order_by_id_for_seller: {e}")
        except Exception as e:
            raise Exception(f"error read_order_by_id_for_seller: {e}")

    def update_order_status(self, order_id: str, status: str):
        try:
            result = self._supabase_client.table(self._table_name) \
                .update({"status": status}) \
                .eq("id", order_id) \
                .execute()

            if result and result.data:
                return result.data[0]

            return None

        except PostgrestExceptionAPIError as e:
            raise Exception(f"Supabase error - update_order_status: {e}")
        except Exception as e:
            raise Exception(f"error update_order_status: {e}")

    def read_order_by_id_raw(self, order_id: str):
        """Read order by ID without user scoping (for IPN server-to-server)."""
        try:
            result = self._supabase_client.table(self._table_name) \
                .select("id, payment_status, status") \
                .eq("id", order_id) \
                .maybe_single() \
                .execute()

            return result.data if result and result.data else None

        except PostgrestExceptionAPIError as e:
            raise Exception(f"Supabase error - read_order_by_id_raw: {e}")
        except Exception as e:
            raise Exception(f"error read_order_by_id_raw: {e}")

    def update_payment_status(self, order_id: str, payment_status: str, transaction_ref: str = None):
        try:
            update_data = {"payment_status": payment_status}
            if transaction_ref:
                update_data["transaction_ref"] = transaction_ref

            self._supabase_client.table(self._table_name) \
                .update(update_data) \
                .eq("id", order_id) \
                .execute()

            return True

        except PostgrestExceptionAPIError as e:
            raise Exception(f"Supabase error - update_payment_status: {e}")
        except Exception as e:
            raise Exception(f"error update_payment_status: {e}")
