-- ============================================
-- TABLA: config
-- Guarda flags de configuración del sitio (ej. habilitar popup de eventos).
-- RLS: solo service_role (acceso vía API routes, nunca anon).
-- ============================================

create table if not exists public.config (
  clave text primary key,
  valor jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.config enable row level security;
alter table public.config force row level security;

-- Solo el service_role (backend) puede leer/escribir
drop policy if exists "Config service role" on public.config;
create policy "Config service role"
  on public.config
  for all
  to service_role
  using (true)
  with check (true);

-- Seed por defecto: popup de eventos desactivado hasta que el admin lo habilite
insert into public.config (clave, valor) values
  ('popup_eventos', '{"habilitado": false}'::jsonb)
on conflict (clave) do nothing;