"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, MapPin, X, Crosshair, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import MapPicker from "@/components/MapPicker";

interface FacilitadorAdmin {
  id: string;
  nombre: string;
  email: string;
  telefono: string | null;
  whatsapp: string | null;
  bio: string | null;
  instagram: string | null;
  sitio_web: string | null;
  logo_url: string | null;
  activo: boolean;
  actividad_ids: string[];
  ubicaciones: { id: string; direccion: string | null; latitud: number; longitud: number; ciudad: string; descripcion: string | null }[];
}

interface ActividadOption {
  id: string;
  nombre: string;
}

interface PlanOption {
  id: string;
  nombre: string;
}

interface RepresentanteOption {
  id: string;
  nombre: string;
  comision_porcentaje: number | null;
}

interface PlanAsignacion {
  id: string | null;
  plan_id: string | null;
  representante_id: string | null;
  ciudad: string | null;
  fundador: boolean;
  estado: string;
  precio_contratado: string;
  fecha_inicio: string;
  fecha_vencimiento: string;
  proxima_fecha_pago: string;
  observaciones: string;
}

interface UbicacionForm {
  direccion: string;
  latitud: string;
  longitud: string;
  ciudad: string;
  descripcion: string;
}

const EMPTY_UBI: UbicacionForm = { direccion: "", latitud: "-38.0055", longitud: "-57.5426", ciudad: "Mar del Plata", descripcion: "" };

const EMPTY_PLAN: PlanAsignacion = {
  id: null,
  plan_id: null,
  representante_id: null,
  ciudad: null,
  fundador: false,
  estado: "activo",
  precio_contratado: "",
  fecha_inicio: "",
  fecha_vencimiento: "",
  proxima_fecha_pago: "",
  observaciones: "",
};

const EMPTY_FORM = {
  nombre: "", email: "", telefono: "", whatsapp: "", bio: "",
  instagram: "", sitio_web: "", logo_url: "", activo: true, actividad_ids: [] as string[],
  ubicaciones: [] as UbicacionForm[],
};

