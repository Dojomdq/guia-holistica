import { supabasePublic } from "@/lib/supabase/public-server";
import { slugifyCiudad, deslugifyCiudad, type CiudadInfo } from "@/lib/cities";

export interface CiudadLanding extends CiudadInfo {
  // Marcador de prioridad SEO (ej: Buenos Aires/CABA primero)
  prioridad: number;
}

const ALIASES = {
  "buenos-aires": "Buenos Aires",
  "caba": "Buenos Aires",
  "capital-federal": "Buenos Aires",
};

const PRIORITARIAS: Record<string, string> = {
  "Buenos Aires": "Buenos Aires",
  "CABA": "Buenos Aires",
  "Mar del Plata": "Mar del Plata",
  "La Plata": "La Plata",
  "Córdoba": "Córdoba",
  "Rosario": "Rosario",
  "Mendoza": "Mendoza",
  "Bahía Blanca": "Bahía Blanca",
  "Santa Fe": "Santa Fe",
  "Tucumán": "Tucumán",
  "Salta": "Salta",
  "Neuquén": "Neuquén",
  "Bariloche": "Bariloche",
  "Comodoro Rivadavia": "Comodoro Rivadavia",
};

export async function todasLasCiudadesDeLaBD(): Promise<string[]> {
  const set = new Set<string>();
  try {
    const { data } = await supabasePublic
      .from("facilitadores")
      .select("ubicaciones(ciudad)")
      .eq("activo", true);
    if (data) {
      (data as any[]).forEach((f) => {
        (f.ubicaciones || []).forEach((u: any) => {
          if (u?.ciudad) set.add(u.ciudad);
        });
      });
    }
  } catch {
    // Sin datos, usamos solo las prioritarias
  }
  return Array.from(set);
}

// Unión de ciudades de la BD + prioritarias, sin duplicar por slug
export async function todosLasLandingCiudades(): Promise<CiudadLanding[]> {
  const deBD = await todasLasCiudadesDeLaBD();
  const nombres = Array.from(
    new Set([...deBD, ...Object.values(PRIORITARIAS)])
  ).sort((a, b) => a.localeCompare(b));

  return nombres.map((nombre, i) => ({
    nombre,
    slug: slugifyCiudad(nombre),
    prioridad: i,
  }));
}

export async function ciudadFromSlug(slug: string): Promise<CiudadLanding | null> {
  const todas = await todosLasLandingCiudades();
  const match = todas.find(
    (c) => c.slug === slug || c.slug === slugifyCiudad(deslugifyCiudad(slug))
  );
  return match || null;
}

export function ciudadCanonica(slug: string): string | null {
  return ALIASES[slug] ?? null;
}