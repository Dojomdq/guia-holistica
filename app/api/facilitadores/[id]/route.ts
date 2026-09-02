import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { geocodeAddress, isDefaultCoordinates, DEFAULT_LAT, DEFAULT_LNG } from "@/lib/geocode";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("facilitadores")
    .select("*, facilitador_actividades(actividades(id, nombre))")
    .eq("id", params.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const supabase = getAdminClient();

    const { actividad_ids, ubicaciones, ...facData } = body;

    const updates: Record<string, any> = {};
    if (facData.nombre !== undefined) updates.nombre = facData.nombre;
    if (facData.email !== undefined) updates.email = facData.email;
    if (facData.telefono !== undefined) updates.telefono = facData.telefono;
    if (facData.whatsapp !== undefined) updates.whatsapp = facData.whatsapp;
    if (facData.foto_url !== undefined) updates.foto_url = facData.foto_url;
    if (facData.bio !== undefined) updates.bio = facData.bio;
    if (facData.ciudad !== undefined) updates.ciudad = facData.ciudad;
    if (facData.direccion !== undefined) updates.direccion = facData.direccion;
    if (facData.instagram !== undefined) updates.instagram = facData.instagram;
    if (facData.sitio_web !== undefined) updates.sitio_web = facData.sitio_web;
    if (facData.logo_url !== undefined) updates.logo_url = facData.logo_url;
    if (facData.activo !== undefined) updates.activo = facData.activo;

    if (facData.latitud !== undefined) updates.latitud = facData.latitud;
    if (facData.longitud !== undefined) updates.longitud = facData.longitud;

    if (
      facData.direccion !== undefined &&
      updates.latitud === undefined &&
      updates.longitud === undefined
    ) {
      const currentLat = updates.latitud ?? DEFAULT_LAT;
      const currentLng = updates.longitud ?? DEFAULT_LNG;
      if (isDefaultCoordinates(currentLat, currentLng) && facData.direccion) {
        const geo = await geocodeAddress(facData.direccion, facData.ciudad || "Mar del Plata");
        if (geo) {
          updates.latitud = geo.lat;
          updates.longitud = geo.lng;
        }
      }
    }

    const { data, error } = await supabase
      .from("facilitadores")
      .update(updates)
      .eq("id", params.id)
      .select()
      .single();

    if (error) return NextResponse.json({ success: false, error: "Error al actualizar facilitador" }, { status: 500 });

    if (actividad_ids !== undefined) {
      const { error: delErr } = await supabase.from("facilitador_actividades").delete().eq("facilitador_id", params.id);
      if (delErr) return NextResponse.json({ success: false, error: "Error al actualizar actividades" }, { status: 500 });
      if (actividad_ids.length) {
        const rels = actividad_ids.map((aid: string) => ({
          facilitador_id: params.id,
          actividad_id: aid,
        }));
        const { error: insErr } = await supabase.from("facilitador_actividades").insert(rels);
        if (insErr) return NextResponse.json({ success: false, error: "Error al actualizar actividades" }, { status: 500 });
      }
    }

    if (ubicaciones !== undefined) {
      await supabase.from("ubicaciones").delete().eq("facilitador_id", params.id);
      if (ubicaciones.length) {
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
              facilitador_id: params.id,
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
    }

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, error: "Error interno" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = getAdminClient();
    await supabase.from("facilitador_actividades").delete().eq("facilitador_id", params.id);
    await supabase.from("ubicaciones").delete().eq("facilitador_id", params.id);
    const { error } = await supabase.from("facilitadores").delete().eq("id", params.id);
    if (error) return NextResponse.json({ success: false, error: "Error al eliminar facilitador" }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Error interno" }, { status: 500 });
  }
}
