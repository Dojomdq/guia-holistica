-- Tabla de clicks para tracking
CREATE TABLE clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo TEXT NOT NULL CHECK (tipo IN ('actividad', 'facilitador')),
  referencia_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para queries rápidas
CREATE INDEX idx_clicks_tipo ON clicks(tipo);
CREATE INDEX idx_clicks_referencia ON clicks(referencia_id);
CREATE INDEX idx_clicks_created ON clicks(created_at);

-- RLS: anyone can insert, only admin can read
ALTER TABLE clicks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert clicks" ON clicks FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can read clicks" ON clicks FOR SELECT USING (true);
