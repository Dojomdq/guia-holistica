import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  const supabase = getAdminClient();
  const { searchParams } = new URL(req.url);
  const facilitadorId = searchParams.get("facilitador_id");

  let query = supabase
    .from("facilitador_planes")
    .select("*, planes(nombre, slug)")
    .order("created_at", { ascending: false });

  if (facilitadorId) query = query.eq("facilitador_id", facilitadorId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = getAdminClient();

    const { data, error } = await supabase
      .from("facilitador_planes")
      .insert({
        facilitador_id: body.facilitador_id,
        plan_id: body.plan_id || null,
        ciudad: body.ciudad || "Mar del Plata",
        fundador: !!body.fundador,
        estado: body.estado || "activo",
        precio_contratado: body.precio_contratado ?? null,
        fecha_inicio: body.fecha_inicio || null,
        fecha_vencimiento: body.fecha_vencimiento || null,
        proxima_fecha_pago: body.proxima_fecha_pago || null,
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
