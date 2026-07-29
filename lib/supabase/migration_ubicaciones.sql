-- ============================================
-- MIGRACIÓN: Tabla de ubicaciones múltiples
-- ============================================

-- 1. Crear tabla ubicaciones
CREATE TABLE ubicaciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  facilitador_id UUID NOT NULL REFERENCES facilitadores(id) ON DELETE CASCADE,
  direccion TEXT,
  latitud DECIMAL(10, 8) NOT NULL,
  longitud DECIMAL(11, 8) NOT NULL,
  ciudad TEXT NOT NULL DEFAULT 'Mar del Plata',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ubicaciones_facilitador ON ubicaciones(facilitador_id);
CREATE INDEX idx_ubicaciones_ciudad ON ubicaciones(ciudad);

-- 2. Migrar ubicaciones existentes de facilitadores a la nueva tabla
INSERT INTO ubicaciones (facilitador_id, direccion, latitud, longitud, ciudad)
SELECT id, direccion, latitud, longitud, ciudad
FROM facilitadores
WHERE direccion IS NOT NULL OR (latitud IS NOT NULL AND longitud IS NOT NULL);

-- 3. RLS para ubicaciones
ALTER TABLE ubicaciones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lectura pública de ubicaciones" ON ubicaciones FOR SELECT USING (true);
CREATE POLICY "Admin ubicaciones" ON ubicaciones FOR ALL USING (auth.role() = 'service_role');

-- 4. Agregar nuevas actividades
INSERT INTO actividades (nombre, slug, descripcion, categoria_id) VALUES
  ('Practicante Chamánica', 'practicante-chamanica', 'Práctica chamánica y conexión espiritual', (SELECT id FROM categorias WHERE slug = 'chamanismo')),
  ('Registros Akáshicos', 'registros-akashicos', 'Lectura y sanación a través de los registros akáshicos', (SELECT id FROM categorias WHERE slug = 'sanacion-energetica')),
  ('Sanación de Útero', 'sanacion-de-utero', 'Sanación energética del útero y lo femenino', (SELECT id FROM categorias WHERE slug = 'sanacion-energetica')),
  ('Yoga & Emociones', 'yoga-y-emociones', 'Yoga integrado con gestión emocional', (SELECT id FROM categorias WHERE slug = 'yoga')),
  ('Armonizaciones', 'armonizaciones', 'Armonización energética y corporal', (SELECT id FROM categorias WHERE slug = 'sonidos-y-vibraciones')),
  ('Programas de Autoconocimiento', 'programas-de-autoconocimiento', 'Programas de autoconocimiento y crecimiento personal', (SELECT id FROM categorias WHERE slug = 'terapias-holisticas'));
