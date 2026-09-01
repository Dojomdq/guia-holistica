import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { geocodeAddress, isDefaultCoordinates, DEFAULT_LAT, DEFAULT_LNG } from "@/lib/geocode";

export async function GET() {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("facilitadores")
    .select("*, facilitador_actividades(actividades(id, nombre)), ubicaciones(*)")
    .order("nombre");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = getAdminClient();

    const { actividad_ids, ubicaciones, ...facData } = body;

    let lat = parseFloat(body.latitud) || DEFAULT_LAT;
    let lng = parseFloat(body.longitud) || DEFAULT_LNG;

    if (isDefaultCoordinates(lat, lng) && facData.direccion) {
      const geo = await geocodeAddress(facData.direccion, facData.ciudad || "Mar del Plata");
      if (geo) {
        lat = geo.lat;
        lng = geo.lng;
      }
    }

    function makeSlug(nombre: string): string {
      return nombre
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    const slugBase = facData.slug || makeSlug(facData.nombre || "facilitador");
    let slug = slugBase;
    let counter = 1;
    while (true) {
      const { data: existente } = await supabase
        .from("facilitadores")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();
      if (!existente) break;
      counter += 1;
      slug = `${slugBase}-${counter}`;
    }

    const { data: fac, error: facErr } = await supabase
      .from("facilitadores")
      .insert({
        nombre: facData.nombre,
        email: facData.email,
        slug,
        telefono: facData.telefono || null,
        whatsapp: facData.whatsapp || null,
        foto_url: facData.foto_url || null,
        bio: facData.bio || null,
        ciudad: facData.ciudad || "Mar del Plata",
        latitud: lat,
        longitud: lng,
        direccion: facData.direccion || null,
        instagram: facData.instagram || null,
        sitio_web: facData.sitio_web || null,
        logo_url: facData.logo_url || null,
        activo: facData.activo !== false,
      })
      .select()
      .single();

    if (facErr) return NextResponse.json({ success: false, error: facErr.message }, { status: 500 });

    if (actividad_ids?.length) {
      const rels = actividad_ids.map((aid: string) => ({
        facilitador_id: fac.id,
        actividad_id: aid,
      }));
      const { error: relErr } = await supabase.from("facilitador_actividades").insert(rels);
      if (relErr) return NextResponse.json({ success: false, error: relErr.message }, { status: 500 });
    }

    if (ubicaciones?.length) {
      const ubis = await Promise.all(
        ubicaciones.map(async (u: any) => {
          let uLat = parseFloat(u.latitud) || DEFAULT_LAT;
          let uLng = parseFloat(u.longitud) || DEFAULT_LNG;

          if (isDefaultCoordinates(uLat, uLng) && u.direccion) {
            const geo = await geocodeAddress(u.direccion, u.ciudad || "Mar del Plata");
            if (geo) {
              uLat = geo.lat;
              uLng = geo.lng;
            }
          }

          return {
            facilitador_id: fac.id,
            direccion: u.direccion || null,
            latitud: uLat,
            longitud: uLng,
            ciudad: u.ciudad || "Mar del Plata",
            descripcion: u.descripcion || null,
          };
        })
      );
      await supabase.from("ubicaciones").insert(ubis);
    }

    return NextResponse.json({ success: true, data: fac }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Error interno" }, { status: 500 });
  }
}
