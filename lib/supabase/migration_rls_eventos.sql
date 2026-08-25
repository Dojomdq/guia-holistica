-- Habilitar RLS en la tabla eventos (fue creada sin políticas)
ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;

-- Lectura pública solo de eventos activos
CREATE POLICY "Lectura pública de eventos activos"
  ON eventos FOR SELECT
  USING (activo = true);

-- Acceso completo vía service_role (admin)
CREATE POLICY "Admin eventos"
  ON eventos FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
