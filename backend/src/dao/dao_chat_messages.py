from datetime import datetime, timezone
import logging

from postgrest.exceptions import APIError as PostgrestExceptionAPIError

from dao.dao_base import DAOBase

logger = logging.getLogger(__name__)


class DAOChatMessages(DAOBase):

    def __init__(self):
        super().__init__()
        self._table_name = "chat_messages"

    def mark_read(self, conversation_id: str, reader_id: str):
        """Stamp read_at on the reader's unread incoming messages (not their own)."""
        try:
            now_iso = datetime.now(timezone.utc).isoformat()
            self._supabase_client.table(self._table_name) \
                .update({"read_at": now_iso}) \
                .eq("conversation_id", conversation_id) \
                .neq("sender_id", reader_id) \
                .is_("read_at", "null") \
                .execute()
            return True
        except PostgrestExceptionAPIError as e:
            raise Exception(f"Supabase error - mark_read conversation {conversation_id}: {e}")
        except Exception as e:
            raise Exception(f"error mark_read conversation {conversation_id}: {e}")

    def read_unread_rows(self, conversation_ids: list, reader_id: str):
        """Return one row per unread incoming message across the given conversations.

        Caller tallies per conversation_id — cheaper than N per-conversation counts.
        """
        try:
            if not conversation_ids:
                return []
            result = self._supabase_client.table(self._table_name) \
                .select("conversation_id") \
                .in_("conversation_id", conversation_ids) \
                .neq("sender_id", reader_id) \
                .is_("read_at", "null") \
                .execute()
            return result.data if result and result.data else []
        except Exception as e:
            raise Exception(f"error read_unread_rows for reader {reader_id}: {e}")
