-- ============================================
-- FIX SEGURIDAD: Cerrar RLS (solo service_role escribe)
-- Las páginas admin ahora usan API routes con service_role,
-- la web pública solo lee. Idempotente, se puede re-ejecutar.
-- ============================================

-- ============================================
-- 1. CATEGORIAS: lectura pública, escritura solo service_role
-- ============================================
DROP POLICY IF EXISTS "Admin categorias" ON categorias;
CREATE POLICY "Admin categorias"
  ON categorias FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 2. ACTIVIDADES: lectura pública, escritura solo service_role
-- ============================================
DROP POLICY IF EXISTS "Admin actividades" ON actividades;
CREATE POLICY "Admin actividades"
  ON actividades FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 3. FACILITADORES: lectura pública solo activos, escritura solo service_role
-- ============================================
DROP POLICY IF EXISTS "Admin facilitadores" ON facilitadores;
DROP POLICY IF EXISTS "Escritura facilitadores" ON facilitadores;
DROP POLICY IF EXISTS "Lectura pública de facilitadores" ON facilitadores;
CREATE POLICY "Lectura pública de facilitadores activos"
  ON facilitadores FOR SELECT
  TO anon
  USING (activo = true);
CREATE POLICY "Admin facilitadores"
  ON facilitadores FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 4. FACILITADOR_ACTIVIDADES: lectura pública, escritura solo service_role
-- ============================================
DROP POLICY IF EXISTS "Admin facilitador_actividades" ON facilitador_actividades;
CREATE POLICY "Admin facilitador_actividades"
  ON facilitador_actividades FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 5. PAGOS: sin lectura pública (solo service_role)
-- ============================================
DROP POLICY IF EXISTS "Anyone can read pagos" ON pagos;

-- ============================================
-- 6. REPRESENTANTES: sin lectura pública (solo service_role)
-- ============================================
DROP POLICY IF EXISTS "Lectura pública de representantes" ON representantes;

-- ============================================
-- 7. COMISIONES: sin lectura pública (solo service_role)
-- ============================================
DROP POLICY IF EXISTS "Lectura pública de comisiones" ON comisiones;

-- ============================================
-- 8. CLICKS: sin acceso anon (insert y lectura vía service_role)
-- El POST /api/clicks ahora usa service_role.
-- ============================================
DROP POLICY IF EXISTS "Anyone can insert clicks" ON clicks;
DROP POLICY IF EXISTS "Admin can read clicks" ON clicks;