-- Ampliar tipos de eventos permitidos en la tabla clicks
-- (agrega: whatsapp, instagram, telefono, sitio_web, como_llegar, busqueda, busqueda_sin_resultado)

ALTER TABLE clicks
  DROP CONSTRAINT IF EXISTS clicks_tipo_check;

ALTER TABLE clicks
  ADD CONSTRAINT clicks_tipo_check
  CHECK (tipo IN ('actividad', 'facilitador', 'whatsapp', 'instagram', 'telefono', 'sitio_web', 'como_llegar', 'busqueda', 'busqueda_sin_resultado'));