export default function FacilitadoresAdmin() {
  const [busqueda, setBusqueda] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState<string | null>(null);
  const [facilitadores, setFacilitadores] = useState<FacilitadorAdmin[]>([]);
  const [actividades, setActividades] = useState<ActividadOption[]>([]);
  const [planes, setPlanes] = useState<PlanOption[]>([]);
  const [representantes, setRepresentantes] = useState<RepresentanteOption[]>([]);
  const [planesMap, setPlanesMap] = useState<Record<string, PlanAsignacion>>({});
  const [form, setForm] = useState(EMPTY_FORM);
  const [planForm, setPlanForm] = useState<PlanAsignacion>(EMPTY_PLAN);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [buscandoDir, setBuscandoDir] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    const [fRes, aRes] = await Promise.all([
      supabase
        .from("facilitadores")
        .select("*, facilitador_actividades(actividades(id)), ubicaciones(*)")
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
          id: f.id,
          nombre: f.nombre,
          email: f.email,
          telefono: f.telefono,
          whatsapp: f.whatsapp,
          bio: f.bio,
          instagram: f.instagram,
          sitio_web: f.sitio_web,
          logo_url: f.logo_url || null,
          activo: f.activo,
          actividad_ids: (f.facilitador_actividades || []).map((fa: any) => fa.actividades?.id).filter(Boolean),
          ubicaciones: (f.ubicaciones || []).map((u: any) => ({
            id: u.id,
            direccion: u.direccion,
            latitud: u.latitud,
            longitud: u.longitud,
            ciudad: u.ciudad,
            descripcion: u.descripcion || "",
          })),
        }))
      );
    }

    if (aRes.data) {
      setActividades((aRes.data || []).map((a: any) => ({ id: a.id, nombre: a.nombre })));
    }

    try {
      const planesRes = await fetch("/api/planes");
      const planesData = await planesRes.json();
      if (planesRes.ok && Array.isArray(planesData)) {
        setPlanes(planesData.map((p: any) => ({ id: p.id, nombre: p.nombre })));
      }

      const repsRes = await fetch("/api/representantes");
      const repsData = await repsRes.json();
      if (repsRes.ok && Array.isArray(repsData)) {
        setRepresentantes(repsData.map((r: any) => ({ id: r.id, nombre: r.nombre, comision_porcentaje: r.comision_porcentaje ?? null })));
      }

      const asignRes = await fetch("/api/facilitador-planes");
      const asignData = await asignRes.json();
      if (asignRes.ok && Array.isArray(asignData)) {
        const map: Record<string, PlanAsignacion> = {};
        for (const a of asignData) {
          if (a.facilitador_id) {
            map[a.facilitador_id] = {
              id: a.id,
              plan_id: a.plan_id,
              representante_id: a.representante_id,
              ciudad: a.ciudad || null,
              fundador: a.fundador,
              estado: a.estado || "activo",
              precio_contratado: a.precio_contratado != null ? String(a.precio_contratado) : "",
              fecha_inicio: a.fecha_inicio || "",
              fecha_vencimiento: a.fecha_vencimiento || "",
              proxima_fecha_pago: a.proxima_fecha_pago || "",
              observaciones: a.observaciones || "",
            };
          }
        }
        setPlanesMap(map);
      }
    } catch {}

    setCargando(false);
  }

  useEffect(() => { load(); }, []);

  const filtered = facilitadores.filter(
    (f) =>
      f.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      f.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  function openNew() {
    setForm(EMPTY_FORM);
    setPlanForm(EMPTY_PLAN);
    setEditando(null);
    setShowForm(true);
  }

  function openEdit(f: FacilitadorAdmin) {
    setForm({
      nombre: f.nombre, email: f.email, telefono: f.telefono || "",
      whatsapp: f.whatsapp || "", bio: f.bio || "",
      instagram: f.instagram || "", sitio_web: f.sitio_web || "",
      logo_url: f.logo_url || "",
      activo: f.activo, actividad_ids: f.actividad_ids,
      ubicaciones: f.ubicaciones.length > 0
        ? f.ubicaciones.map((u) => ({
            direccion: u.direccion || "",
            latitud: String(u.latitud),
            longitud: String(u.longitud),
            ciudad: u.ciudad,
            descripcion: u.descripcion || "",
          }))
        : [{ ...EMPTY_UBI }],
    });
    setPlanForm(planesMap[f.id] ? { ...planesMap[f.id] } : { ...EMPTY_PLAN });
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

  function updateUbi(idx: number, field: keyof UbicacionForm, value: string) {
    setForm((prev) => {
      const ubi = [...prev.ubicaciones];
      ubi[idx] = { ...ubi[idx], [field]: value };
      return { ...prev, ubicaciones: ubi };
    });
  }

  function addUbi() {
    setForm((prev) => ({ ...prev, ubicaciones: [...prev.ubicaciones, { ...EMPTY_UBI }] }));
  }

  function removeUbi(idx: number) {
    setForm((prev) => ({
      ...prev,
      ubicaciones: prev.ubicaciones.filter((_, i) => i !== idx),
    }));
  }

  async function buscarDireccion(idx: number) {
    const ubi = form.ubicaciones[idx];
    if (!ubi.direccion.trim()) return;
    setBuscandoDir(idx);
    try {
      const query = encodeURIComponent(`${ubi.direccion}, ${ubi.ciudad}, Argentina`);
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`, {
        headers: {
          "Accept-Language": "es",
          "User-Agent": "GuiaDeBienestar/1.0",
        },
      });
      const data = await res.json();
      if (data.length > 0) {
        updateUbi(idx, "latitud", parseFloat(data[0].lat).toFixed(6));
        updateUbi(idx, "longitud", parseFloat(data[0].lon).toFixed(6));
      } else {
        alert("No se encontró la dirección. Probá de otra forma.");
      }
    } catch {
      alert("Error al buscar la dirección");
    }
    setBuscandoDir(null);
  }

  async function handleSave() {
    setGuardando(true);
    setError(null);
    const payload: any = {
      nombre: form.nombre,
      email: form.email || `facilitador-${Date.now()}@guia-de-bienestar.local`,
      telefono: form.telefono || null,
      whatsapp: form.whatsapp || null,
      bio: form.bio || null,
      instagram: form.instagram || null,
      sitio_web: form.sitio_web || null,
      logo_url: form.logo_url || null,
      activo: form.activo,
      latitud: parseFloat(form.ubicaciones[0]?.latitud || "-38.0055"),
      longitud: parseFloat(form.ubicaciones[0]?.longitud || "-57.5426"),
      direccion: form.ubicaciones[0]?.direccion || null,
      actividad_ids: form.actividad_ids,
      ubicaciones: form.ubicaciones.filter((u) => u.direccion.trim() || u.latitud.trim() || u.longitud.trim()).map((u) => ({
        direccion: u.direccion || null,
        latitud: u.latitud,
        longitud: u.longitud,
        ciudad: u.ciudad || "Mar del Plata",
        descripcion: u.descripcion || null,
      })),
    };

    const url = editando ? `/api/facilitadores/${editando}` : "/api/facilitadores";
    const method = editando ? "PUT" : "POST";

    let facilitadorId = editando;

    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError("Error (" + res.status + "): " + (data.error || res.statusText) + " | " + JSON.stringify(data));
        setGuardando(false);
        return;
      }
      if (!editando && data.data?.id) {
        facilitadorId = data.data.id;
      }
    } catch (err: any) {
      setError("Error de red: " + err.message);
      setGuardando(false);
      return;
    }

    if (facilitadorId && (planForm.plan_id || planForm.id || planForm.fundador || planForm.observaciones)) {
      const planPayload = {
        plan_id: planForm.plan_id || null,
        representante_id: planForm.representante_id || null,
        fundador: planForm.fundador,
        estado: planForm.estado,
        precio_contratado: planForm.precio_contratado === "" ? null : parseFloat(planForm.precio_contratado),
        fecha_inicio: planForm.fecha_inicio || null,
        fecha_vencimiento: planForm.fecha_vencimiento || null,
        proxima_fecha_pago: planForm.proxima_fecha_pago || null,
        observaciones: planForm.observaciones || null,
      };

      try {
        if (planForm.id) {
          await fetch(`/api/facilitador-planes/${planForm.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(planPayload),
          });
        } else {
          await fetch("/api/facilitador-planes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...planPayload, facilitador_id: facilitadorId }),
          });
        }
      } catch {}
    }

    setShowForm(false);
    setEditando(null);
    setForm(EMPTY_FORM);
    setPlanForm(EMPTY_PLAN);
    await load();
    setGuardando(false);
  }

