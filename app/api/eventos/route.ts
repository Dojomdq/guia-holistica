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
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "JSON inválido" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ success: false, error: "Body inválido" }, { status: 400 });
  }

  if (!body.titulo || typeof body.titulo !== "string" || !body.titulo.trim()) {
    return NextResponse.json({ success: false, error: "El campo titulo es obligatorio" }, { status: 400 });
  }

  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("eventos")
    .insert({
      titulo: body.titulo.trim(),
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

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  return NextResponse.json({ success: true, data }, { status: 201 });
}