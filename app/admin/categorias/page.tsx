"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface CategoriaAdmin {
  id: string;
  nombre: string;
  slug: string;
  icono: string | null;
}

const EMPTY_FORM = { nombre: "", slug: "", icono: "" };

function makeSlug(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default function CategoriasAdmin() {
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState<string | null>(null);
  const [categorias, setCategorias] = useState<CategoriaAdmin[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    const { data, error: err } = await supabase
      .from("categorias")
      .select("*")
      .order("nombre");

    if (err) {
      setError("Error cargando categorías: " + err.message);
    } else {
      setCategorias(data || []);
    }
    setCargando(false);
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setForm(EMPTY_FORM);
    setEditando(null);
    setShowForm(true);
  }

  function openEdit(c: CategoriaAdmin) {
    setForm({ nombre: c.nombre, slug: c.slug, icono: c.icono || "" });
    setEditando(c.id);
    setShowForm(true);
  }

  async function handleSave() {
    setGuardando(true);
    setError(null);
    const slug = form.slug || makeSlug(form.nombre);
    const payload = {
      nombre: form.nombre,
      slug,
      icono: form.icono || null,
    };

    if (editando) {
      const { error: updErr } = await supabase
        .from("categorias")
        .update(payload)
        .eq("id", editando);

      if (updErr) {
        setError("Error al guardar: " + updErr.message);
        setGuardando(false);
        return;
      }
    } else {
      const { error: insErr } = await supabase
        .from("categorias")
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
    if (!confirm(`¿Eliminar la categoría "${nombre}"? Se eliminarán también sus actividades asociadas.`)) return;
    const { error } = await supabase.from("categorias").delete().eq("id", id);
    if (!error) await load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-serif font-semibold text-warmblack">Categorías</h1>
        <button onClick={openNew} className="inline-flex items-center gap-2 bg-warmblack text-white px-4 py-2.5 rounded-xl hover:bg-warmblack/85 transition-all duration-300 text-sm font-medium hover:-translate-y-0.5">
          <Plus className="h-4 w-4" /> Nueva Categoría
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
            <h2 className="font-serif font-semibold text-warmblack">{editando ? "Editar Categoría" : "Nueva Categoría"}</h2>
            <button onClick={() => { setShowForm(false); setEditando(null); }} className="text-warmblack/30 hover:text-warmblack/60 transition-colors"><X className="h-5 w-5" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-warmblack/70 mb-1">Nombre *</label>
              <input type="text" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-warmblack placeholder:text-warmblack/25 focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all" placeholder="Nombre de la categoría" />
            </div>
            <div>
              <label className="block text-sm font-medium text-warmblack/70 mb-1">Slug</label>
              <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-warmblack placeholder:text-warmblack/25 focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all" placeholder="auto-generado si se deja vacío" />
            </div>
            <div>
              <label className="block text-sm font-medium text-warmblack/70 mb-1">Icono (emoji)</label>
              <input type="text" value={form.icono} onChange={(e) => setForm({ ...form, icono: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-warmblack placeholder:text-warmblack/25 focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all" placeholder="🌿" maxLength={4} />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={handleSave} disabled={guardando || !form.nombre}
              className="bg-warmblack text-white px-6 py-2.5 rounded-xl hover:bg-warmblack/85 transition-all duration-300 text-sm font-medium disabled:opacity-50 hover:-translate-y-0.5">
              {guardando ? "Guardando..." : "Guardar"}
            </button>
            <button onClick={() => { setShowForm(false); setEditando(null); }} className="bg-cream-200 text-warmblack/60 px-6 py-2.5 rounded-xl hover:bg-cream-300 transition-all duration-300 text-sm font-medium">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {cargando ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-soft border border-cream-300/60 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-cream-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-cream-200 rounded w-2/3" />
                  <div className="h-2 bg-cream-200 rounded w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categorias.map((cat) => (
            <div key={cat.id} className="bg-white rounded-2xl p-5 shadow-soft border border-cream-300/60 flex items-center justify-between hover:shadow-medium hover:-translate-y-0.5 transition-all duration-300">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{cat.icono || "🌿"}</span>
                <div>
                  <h3 className="font-semibold text-warmblack text-sm">{cat.nombre}</h3>
                  <p className="text-xs text-warmblack/35">{cat.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(cat)} className="p-1.5 text-warmblack/30 hover:text-warmblack/60 hover:bg-cream-200 rounded-lg transition-colors"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => handleDelete(cat.id, cat.nombre)} className="p-1.5 text-warmblack/30 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
