"use client";

import { useState, useEffect } from "react";
import { Users, Activity, Tag } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function AdminDashboard() {
  const [stats, setStats] = useState([
    { label: "Facilitadores", value: "—", icon: Users, color: "bg-primary-500" },
    { label: "Actividades", value: "—", icon: Activity, color: "bg-sky-500" },
    { label: "Categorías", value: "—", icon: Tag, color: "bg-violet-500" },
  ]);

  useEffect(() => {
    async function load() {
      const [f, a, c] = await Promise.all([
        supabase.from("facilitadores").select("id", { count: "exact", head: true }),
        supabase.from("actividades").select("id", { count: "exact", head: true }),
        supabase.from("categorias").select("id", { count: "exact", head: true }),
      ]);

      setStats([
        { label: "Facilitadores", value: String(f.count || 0), icon: Users, color: "bg-primary-500" },
        { label: "Actividades", value: String(a.count || 0), icon: Activity, color: "bg-sky-500" },
        { label: "Categorías", value: String(c.count || 0), icon: Tag, color: "bg-violet-500" },
      ]);
    }
    load();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-800 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
              <div className="flex items-center gap-4">
                <div className={`${stat.color} h-12 w-12 rounded-xl flex items-center justify-center text-white`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-stone-800">{stat.value}</p>
                  <p className="text-sm text-stone-500">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
        <h2 className="font-bold text-stone-800 mb-4">Próximos pasos</h2>
        <div className="space-y-3 text-sm text-stone-600">
          <p>✅ Base de datos conectada y funcionando</p>
          <p>✅ Frontend conectado con Supabase</p>
          <p>⬜ Agregar autenticación para el admin</p>
          <p>⬜ Formularios de creación/edición funcionales</p>
          <p>⬜ Deploy en Vercel</p>
        </div>
      </div>
    </div>
  );
}
