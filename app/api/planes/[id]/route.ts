import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const supabase = getAdminClient();

    const updates: Record<string, any> = {};
    if (body.nombre !== undefined) updates.nombre = body.nombre;
    if (body.slug !== undefined) updates.slug = body.slug;
    if (body.precio !== undefined) updates.precio = body.precio;
    if (body.periodicidad !== undefined) updates.periodicidad = body.periodicidad;
    if (body.descripcion !== undefined) updates.descripcion = body.descripcion;
    if (body.beneficios !== undefined) updates.beneficios = body.beneficios;
    if (body.activo !== undefined) updates.activo = body.activo;
    if (body.acciones_difusion !== undefined) updates.acciones_difusion = body.acciones_difusion;
    if (body.publicacion_individual !== undefined) updates.publicacion_individual = body.publicacion_individual;
    if (body.perfil_destacado !== undefined) updates.perfil_destacado = body.perfil_destacado;
    if (body.prioridad_categoria !== undefined) updates.prioridad_categoria = body.prioridad_categoria;
    if (body.aparicion_destacados !== undefined) updates.aparicion_destacados = body.aparicion_destacados;
    if (body.contenidos_tematicos !== undefined) updates.contenidos_tematicos = body.contenidos_tematicos;

    const { data, error } = await supabase
      .from("planes")
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
    const { error } = await supabase.from("planes").delete().eq("id", params.id);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Error interno" }, { status: 500 });
  }
}
