"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface FacilitadorAdmin {
  id: string;
  nombre: string;
  email: string;
  ciudad: string;
  direccion: string | null;
  activo: boolean;
  actividades: string[];
}

export default function FacilitadoresAdmin() {
  const [busqueda, setBusqueda] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [facilitadores, setFacilitadores] = useState<FacilitadorAdmin[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("facilitadores")
        .select("id, nombre, email, ciudad, direccion, activo, facilitador_actividades(actividades(nombre))")
        .order("nombre");

      if (data) {
        setFacilitadores(
          data.map((f: any) => ({
            id: f.id,
            nombre: f.nombre,
            email: f.email,
            ciudad: f.ciudad,
            direccion: f.direccion,
            activo: f.activo,
            actividades: (f.facilitador_actividades || []).map((a: any) => a.actividades?.nombre).filter(Boolean),
          }))
        );
      }
      setCargando(false);
    }
    load();
  }, []);

  const filtered = facilitadores.filter(
    (f) =>
      f.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      f.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-stone-800">Facilitadores</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-xl hover:bg-primary-700 transition-colors text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          Nuevo Facilitador
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 mb-6">
          <h2 className="font-bold text-stone-800 mb-4">Nuevo Facilitador</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Nombre *</label>
              <input type="text" className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Nombre completo" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Email *</label>
              <input type="email" className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="email@ejemplo.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Teléfono</label>
              <input type="tel" className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="+54 11 5555-0000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">WhatsApp</label>
              <input type="tel" className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="+541155550000" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1">Dirección *</label>
              <input type="text" className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Av. Corrientes 1234, CABA" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1">Bio</label>
              <textarea rows={3} className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Breve descripción del facilitador..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Instagram</label>
              <input type="text" className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="@usuario" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Sitio Web</label>
              <input type="url" className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="https://..." />
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
          placeholder="Buscar facilitador..."
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
                <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase hidden md:table-cell">Email</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase hidden lg:table-cell">Dirección</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase">Estado</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-stone-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((f) => (
                <tr key={f.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-stone-800 text-sm">{f.nombre}</p>
                    <div className="flex gap-1 mt-1">
                      {f.actividades.map((a) => (
                        <span key={a} className="px-2 py-0.5 bg-primary-50 text-primary-700 text-xs rounded-full">{a}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-stone-500 hidden md:table-cell">{f.email}</td>
                  <td className="px-6 py-4 text-sm text-stone-500 hidden lg:table-cell">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {f.direccion || "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${f.activo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {f.activo ? "Activo" : "Inactivo"}
                    </span>
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
