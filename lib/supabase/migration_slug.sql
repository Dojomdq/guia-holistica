-- Agregar campo slug a facilitadores para URLs amigables (SEO)

ALTER TABLE facilitadores
  ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Generar slugs para facilitadores existentes (nombre + actividad principal)
-- Nota: se ejecuta de forma básica; si hay duplicados, los registros sin slug
-- se completarán cuando se editen desde el admin.
DO $$
DECLARE
  r RECORD;
  base_slug TEXT;
  final_slug TEXT;
  counter INT;
BEGIN
  FOR r IN
    SELECT id, nombre FROM facilitadores WHERE slug IS NULL OR slug = ''
  LOOP
    base_slug := lower(regexp_replace(
      regexp_replace(
        translate(r.nombre, 'áéíóúÁÉÍÓÚñÑ', 'aeiouAEIOUnN'),
        '[^a-z0-9]+', '-', 'g'
      ),
      '(^-+|-+$)', '', 'g'
    ));

    final_slug := base_slug;
    counter := 1;
    WHILE EXISTS (SELECT 1 FROM facilitadores WHERE slug = final_slug) LOOP
      final_slug := base_slug || '-' || counter;
      counter := counter + 1;
    END LOOP;

    UPDATE facilitadores SET slug = final_slug WHERE id = r.id;
  END LOOP;
END $$;
