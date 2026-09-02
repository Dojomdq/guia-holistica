import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { geocodeAddress, isDefaultCoordinates, DEFAULT_LAT, DEFAULT_LNG } from "@/lib/geocode";
import { readJsonBody } from "@/lib/body";

export async function GET() {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("facilitadores")
    .select("*, facilitador_actividades(actividades(id, nombre)), ubicaciones(*)")
    .order("nombre");

  if (error) return NextResponse.json({ error: "Error al consultar facilitadores" }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const read = await readJsonBody(req, 2 * 1024 * 1024);
  if (!read.ok) {
    return NextResponse.json({ success: false, error: read.error }, { status: read.status });
  }
  const body = read.body as any;
  const supabase = getAdminClient();

    const { actividad_ids, ubicaciones, ...facData } = body;

    const nombre = typeof facData.nombre === "string" ? facData.nombre.trim() : "";
    const email = typeof facData.email === "string" ? facData.email.trim() : "";
    if (!nombre) return NextResponse.json({ success: false, error: "El nombre es requerido" }, { status: 400 });
    if (!email) return NextResponse.json({ success: false, error: "El email es requerido" }, { status: 400 });

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
        nombre,
        email,
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

    if (facErr) return NextResponse.json({ success: false, error: "Error al guardar facilitador" }, { status: 500 });

    if (actividad_ids?.length) {
      const rels = actividad_ids.map((aid: string) => ({
        facilitador_id: fac.id,
        actividad_id: aid,
      }));
      const { error: relErr } = await supabase.from("facilitador_actividades").insert(rels);
      if (relErr) return NextResponse.json({ success: false, error: "Error al guardar actividades" }, { status: 500 });
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
}
