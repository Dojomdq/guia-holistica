import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("actividades")
    .select("*, categorias(nombre)")
    .eq("id", params.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const supabase = getAdminClient();

  const updates: Record<string, any> = {};
  if (body.nombre !== undefined) updates.nombre = body.nombre;
  if (body.slug !== undefined) updates.slug = body.slug;
  if (body.descripcion !== undefined) updates.descripcion = body.descripcion;
  if (body.categoria_id !== undefined) updates.categoria_id = body.categoria_id;

  const { data, error } = await supabase
    .from("actividades")
    .update(updates)
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = getAdminClient();
  const { error } = await supabase.from("actividades").delete().eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
