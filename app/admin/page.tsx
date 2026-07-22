"use client";

import { useState, useEffect } from "react";
import { Users, Activity, Tag, ExternalLink, Database } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

export default function AdminDashboard() {
  const [stats, setStats] = useState([
    { label: "Facilitadores", value: "—", icon: Users, href: "/admin/facilitadores" },
    { label: "Actividades", value: "—", icon: Activity, href: "/admin/actividades" },
    { label: "Categorías", value: "—", icon: Tag, href: "/admin/categorias" },
  ]);

  useEffect(() => {
    async function load() {
      const [f, a, c] = await Promise.all([
        supabase.from("facilitadores").select("id", { count: "exact", head: true }),
        supabase.from("actividades").select("id", { count: "exact", head: true }),
        supabase.from("categorias").select("id", { count: "exact", head: true }),
      ]);

      setStats([
        { label: "Facilitadores", value: String(f.count || 0), icon: Users, href: "/admin/facilitadores" },
        { label: "Actividades", value: String(a.count || 0), icon: Activity, href: "/admin/actividades" },
        { label: "Categorías", value: String(c.count || 0), icon: Tag, href: "/admin/categorias" },
      ]);
    }
    load();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:border-gray-400 hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="bg-gray-900 h-12 w-12 rounded-xl flex items-center justify-center text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
        <h2 className="font-bold text-gray-900 mb-4">Estado del proyecto</h2>
        <div className="space-y-3 text-sm text-gray-600">
          <p>✅ Base de datos conectada y funcionando</p>
          <p>✅ Frontend conectado con Supabase (client-side)</p>
          <p>✅ Autenticación para el admin (Basic Auth)</p>
          <p>✅ CRUD de facilitadores, actividades y categorías</p>
          <p>✅ Actividades dinámicas desde la DB</p>
          <p>✅ Filtro por categoría en facilitadores</p>
          <p>✅ Deploy en Vercel</p>
          <p className="pl-1">⬜ Vincular dominio agenciakoi.com</p>
          <p className="pl-1">⬜ Completar datos de facilitadores (direcciones, coords, bios)</p>
        </div>
      </div>

      <a href="/" target="_blank" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 font-medium">
        <ExternalLink className="h-4 w-4" /> Ver sitio público
      </a>
    </div>
  );
}
