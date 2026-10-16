import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { readJsonBody } from "@/lib/body";

export async function GET(req: NextRequest) {
  const supabase = getAdminClient();
  const { searchParams } = new URL(req.url);
  const estado = searchParams.get("estado");
  const facilitador_id = searchParams.get("facilitador_id");

  let query = supabase
    .from("codigos_canje")
    .select("*, facilitadores(id, nombre)")
    .order("created_at", { ascending: false })
    .limit(300);

  if (estado && estado !== "todos") query = query.eq("estado", estado);
  if (facilitador_id) query = query.eq("facilitador_id", facilitador_id);

  const { data, error } = await query;
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const read = await readJsonBody(req);
  if (!read.ok) return NextResponse.json({ error: read.error }, { status: read.status });

  const { id, estado } = read.body as any;
  if (typeof id !== "string" || !id) {
    return NextResponse.json({ error: "Falta el id del código" }, { status: 400 });
  }

  const supabase = getAdminClient();
  const esUsado = estado === "usado";

  const { data, error } = await supabase
    .from("codigos_canje")
    .update({
      estado: esUsado ? "usado" : "activo",
      usado_at: esUsado ? new Date().toISOString() : null,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data });
}