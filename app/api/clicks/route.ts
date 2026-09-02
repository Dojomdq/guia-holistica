import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";

const MAX_BODY_BYTES = 2 * 1024; // 2KB es muy holgado para { tipo, referencia_id }

const TIPOS_VALIDOS = [
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

export async function POST(request: NextRequest) {
  let body: any;

  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json({ error: "Content-Type debe ser application/json" }, { status: 400 });
    }

    const text = await request.text(); // leemos como texto para poder validar tamaño
    if (text.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Payload demasiado grande" }, { status: 413 });
    }

    body = JSON.parse(text);
  } catch (err: any) {
    return NextResponse.json(
      { error: "JSON inválido o cuerpo malformado" },
      { status: 400 }
    );
  }

  const { tipo, referencia_id } = body || {};

  if (typeof tipo !== "string" || typeof referencia_id !== "string") {
    return NextResponse.json(
      { error: "tipo y referencia_id son requeridos" },
      { status: 400 }
    );
  }

  if (!TIPOS_VALIDOS.includes(tipo)) {
    return NextResponse.json({ error: "Invalid tipo" }, { status: 400 });
  }

  const supabase = getAdminClient();
  const { error } = await supabase.from("clicks").insert({ tipo, referencia_id });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
