"use client";

import Link from "next/link";
import { useState } from "react";
import { Search } from "lucide-react";
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
    <section className="bg-white border-b border-gray-100">
      <div className="container-page py-16 md:py-24">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Encontrá tu camino{" "}
            <span className="text-gray-500">holístico</span>
          </h1>
          <p className="text-gray-500 text-lg mb-8">
            Facilitadores, terapeutas y guías en tu ciudad.
          </p>

          <form onSubmit={handleSearch} className="max-w-lg mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar: chamanismo, yoga, reiki..."
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                Buscar
              </button>
            </div>
          </form>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link href="/mapa?q=chamanismo" className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              🪶 Chamanismo
            </Link>
            <Link href="/mapa?q=yoga" className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              🧘 Yoga
            </Link>
            <Link href="/mapa?q=reiki" className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              ✋ Reiki
            </Link>
            <Link href="/mapa?q=meditacion" className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              🕯️ Meditación
            </Link>
            <Link href="/mapa?q=tarot" className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              🔮 Tarot
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