async function handleDelete(id: string, nombre: string) {
    if (!confirm(`¿Eliminar a "${nombre}"?`)) return;
    await fetch(`/api/facilitadores/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-serif font-semibold text-bark">Facilitadores</h1>
        <button onClick={openNew} className="inline-flex items-center gap-2 bg-bark text-white px-4 py-2.5 rounded-xl hover:bg-bark/85 transition-all duration-300 text-sm font-medium hover:-translate-y-0.5">
          <Plus className="h-4 w-4" /> Nuevo Facilitador
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
            <h2 className="font-serif font-semibold text-bark">{editando ? "Editar Facilitador" : "Nuevo Facilitador"}</h2>
            <button onClick={() => { setShowForm(false); setEditando(null); }} className="text-bark-500 hover:text-bark-700 transition-colors"><X className="h-5 w-5" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-bark-800 mb-1">Nombre *</label>
              <input type="text" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark placeholder:text-bark-400 focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all" placeholder="Nombre completo" />
            </div>
            <div>
              <label className="block text-sm font-medium text-bark-800 mb-1">Email *</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark placeholder:text-bark-400 focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all" placeholder="email@ejemplo.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-bark-800 mb-1">Teléfono</label>
              <input type="tel" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark placeholder:text-bark-400 focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all" placeholder="+54 223 555-0000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-bark-800 mb-1">WhatsApp</label>
              <input type="tel" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark placeholder:text-bark-400 focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all" placeholder="+542235550000" />
            </div>

            {/* Ubicaciones */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-bark-800">Ubicaciones</label>
                <button type="button" onClick={addUbi} className="inline-flex items-center gap-1 text-xs font-medium text-sage-600 hover:text-sage-700 bg-sage-50 px-2.5 py-1 rounded-lg transition-colors">
                  <Plus className="h-3 w-3" /> Agregar ubicación
                </button>
              </div>
              {form.ubicaciones.length === 0 && (
                <p className="text-xs text-bark-500 mb-2">Sin ubicaciones cargadas</p>
              )}
              {form.ubicaciones.map((ubi, idx) => (
                <div key={idx} className="bg-cream-50 rounded-xl p-4 mb-3 border border-cream-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-bark-600 font-mono">Ubicación {idx + 1}</span>
                    {form.ubicaciones.length > 1 && (
                      <button type="button" onClick={() => removeUbi(idx)} className="text-bark-400 hover:text-red-500 transition-colors">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="md:col-span-2">
                      <input type="text" value={ubi.direccion} onChange={(e) => updateUbi(idx, "direccion", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-cream-300 text-sm text-bark placeholder:text-bark-400 focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all" placeholder="Dirección" />
                    </div>
                    <div>
                      <input type="text" value={ubi.ciudad} onChange={(e) => updateUbi(idx, "ciudad", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-cream-300 text-sm text-bark placeholder:text-bark-400 focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all" placeholder="Ciudad" />
                    </div>
                    <textarea value={ubi.descripcion} onChange={(e) => updateUbi(idx, "descripcion", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-cream-300 text-sm text-bark placeholder:text-bark-400 focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all" placeholder="Descripción (horarios, referencias...)" rows={2} />
                    <div className="flex items-center gap-2">
                      <input type="text" value={ubi.latitud} onChange={(e) => updateUbi(idx, "latitud", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-cream-300 text-sm text-bark placeholder:text-bark-400 focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all" placeholder="Latitud" />
                      <input type="text" value={ubi.longitud} onChange={(e) => updateUbi(idx, "longitud", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-cream-300 text-sm text-bark placeholder:text-bark-400 focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all" placeholder="Longitud" />
                      <button type="button" onClick={() => buscarDireccion(idx)} disabled={buscandoDir === idx || !ubi.direccion.trim()}
                        className="shrink-0 inline-flex items-center gap-1 text-xs font-medium text-bark-600 hover:text-bark-800 bg-cream-200 hover:bg-cream-300 px-2 py-2 rounded-lg transition-colors disabled:opacity-50">
                        <Crosshair className="h-3 w-3" />
                      </button>
                    </div>
                    <MapPicker
                      lat={parseFloat(ubi.latitud) || -38.0055}
                      lng={parseFloat(ubi.longitud) || -57.5426}
                      onChange={(lat, lng) => {
                        updateUbi(idx, "latitud", String(lat));
                        updateUbi(idx, "longitud", String(lng));
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-bark-800 mb-1">Bio</label>
              <textarea rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark placeholder:text-bark-400 focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all" placeholder="Breve descripción..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-bark-800 mb-1">Instagram</label>
              <input type="text" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark placeholder:text-bark-400 focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all" placeholder="@usuario" />
            </div>
            <div>
              <label className="block text-sm font-medium text-bark-800 mb-1">Sitio Web</label>
              <input type="url" value={form.sitio_web} onChange={(e) => setForm({ ...form, sitio_web: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark placeholder:text-bark-400 focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-bark-800 mb-1">Logo del marcador (mapa)</label>
              <input type="url" value={form.logo_url} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark placeholder:text-bark-400 focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all" placeholder="https://res.cloudinary.com/..." />
              {form.logo_url && (
                <img src={form.logo_url} alt="Preview" className="mt-2 h-10 w-10 rounded-lg object-contain border border-cream-200" />
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-bark-800 mb-2">Actividades</label>
              {actividades.length === 0 ? (
                <p className="text-sm text-bark-400">
                  No hay actividades cargadas.{" "}
                  <a href="/admin/actividades" className="text-sage-600 underline">Crear actividades</a>
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {actividades.map((a) => (
                    <button key={a.id} type="button" onClick={() => toggleActividad(a.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                        form.actividad_ids.includes(a.id) ? "bg-bark text-white" : "bg-cream-200 text-bark-700 hover:bg-cream-300"
                      }`}>
                      {a.nombre}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 mt-6">
            <label className="flex items-center gap-2 text-sm text-bark-700">
              <input type="checkbox" checked={form.activo} onChange={(e) => setForm({ ...form, activo: e.target.checked })} className="rounded border-cream-300 text-sage-600 focus:ring-sage-400" />
              Activo
            </label>
          </div>

          <div className="mt-6 border-t border-cream-200 pt-5">
            <h3 className="font-serif font-semibold text-bark mb-4">Plan contratado</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-bark-800 mb-1">Plan</label>
                <select value={planForm.plan_id || ""} onChange={(e) => setPlanForm({ ...planForm, plan_id: e.target.value || null })}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all">
                  <option value="">Sin plan</option>
                  {planes.map((p) => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-bark-800 mb-1">Representante / Comercial</label>
                <select value={planForm.representante_id || ""} onChange={(e) => setPlanForm({ ...planForm, representante_id: e.target.value || null })}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all">
                  <option value="">Sin representante</option>
                  {representantes.map((r) => (
                    <option key={r.id} value={r.id}>{r.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-bark-800 mb-1">Estado</label>
                <select value={planForm.estado} onChange={(e) => setPlanForm({ ...planForm, estado: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all">
                  <option value="activo">Activo</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="vencido">Vencido</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-bark-800 mb-1">Precio contratado ($)</label>
                <input type="number" min="0" value={planForm.precio_contratado} onChange={(e) => setPlanForm({ ...planForm, precio_contratado: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark placeholder:text-bark-400 focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all" placeholder="Ej: 18000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-bark-800 mb-1">Fecha de inicio</label>
                <input type="date" value={planForm.fecha_inicio} onChange={(e) => setPlanForm({ ...planForm, fecha_inicio: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-bark-800 mb-1">Fecha de vencimiento</label>
                <input type="date" value={planForm.fecha_vencimiento} onChange={(e) => setPlanForm({ ...planForm, fecha_vencimiento: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-bark-800 mb-1">Próxima fecha de pago</label>
                <input type="date" value={planForm.proxima_fecha_pago} onChange={(e) => setPlanForm({ ...planForm, proxima_fecha_pago: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all" />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-bark-800 mb-1">Observaciones</label>
                <textarea rows={2} value={planForm.observaciones} onChange={(e) => setPlanForm({ ...planForm, observaciones: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark placeholder:text-bark-400 focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all" placeholder="Notas internas..." />
              </div>
              <label className="flex items-center gap-2 text-sm text-bark-700 md:col-span-3 cursor-pointer">
                <input type="checkbox" checked={planForm.fundador} onChange={(e) => setPlanForm({ ...planForm, fundador: e.target.checked })} className="rounded border-cream-300 text-sage-600 focus:ring-sage-400" />
                Fundador (costo $0)
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button onClick={handleSave} disabled={guardando || !form.nombre}
              className="bg-bark text-white px-6 py-2.5 rounded-xl hover:bg-bark/85 transition-all duration-300 text-sm font-medium disabled:opacity-50 hover:-translate-y-0.5">
              {guardando ? "Guardando..." : "Guardar"}
            </button>
            <button onClick={() => { setShowForm(false); setEditando(null); }} className="bg-cream-200 text-bark-700 px-6 py-2.5 rounded-xl hover:bg-cream-300 transition-all duration-300 text-sm font-medium">
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-bark-400" />
        <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar facilitador..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/80 backdrop-blur-sm border border-cream-300 text-sm text-bark placeholder:text-bark-400 focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all" />
      </div>

      <div className="bg-white rounded-2xl shadow-soft border border-cream-300/60 overflow-hidden">
        {cargando ? (
          <div className="p-8 text-center text-bark-500">Cargando...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-cream-50 border-b border-cream-300/60">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-bark-600 uppercase tracking-wide">Nombre</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-bark-600 uppercase tracking-wide hidden md:table-cell">Email</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-bark-600 uppercase tracking-wide hidden lg:table-cell">Ubicaciones</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-bark-600 uppercase tracking-wide">Plan</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-bark-600 uppercase tracking-wide">Estado</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-bark-600 uppercase tracking-wide">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {filtered.map((f) => (
                <tr key={f.id} className="hover:bg-cream-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-bark text-sm">{f.nombre}</p>
                    {f.actividad_ids.length > 0 && (
                      <p className="text-xs text-bark-500 mt-0.5">{f.actividad_ids.length} actividad(es)</p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-bark-600 hidden md:table-cell">{f.email}</td>
                  <td className="px-6 py-4 text-sm text-bark-600 hidden lg:table-cell">
                    {f.ubicaciones.length > 0 ? (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {f.ubicaciones.length} ubicacion(es)
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-orange-500">
                        <AlertCircle className="h-3 w-3" /> Sin dirección
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {(() => {
                      const asign = planesMap[f.id];
                      if (!asign || !asign.plan_id) {
                        return <span className="text-xs text-bark-400">—</span>;
                      }
                      const plan = planes.find((p) => p.id === asign.plan_id);
                      const rep = representantes.find((r) => r.id === asign.representante_id);
                      return (
                        <div>
                          <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                            {plan?.nombre || "Plan"}
                          </span>
                          {asign.fundador && (
                            <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/60 ml-1">
                              Fundador
                            </span>
                          )}
                          {rep && (
                            <p className="text-[11px] text-bark-500 mt-1">Rep: {rep.nombre}</p>
                          )}
                        </div>
                      );
                    })()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${f.activo ? "bg-sage-50 text-sage-700 border border-sage-200/60" : "bg-red-50 text-red-700 border border-red-200/60"}`}>
                      {f.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(f)} className="p-1.5 text-bark-500 hover:text-bark-700 hover:bg-cream-200 rounded-lg transition-colors"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(f.id, f.nombre)} className="p-1.5 text-bark-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-bark-500 text-sm">No se encontraron facilitadores</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
