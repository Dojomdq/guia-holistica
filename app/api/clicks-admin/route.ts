import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";

function applyFilters(q: any, desde: string | null, hasta: string | null) {
  if (desde) {
    q = q.gte("created_at", desde);
  } else {
    q = q.gte("created_at", "2000-01-01");
  }
  if (hasta) {
    q = q.lte("created_at", `${hasta}T23:59:59`);
  }
  return q;
}

export async function GET(req: NextRequest) {
  const supabase = getAdminClient();
  const { searchParams } = new URL(req.url);
  const desde = searchParams.get("desde");
  const hasta = searchParams.get("hasta");

  let q = supabase.from("clicks").select("tipo, referencia_id, created_at").order("created_at", { ascending: false });
  q = applyFilters(q as any, desde, hasta);
  const { data, error } = await q;
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = getAdminClient();
    const { searchParams } = new URL(req.url);
    const desde = searchParams.get("desde");
    const hasta = searchParams.get("hasta");
    const confirmar = searchParams.get("confirmar");

    if (!desde && !hasta && confirmar !== "1") {
      return NextResponse.json(
        { success: false, error: "Se requiere un rango de fechas (desde/hasta) o confirmar=1 para borrar" },
        { status: 400 }
      );
    }

    let countQ = applyFilters(supabase.from("clicks").select("id", { count: "exact", head: true }), desde, hasta);
    const { count, error: countErr } = await countQ;
    if (countErr) return NextResponse.json({ success: false, error: countErr.message }, { status: 500 });

    let delQ = applyFilters(supabase.from("clicks").delete(), desde, hasta);
    const { error: delErr } = await delQ;
    if (delErr) return NextResponse.json({ success: false, error: delErr.message }, { status: 500 });

    return NextResponse.json({ success: true, deleted: count ?? 0 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Error interno" }, { status: 500 });
  }
}
