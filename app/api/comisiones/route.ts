import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("comisiones")
    .select("*, facilitadores(nombre), representantes(nombre), planes(nombre)")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = getAdminClient();

    const importeCobrado = body.importe_cobrado ?? 0;
    const porcentaje = body.comision_porcentaje ?? 0;
    const importeComision = Math.round((importeCobrado * porcentaje) / 100);
    const importeNeto = importeCobrado - importeComision;

    const { data, error } = await supabase
      .from("comisiones")
      .insert({
        facilitador_id: body.facilitador_id || null,
        representante_id: body.representante_id || null,
        plan_id: body.plan_id || null,
        ciudad: body.ciudad || null,
        periodo: body.periodo || null,
        importe_cobrado: importeCobrado,
        comision_porcentaje: porcentaje,
        importe_comision: importeComision,
        importe_neto: importeNeto,
        estado: body.estado || "pendiente",
        fecha_generacion: body.fecha_generacion || null,
        fecha_pago: body.fecha_pago || null,
        observaciones: body.observaciones || null,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Error interno" }, { status: 500 });
  }
}
