"use client";

import Link from "next/link";
import { MapPin, Users } from "lucide-react";

const actividades = [
  { slug: "chamanismo", nombre: "Chamanismo", icono: "🪶", count: 3, color: "bg-amber-50 border-amber-200" },
  { slug: "yoga", nombre: "Yoga", icono: "🧘", count: 5, color: "bg-purple-50 border-purple-200" },
  { slug: "reiki", nombre: "Reiki", icono: "✋", count: 4, color: "bg-sky-50 border-sky-200" },
  { slug: "meditacion", nombre: "Meditación", icono: "🕯️", count: 3, color: "bg-indigo-50 border-indigo-200" },
  { slug: "tarot", nombre: "Tarot y Cartomancia", icono: "🔮", count: 4, color: "bg-violet-50 border-violet-200" },
  { slug: "astrologia", nombre: "Astrología", icono: "⭐", count: 2, color: "bg-yellow-50 border-yellow-200" },
  { slug: "sanacion-energetica", nombre: "Sanación Energética", icono: "💫", count: 3, color: "bg-pink-50 border-pink-200" },
  { slug: "flores-de-bach", nombre: "Flores de Bach", icono: "🌸", count: 2, color: "bg-rose-50 border-rose-200" },
  { slug: "terapias-holisticas", nombre: "Terapias Holísticas", icono: "🌿", count: 4, color: "bg-green-50 border-green-200" },
  { slug: "masajes-terapeuticos", nombre: "Masajes Terapéuticos", icono: "💆", count: 3, color: "bg-teal-50 border-teal-200" },
  { slug: "circulos-de-mujeres", nombre: "Círculos de Mujeres", icono: "🌙", count: 2, color: "bg-rose-50 border-rose-200" },
  { slug: "cacao-ceremonia", nombre: "Cacao Ceremonia", icono: "🍫", count: 2, color: "bg-orange-50 border-orange-200" },
  { slug: "sonidos-y-vibraciones", nombre: "Sonidos y Vibraciones", icono: "🔔", count: 2, color: "bg-cyan-50 border-cyan-200" },
  { slug: "aromaterapia", nombre: "Aromaterapia", icono: "🫧", count: 1, color: "bg-emerald-50 border-emerald-200" },
  { slug: "numerologia", nombre: "Numerología", icono: "🔢", count: 1, color: "bg-amber-50 border-amber-200" },
  { slug: "pranoterapia", nombre: "Pranoterapia", icono: "🌬️", count: 1, color: "bg-sky-50 border-sky-200" },
  { slug: "limpieza-energetica", nombre: "Limpieza Energética", icono: "✨", count: 2, color: "bg-violet-50 border-violet-200" },
  { slug: "plantas-medicinales", nombre: "Plantas Medicinales", icono: "🍃", count: 1, color: "bg-lime-50 border-lime-200" },
];

export default function ActividadesPage() {
  return (
    <div className="container-page py-12">
      <div className="max-w-3xl mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-3">
          Actividades Holísticas
        </h1>
        <p className="text-stone-500 text-lg">
          Explorá todas las actividades disponibles y encontrá la que
          necesitás. Cada una tiene facilitadores verificados en el mapa.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {actividades.map((a) => (
          <Link
            key={a.slug}
            href={`/mapa?q=${a.slug}`}
            className="group"
          >
            <div
              className={`${a.color} border rounded-2xl p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{a.icono}</span>
                <div className="flex items-center gap-1 text-stone-400 text-sm">
                  <Users className="h-4 w-4" />
                  {a.count}
                </div>
              </div>
              <h2 className="font-bold text-stone-800 group-hover:text-primary-600 transition-colors mb-1">
                {a.nombre}
              </h2>
              <div className="flex items-center gap-1 text-sm text-stone-500">
                <MapPin className="h-3.5 w-3.5" />
                Ver en el mapa
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
