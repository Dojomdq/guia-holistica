-- ============================================
-- FIX SEGURIDAD: RLS para la tabla eventos
-- Idempotente: se puede ejecutar varias veces.
-- ============================================

-- 1. Habilitar RLS
ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;

-- 2. Limpiar políticas previas (evita errores al re-ejecutar)
DROP POLICY IF EXISTS "Lectura pública de eventos activos" ON eventos;
DROP POLICY IF EXISTS "Admin eventos" ON eventos;
DROP POLICY IF EXISTS "Anyone can read eventos" ON eventos;

-- 3. Lectura pública SOLO de eventos activos
CREATE POLICY "Lectura pública de eventos activos"
  ON eventos FOR SELECT
  TO anon
  USING (activo = true);

-- 4. Acceso completo vía service_role (admin API routes)
CREATE POLICY "Admin eventos"
  ON eventos FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);