import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";

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
  const body = await req.json();
  const supabase = getAdminClient();

  const { actividad_ids, ...facData } = body;

  const updates: Record<string, any> = {};
  if (facData.nombre !== undefined) updates.nombre = facData.nombre;
  if (facData.email !== undefined) updates.email = facData.email;
  if (facData.telefono !== undefined) updates.telefono = facData.telefono;
  if (facData.whatsapp !== undefined) updates.whatsapp = facData.whatsapp;
  if (facData.foto_url !== undefined) updates.foto_url = facData.foto_url;
  if (facData.bio !== undefined) updates.bio = facData.bio;
  if (facData.ciudad !== undefined) updates.ciudad = facData.ciudad;
  if (facData.latitud !== undefined) updates.latitud = facData.latitud;
  if (facData.longitud !== undefined) updates.longitud = facData.longitud;
  if (facData.direccion !== undefined) updates.direccion = facData.direccion;
  if (facData.instagram !== undefined) updates.instagram = facData.instagram;
  if (facData.sitio_web !== undefined) updates.sitio_web = facData.sitio_web;
  if (facData.activo !== undefined) updates.activo = facData.activo;

  const { data, error } = await supabase
    .from("facilitadores")
    .update(updates)
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (actividad_ids !== undefined) {
    await supabase.from("facilitador_actividades").delete().eq("facilitador_id", params.id);
    if (actividad_ids.length) {
      const rels = actividad_ids.map((aid: string) => ({
        facilitador_id: params.id,
        actividad_id: aid,
      }));
      await supabase.from("facilitador_actividades").insert(rels);
    }
  }

  return NextResponse.json(data);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = getAdminClient();
  const { error } = await supabase.from("facilitadores").delete().eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
