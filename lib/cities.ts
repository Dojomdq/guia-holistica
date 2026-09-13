import { CITY_COORDS } from "@/lib/constants";

export interface CiudadInfo {
  nombre: string;
  slug: string;
  coords?: [number, number];
}

// Aliases: slug canónico → nombre exacto guardado en la BD
const ALIASES: Record<string, string> = {
  "buenos-aires": "Buenos Aires",
  "caba": "Buenos Aires",
  "capital-federal": "Buenos Aires",
  "capital": "Buenos Aires",
  "mar-del-plata": "Mar del Plata",
  "mendoza": "Mendoza",
  "cordoba": "Córdoba",
  "rosario": "Rosario",
  "la-plata": "La Plata",
  "bahia-blanca": "Bahía Blanca",
  "santa-fe": "Santa Fe",
  "tucuman": "Tucumán",
  "salta": "Salta",
  "neuquen": "Neuquén",
  "bariloche": "Bariloche",
  "comodoro-rivadavia": "Comodoro Rivadavia",
};

export function slugifyCiudad(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function deslugifyCiudad(slug: string): string {
  return ALIASES[slug] ?? slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function ciudadBySlug(slug: string): CiudadInfo | null {
  const nombre = deslugifyCiudad(slug);
  return {
    nombre,
    slug,
    coords: CITY_COORDS[nombre],
  };
}

export function todasLasCiudades(): CiudadInfo[] {
  return Object.keys(CITY_COORDS)
    .map((nombre) => ({
      nombre,
      slug: slugifyCiudad(nombre),
      coords: CITY_COORDS[nombre],
    }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre));
}