-- ============================================================
-- Sariko Chat — per-participant pin & soft-delete
-- Additive migration to chat_schema.sql. Safe to run against prod.
--
-- Pin/delete are PER USER: a conversation has two participants
-- (buyer + seller), so each side gets its own columns. Pinning or
-- deleting in your inbox never reorders/hides the other person's.
--
-- Soft-delete hides the row from the deleter's list. A new message
-- clears both *_deleted_at flags (see bump trigger) so the thread
-- reappears — standard messenger behavior.
-- ============================================================

alter table public.chat_conversations
  add column if not exists buyer_pinned_at   timestamp with time zone null,
  add column if not exists seller_pinned_at  timestamp with time zone null,
  add column if not exists buyer_deleted_at  timestamp with time zone null,
  add column if not exists seller_deleted_at timestamp with time zone null;

-- Bump trigger: on a new message, refresh the preview AND resurface the
-- thread for anyone who had soft-deleted it (new activity un-hides it).
create or replace function public.bump_chat_conversation () returns trigger
  language plpgsql
  security definer
  set search_path = public
as $$
begin
  update public.chat_conversations
     set last_message_at = new.created_at,
         last_message_text = new.body,
         buyer_deleted_at = null,
         seller_deleted_at = null
   where id = new.conversation_id;
  return new;
end;
$$;
