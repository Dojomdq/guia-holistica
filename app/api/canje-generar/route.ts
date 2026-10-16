import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { readJsonBody } from "@/lib/body";
import { generarCodigoCanje } from "@/lib/canje";

const LIMITE_POR_IP = 3;
const DIAS_VALIDEZ = 30;
const ventanaIp = new Map<string, number[]>();

function limpiarVentanas() {
  const now = Date.now();
  const dia = 24 * 60 * 60 * 1000;
  ventanaIp.forEach((times, ip) => {
    const vigentes = times.filter((t) => now - t < dia);
    if (vigentes.length === 0) ventanaIp.delete(ip);
    else ventanaIp.set(ip, vigentes);
  });
}

export async function POST(req: NextRequest) {
  const read = await readJsonBody(req);
  if (!read.ok) return NextResponse.json({ error: read.error }, { status: read.status });

  const { facilitador_id } = read.body as any;
  if (typeof facilitador_id !== "string" || !facilitador_id) {
    return NextResponse.json({ error: "Falta el facilitador_id" }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  limpiarVentanas();
  const hoy = new Date().toDateString();
  const hits = (ventanaIp.get(ip) || []).filter((t) => new Date(t).toDateString() === hoy);
  if (hits.length >= LIMITE_POR_IP) {
    return NextResponse.json({ error: "Ya generaste varios códigos hoy. Andá a la clase y mostrá el último." }, { status: 429 });
  }

  const supabase = getAdminClient();

  const { data: fac, error: facErr } = await supabase
    .from("facilitadores")
    .select("id, nombre, beneficio_canje")
    .eq("id", facilitador_id)
    .eq("activo", true)
    .maybeSingle();

  if (facErr || !fac) {
    return NextResponse.json({ error: "Profesional no encontrado" }, { status: 404 });
  }

  const beneficio = fac.beneficio_canje || "Primera clase gratis";
  const vence = new Date(Date.now() + DIAS_VALIDEZ * 24 * 60 * 60 * 1000).toISOString();

  let codigo = "";
  for (let intento = 0; intento < 5; intento++) {
    codigo = generarCodigoCanje();
    const { data: existente } = await supabase
      .from("codigos_canje")
      .select("id")
      .eq("codigo", codigo)
      .maybeSingle();
    if (!existente) break;
  }

  const { data, error } = await supabase
    .from("codigos_canje")
    .insert({ facilitador_id, codigo, beneficio, estado: "activo", vence })
    .select("codigo, beneficio, vence")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  ventanaIp.set(ip, [...(ventanaIp.get(ip) || []), Date.now()]);

  return NextResponse.json({ success: true, data }, { status: 201 });
}