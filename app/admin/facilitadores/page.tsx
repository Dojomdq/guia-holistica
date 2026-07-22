"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, MapPin, X, Crosshair, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface FacilitadorAdmin {
  id: string;
  nombre: string;
  email: string;
  telefono: string | null;
  whatsapp: string | null;
  bio: string | null;
  ciudad: string;
  latitud: number;
  longitud: number;
  direccion: string | null;
  instagram: string | null;
  sitio_web: string | null;
  activo: boolean;
  actividad_ids: string[];
}

interface ActividadOption {
  id: string;
  nombre: string;
}

const EMPTY_FORM = {
  nombre: "", email: "", telefono: "", whatsapp: "", bio: "",
  ciudad: "Mar del Plata", latitud: "-38.0055", longitud: "-57.5426",
  direccion: "", instagram: "", sitio_web: "", activo: true, actividad_ids: [] as string[],
};

export default function FacilitadoresAdmin() {
  const [busqueda, setBusqueda] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState<string | null>(null);
  const [facilitadores, setFacilitadores] = useState<FacilitadorAdmin[]>([]);
  const [actividades, setActividades] = useState<ActividadOption[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [buscandoDir, setBuscandoDir] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    const [fRes, aRes] = await Promise.all([
      supabase
        .from("facilitadores")
        .select("*, facilitador_actividades(actividades(id))")
        .order("nombre"),
      supabase
        .from("actividades")
        .select("id, nombre")
        .order("nombre"),
    ]);

    if (fRes.error) {
      setError("Error cargando facilitadores: " + fRes.error.message);
    } else {
      setFacilitadores(
        (fRes.data || []).map((f: any) => ({
          ...f,
          actividad_ids: (f.facilitador_actividades || []).map((fa: any) => fa.actividades?.id).filter(Boolean),
        }))
      );
    }

    if (aRes.data) {
      setActividades((aRes.data || []).map((a: any) => ({ id: a.id, nombre: a.nombre })));
    }

    setCargando(false);
  }

  useEffect(() => { load(); }, []);

  const filtered = facilitadores.filter(
    (f) =>
      f.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      f.email.toLowerCase().includes(busqueda.toLowerCase()) ||
      f.ciudad.toLowerCase().includes(busqueda.toLowerCase())
  );

  function openNew() {
    setForm(EMPTY_FORM);
    setEditando(null);
    setShowForm(true);
  }

  function openEdit(f: FacilitadorAdmin) {
    setForm({
      nombre: f.nombre, email: f.email, telefono: f.telefono || "",
      whatsapp: f.whatsapp || "", bio: f.bio || "", ciudad: f.ciudad,
      latitud: String(f.latitud), longitud: String(f.longitud),
      direccion: f.direccion || "", instagram: f.instagram || "",
      sitio_web: f.sitio_web || "", activo: f.activo,
      actividad_ids: f.actividad_ids,
    });
    setEditando(f.id);
    setShowForm(true);
  }

  function toggleActividad(id: string) {
    setForm((prev) => ({
      ...prev,
      actividad_ids: prev.actividad_ids.includes(id)
        ? prev.actividad_ids.filter((a) => a !== id)
        : [...prev.actividad_ids, id],
    }));
  }

  async function handleSave() {
    setGuardando(true);
    setError(null);
    const payload = {
      nombre: form.nombre,
      email: form.email,
      telefono: form.telefono || null,
      whatsapp: form.whatsapp || null,
      bio: form.bio || null,
      ciudad: form.ciudad || "Mar del Plata",
      latitud: parseFloat(form.latitud) || -38.0055,
      longitud: parseFloat(form.longitud) || -57.5426,
      direccion: form.direccion || null,
      instagram: form.instagram || null,
      sitio_web: form.sitio_web || null,
      activo: form.activo,
    };

    if (editando) {
      const { error: updErr } = await supabase
        .from("facilitadores")
        .update(payload)
        .eq("id", editando);

      if (updErr) {
        setError("Error al guardar: " + updErr.message);
        setGuardando(false);
        return;
      }

      await supabase.from("facilitador_actividades").delete().eq("facilitador_id", editando);
      if (form.actividad_ids.length) {
        await supabase.from("facilitador_actividades").insert(
          form.actividad_ids.map((aid) => ({ facilitador_id: editando, actividad_id: aid }))
        );
      }
    } else {
      const { data: newFac, error: insErr } = await supabase
        .from("facilitadores")
        .insert(payload)
        .select()
        .single();

      if (insErr) {
        setError("Error al crear: " + insErr.message);
        setGuardando(false);
        return;
      }

      if (form.actividad_ids.length && newFac) {
        await supabase.from("facilitador_actividades").insert(
          form.actividad_ids.map((aid) => ({ facilitador_id: newFac.id, actividad_id: aid }))
        );
      }
    }

    setShowForm(false);
    setEditando(null);
    setForm(EMPTY_FORM);
    await load();
    setGuardando(false);
  }

  async function handleDelete(id: string, nombre: string) {
    if (!confirm(`¿Eliminar a "${nombre}"?`)) return;
    await supabase.from("facilitador_actividades").delete().eq("facilitador_id", id);
    const { error } = await supabase.from("facilitadores").delete().eq("id", id);
    if (!error) await load();
  }

  async function buscarDireccion() {
    if (!form.direccion.trim()) return;
    setBuscandoDir(true);
    try {
      const query = encodeURIComponent(`${form.direccion}, ${form.ciudad}, Argentina`);
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`, {
        headers: { "Accept-Language": "es" },
      });
      const data = await res.json();
      if (data.length > 0) {
        setForm((prev) => ({
          ...prev,
          latitud: parseFloat(data[0].lat).toFixed(6),
          longitud: parseFloat(data[0].lon).toFixed(6),
        }));
        alert("Dirección ubicada correctamente");
      } else {
        alert("No se encontró la dirección. Probá de otra forma, ej: 'San Martín 3534, Mar del Plata'");
      }
    } catch {
      alert("Error al buscar la dirección");
    }
    setBuscandoDir(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Facilitadores</h1>
        <button onClick={openNew} className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
          <Plus className="h-4 w-4" /> Nuevo Facilitador
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
          <button onClick={() => setError(null)} className="float-right font-bold">×</button>
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">{editando ? "Editar Facilitador" : "Nuevo Facilitador"}</h2>
            <button onClick={() => { setShowForm(false); setEditando(null); }} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
              <input type="text" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" placeholder="Nombre completo" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" placeholder="email@ejemplo.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input type="tel" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" placeholder="+54 223 555-0000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
              <input type="tel" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" placeholder="+542235550000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
              <input type="text" value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" placeholder="Av. Libertador 1234, Mar del Plata" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
              <input type="text" value={form.ciudad} onChange={(e) => setForm({ ...form, ciudad: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
            </div>
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-1">
                <label className="text-sm font-medium text-gray-700">Ubicación en mapa</label>
                <button type="button" onClick={buscarDireccion} disabled={buscandoDir || !form.direccion.trim()}
                  className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-md transition-colors disabled:opacity-50">
                  <Crosshair className="h-3 w-3" />
                  {buscandoDir ? "Buscando..." : "Ubicar dirección"}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="text" value={form.latitud} onChange={(e) => setForm({ ...form, latitud: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" placeholder="Latitud" />
                <input type="text" value={form.longitud} onChange={(e) => setForm({ ...form, longitud: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" placeholder="Longitud" />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" placeholder="Breve descripción..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
              <input type="text" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" placeholder="@usuario" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sitio Web</label>
              <input type="url" value={form.sitio_web} onChange={(e) => setForm({ ...form, sitio_web: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" placeholder="https://..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Actividades</label>
              <div className="flex flex-wrap gap-2">
                {actividades.map((a) => (
                  <button key={a.id} type="button" onClick={() => toggleActividad(a.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      form.actividad_ids.includes(a.id) ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}>
                    {a.nombre}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-6">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" checked={form.activo} onChange={(e) => setForm({ ...form, activo: e.target.checked })} className="rounded" />
              Activo
            </label>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSave} disabled={guardando || !form.nombre || !form.email}
              className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium disabled:opacity-50">
              {guardando ? "Guardando..." : "Guardar"}
            </button>
            <button onClick={() => { setShowForm(false); setEditando(null); }} className="bg-gray-100 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar facilitador..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {cargando ? (
          <div className="p-8 text-center text-gray-400">Cargando...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Nombre</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Email</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Dirección</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Estado</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((f) => (
                <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 text-sm">{f.nombre}</p>
                    {f.actividad_ids.length > 0 && (
                      <p className="text-xs text-gray-400 mt-0.5">{f.actividad_ids.length} actividad(es)</p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">{f.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 hidden lg:table-cell">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {f.direccion || (
                        <span className="flex items-center gap-1 text-orange-500">
                          <AlertCircle className="h-3 w-3" /> Sin dirección
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${f.activo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {f.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(f)} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(f.id, f.nombre)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400 text-sm">No se encontraron facilitadores</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
