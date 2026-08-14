-- ============================================
-- MIGRATION: Sistema de Planes (interno admin)
-- ============================================

-- Tabla de planes configurables
CREATE TABLE IF NOT EXISTS planes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  slug TEXT UNIQUE,
  precio NUMERIC,
  periodicidad TEXT DEFAULT 'mensual',
  descripcion TEXT,
  beneficios TEXT,
  activo BOOLEAN DEFAULT TRUE,
  acciones_difusion INTEGER DEFAULT 0,
  publicacion_individual BOOLEAN DEFAULT FALSE,
  perfil_destacado BOOLEAN DEFAULT FALSE,
  prioridad_categoria BOOLEAN DEFAULT FALSE,
  aparicion_destacados BOOLEAN DEFAULT FALSE,
  contenidos_tematicos BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de asignación plan <-> facilitador
-- (preparada para multi-ciudad vía campo ciudad)
CREATE TABLE IF NOT EXISTS facilitador_planes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  facilitador_id UUID REFERENCES facilitadores(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES planes(id) ON DELETE SET NULL,
  ciudad TEXT DEFAULT 'Mar del Plata',
  fundador BOOLEAN DEFAULT FALSE,
  estado TEXT DEFAULT 'activo',
  precio_contratado NUMERIC,
  fecha_inicio DATE,
  fecha_vencimiento DATE,
  proxima_fecha_pago DATE,
  observaciones TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_planes_activo ON planes(activo);
CREATE INDEX IF NOT EXISTS idx_facilitador_planes_facilitador ON facilitador_planes(facilitador_id);
CREATE INDEX IF NOT EXISTS idx_facilitador_planes_plan ON facilitador_planes(plan_id);

-- ============================================
-- RLS: lectura pública, escritura solo service_role
-- ============================================
ALTER TABLE planes ENABLE ROW LEVEL SECURITY;
ALTER TABLE facilitador_planes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública de planes" ON planes FOR SELECT USING (true);
CREATE POLICY "Admin planes" ON planes FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Lectura pública de facilitador_planes" ON facilitador_planes FOR SELECT USING (true);
CREATE POLICY "Admin facilitador_planes" ON facilitador_planes FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- ============================================
-- SEED: Planes iniciales
-- ============================================
INSERT INTO planes (nombre, slug, precio, periodicidad, descripcion, beneficios, activo, acciones_difusion, publicacion_individual, perfil_destacado, prioridad_categoria, aparicion_destacados, contenidos_tematicos) VALUES
(
  'Fundadores / Esencial',
  'fundadores-esencial',
  11000,
  'mensual',
  'Perfil en Guía de Bienestar con aparición en mapa y búsquedas.',
  E'Perfil en Guía de Bienestar.\nAparición en el mapa.\nAparición en búsquedas.\nCategoría.\nCiudad.\nDatos de contacto.\nEnlaces disponibles.\n1 acción de difusión mensual en Instagram.\nInclusión en la historia destacada de su categoría.\nAcceso a las charlas grupales de Guía de Bienestar.',
  TRUE,
  1,
  FALSE,
  FALSE,
  FALSE,
  FALSE,
  FALSE
),
(
  'Difusión',
  'difusion',
  20000,
  'mensual',
  'Todos los beneficios de Esencial más hasta 3 acciones de difusión y 1 publicación individual.',
  E'Hasta 3 acciones de difusión mensuales.\n1 publicación individual mensual en el feed.\nDifusión de servicios, novedades, promociones o actividades.\nParticipación rotativa en Destacados del mes.\nMayor presencia en las acciones de comunicación de Guía de Bienestar.',
  TRUE,
  3,
  TRUE,
  FALSE,
  FALSE,
  TRUE,
  FALSE
),
(
  'Premium / Destacado',
  'premium-destacado',
  35000,
  'mensual',
  'Todos los beneficios de Difusión más perfil destacado y prioridad.',
  E'Perfil destacado.\nAparición prioritaria dentro de su categoría.\nInclusión en el filtro "Destacados" del mapa.\nParticipación prioritaria en Destacados del mes.\nHasta 4 acciones de difusión mensuales.\n1 publicación individual mensual.\nPrioridad de aparición en contenidos temáticos.',
  FALSE,
  4,
  TRUE,
  TRUE,
  TRUE,
  TRUE,
  TRUE
);
