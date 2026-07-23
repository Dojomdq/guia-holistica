"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, ArrowRight, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";

const rotatingWords = [
  "Bienestar",
  "Transformación",
  "Conexión",
  "Conciencia",
  "Armonía",
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
    const interval = setInterval(changeWord, 3200);
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
    <section className="relative min-h-[100svh] flex flex-col justify-end bg-ink overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "256px 256px",
          }}
        />
        {/* Gradient orb */}
        <div
          className="absolute top-[10%] right-[15%] w-[600px] h-[600px] rounded-full opacity-[0.08]"
          style={{
            background: "radial-gradient(circle, rgba(93,138,110,1) 0%, transparent 70%)",
            transform: loaded ? "scale(1)" : "scale(0.8)",
            opacity: loaded ? 0.08 : 0,
            transition: "all 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
          }}
        />
        <div
          className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] rounded-full opacity-[0.05]"
          style={{
            background: "radial-gradient(circle, rgba(184,149,106,1) 0%, transparent 70%)",
            transform: loaded ? "scale(1)" : "scale(0.8)",
            opacity: loaded ? 0.05 : 0,
            transition: "all 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.5s",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative container-page pb-14 md:pb-20 lg:pb-24 pt-36 md:pt-44 w-full">
        {/* Overline */}
        <div
          className={`mb-8 md:mb-12 transition-all duration-700 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="label-light">
            Mar del Plata · Argentina
          </span>
        </div>

        {/* Main heading */}
        <div className="max-w-[900px]">
          <h1
            className={`font-serif text-[clamp(2.5rem,7vw,6rem)] leading-[1.02] tracking-[-0.03em] text-white mb-8 md:mb-12 transition-all duration-[1200ms] ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            Encontrá tu
            <br />
            <span className="relative inline-block">
              {rotatingWords.map((word, i) => (
                <span
                  key={word}
                  className={`absolute left-0 transition-all duration-500 ease-out-expo ${
                    i === currentWordIndex
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-2 pointer-events-none"
                  }`}
                >
                  {word}
                </span>
              ))}
              <span className="invisible block" aria-hidden="true">
                Transformación
              </span>
              <span className="absolute bottom-[0.06em] left-0 w-full h-[2px] bg-sage-500/40" />
            </span>
          </h1>

          <p
            className={`text-white/50 text-base sm:text-lg max-w-md leading-relaxed mb-10 md:mb-14 transition-all duration-700 delay-200 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Facilitadores, terapeutas y guías de sanación
            en un solo lugar.
          </p>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className={`max-w-lg transition-all duration-700 delay-300 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="flex items-center bg-white/[0.07] backdrop-blur-md rounded-xl border border-white/[0.08] p-1.5">
              <Search className="ml-4 h-4 w-4 text-white/30 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="chamanismo, yoga, reiki..."
                className="flex-1 px-4 py-3 bg-transparent text-white placeholder:text-white/25 focus:outline-none text-sm"
              />
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-ink rounded-lg hover:bg-white/90 transition-all duration-300 text-sm font-medium shrink-0 group/btn"
              >
                Buscar
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
              </button>
            </div>
          </form>

          {/* Quick links */}
          <div
            className={`flex flex-wrap items-center gap-x-6 gap-y-2 mt-6 transition-all duration-700 delay-[500ms] ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {["Yoga", "Reiki", "Meditación", "Chamanismo"].map((tag) => (
              <button
                key={tag}
                onClick={() =>
                  router.push(`/mapa?q=${encodeURIComponent(tag.toLowerCase())}`)
                }
                className="text-white/35 text-[13px] font-medium hover:text-white/70 transition-colors duration-300 flex items-center gap-1"
              >
                {tag}
                <ArrowUpRight className="h-3 w-3 opacity-50" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cream-100 to-transparent" />
    </section>
  );
}
