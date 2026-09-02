-- ============================================
-- ACTIVAR ROW LEVEL SECURITY en TODAS las tablas public
-- Sin esto, las policies NO se aplican (anon escribe libre).
-- Idempotente.
-- ============================================

-- Diagnóstico antes: lista RLS por tabla (0 = deshabilitado)
DO $$
DECLARE
  t text;
  r RECORD;
BEGIN
  RAISE NOTICE '--- RLS por tabla (relrowsecurity) ---';
  FOR r IN
    SELECT c.relname AS tabla, c.relrowsecurity AS rls, c.relforcerowsecurity AS forzado
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relkind = 'r'
    ORDER BY c.relname
  LOOP
    RAISE NOTICE '% | rls=% | force=%', r.tabla, r.rls, r.forzado;
  END LOOP;
END $$;

-- Activar RLS y forzar su aplicación en todas las tablas public
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT c.relname AS tabla
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relkind = 'r'
    ORDER BY c.relname
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', r.tabla);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY;', r.tabla);
  END LOOP;
END $$;

-- Verificar después
DO $$
DECLARE
  r RECORD;
BEGIN
  RAISE NOTICE '--- RLS despues (deben ser todos rls=t) ---';
  FOR r IN
    SELECT c.relname AS tabla, c.relrowsecurity AS rls
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relkind = 'r'
    ORDER BY c.relname
  LOOP
    RAISE NOTICE '% | rls=%', r.tabla, r.rls;
  END LOOP;
END $$;