import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const supabase = getAdminClient();

    const updates: Record<string, any> = {};
    if (body.facilitador_id !== undefined) updates.facilitador_id = body.facilitador_id;
    if (body.representante_id !== undefined) updates.representante_id = body.representante_id;
    if (body.plan_id !== undefined) updates.plan_id = body.plan_id;
    if (body.ciudad !== undefined) updates.ciudad = body.ciudad;
    if (body.periodo !== undefined) updates.periodo = body.periodo;
    if (body.importe_cobrado !== undefined) updates.importe_cobrado = body.importe_cobrado;
    if (body.comision_porcentaje !== undefined) updates.comision_porcentaje = body.comision_porcentaje;
    if (body.importe_comision !== undefined) updates.importe_comision = body.importe_comision;
    if (body.importe_neto !== undefined) updates.importe_neto = body.importe_neto;
    if (body.estado !== undefined) updates.estado = body.estado;
    if (body.fecha_generacion !== undefined) updates.fecha_generacion = body.fecha_generacion;
    if (body.fecha_pago !== undefined) updates.fecha_pago = body.fecha_pago;
    if (body.observaciones !== undefined) updates.observaciones = body.observaciones;

    const { data, error } = await supabase
      .from("comisiones")
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
    const { error } = await supabase.from("comisiones").delete().eq("id", params.id);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Error interno" }, { status: 500 });
  }
}
