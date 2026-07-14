-- 1. Grant the privileges the role needs
grant select on public.your_table to anon;
grant select, insert, update, delete on public.your_table to authenticated;
grant select, insert, update, delete on public.your_table to service_role;

-- 2. Enable RLS
alter table public.your_table enable row level security;

-- 3. Add the policies you need
create policy "users can read their own rows"
  on public.your_table
  for select
  to authenticated
  using (auth.uid() = user_id);