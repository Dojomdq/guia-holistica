import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  const { tipo, referencia_id } = await request.json();

  if (!tipo || !referencia_id) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (tipo !== "actividad" && tipo !== "facilitador") {
    return NextResponse.json({ error: "Invalid tipo" }, { status: 400 });
  }

  const { error } = await supabase.from("clicks").insert({ tipo, referencia_id });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
