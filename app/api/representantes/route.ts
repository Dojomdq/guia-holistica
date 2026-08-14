import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("representantes")
    .select("*")
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

    const { data, error } = await supabase
      .from("representantes")
      .insert({
        nombre: body.nombre,
        contacto: body.contacto || null,
        ciudades: body.ciudades || null,
        comision_porcentaje: body.comision_porcentaje ?? 50,
        activo: body.activo !== false,
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
