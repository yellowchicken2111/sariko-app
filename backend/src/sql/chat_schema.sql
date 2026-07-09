-- ============================================================
-- Sariko Chat Schema — realtime buyer <-> seller messaging
-- One conversation per (buyer, seller) pair.
-- Run once against Supabase. Additive to create_tables.sql / rls.sql.
--
-- NOTE: named chat_* on purpose — Supabase already ships realtime.messages
-- (Realtime Broadcast), so reusing "messages" invites confusion.
--
-- The drops below make this file safely re-runnable in dev.
-- They WIPE chat data — remove them before running against prod.
-- ============================================================

drop table if exists public.chat_messages cascade;
drop table if exists public.chat_conversations cascade;

-- 14. CHAT CONVERSATIONS
create table public.chat_conversations (
  id uuid not null default gen_random_uuid (),
  buyer_id uuid not null,
  seller_id uuid not null,
  last_message_at timestamp with time zone null,
  last_message_text text null,
  created_at timestamp with time zone not null default now(),
  constraint chat_conversations_pkey primary key (id),
  constraint chat_conversations_buyer_seller_key unique (buyer_id, seller_id),
  constraint chat_conversations_buyer_id_fkey foreign KEY (buyer_id) references users (id) on delete CASCADE,
  constraint chat_conversations_seller_id_fkey foreign KEY (seller_id) references seller_profiles (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_chat_conversations_buyer on public.chat_conversations using btree (buyer_id) TABLESPACE pg_default;
create index IF not exists idx_chat_conversations_seller on public.chat_conversations using btree (seller_id) TABLESPACE pg_default;

-- 15. CHAT MESSAGES
create table public.chat_messages (
  id uuid not null default gen_random_uuid (),
  conversation_id uuid not null,
  sender_id uuid not null,
  body text not null,
  created_at timestamp with time zone not null default now(),
  read_at timestamp with time zone null,
  constraint chat_messages_pkey primary key (id),
  constraint chat_messages_conversation_id_fkey foreign KEY (conversation_id) references chat_conversations (id) on delete CASCADE,
  constraint chat_messages_sender_id_fkey foreign KEY (sender_id) references users (id),
  constraint chat_messages_body_check check ((char_length(btrim(body)) > 0))
) TABLESPACE pg_default;

create index IF not exists idx_chat_messages_conversation on public.chat_messages using btree (conversation_id, created_at desc) TABLESPACE pg_default;

-- ------------------------------------------------------------
-- Trigger: keep conversation preview / ordering column fresh
-- ------------------------------------------------------------
-- SECURITY DEFINER: the trigger runs as the function owner (postgres, the table
-- owner) so a message insert from the `authenticated` role can update the parent
-- conversation without needing an UPDATE grant / RLS policy on the authenticated role.
create or replace function public.bump_chat_conversation () returns trigger
  language plpgsql
  security definer
  set search_path = public
as $$
begin
  update public.chat_conversations
     set last_message_at = new.created_at,
         last_message_text = new.body
   where id = new.conversation_id;
  return new;
end;
$$;

drop trigger if exists on_new_chat_message on public.chat_messages;
create trigger on_new_chat_message
  after insert on public.chat_messages
  for each row
  execute function public.bump_chat_conversation ();

-- ------------------------------------------------------------
-- Realtime: broadcast message inserts to subscribed participants
-- (RLS below still filters which rows each client actually receives)
-- Guarded so re-running the file doesn't error on "already member".
-- ------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'chat_messages'
  ) then
    alter publication supabase_realtime add table public.chat_messages;
  end if;
end $$;

-- ------------------------------------------------------------
-- GRANTS — RLS filters rows, but the role still needs table privileges.
-- Frontend (authenticated) reads history + sends messages directly.
-- It reads chat_conversations too because the message RLS policies below
-- reference it in a subquery. Everything else goes through the backend
-- (service_role, which bypasses RLS). No anon access — chat is auth-only.
-- ------------------------------------------------------------
grant select on public.chat_conversations to authenticated;
grant select, insert on public.chat_messages to authenticated;
grant all on public.chat_conversations to service_role;
grant all on public.chat_messages to service_role;

-- ------------------------------------------------------------
-- RLS — the only line of defense (clients read/write direct to Supabase)
-- "participant" = the buyer, OR the user who owns the seller_profile
-- ------------------------------------------------------------
alter table public.chat_conversations enable row level security;
alter table public.chat_messages enable row level security;

-- seller_profiles has RLS enabled but no SELECT policy for authenticated users,
-- so the "seller_id in (select ... from seller_profiles where user_id = auth.uid())"
-- subquery in the message policies below returns empty for a seller's own client —
-- which silently hides chat from sellers. Let a seller read their own profile row.
drop policy if exists "seller read own profile" on public.seller_profiles;
create policy "seller read own profile"
on public.seller_profiles for select
using (user_id = auth.uid());

create policy "participant read conversation"
on public.chat_conversations for select
using (
  buyer_id = auth.uid()
  or seller_id in (
    select id from public.seller_profiles where user_id = auth.uid()
  )
);

create policy "participant read messages"
on public.chat_messages for select
using (
  conversation_id in (
    select id from public.chat_conversations
    where buyer_id = auth.uid()
       or seller_id in (
         select id from public.seller_profiles where user_id = auth.uid()
       )
  )
);

create policy "participant send message"
on public.chat_messages for insert
with check (
  sender_id = auth.uid()
  and conversation_id in (
    select id from public.chat_conversations
    where buyer_id = auth.uid()
       or seller_id in (
         select id from public.seller_profiles where user_id = auth.uid()
       )
  )
);
