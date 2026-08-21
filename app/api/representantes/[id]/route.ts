import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const supabase = getAdminClient();

    const updates: Record<string, any> = {};
    if (body.nombre !== undefined) updates.nombre = body.nombre;
    if (body.contacto !== undefined) updates.contacto = body.contacto;
    if (body.ciudades !== undefined) updates.ciudades = body.ciudades;
    if (body.comision_porcentaje !== undefined) updates.comision_porcentaje = body.comision_porcentaje;
    if (body.activo !== undefined) updates.activo = body.activo;
    if (body.observaciones !== undefined) updates.observaciones = body.observaciones;

    const { data, error } = await supabase
      .from("representantes")
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
    const { error } = await supabase.from("representantes").delete().eq("id", params.id);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Error interno" }, { status: 500 });
  }
}
