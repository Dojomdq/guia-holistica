-- ============================================
-- MIGRATION: Permisos de escritura para anon
-- El admin UI está protegido por Basic Auth middleware
-- ============================================

-- Eliminar política restrictiva de lectura de facilitadores (solo activos)
DROP POLICY IF EXISTS "Lectura pública de facilitadores" ON facilitadores;

-- Permitir lectura de TODOS los facilitadores (para admin)
CREATE POLICY "Lectura pública de facilitadores" ON facilitadores FOR SELECT USING (true);

-- Permitir INSERT/UPDATE/DELETE para anon en categorias
DROP POLICY IF EXISTS "Admin categorias" ON categorias;
CREATE POLICY "Admin categorias" ON categorias FOR ALL USING (true) WITH CHECK (true);

-- Permitir INSERT/UPDATE/DELETE para anon en actividades
DROP POLICY IF EXISTS "Admin actividades" ON actividades;
CREATE POLICY "Admin actividades" ON actividades FOR ALL USING (true) WITH CHECK (true);

-- Permitir INSERT/UPDATE/DELETE para anon en facilitadores
CREATE POLICY "Escritura facilitadores" ON facilitadores FOR ALL USING (true) WITH CHECK (true);

-- Permitir INSERT/UPDATE/DELETE para anon en facilitador_actividades
DROP POLICY IF EXISTS "Admin facilitador_actividades" ON facilitador_actividades;
CREATE POLICY "Admin facilitador_actividades" ON facilitador_actividades FOR ALL USING (true) WITH CHECK (true);
