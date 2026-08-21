-- ============================================
-- MIGRATION: Representantes y Comisiones
-- ============================================

-- Tabla de representantes / comerciales
CREATE TABLE IF NOT EXISTS representantes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  contacto TEXT,
  ciudades TEXT,
  comision_porcentaje NUMERIC DEFAULT 50,
  activo BOOLEAN DEFAULT TRUE,
  observaciones TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Columna de representante en la asignación facilitador-plan
ALTER TABLE facilitador_planes
  ADD COLUMN IF NOT EXISTS representante_id UUID REFERENCES representantes(id) ON DELETE SET NULL;

-- Tabla de comisiones (registro y seguimiento de pagos)
CREATE TABLE IF NOT EXISTS comisiones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  facilitador_id UUID REFERENCES facilitadores(id) ON DELETE SET NULL,
  representante_id UUID REFERENCES representantes(id) ON DELETE SET NULL,
  plan_id UUID REFERENCES planes(id) ON DELETE SET NULL,
  ciudad TEXT,
  periodo TEXT,
  importe_cobrado NUMERIC DEFAULT 0,
  comision_porcentaje NUMERIC DEFAULT 0,
  importe_comision NUMERIC DEFAULT 0,
  importe_neto NUMERIC DEFAULT 0,
  estado TEXT DEFAULT 'pendiente',
  fecha_generacion DATE,
  fecha_pago DATE,
  observaciones TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_representantes_activo ON representantes(activo);
CREATE INDEX IF NOT EXISTS idx_comisiones_representante ON comisiones(representante_id);
CREATE INDEX IF NOT EXISTS idx_comisiones_facilitador ON comisiones(facilitador_id);
CREATE INDEX IF NOT EXISTS idx_comisiones_estado ON comisiones(estado);
CREATE INDEX IF NOT EXISTS idx_facilitador_planes_representante ON facilitador_planes(representante_id);

-- ============================================
-- RLS: lectura pública, escritura solo service_role
-- ============================================
ALTER TABLE representantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comisiones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública de representantes" ON representantes FOR SELECT USING (true);
CREATE POLICY "Admin representantes" ON representantes FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Lectura pública de comisiones" ON comisiones FOR SELECT USING (true);
CREATE POLICY "Admin comisiones" ON comisiones FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
