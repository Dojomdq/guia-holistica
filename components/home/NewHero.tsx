"use client";

import { useState, useEffect } from "react";
import { Search, ArrowRight, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=1080&fit=crop&crop=center"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-bark/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-bark/90 via-bark/40 to-bark/20" />
        {/* Subtle warm tint */}
        <div className="absolute inset-0 bg-terracotta-900/10 mix-blend-multiply" />
      </div>

      {/* Content — centered */}
      <div className="relative z-10 w-full px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Overline */}
          <div
            className={`mb-6 transition-all duration-700 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="inline-flex items-center gap-2 text-[11px] font-mono font-medium tracking-[0.14em] uppercase text-sand-300/70">
              <MapPin className="h-3 w-3" />
              Mar del Plata · Argentina
            </span>
          </div>

          {/* Main heading */}
          <h1
            className={`font-serif text-[clamp(2.75rem,7vw,6.5rem)] leading-[1.02] tracking-[-0.03em] text-white mb-6 transition-all duration-[1200ms] ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            Bienestar en
            <br />
            <span className="text-sand-300/90">Mar del Plata</span>
          </h1>

          {/* Subtitle */}
          <p
            className={`text-white/60 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10 transition-all duration-700 delay-200 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Encontrá terapeutas, facilitadores y guías holísticos cerca tuyo.
          </p>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className={`max-w-xl mx-auto transition-all duration-700 delay-300 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="flex items-center bg-white/10 backdrop-blur-xl rounded-2xl border border-white/15 p-2 hover:bg-white/15 transition-colors duration-300">
              <Search className="ml-4 h-5 w-5 text-white/30 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="chamanismo, yoga, reiki..."
                className="flex-1 px-4 py-3.5 bg-transparent text-white placeholder:text-white/30 focus:outline-none text-base"
              />
              <button
                type="submit"
                className="flex items-center gap-2 px-7 py-3.5 bg-sand-400 text-bark rounded-xl hover:bg-sand-300 hover:shadow-warm hover:-translate-y-0.5 transition-all duration-300 text-sm font-semibold shrink-0 group/btn"
              >
                Buscar
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
              </button>
            </div>
          </form>

          {/* Quick links */}
          <div
            className={`flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-6 transition-all duration-700 delay-[500ms] ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {["Yoga", "Reiki", "Meditación", "Chamanismo", "Tarot"].map((tag) => (
              <button
                key={tag}
                onClick={() =>
                  router.push(`/mapa?q=${encodeURIComponent(tag.toLowerCase())}`)
                }
                className="text-white/35 text-[13px] font-medium hover:text-sand-300 transition-colors duration-300"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-700 delay-[800ms] ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="w-5 h-8 rounded-full border-2 border-white/20 flex justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-white/40 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
