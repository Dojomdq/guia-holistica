import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("actividades")
    .select("*, categorias(nombre)")
    .order("nombre");

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.nombre) {
      return NextResponse.json({ success: false, error: "nombre es requerido" }, { status: 400 });
    }
    const supabase = getAdminClient();

    const slug = body.slug
      || body.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    const { data, error } = await supabase
      .from("actividades")
      .insert({
        nombre: body.nombre,
        slug,
        descripcion: body.descripcion || null,
        categoria_id: body.categoria_id || null,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Error interno" }, { status: 500 });
  }
}
