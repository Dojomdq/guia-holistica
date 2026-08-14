import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const supabase = getAdminClient();

    const updates: Record<string, any> = {};
    if (body.plan_id !== undefined) updates.plan_id = body.plan_id;
    if (body.ciudad !== undefined) updates.ciudad = body.ciudad;
    if (body.fundador !== undefined) updates.fundador = body.fundador;
    if (body.estado !== undefined) updates.estado = body.estado;
    if (body.precio_contratado !== undefined) updates.precio_contratado = body.precio_contratado;
    if (body.fecha_inicio !== undefined) updates.fecha_inicio = body.fecha_inicio;
    if (body.fecha_vencimiento !== undefined) updates.fecha_vencimiento = body.fecha_vencimiento;
    if (body.proxima_fecha_pago !== undefined) updates.proxima_fecha_pago = body.proxima_fecha_pago;
    if (body.observaciones !== undefined) updates.observaciones = body.observaciones;
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("facilitador_planes")
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
    const { error } = await supabase.from("facilitador_planes").delete().eq("id", params.id);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Error interno" }, { status: 500 });
  }
}
