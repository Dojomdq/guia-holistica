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
    <section className="relative min-h-[500px] md:min-h-[560px] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1775169726139-82f78b87b8a4?w=1920&q=80&auto=format&fit=crop"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900/80 via-stone-900/60 to-emerald-900/70" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative container-page py-16 md:py-24">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-emerald-300/90 text-sm mb-4">
            <MapPin className="h-4 w-4" />
            <span className="font-medium">Mar del Plata, Argentina</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Encontrá tu camino{" "}
            <span className="text-emerald-300">holístico</span>
          </h1>
          <p className="text-white/75 text-lg mb-8 max-w-lg leading-relaxed">
            Facilitadores, terapeutas y guías de sanación en tu ciudad.
            Explorá el mapa, descubrí actividades y conectá con quien necesitás.
          </p>

          <form onSubmit={handleSearch} className="max-w-lg">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar: chamanismo, yoga, reiki..."
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/95 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-lg"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-700 text-white px-5 py-2 rounded-lg hover:bg-emerald-800 transition-colors text-sm font-medium shadow-sm"
              >
                Buscar
              </button>
            </div>
          </form>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/mapa?q=chamanismo" className="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15 text-sm text-white/90 hover:bg-white/20 transition-colors">
              🪶 Chamanismo
            </Link>
            <Link href="/mapa?q=yoga" className="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15 text-sm text-white/90 hover:bg-white/20 transition-colors">
              🧘 Yoga
            </Link>
            <Link href="/mapa?q=reiki" className="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15 text-sm text-white/90 hover:bg-white/20 transition-colors">
              ✋ Reiki
            </Link>
            <Link href="/mapa?q=meditacion" className="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15 text-sm text-white/90 hover:bg-white/20 transition-colors">
              🕯️ Meditación
            </Link>
            <Link href="/mapa?q=tarot" className="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15 text-sm text-white/90 hover:bg-white/20 transition-colors">
              🔮 Tarot
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
