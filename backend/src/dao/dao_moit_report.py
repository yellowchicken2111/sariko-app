import logging
from decimal import Decimal
from datetime import datetime, timezone

from postgrest.exceptions import APIError as PostgrestExceptionAPIError

from dao.dao_base import DAOBase

logger = logging.getLogger(__name__)


class DAOMoitReport(DAOBase):

    def _count(self, table: str, since: str = None, filters: list = None) -> int:
        query = self._supabase_client.table(table).select("id", count="exact")
        if since:
            query = query.gte("created_at", since)
        for col, op, val in filters or []:
            query = getattr(query, op)(col, val)
        result = query.limit(1).execute()
        return result.count or 0

    def count_users_total(self) -> int:
        return self._count("users")

    def count_sellers_total(self) -> int:
        return self._count("seller_profiles")

    def count_sellers_new(self, since: str) -> int:
        return self._count("seller_profiles", since=since)

    def count_food_items_total(self) -> int:
        return self._count("food_items")

    def count_food_items_new(self, since: str) -> int:
        return self._count("food_items", since=since)

    def count_orders_total(self, since: str) -> int:
        return self._count("orders", since=since)

    def count_orders_done(self, since: str) -> int:
        return self._count("orders", since=since, filters=[("status", "eq", "done")])

    def count_orders_cancelled(self, since: str) -> int:
        return self._count("orders", since=since, filters=[("status", "eq", "cancelled")])

    def sum_done_orders_value(self, since: str) -> int:
        try:
            total = Decimal(0)
            page_size = 1000
            offset = 0
            while True:
                result = (
                    self._supabase_client
                    .table("orders")
                    .select("total_amount")
                    .eq("status", "done")
                    .gte("created_at", since)
                    .range(offset, offset + page_size - 1)
                    .execute()
                )
                rows = result.data or []
                for row in rows:
                    amount = row.get("total_amount")
                    if amount is None:
                        continue
                    total += Decimal(str(amount))
                if len(rows) < page_size:
                    break
                offset += page_size
            return int(total)
        except PostgrestExceptionAPIError as e:
            raise Exception(f"Supabase error - sum_done_orders_value: {e}")
        except Exception as e:
            raise Exception(f"error sum_done_orders_value: {e}")
