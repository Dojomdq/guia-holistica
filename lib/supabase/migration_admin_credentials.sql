-- ============================================
-- TABLA: admin_credentials
-- Guarda la contraseña del admin de forma dinámica (hash PBKDF2).
-- Permite cambiar la contraseña desde el panel sin tocar el ambiente.
-- RLS: solo service_role (acceso vía API routes, nunca anon).
-- ============================================

create table if not exists public.admin_credentials (
  id uuid primary key default gen_random_uuid(),
  password_hash text not null,
  updated_at timestamptz not null default now()
);

alter table public.admin_credentials enable row level security;
alter table public.admin_credentials force row level security;

-- Solo el service_role (backend) puede leer/escribir
drop policy if exists "Admin credentials service role" on public.admin_credentials;
create policy "Admin credentials service role"
  on public.admin_credentials
  for all
  to service_role
  using (true)
  with check (true);
