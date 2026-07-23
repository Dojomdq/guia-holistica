"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, X } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface ActividadAdmin {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  categoria_id: string | null;
  categoria_nombre: string;
}

interface CategoriaOption {
  id: string;
  nombre: string;
}

const EMPTY_FORM = { nombre: "", slug: "", descripcion: "", categoria_id: "" };

function makeSlug(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default function ActividadesAdmin() {
  const [busqueda, setBusqueda] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState<string | null>(null);
  const [actividades, setActividades] = useState<ActividadAdmin[]>([]);
  const [categorias, setCategorias] = useState<CategoriaOption[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    const [aRes, cRes] = await Promise.all([
      supabase
        .from("actividades")
        .select("*, categorias(nombre)")
        .order("nombre"),
      supabase
        .from("categorias")
        .select("id, nombre")
        .order("nombre"),
    ]);

    if (aRes.error) {
      setError("Error cargando actividades: " + aRes.error.message);
    } else {
      setActividades(
        (aRes.data || []).map((a: any) => ({
          id: a.id, nombre: a.nombre, slug: a.slug,
          descripcion: a.descripcion, categoria_id: a.categoria_id,
          categoria_nombre: a.categorias?.nombre || "Sin categoría",
        }))
      );
    }

    if (cRes.data) {
      setCategorias((cRes.data || []).map((c: any) => ({ id: c.id, nombre: c.nombre })));
    }

    setCargando(false);
  }

  useEffect(() => { load(); }, []);

  const filtered = actividades.filter(
    (a) =>
      a.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      a.categoria_nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  function openNew() {
    setForm(EMPTY_FORM);
    setEditando(null);
    setShowForm(true);
  }

  function openEdit(a: ActividadAdmin) {
    setForm({
      nombre: a.nombre, slug: a.slug,
      descripcion: a.descripcion || "",
      categoria_id: a.categoria_id || "",
    });
    setEditando(a.id);
    setShowForm(true);
  }

  async function handleSave() {
    setGuardando(true);
    setError(null);
    const slug = form.slug || makeSlug(form.nombre);
    const payload = {
      nombre: form.nombre,
      slug,
      descripcion: form.descripcion || null,
      categoria_id: form.categoria_id || null,
    };

    if (editando) {
      const { error: updErr } = await supabase
        .from("actividades")
        .update(payload)
        .eq("id", editando);

      if (updErr) {
        setError("Error al guardar: " + updErr.message);
        setGuardando(false);
        return;
      }
    } else {
      const { error: insErr } = await supabase
        .from("actividades")
        .insert(payload);

      if (insErr) {
        setError("Error al crear: " + insErr.message);
        setGuardando(false);
        return;
      }
    }

    setShowForm(false);
    setEditando(null);
    setForm(EMPTY_FORM);
    await load();
    setGuardando(false);
  }

  async function handleDelete(id: string, nombre: string) {
    if (!confirm(`¿Eliminar la actividad "${nombre}"?`)) return;
    await supabase.from("facilitador_actividades").delete().eq("actividad_id", id);
    const { error } = await supabase.from("actividades").delete().eq("id", id);
    if (!error) await load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-serif font-semibold text-warmblack">Actividades</h1>
        <button onClick={openNew} className="inline-flex items-center gap-2 bg-warmblack text-white px-4 py-2.5 rounded-xl hover:bg-warmblack/85 transition-all duration-300 text-sm font-medium hover:-translate-y-0.5">
          <Plus className="h-4 w-4" /> Nueva Actividad
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
          {error}
          <button onClick={() => setError(null)} className="float-right font-bold">×</button>
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-cream-300/60 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif font-semibold text-warmblack">{editando ? "Editar Actividad" : "Nueva Actividad"}</h2>
            <button onClick={() => { setShowForm(false); setEditando(null); }} className="text-warmblack/30 hover:text-warmblack/60 transition-colors"><X className="h-5 w-5" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-warmblack/70 mb-1">Nombre *</label>
              <input type="text" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-warmblack placeholder:text-warmblack/25 focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all" placeholder="Nombre de la actividad" />
            </div>
            <div>
              <label className="block text-sm font-medium text-warmblack/70 mb-1">Categoría *</label>
              <select value={form.categoria_id} onChange={(e) => setForm({ ...form, categoria_id: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-warmblack focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all">
                <option value="">Seleccionar categoría</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-warmblack/70 mb-1">Descripción</label>
              <textarea rows={3} value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-warmblack placeholder:text-warmblack/25 focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all" placeholder="Descripción de la actividad..." />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={handleSave} disabled={guardando || !form.nombre || !form.categoria_id}
              className="bg-warmblack text-white px-6 py-2.5 rounded-xl hover:bg-warmblack/85 transition-all duration-300 text-sm font-medium disabled:opacity-50 hover:-translate-y-0.5">
              {guardando ? "Guardando..." : "Guardar"}
            </button>
            <button onClick={() => { setShowForm(false); setEditando(null); }} className="bg-cream-200 text-warmblack/60 px-6 py-2.5 rounded-xl hover:bg-cream-300 transition-all duration-300 text-sm font-medium">
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-warmblack/25" />
        <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar actividad..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/80 backdrop-blur-sm border border-cream-300 text-sm text-warmblack placeholder:text-warmblack/25 focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all" />
      </div>

      <div className="bg-white rounded-2xl shadow-soft border border-cream-300/60 overflow-hidden">
        {cargando ? (
          <div className="p-8 text-center text-warmblack/30">Cargando...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-cream-50 border-b border-cream-300/60">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-warmblack/40 uppercase tracking-wide">Nombre</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-warmblack/40 uppercase tracking-wide hidden md:table-cell">Categoría</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-warmblack/40 uppercase tracking-wide hidden lg:table-cell">Descripción</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-warmblack/40 uppercase tracking-wide">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-cream-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-warmblack text-sm">{a.nombre}</p>
                    <p className="text-xs text-warmblack/35 mt-0.5">{a.slug}</p>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="px-2.5 py-0.5 bg-cream-200 text-warmblack/60 text-xs rounded-full font-medium">{a.categoria_nombre}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-warmblack/50 hidden lg:table-cell">
                    <span className="line-clamp-1">{a.descripcion || "—"}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(a)} className="p-1.5 text-warmblack/30 hover:text-warmblack/60 hover:bg-cream-200 rounded-lg transition-colors"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(a.id, a.nombre)} className="p-1.5 text-warmblack/30 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-warmblack/30 text-sm">No se encontraron actividades</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
