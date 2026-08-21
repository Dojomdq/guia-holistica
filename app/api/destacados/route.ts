import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  const supabase = getAdminClient();
  const { searchParams } = new URL(req.url);
  const tipo = searchParams.get("tipo");

  let query = supabase
    .from("destacados")
    .select("*, facilitadores(id, nombre, bio, foto_url, slug, facilitador_actividades(actividades(nombre, slug)))");

  if (tipo) query = query.eq("tipo", tipo);

  const { data, error } = await query;
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = getAdminClient();

    const { data, error } = await supabase
      .from("destacados")
      .insert({
        facilitador_id: body.facilitador_id,
        tipo: body.tipo || "sitio",
        activo: body.activo !== false,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Error interno" }, { status: 500 });
  }
}
