import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/lib/password";
import { readJsonBody } from "@/lib/body";
import { getAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const read = await readJsonBody(req);
  if (!read.ok) {
    return NextResponse.json({ error: read.error }, { status: read.status });
  }

  const { actual, nueva } = read.body as any;
  if (typeof actual !== "string" || !actual || typeof nueva !== "string" || !nueva) {
    return NextResponse.json({ error: "Se requieren 'actual' y 'nueva'" }, { status: 400 });
  }
  if (nueva.length < 8) {
    return NextResponse.json({ error: "La nueva contraseña debe tener al menos 8 caracteres" }, { status: 400 });
  }

  const supabase = getAdminClient();

  // Validar que la contraseña "actual" sea correcta (contra BD dinámica o env)
  let stored: { id: unknown; password_hash: string } | null = null;
  const { data: existing, error: storedErr } = await supabase
    .from("admin_credentials")
    .select("id, password_hash")
    .limit(1)
    .maybeSingle();
  if (!storedErr && existing) stored = existing as any;

  const ADMIN_PASS = process.env.ADMIN_PASS || "guia2026";
  let actualOk = false;
  if (stored?.password_hash) {
    const { verifyPassword } = await import("@/lib/password");
    actualOk = await verifyPassword(actual, stored.password_hash as string);
  } else {
    actualOk = actual === ADMIN_PASS;
  }

  if (!actualOk) {
    return NextResponse.json({ error: "Contraseña actual incorrecta" }, { status: 401 });
  }

  const newHash = await hashPassword(nueva);

  if (stored) {
    const { error } = await supabase
      .from("admin_credentials")
      .update({ password_hash: newHash, updated_at: new Date().toISOString() })
      .eq("id", stored.id);
    if (error) return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  } else {
    const { error } = await supabase
      .from("admin_credentials")
      .insert({ password_hash: newHash });
    if (error) return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
