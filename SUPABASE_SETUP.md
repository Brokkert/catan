# Supabase setup (eenmalig)

Log in op je Supabase project → **SQL Editor** → plak dit en run:

```sql
create table if not exists public.catan_shared (
  id text primary key,
  state text,
  updated_at timestamptz default now()
);

alter table public.catan_shared enable row level security;

drop policy if exists "anon_all" on public.catan_shared;
create policy "anon_all"
  on public.catan_shared
  for all
  using (true)
  with check (true);

alter publication supabase_realtime add table public.catan_shared;
```

Dat zet:
- Een tabel `catan_shared` met 1 rij die de Yjs doc state opslaat.
- Anon-read/write (alleen gehobby-app, niet super-secret).
- Realtime updates aan zodat wijzigingen push-doorgestuurd worden.

Klaar. Laad de app en het status-bolletje in de header moet ☁️ cloud worden.
