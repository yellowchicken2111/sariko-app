import logging

from postgrest.exceptions import APIError as PostgrestExceptionAPIError

from dao.dao_base import DAOBase

logger = logging.getLogger(__name__)


class DAOChatConversations(DAOBase):

    def __init__(self):
        super().__init__()
        self._table_name = "chat_conversations"

    def get_or_create(self, buyer_id: str, seller_id: str):
        """Return the (buyer, seller) conversation, creating it on first contact.

        Guarded against the unique(buyer_id, seller_id) race: if a concurrent
        insert wins, we swallow the violation and re-select the existing row.
        """
        try:
            existing = self._supabase_client.table(self._table_name) \
                .select("id, buyer_id, seller_id") \
                .eq("buyer_id", buyer_id) \
                .eq("seller_id", seller_id) \
                .maybe_single() \
                .execute()

            if existing and existing.data:
                return existing.data

            try:
                inserted = self._supabase_client.table(self._table_name) \
                    .insert({"buyer_id": buyer_id, "seller_id": seller_id}) \
                    .execute()
                if inserted and inserted.data:
                    return inserted.data[0]
            except PostgrestExceptionAPIError:
                # concurrent insert won the unique race — fall through to re-select
                pass

            reselect = self._supabase_client.table(self._table_name) \
                .select("id, buyer_id, seller_id") \
                .eq("buyer_id", buyer_id) \
                .eq("seller_id", seller_id) \
                .maybe_single() \
                .execute()
            return reselect.data if reselect and reselect.data else None

        except PostgrestExceptionAPIError as e:
            raise Exception(f"Supabase error - get_or_create conversation buyer {buyer_id} seller {seller_id}: {e}")
        except Exception as e:
            raise Exception(f"error get_or_create conversation buyer {buyer_id} seller {seller_id}: {e}")

    def read_by_id(self, conversation_id: str):
        try:
            result = self._supabase_client.table(self._table_name) \
                .select("id, buyer_id, seller_id") \
                .eq("id", conversation_id) \
                .maybe_single() \
                .execute()
            return result.data if result and result.data else None
        except Exception as e:
            raise Exception(f"error read_by_id conversation {conversation_id}: {e}")

    def list_for_buyer(self, buyer_id: str):
        try:
            result = self._supabase_client.table(self._table_name) \
                .select("id, seller_id, last_message_at, last_message_text, seller_profiles(store_name, slug, avatar_url)") \
                .eq("buyer_id", buyer_id) \
                .order("last_message_at", desc=True) \
                .execute()
            return result.data if result and result.data else []
        except Exception as e:
            raise Exception(f"error list_for_buyer {buyer_id}: {e}")

    def list_for_seller(self, seller_id: str):
        try:
            result = self._supabase_client.table(self._table_name) \
                .select("id, buyer_id, last_message_at, last_message_text, users(name, avatar_url)") \
                .eq("seller_id", seller_id) \
                .order("last_message_at", desc=True) \
                .execute()
            return result.data if result and result.data else []
        except Exception as e:
            raise Exception(f"error list_for_seller {seller_id}: {e}")
