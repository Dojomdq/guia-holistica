import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const supabase = getAdminClient();

    const updates: Record<string, any> = {};
    if (body.titulo !== undefined) updates.titulo = body.titulo;
    if (body.descripcion !== undefined) updates.descripcion = body.descripcion;
    if (body.fecha !== undefined) updates.fecha = body.fecha;
    if (body.imagen_url !== undefined) updates.imagen_url = body.imagen_url;
    if (body.link !== undefined) updates.link = body.link;
    if (body.activo !== undefined) updates.activo = body.activo;
    if (body.ciudad !== undefined) updates.ciudad = body.ciudad;
    if (body.latitud !== undefined) updates.latitud = body.latitud;
    if (body.longitud !== undefined) updates.longitud = body.longitud;
    if (body.solidario !== undefined) updates.solidario = body.solidario;

    const { data, error } = await supabase
      .from("eventos")
      .update(updates)
      .eq("id", params.id)
      .select()
      .single();

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Error interno" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = getAdminClient();
    const { error } = await supabase.from("eventos").delete().eq("id", params.id);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Error interno" }, { status: 500 });
  }
}