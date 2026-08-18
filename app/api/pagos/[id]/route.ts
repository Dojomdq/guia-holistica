import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("pagos")
    .select("*, facilitadores(id, nombre), planes(id, nombre, precio)")
    .eq("id", params.id)
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = getAdminClient();
  const body = await req.json();
  const { data, error } = await supabase
    .from("pagos")
    .update({
      facilitador_id: body.facilitador_id,
      plan_id: body.plan_id || null,
      monto: body.monto,
      fecha_pago: body.fecha_pago,
      metodo_pago: body.metodo_pago,
      periodo: body.periodo || null,
      observaciones: body.observaciones || null,
    })
    .eq("id", params.id)
    .select("*, facilitadores(id, nombre), planes(id, nombre, precio)")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = getAdminClient();
  const { error } = await supabase.from("pagos").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
