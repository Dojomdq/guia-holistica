-- ============================================
-- FIX SEGURIDAD: Cerrar RLS definitivo
-- Solo service_role escribe. La web pública solo lee
-- lo que necesita. Idempotente, se puede re-ejecutar.
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
-- 6. REPRESENTANTES: sin acceso público (solo service_role)
-- ============================================
DROP POLICY IF EXISTS "Admin representantes" ON representantes;
DROP POLICY IF EXISTS "Lectura pública de representantes" ON representantes;
CREATE POLICY "Admin representantes"
  ON representantes FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 7. COMISIONES: sin acceso público (solo service_role)
-- ============================================
DROP POLICY IF EXISTS "Admin comisiones" ON comisiones;
DROP POLICY IF EXISTS "Lectura pública de comisiones" ON comisiones;
CREATE POLICY "Admin comisiones"
  ON comisiones FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 8. CLICKS: sin acceso anon (insert y lectura vía service_role)
-- ============================================
DROP POLICY IF EXISTS "Anyone can insert clicks" ON clicks;
DROP POLICY IF EXISTS "Admin can read clicks" ON clicks;
CREATE POLICY "Admin clicks"
  ON clicks FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 9. DESTACADOS: lectura pública (la home la usa), escritura solo service_role
-- ============================================
DROP POLICY IF EXISTS "Admin destacados" ON destacados;
CREATE POLICY "Admin destacados"
  ON destacados FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
DROP POLICY IF EXISTS "Lectura pública de destacados" ON destacados;
CREATE POLICY "Lectura pública de destacados"
  ON destacados FOR SELECT
  TO anon
  USING (true);

-- ============================================
-- 10. PLANES: lectura pública (embed de la home), escritura solo service_role
-- ============================================
DROP POLICY IF EXISTS "Admin planes" ON planes;
CREATE POLICY "Admin planes"
  ON planes FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
DROP POLICY IF EXISTS "Lectura pública de planes" ON planes;
CREATE POLICY "Lectura pública de planes"
  ON planes FOR SELECT
  TO anon
  USING (true);

-- ============================================
-- 11. FACILITADOR_PLANES: lectura pública (embed de la home), escritura solo service_role
-- ============================================
DROP POLICY IF EXISTS "Admin facilitador_planes" ON facilitador_planes;
CREATE POLICY "Admin facilitador_planes"
  ON facilitador_planes FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
DROP POLICY IF EXISTS "Lectura pública de facilitador_planes" ON facilitador_planes;
CREATE POLICY "Lectura pública de facilitador_planes"
  ON facilitador_planes FOR SELECT
  TO anon
  USING (true);

-- ============================================
-- 12. UBICACIONES: lectura pública (mapas), escritura solo service_role
-- ============================================
DROP POLICY IF EXISTS "Admin ubicaciones" ON ubicaciones;
CREATE POLICY "Admin ubicaciones"
  ON ubicaciones FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
DROP POLICY IF EXISTS "Lectura pública de ubicaciones" ON ubicaciones;
CREATE POLICY "Lectura pública de ubicaciones"
  ON ubicaciones FOR SELECT
  TO anon
  USING (true);