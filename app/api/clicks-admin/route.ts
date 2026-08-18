import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";

export async function DELETE(req: NextRequest) {
  try {
    const supabase = getAdminClient();
    const { searchParams } = new URL(req.url);
    const desde = searchParams.get("desde");
    const hasta = searchParams.get("hasta");

    let countQuery = supabase.from("clicks").select("id", { count: "exact", head: true });
    if (desde) countQuery = countQuery.gte("created_at", desde);
    if (hasta) countQuery = countQuery.lte("created_at", `${hasta}T23:59:59`);
    const { count, error: countErr } = await countQuery;
    if (countErr) return NextResponse.json({ success: false, error: countErr.message }, { status: 500 });

    let delQuery = supabase.from("clicks").delete();
    if (desde) delQuery = delQuery.gte("created_at", desde);
    if (hasta) delQuery = delQuery.lte("created_at", `${hasta}T23:59:59`);
    const { error: delErr } = await delQuery;
    if (delErr) return NextResponse.json({ success: false, error: delErr.message }, { status: 500 });

    return NextResponse.json({ success: true, deleted: count ?? 0 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Error interno" }, { status: 500 });
  }
}
