"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const rotatingWords = [
  "Camino",
  "Bienestar",
  "Transformación",
  "Conexión",
  "Conciencia",
  "Naturaleza",
];

export default function Hero() {
  const [search, setSearch] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  const changeWord = useCallback(() => {
    setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
  }, []);

  useEffect(() => {
    setLoaded(true);
    const interval = setInterval(changeWord, 3000);
    return () => clearInterval(interval);
  }, [changeWord]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/mapa?q=${encodeURIComponent(search.trim())}`);
    } else {
      router.push("/mapa");
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-end bg-warmblack">
      {/* Decorative shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full border border-sage-500/10"
          style={{
            opacity: loaded ? 0.6 : 0,
            transition: "opacity 1.5s ease-out 0.5s",
          }}
        />
        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full border border-sage-500/5"
          style={{
            transform: "scale(1.4)",
            opacity: loaded ? 0.4 : 0,
            transition: "opacity 1.5s ease-out 0.7s",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative container-page pb-16 md:pb-24 lg:pb-28 pt-32 w-full">
        <div
          className={`flex items-center gap-3 mb-12 md:mb-20 transition-opacity duration-700 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="w-8 h-px bg-sage-400/40" />
          <span className="text-sage-400/80 text-[11px] font-medium tracking-[0.3em] uppercase">
            Mar del Plata
          </span>
        </div>

        <div className="max-w-5xl">
          <h1
            className={`text-[2.8rem] sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-serif text-white leading-[1.05] tracking-tight mb-10 md:mb-14 transition-opacity duration-1000 delay-100 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          >
            Encontrá tu
            <br />
            <span className="relative inline-block">
              {/* All words stacked, crossfade with opacity only */}
              {rotatingWords.map((word, i) => (
                <span
                  key={word}
                  className={`absolute left-0 transition-opacity duration-500 ease-in-out ${
                    i === currentWordIndex
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
                  }`}
                  style={{
                    WebkitFontSmoothing: "antialiased",
                  }}
                >
                  {word}
                </span>
              ))}
              {/* Invisible placeholder to reserve space for the widest word */}
              <span className="invisible block" aria-hidden="true">
                Transformación
              </span>
              {/* Underline accent */}
              <span className="absolute bottom-[0.05em] left-0 w-full h-[3px] bg-sage-500/30 rounded-full" />
            </span>
          </h1>

          <p
            className={`text-white/55 text-base sm:text-lg max-w-md leading-relaxed mb-10 md:mb-12 transition-opacity duration-700 delay-300 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          >
            Facilitadores, terapeutas y guías de sanación
            en un solo lugar.
          </p>

          <form
            onSubmit={handleSearch}
            className={`max-w-md transition-opacity duration-700 delay-500 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="relative flex items-center bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
              <Search className="absolute left-4 h-4 w-4 text-white/50" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="chamanismo, yoga, reiki..."
                className="flex-1 pl-11 pr-4 py-4 bg-transparent text-white placeholder:text-white/40 focus:outline-none text-sm"
              />
              <button
                type="submit"
                className="flex items-center gap-2 mr-1.5 px-5 py-2.5 bg-sage-500 text-white rounded-xl hover:bg-sage-400 transition-colors duration-300 text-sm font-medium group/btn"
              >
                Buscar
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
              </button>
            </div>
          </form>

          <div
            className={`flex items-center gap-5 mt-6 transition-opacity duration-700 delay-700 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="text-white/40 text-xs font-medium tracking-wide uppercase">Explorá por:</span>
            {["Yoga", "Reiki", "Meditación"].map((tag) => (
              <button
                key={tag}
                onClick={() =>
                  router.push(
                    `/mapa?q=${encodeURIComponent(tag.toLowerCase())}`
                  )
                }
                className="text-white/50 text-xs font-medium hover:text-white/80 transition-colors duration-300 border-b border-white/15 hover:border-white/30 pb-px"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-cream-100 to-transparent" />
    </section>
  );
}
