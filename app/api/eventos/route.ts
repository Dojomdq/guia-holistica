import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("eventos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = getAdminClient();

    const { data, error } = await supabase
      .from("eventos")
      .insert({
        titulo: body.titulo,
        descripcion: body.descripcion ?? null,
        fecha: body.fecha ?? null,
        imagen_url: body.imagen_url ?? null,
        link: body.link ?? null,
        activo: body.activo ?? true,
        ciudad: body.ciudad ?? null,
        latitud: body.latitud ?? null,
        longitud: body.longitud ?? null,
        solidario: body.solidario ?? false,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Error interno" }, { status: 500 });
  }
}