"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Calendar } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface Evento {
  id: string;
  titulo: string;
  descripcion: string | null;
  fecha: string | null;
  imagen_url: string | null;
  link: string | null;
  activo: boolean;
}

const EMPTY = { titulo: "", descripcion: "", fecha: "", imagen_url: "", link: "", activo: true };

export default function AdminEventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [form, setForm] = useState(EMPTY);
  const [editando, setEditando] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  async function load() {
    const { data } = await supabase.from("eventos").select("*").order("created_at", { ascending: false });
    if (data) setEventos(data);
  }

  useEffect(() => { load(); }, []);

  async function handleSave() {
    setGuardando(true);
    setError("");
    if (!form.titulo.trim()) { setError("El título es obligatorio"); setGuardando(false); return; }

    if (editando) {
      const { error: e } = await supabase.from("eventos").update(form).eq("id", editando);
      if (e) { setError(e.message); setGuardando(false); return; }
    } else {
      const { error: e } = await supabase.from("eventos").insert(form);
      if (e) { setError(e.message); setGuardando(false); return; }
    }

    setShowForm(false); setEditando(null); setForm(EMPTY);
    await load(); setGuardando(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este evento?")) return;
    await supabase.from("eventos").delete().eq("id", id);
    await load();
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-serif font-medium text-bark">Eventos</h2>
        <button onClick={() => { setForm(EMPTY); setEditando(null); setShowForm(true); }} className="btn-sage text-sm">
          <Plus className="h-4 w-4" /> Nuevo evento
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-cream-200 p-6 mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-bark">{editando ? "Editar" : "Nuevo"} evento</h3>
            <button onClick={() => setShowForm(false)} className="text-bark-400 hover:text-bark-600">Cancelar</button>
          </div>
          <input value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} placeholder="Título *" className="input-field" />
          <textarea value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} placeholder="Descripción" className="input-field" rows={2} />
          <input value={form.fecha} onChange={e => setForm({ ...form, fecha: e.target.value })} placeholder="Fecha (ej: 15 de agosto 18hs)" className="input-field" />
          <input value={form.imagen_url} onChange={e => setForm({ ...form, imagen_url: e.target.value })} placeholder="URL de la imagen (Cloudinary)" className="input-field" />
          <input value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} placeholder="Link (WhatsApp, Instagram...)" className="input-field" />
          <label className="flex items-center gap-2 text-sm text-bark-600">
            <input type="checkbox" checked={form.activo} onChange={e => setForm({ ...form, activo: e.target.checked })} /> Activo
          </label>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button onClick={handleSave} disabled={guardando} className="btn-sage w-full">
            {guardando ? "Guardando..." : (editando ? "Actualizar" : "Crear evento")}
          </button>
        </div>
      )}

      <div className="space-y-3">
        {eventos.length === 0 && <p className="text-bark-500 text-center py-8">No hay eventos aún.</p>}
        {eventos.map((e) => (
          <div key={e.id} className="bg-white rounded-xl border border-cream-200 p-4 flex items-start gap-4">
            {e.imagen_url && <img src={e.imagen_url} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-bark">{e.titulo}</h3>
              {e.fecha && <p className="text-xs text-bark-500 mt-0.5 flex items-center gap-1"><Calendar className="h-3 w-3" />{e.fecha}</p>}
              {e.descripcion && <p className="text-sm text-bark-600 mt-1 line-clamp-2">{e.descripcion}</p>}
              <span className={`text-[10px] px-1.5 py-0.5 rounded mt-1.5 inline-block ${e.activo ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>{e.activo ? "Activo" : "Inactivo"}</span>
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => { setForm({ titulo: e.titulo, descripcion: e.descripcion || "", fecha: e.fecha || "", imagen_url: e.imagen_url || "", link: e.link || "", activo: e.activo }); setEditando(e.id); setShowForm(true); }} className="p-1.5 rounded-lg hover:bg-cream-100 transition"><Pencil className="h-4 w-4 text-bark-500" /></button>
              <button onClick={() => handleDelete(e.id)} className="p-1.5 rounded-lg hover:bg-red-50 transition"><Trash2 className="h-4 w-4 text-red-500" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
