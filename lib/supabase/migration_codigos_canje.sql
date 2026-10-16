-- ============================================
-- CÓDIGOS DE CANJE: beneficio por descubrir en la Guía
-- El visitante genera un código único desde la ficha del facilitador.
-- El admin lo marca como usado cuando la persona efectivamente asiste,
-- cerrando así la conversión real (no solo el click).
-- RLS: solo service_role (acceso vía API routes).
-- ============================================

-- 1. Campo de beneficio configurable por perfil en facilitadores
ALTER TABLE facilitadores ADD COLUMN IF NOT EXISTS beneficio_canje TEXT;

-- 2. Tabla de códigos generados
CREATE TABLE IF NOT EXISTS codigos_canje (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facilitador_id UUID REFERENCES facilitadores(id) ON DELETE CASCADE NOT NULL,
  codigo TEXT NOT NULL UNIQUE,
  beneficio TEXT NOT NULL DEFAULT 'Primera clase gratis',
  estado TEXT NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo', 'usado')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  usado_at TIMESTAMPTZ,
  vence TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_codigos_canje_facilitador ON codigos_canje(facilitador_id);
CREATE INDEX IF NOT EXISTS idx_codigos_canje_estado ON codigos_canje(estado);

-- 3. RLS cerrada: solo el service_role (backend) accede
ALTER TABLE codigos_canje ENABLE ROW LEVEL SECURITY;
ALTER TABLE codigos_canje FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Canje service role" ON codigos_canje;
CREATE POLICY "Canje service role"
  ON codigos_canje
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);