"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Search, ArrowRight, MapPin, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { CITY_NAME, CITY_COORDS } from "@/lib/constants";

export default function NewHero() {
  const [search, setSearch] = useState("");
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/mapa?q=${encodeURIComponent(search.trim())}`);
    } else {
      router.push("/mapa");
    }
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://res.cloudinary.com/kmxmqr0t/image/upload/v1785019465/AF49F0FF-4A15-4EA3-AE9F-AC8F83C11FC0_hkigqu.jpg"
          alt="Costa de Mar del Plata"
          fill
          className="object-cover scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bark/60 via-bark/50 to-bark/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-sage-950/20 via-transparent to-terracotta-950/20 mix-blend-overlay" />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-[400px] h-[400px] rounded-full opacity-[0.06]"
          style={{
            background: "radial-gradient(circle, #FAF6EE 0%, transparent 70%)",
            animation: "blob 20s ease-in-out infinite",
          }}
        />
        <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.05]"
          style={{
            background: "radial-gradient(circle, #E8DED0 0%, transparent 70%)",
            animation: "blob 25s ease-in-out infinite reverse",
          }}
        />
      </div>

      <div className="relative z-10 w-full px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`mb-8 transition-all duration-700 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <span className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-[11px] font-mono font-medium tracking-[0.14em] uppercase text-sand-300 border border-white/10">
              <MapPin className="h-3 w-3" />
              {CITY_NAME} · Argentina
              <Sparkles className="h-3 w-3" />
            </span>
          </div>

          <h1 className={`heading-xl text-white mb-6 transition-all duration-1000 ease-out ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            Guía de
            <br />
            <span className="text-sage-100">
              Bienestar
            </span>
          </h1>

          <p className={`text-cream-100/90 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-12 transition-all duration-700 delay-500 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            Encontrá terapeutas, facilitadores y guías cerca tuyo.
          </p>

          <form onSubmit={handleSearch} className={`max-w-xl mx-auto mb-8 transition-all duration-700 delay-[700ms] ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <div className="flex items-center bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-1.5 hover:bg-white/15 hover:border-white/30 transition-all duration-300 shadow-lg shadow-black/10">
              <Search className="ml-5 h-5 w-5 text-sand-400 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscá por actividad: yoga, reiki, chamanismo..."
                aria-label="Buscar facilitadores o actividades"
                className="flex-1 px-4 py-4 bg-transparent text-white placeholder:text-cream-300/60 focus:outline-none text-base"
              />
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3.5 bg-sage-500 text-white rounded-xl hover:bg-terracotta-600 hover:shadow-md hover:scale-[1.02] transition-all duration-200 text-sm font-semibold shrink-0 group/btn"
              >
                Buscar
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </button>
            </div>
          </form>

          <div className={`flex flex-wrap items-center justify-center gap-3 transition-all duration-700 delay-[900ms] ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <span className="text-[11px] font-mono font-medium tracking-[0.14em] uppercase text-sand-500/80 mr-1">
              Rápido:
            </span>
            {["Yoga", "Reiki", "Meditación", "Chamanismo", "Tarot"].map((tag) => (
              <button
                key={tag}
                onClick={() => router.push(`/mapa?q=${encodeURIComponent(tag.toLowerCase())}`)}
                className="px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-[13px] font-medium text-cream-200 hover:bg-white/20 hover:text-white border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
