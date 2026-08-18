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
  const { data, error } = await supabase
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
  return NextResponse.json(data, { status: 201 });
}
