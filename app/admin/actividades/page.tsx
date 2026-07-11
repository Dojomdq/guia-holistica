"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface ActividadAdmin {
  id: string;
  nombre: string;
  slug: string;
  categoria: string;
  descripcion: string | null;
}

export default function ActividadesAdmin() {
  const [busqueda, setBusqueda] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [actividades, setActividades] = useState<ActividadAdmin[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("actividades")
        .select("id, nombre, slug, descripcion, categorias(nombre)")
        .order("nombre");

      if (data) {
        setActividades(
          data.map((a: any) => ({
            id: a.id,
            nombre: a.nombre,
            slug: a.slug,
            categoria: a.categorias?.nombre || "Sin categoría",
            descripcion: a.descripcion,
          }))
        );
      }
      setCargando(false);
    }
    load();
  }, []);

  const filtered = actividades.filter(
    (a) =>
      a.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      a.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-stone-800">Actividades</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-xl hover:bg-primary-700 transition-colors text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          Nueva Actividad
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 mb-6">
          <h2 className="font-bold text-stone-800 mb-4">Nueva Actividad</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Nombre *</label>
              <input type="text" className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Nombre de la actividad" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Categoría *</label>
              <select className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">Seleccionar categoría</option>
                <option value="chamanismo">🪶 Chamanismo</option>
                <option value="yoga">🧘 Yoga</option>
                <option value="reiki">✋ Reiki</option>
                <option value="meditacion">🕯️ Meditación</option>
                <option value="tarot">🔮 Tarot</option>
                <option value="astrologia">⭐ Astrología</option>
                <option value="sanacion-energetica">💫 Sanación Energética</option>
                <option value="flores-de-bach">🌸 Flores de Bach</option>
                <option value="terapias-holisticas">🌿 Terapias Holísticas</option>
                <option value="masajes-terapeuticos">💆 Masajes</option>
                <option value="circulos-de-mujeres">🌙 Círculos de Mujeres</option>
                <option value="cacao-ceremonia">🍫 Cacao Ceremonia</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1">Descripción</label>
              <textarea rows={3} className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Descripción de la actividad..." />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button className="bg-primary-600 text-white px-6 py-2 rounded-xl hover:bg-primary-700 transition-colors text-sm font-medium">Guardar</button>
            <button onClick={() => setShowForm(false)} className="bg-stone-100 text-stone-600 px-6 py-2 rounded-xl hover:bg-stone-200 transition-colors text-sm font-medium">Cancelar</button>
          </div>
        </div>
      )}

      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar actividad..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        {cargando ? (
          <div className="p-8 text-center text-stone-400">Cargando...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-stone-50 border-b border-stone-100">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase">Nombre</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase hidden md:table-cell">Categoría</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase hidden lg:table-cell">Descripción</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-stone-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-stone-800 text-sm">{a.nombre}</p>
                    <p className="text-xs text-stone-400 mt-0.5">{a.slug}</p>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="px-2.5 py-0.5 bg-primary-50 text-primary-700 text-xs rounded-full font-medium">{a.categoria}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-stone-500 hidden lg:table-cell">
                    <span className="line-clamp-1">{a.descripcion || "—"}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-stone-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
