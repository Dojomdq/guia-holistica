import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { readJsonBody } from "@/lib/body";

export async function GET() {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("categorias")
    .select("*")
    .order("nombre");

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const read = await readJsonBody(req);
  if (!read.ok) {
    return NextResponse.json({ success: false, error: read.error }, { status: read.status });
  }
  const body = read.body;

  const nombre = body.nombre;
  if (typeof nombre !== "string" || !nombre.trim()) {
    return NextResponse.json({ success: false, error: "nombre es requerido" }, { status: 400 });
  }

  const supabase = getAdminClient();
  const slug = typeof body.slug === "string" && body.slug
    ? body.slug
    : nombre.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const { data, error } = await supabase
    .from("categorias")
    .insert({ nombre: nombre.trim(), slug, icono: typeof body.icono === "string" ? body.icono : null })
    .select()
    .single();

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data }, { status: 201 });
}
