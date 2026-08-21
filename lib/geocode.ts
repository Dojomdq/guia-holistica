const DEFAULT_LAT = -38.0055;
const DEFAULT_LNG = -57.5426;

interface GeocodeResult {
  lat: number;
  lng: number;
}

export async function geocodeAddress(
  direccion: string | null,
  ciudad: string | null
): Promise<GeocodeResult | null> {
  if (!direccion) return null;

  const query = [direccion, ciudad].filter(Boolean).join(", ");
  if (!query.trim()) return null;

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "GuiaDeBienestar/1.0 (https://guiadebienestar.com.ar)",
      },
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (!data || data.length === 0) return null;

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  } catch {
    return null;
  }
}

export function isDefaultCoordinates(lat: number, lng: number): boolean {
  return lat === DEFAULT_LAT && lng === DEFAULT_LNG;
}

export { DEFAULT_LAT, DEFAULT_LNG };
