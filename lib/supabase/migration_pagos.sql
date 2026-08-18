-- Tabla de pagos de facilitadores
-- Registra cada pago recibido de un profesional

CREATE TABLE pagos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  facilitador_id UUID NOT NULL REFERENCES facilitadores(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES planes(id) ON DELETE SET NULL,
  monto NUMERIC(10,2) NOT NULL CHECK (monto >= 0),
  fecha_pago DATE NOT NULL DEFAULT CURRENT_DATE,
  metodo_pago TEXT NOT NULL DEFAULT 'transferencia' CHECK (metodo_pago IN ('efectivo', 'transferencia', 'mercado_pago', 'otro')),
  periodo TEXT,
  observaciones TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Índices
CREATE INDEX idx_pagos_facilitador ON pagos(facilitador_id);
CREATE INDEX idx_pagos_fecha ON pagos(fecha_pago);
CREATE INDEX idx_pagos_metodo ON pagos(metodo_pago);

-- RLS: solo service_role puede escribir (anon no)
ALTER TABLE pagos ENABLE ROW LEVEL SECURITY;

-- Policies seguras: solo service_role puede todo
CREATE POLICY "Service role full access pagos" ON pagos
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Anon puede leer (para el dashboard)
CREATE POLICY "Anyone can read pagos" ON pagos
  FOR SELECT
  TO anon
  USING (true);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_pagos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER pagos_updated_at
  BEFORE UPDATE ON pagos
  FOR EACH ROW
  EXECUTE FUNCTION update_pagos_updated_at();
