"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface CategoriaAdmin {
  id: string;
  nombre: string;
  slug: string;
  icono: string | null;
}

export default function CategoriasAdmin() {
  const [showForm, setShowForm] = useState(false);
  const [categorias, setCategorias] = useState<CategoriaAdmin[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("categorias")
        .select("id, nombre, slug, icono")
        .order("nombre");

      if (data) setCategorias(data);
      setCargando(false);
    }
    load();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-stone-800">Categorías</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-xl hover:bg-primary-700 transition-colors text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          Nueva Categoría
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 mb-6">
          <h2 className="font-bold text-stone-800 mb-4">Nueva Categoría</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Nombre *</label>
              <input type="text" className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Nombre de la categoría" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Slug *</label>
              <input type="text" className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="mi-categoria" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Icono (emoji)</label>
              <input type="text" className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="🌿" maxLength={4} />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button className="bg-primary-600 text-white px-6 py-2 rounded-xl hover:bg-primary-700 transition-colors text-sm font-medium">Guardar</button>
            <button onClick={() => setShowForm(false)} className="bg-stone-100 text-stone-600 px-6 py-2 rounded-xl hover:bg-stone-200 transition-colors text-sm font-medium">Cancelar</button>
          </div>
        </div>
      )}

      {cargando ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-stone-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-stone-100 rounded w-2/3" />
                  <div className="h-2 bg-stone-100 rounded w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categorias.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{cat.icono || "🌿"}</span>
                <div>
                  <h3 className="font-semibold text-stone-800 text-sm">{cat.nombre}</h3>
                  <p className="text-xs text-stone-400">{cat.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1.5 text-stone-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                  <Pencil className="h-4 w-4" />
                </button>
                <button className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
