-- Eventos solidarios: agregar campo
ALTER TABLE eventos
  ADD COLUMN IF NOT EXISTS solidario BOOLEAN DEFAULT FALSE;

-- Tabla de destacados del mes (sitio web + instagram)
CREATE TABLE IF NOT EXISTS destacados (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  facilitador_id UUID REFERENCES facilitadores(id) ON DELETE CASCADE,
  tipo TEXT DEFAULT 'sitio',
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_destacados_tipo ON destacados(tipo);
CREATE INDEX IF NOT EXISTS idx_destacados_activo ON destacados(activo);

ALTER TABLE destacados ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lectura pública de destacados" ON destacados FOR SELECT USING (true);
CREATE POLICY "Admin destacados" ON destacados FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
