-- ============================================
-- GUÍA HOLÍSTICA - Esquema de Base de Datos
-- ============================================

-- Tabla de categorías
CREATE TABLE categorias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icono TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de actividades
CREATE TABLE actividades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  descripcion TEXT,
  categoria_id UUID REFERENCES categorias(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de facilitadores / profesionales
CREATE TABLE facilitadores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  telefono TEXT,
  whatsapp TEXT,
  foto_url TEXT,
  bio TEXT,
  ciudad TEXT NOT NULL DEFAULT 'Buenos Aires',
  latitud DECIMAL(10, 8) NOT NULL,
  longitud DECIMAL(11, 8) NOT NULL,
  direccion TEXT,
  instagram TEXT,
  sitio_web TEXT,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla relacional N:N facilitadores <-> actividades
CREATE TABLE facilitador_actividades (
  facilitador_id UUID REFERENCES facilitadores(id) ON DELETE CASCADE,
  actividad_id UUID REFERENCES actividades(id) ON DELETE CASCADE,
  PRIMARY KEY (facilitador_id, actividad_id)
);

-- ============================================
-- ÍNDICES para búsquedas rápidas
-- ============================================
CREATE INDEX idx_facilitadores_ciudad ON facilitadores(ciudad);
CREATE INDEX idx_facilitadores_ubicacion ON facilitadores(latitud, longitud);
CREATE INDEX idx_facilitadores_activo ON facilitadores(activo);
CREATE INDEX idx_actividades_categoria ON actividades(categoria_id);
CREATE INDEX idx_actividades_slug ON actividades(slug);
CREATE INDEX idx_facilitador_actividades_facilitador ON facilitador_actividades(facilitador_id);
CREATE INDEX idx_facilitador_actividades_actividad ON facilitador_actividades(actividad_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE actividades ENABLE ROW LEVEL SECURITY;
ALTER TABLE facilitadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE facilitador_actividades ENABLE ROW LEVEL SECURITY;

-- Lectura pública para todos
CREATE POLICY "Lectura pública de categorias" ON categorias FOR SELECT USING (true);
CREATE POLICY "Lectura pública de actividades" ON actividades FOR SELECT USING (true);
CREATE POLICY "Lectura pública de facilitadores" ON facilitadores FOR SELECT USING (activo = true);
CREATE POLICY "Lectura pública de facilitador_actividades" ON facilitador_actividades FOR SELECT USING (true);

-- Escritura solo para service role (admin)
CREATE POLICY "Admin categorias" ON categorias FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin actividades" ON actividades FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin facilitadores" ON facilitadores FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin facilitador_actividades" ON facilitador_actividades FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- SEED DATA: Categorías iniciales
-- ============================================
INSERT INTO categorias (nombre, slug, icono) VALUES
  ('Chamanismo', 'chamanismo', '🪶'),
  ('Yoga', 'yoga', '🧘'),
  ('Reiki', 'reiki', '✋'),
  ('Meditación', 'meditacion', '🕯️'),
  ('Tarot y Cartomancia', 'tarot', '🔮'),
  ('Astrología', 'astrologia', '⭐'),
  ('Sanación Energética', 'sanacion-energetica', '💫'),
  ('Flores de Bach', 'flores-de-bach', '🌸'),
  ('Terapias Holísticas', 'terapias-holisticas', '🌿'),
  ('Masajes Terapéuticos', 'masajes-terapeuticos', '💆'),
  ('Círculos de Mujeres', 'circulos-de-mujeres', '🌙'),
  ('Plantas Medicinales', 'plantas-medicinales', '🍃'),
  ('Limpieza Energética', 'limpieza-energetica', '✨'),
  ('Numerología', 'numerologia', '🔢'),
  ('Pranoterapia', 'pranoterapia', '🌬️'),
  ('Cacao Ceremonia', 'cacao-ceremonia', '🍫'),
  ('Sonidos y Vibraciones', 'sonidos-y-vibraciones', '🔔'),
  ('Aromaterapia', 'aromaterapia', '🫧');

-- ============================================
-- SEED DATA: Actividades iniciales
-- ============================================
INSERT INTO actividades (nombre, slug, descripcion, categoria_id) VALUES
  ('Chamán de la Pachamama', 'chamana-de-la-pachamama', 'Ceremonias chamánicas conectando con la madre tierra', (SELECT id FROM categorias WHERE slug = 'chamanismo')),
  ('Yoga Hatha', 'yoga-hatha', 'Clases de yoga tradicional Hatha', (SELECT id FROM categorias WHERE slug = 'yoga')),
  ('Yoga Restaurativo', 'yoga-restaurativo', 'Sesiones suaves de restauración', (SELECT id FROM categorias WHERE slug = 'yoga')),
  ('Reiki Nivel I', 'reiki-nivel-i', 'Curso de iniciación en Reiki nivel 1', (SELECT id FROM categorias WHERE slug = 'reiki')),
  ('Reiki Sesión Individual', 'reiki-sesion-individual', 'Sesión de sanación energética personal', (SELECT id FROM categorias WHERE slug = 'reiki')),
  ('Meditación Guiada', 'meditacion-guiada', 'Sesiones de meditación con guía', (SELECT id FROM categorias WHERE slug = 'meditacion')),
  ('Meditación Trascendental', 'meditacion-trascendental', 'Técnica de meditación TM', (SELECT id FROM categorias WHERE slug = 'meditacion')),
  ('Lectura de Tarot', 'lectura-de-tarot', 'Sesión de tirada de tarot Rider-Waite', (SELECT id FROM categorias WHERE slug = 'tarot')),
  ('Cartomancia', 'cartomancia', 'Lectura con cartas del destino', (SELECT id FROM categorias WHERE slug = 'tarot')),
  ('Carta Natal', 'carta-natal', 'Interpretación de carta astral natal', (SELECT id FROM categorias WHERE slug = 'astrologia')),
  ('Sanación con Cristales', 'sanacion-con-cristales', 'Terapia de sanación usando cristales y gemas', (SELECT id FROM categorias WHERE slug = 'sanacion-energetica')),
  ('Terapia Floral', 'terapia-floral', 'Tratamiento con flores de Bach', (SELECT id FROM categorias WHERE slug = 'flores-de-bach')),
  ('Masaje Descontracturante', 'masaje-descontracturante', 'Masaje profundo para aliviar tensiones', (SELECT id FROM categorias WHERE slug = 'masajes-terapeuticos')),
  ('Círculo de Mujeres', 'circulo-de-mujeres', 'Espacio de encuentro y sanación femenina', (SELECT id FROM categorias WHERE slug = 'circulos-de-mujeres')),
  ('Ceremonia de Cacao', 'ceremonia-de-cacao', 'Ceremonia ancestral con cacao medicinal', (SELECT id FROM categorias WHERE slug = 'cacao-ceremonia')),
  ('Baño de Bosque', 'bano-de-bosque', 'Terapia de inmersión en naturaleza', (SELECT id FROM categorias WHERE slug = 'terapias-holisticas')),
  ('Limpieza Energética', 'limpieza-energetica', 'Limpieza de aura y campos energéticos', (SELECT id FROM categorias WHERE slug = 'limpieza-energetica')),
  ('Sonidos con Cuencos', 'sonidos-con-cuencos', 'Sesión de sonidos terapéuticos tibetanos', (SELECT id FROM categorias WHERE slug = 'sonidos-y-vibraciones')),
  ('Aromaterapia con Aceites', 'aromaterapia-con-aceites', 'Sesión de aromaterapia con aceites esenciales', (SELECT id FROM categorias WHERE slug = 'aromaterapia')),
  ('Numerología Personal', 'numerologia-personal', 'Análisis numerológico del nombre y fecha', (SELECT id FROM categorias WHERE slug = 'numerologia')),
  ('Pranoterapia a Distancia', 'pranoterapia-a-distancia', 'Sesión de prana curativa a distancia', (SELECT id FROM categorias WHERE slug = 'pranoterapia'));

-- ============================================
-- SEED DATA: Facilitadores de ejemplo
-- ============================================
-- Nota: Las coordenadas son de Buenos Aires (centro)
INSERT INTO facilitadores (nombre, email, telefono, whatsapp, bio, ciudad, latitud, longitud, direccion, instagram) VALUES
  ('María Elena Rodríguez', 'maria.elena@example.com', '+54 11 5555-0001', '+541155550001', 'Maestra chamánica con 15 años de experiencia en ceremonias de la Pachamama. Formada en los Andes peruanos.', 'Buenos Aires', -34.6037, -58.3816, 'Av. de Mayo 1234, CABA', '@maria_elena_chamana'),
  ('Luciano Martínez', 'luciano.m@example.com', '+54 11 5555-0002', '+541155550002', 'Instructor de yoga certificado RYT-500. Especializado en yoga restaurativo y terapéutico.', 'Buenos Aires', -34.5996, -58.3736, 'Callao 567, CABA', '@luciano_yoga'),
  ('Camila Fernández', 'camila.f@example.com', '+54 11 5555-0003', '+541155550003', 'Maestra Reiki nivel III Usui. Terapeuta holística integral. 10 años de práctica.', 'Buenos Aires', -34.6083, -58.3712, 'Corrientes 890, CABA', '@camila_reiki'),
  ('Rodrigo Sánchez', 'rodrigo.s@example.com', '+54 11 5555-0004', '+41155550004', 'Meditador y guía espiritual. Practica Vipassana desde 2010. Ofrece retiros y círculos.', 'Buenos Aires', -34.5874, -58.4012, 'Santa Fe 2345, CABA', '@rodrigo_meditacion'),
  ('Valentina López', 'valentina.l@example.com', '+54 11 5555-0005', '+541155550005', 'Lectora de tarot profesional. Especializada en cartas Rider-Waite y marsella.', 'Buenos Aires', -34.6158, -58.3649, 'Libertad 678, CABA', '@valentina_tarot'),
  ('Fernando García', 'fernando.g@example.com', '+54 11 5555-0006', '+541155550006', 'Astrologo certificado. Cartas natales, transitaciones y sinastria.', 'Buenos Aires', -34.5732, -58.4188, 'Rivadavia 4567, CABA', '@fernando_astro'),
  ('Lucía Morales', 'lucia.m@example.com', '+54 11 5555-0007', '+541155550007', 'Terapeuta holística. Sanación con cristales, aura y campos energéticos.', 'Buenos Aires', -34.6210, -58.3880, 'Belgrano 1890, CABA', '@lucia_cristales'),
  ('Martín Herrera', 'martin.h@example.com', '+54 11 5555-0008', '+541155550008', 'Practicante de flores de Bach desde 2012. Terapia floral personalizada.', 'Buenos Aires', -34.5921, -58.3945, 'Pueyrredón 3210, CABA', '@martin_bach'),
  ('Isabel Díaz', 'isabel.d@example.com', '+54 11 5555-0009', '+541155550009', 'Masajista terapéutica. Formada en masaje descontracturante y drenaje linfático.', 'Buenos Aires', -34.6060, -58.4102, 'Av. Libertador 5678, CABA', '@isabel_masajes'),
  ('Andrés Romero', 'andres.r@example.com', '+54 11 5555-0010', '+541155550010', 'Facilitador de círculos de mujeres y ceremonias de cacao. Guardián de ceremonia.', 'Buenos Aires', -34.6185, -58.3560, 'Dorrego 1456, CABA', '@andres_circulos'),
  ('Sofía Torres', 'sofia.t@example.com', '+54 11 5555-0011', '+541155550011', 'Guía de sonidos terapéuticos. Cuencos tibetanos, gongs y cuencos de cuarzo.', 'Buenos Aires', -34.5800, -58.3650, 'Scalabrini Ortiz 789, CABA', '@sofia_sonidos'),
  ('Diego Castro', 'diego.c@example.com', '+54 11 5555-0012', '+541155550012', 'Aromaterapeuta certificado. Uso medicinal de aceites esenciales puros.', 'Buenos Aires', -34.6120, -58.3980, 'Av. Hipólito Yrigoyen 2345, CABA', '@diego_aroma');

-- ============================================
-- ASIGNAR ACTIVIDADES A FACILITADORES
-- ============================================
INSERT INTO facilitador_actividades (facilitador_id, actividad_id)
SELECT f.id, a.id
FROM facilitadores f, actividades a
WHERE f.email = 'maria.elena@example.com' AND a.slug = 'chamana-de-la-pachamama';

INSERT INTO facilitador_actividades (facilitador_id, actividad_id)
SELECT f.id, a.id
FROM facilitadores f, actividades a
WHERE f.email = 'luciano.m@example.com' AND a.slug IN ('yoga-hatha', 'yoga-restaurativo');

INSERT INTO facilitador_actividades (facilitador_id, actividad_id)
SELECT f.id, a.id
FROM facilitadores f, actividades a
WHERE f.email = 'camila.f@example.com' AND a.slug IN ('reiki-nivel-i', 'reiki-sesion-individual');

INSERT INTO facilitador_actividades (facilitador_id, actividad_id)
SELECT f.id, a.id
FROM facilitadores f, actividades a
WHERE f.email = 'rodrigo.s@example.com' AND a.slug IN ('meditacion-guiada', 'meditacion-trascendental');

INSERT INTO facilitador_actividades (facilitador_id, actividad_id)
SELECT f.id, a.id
FROM facilitadores f, actividades a
WHERE f.email = 'valentina.l@example.com' AND a.slug IN ('lectura-de-tarot', 'cartomancia');

INSERT INTO facilitador_actividades (facilitador_id, actividad_id)
SELECT f.id, a.id
FROM facilitadores f, actividades a
WHERE f.email = 'fernando.g@example.com' AND a.slug = 'carta-natal';

INSERT INTO facilitador_actividades (facilitador_id, actividad_id)
SELECT f.id, a.id
FROM facilitadores f, actividades a
WHERE f.email = 'lucia.m@example.com' AND a.slug = 'sanacion-con-cristales';

INSERT INTO facilitador_actividades (facilitador_id, actividad_id)
SELECT f.id, a.id
FROM facilitadores f, actividades a
WHERE f.email = 'martin.h@example.com' AND a.slug = 'terapia-floral';

INSERT INTO facilitador_actividades (facilitador_id, actividad_id)
SELECT f.id, a.id
FROM facilitadores f, actividades a
WHERE f.email = 'isabel.d@example.com' AND a.slug = 'masaje-descontracturante';

INSERT INTO facilitador_actividades (facilitador_id, actividad_id)
SELECT f.id, a.id
FROM facilitadores f, actividades a
WHERE f.email = 'andres.r@example.com' AND a.slug IN ('circulo-de-mujeres', 'ceremonia-de-cacao');

INSERT INTO facilitador_actividades (facilitador_id, actividad_id)
SELECT f.id, a.id
FROM facilitadores f, actividades a
WHERE f.email = 'sofia.t@example.com' AND a.slug = 'sonidos-con-cuencos';

INSERT INTO facilitador_actividades (facilitador_id, actividad_id)
SELECT f.id, a.id
FROM facilitadores f, actividades a
WHERE f.email = 'diego.c@example.com' AND a.slug = 'aromaterapia-con-aceites';
