import { supabaseAdmin } from "@/lib/supabase/server";
import StatsBar from "@/components/StatsBar";

export default async function StatsSection() {
  const [facilitadores, actividades, ciudades] = await Promise.all([
    supabaseAdmin.from("facilitadores").select("id", { count: "exact", head: true }).eq("activo", true),
    supabaseAdmin.from("actividades").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("facilitadores").select("ciudad").eq("activo", true),
  ]);

  const ciudadesUnicas = new Set(
    (ciudades.data || []).map((f) => f.ciudad).filter(Boolean)
  ).size;

  return (
    <section className="py-16 sm:py-20 relative overflow-hidden">
      <div className="absolute inset-0 section-radial-sage pointer-events-none" />
      <div className="container-page relative z-10">
        <StatsBar
          stats={[
            { label: "Facilitadores", value: facilitadores.count || 0, suffix: "+" },
            { label: "Actividades", value: actividades.count || 0 },
            { label: "Ciudades", value: ciudadesUnicas },
            { label: "Años", value: 3, suffix: "+" },
          ]}
        />
      </div>
    </section>
  );
}
