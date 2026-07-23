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
    <section className="relative min-h-[520px] md:min-h-[580px] flex items-end overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1775169726139-82f78b87b8a4?w=1920&q=80&auto=format&fit=crop"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
      </div>

      <div className="relative container-page pb-16 md:pb-20 pt-32 w-full">
        <div className="max-w-xl">
          <p className="text-emerald-400 text-sm font-medium tracking-wide uppercase mb-4">
            Mar del Plata, Argentina
          </p>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-white mb-6 leading-[1.1]">
            Encontrá tu
            <br />
            <span className="italic text-emerald-300">camino</span>
          </h1>
          <p className="text-white/60 text-lg mb-10 max-w-md leading-relaxed">
            Facilitadores, terapeutas y guías de sanación. Explorá, descubrí y conectá.
          </p>

          <form onSubmit={handleSearch} className="max-w-md">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="chamanismo, yoga, reiki..."
                className="w-full pl-12 pr-24 py-4 rounded-2xl bg-white/95 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-2xl"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-stone-900 text-white px-5 py-2.5 rounded-xl hover:bg-stone-800 transition-colors text-sm font-medium"
              >
                Buscar
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
