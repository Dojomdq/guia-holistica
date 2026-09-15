import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { readJsonBody } from "@/lib/body";
import { verifyJWT } from "@/lib/jwt";

const JWT_SECRET = process.env.JWT_SECRET || "";

export async function GET() {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("config")
    .select("valor")
    .eq("clave", "popup_eventos")
    .maybeSingle();

  if (error) return NextResponse.json({ habilitado: false });
  const habilitado = data?.valor?.habilitado === true;
  return NextResponse.json({ habilitado });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("admin_auth")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const payload = await verifyJWT(token, JWT_SECRET);
  if (!payload) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const read = await readJsonBody(req);
  if (!read.ok) return NextResponse.json({ error: read.error }, { status: read.status });

  const { habilitado } = read.body as any;
  if (typeof habilitado !== "boolean") {
    return NextResponse.json({ error: "El campo habilitado debe ser boolean" }, { status: 400 });
  }

  const supabase = getAdminClient();
  const { error } = await supabase
    .from("config")
    .upsert(
      {
        clave: "popup_eventos",
        valor: { habilitado },
        updated_at: new Date().toISOString(),
      },
      { onConflict: "clave" }
    );

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, habilitado });
}