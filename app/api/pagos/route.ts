import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("pagos")
    .select("*, facilitadores(id, nombre), planes(id, nombre, precio)")
    .order("fecha_pago", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = getAdminClient();
  const body = await req.json();

  const { data: pago, error } = await supabase
    .from("pagos")
    .insert({
      facilitador_id: body.facilitador_id,
      plan_id: body.plan_id || null,
      monto: body.monto,
      fecha_pago: body.fecha_pago,
      metodo_pago: body.metodo_pago || "transferencia",
      periodo: body.periodo || null,
      observaciones: body.observaciones || null,
    })
    .select("*, facilitadores(id, nombre), planes(id, nombre, precio)")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: asignacion } = await supabase
    .from("facilitador_planes")
    .select("representante_id, ciudad, plan_id, precio_contratado")
    .eq("facilitador_id", body.facilitador_id)
    .eq("estado", "activo")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (asignacion?.representante_id) {
    const { data: rep } = await supabase
      .from("representantes")
      .select("comision_porcentaje")
      .eq("id", asignacion.representante_id)
      .single();

    const porcentaje = rep?.comision_porcentaje ?? 0;
    const monto = parseFloat(body.monto) || 0;
    const comision = Math.round((monto * porcentaje) / 100);

    await supabase.from("comisiones").insert({
      facilitador_id: body.facilitador_id,
      representante_id: asignacion.representante_id,
      plan_id: asignacion.plan_id || body.plan_id || null,
      ciudad: asignacion.ciudad || null,
      periodo: body.periodo || null,
      importe_cobrado: monto,
      comision_porcentaje: porcentaje,
      importe_comision: comision,
      importe_neto: monto - comision,
      estado: "pendiente",
      fecha_generacion: body.fecha_pago,
    });
  }

  return NextResponse.json(pago, { status: 201 });
}
