"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/mapa?q=${encodeURIComponent(search.trim())}`);
    } else {
      router.push("/mapa");
    }
  };

  return (
    <section className="relative min-h-[480px] md:min-h-[540px] flex items-center">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1775169726139-82f78b87b8a4?w=1920&q=80&auto=format&fit=crop"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/50 to-gray-900/80" />
      </div>

      <div className="relative container-page py-16 md:py-24">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-white/70 text-sm mb-4">
            <MapPin className="h-4 w-4" />
            <span>Mar del Plata, Argentina</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Encontrá tu camino{" "}
            <span className="text-emerald-300">holístico</span>
          </h1>
          <p className="text-white/80 text-lg mb-8 max-w-lg">
            Facilitadores, terapeutas y guías de sanación en tu ciudad.
            Explorá el mapa, descubrí actividades y conectá con quien necesitás.
          </p>

          <form onSubmit={handleSearch} className="max-w-lg">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar: chamanismo, yoga, reiki..."
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
              >
                Buscar
              </button>
            </div>
          </form>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/mapa?q=chamanismo" className="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-sm text-white hover:bg-white/20 transition-colors">
              🪶 Chamanismo
            </Link>
            <Link href="/mapa?q=yoga" className="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-sm text-white hover:bg-white/20 transition-colors">
              🧘 Yoga
            </Link>
            <Link href="/mapa?q=reiki" className="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-sm text-white hover:bg-white/20 transition-colors">
              ✋ Reiki
            </Link>
            <Link href="/mapa?q=meditacion" className="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-sm text-white hover:bg-white/20 transition-colors">
              🕯️ Meditación
            </Link>
            <Link href="/mapa?q=tarot" className="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-sm text-white hover:bg-white/20 transition-colors">
              🔮 Tarot
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
