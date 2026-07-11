import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("facilitadores")
    .select("*, facilitador_actividades(actividades(id, nombre))")
    .order("nombre");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const supabase = getAdminClient();

  const { actividad_ids, ...facData } = body;

  const lat = body.latitud || -38.0055;
  const lng = body.longitud || -57.5426;

  const { data: fac, error: facErr } = await supabase
    .from("facilitadores")
    .insert({
      nombre: facData.nombre,
      email: facData.email,
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
      activo: facData.activo !== false,
    })
    .select()
    .single();

  if (facErr) return NextResponse.json({ error: facErr.message }, { status: 500 });

  if (actividad_ids?.length) {
    const rels = actividad_ids.map((aid: string) => ({
      facilitador_id: fac.id,
      actividad_id: aid,
    }));
    await supabase.from("facilitador_actividades").insert(rels);
  }

  return NextResponse.json(fac, { status: 201 });
}
