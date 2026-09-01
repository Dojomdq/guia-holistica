import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const { tipo, referencia_id } = await request.json();

  if (!tipo || !referencia_id) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const tiposValidos = [
    "actividad",
    "facilitador",
    "whatsapp",
    "instagram",
    "telefono",
    "sitio_web",
    "como_llegar",
    "busqueda",
    "busqueda_sin_resultado",
  ];

  if (!tiposValidos.includes(tipo)) {
    return NextResponse.json({ error: "Invalid tipo" }, { status: 400 });
  }

  const supabase = getAdminClient();
  const { error } = await supabase.from("clicks").insert({ tipo, referencia_id });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
