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
    <section className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden">
      {/* Background image — Mar del Plata */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1693218960371-fe6fcad32838?w=1920&h=1080&fit=crop&crop=center"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        {/* Top fade — softens header area */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#1a1510]/60 to-transparent" />
        {/* Main gradient — image clear at top, dark at bottom for text */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1510]/95 via-[#1a1510]/50 to-transparent" />
        {/* Subtle warm tint */}
        <div className="absolute inset-0 bg-gradient-to-br from-sand-900/10 via-transparent to-clay-800/10" />
      </div>

      {/* Content */}
      <div className="relative container-page pb-10 md:pb-14 lg:pb-16 pt-36 md:pt-44 w-full">
        {/* Overline */}
        <div
          className={`mb-4 md:mb-6 transition-all duration-700 ${
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
            className={`font-serif text-[clamp(2.5rem,7vw,6rem)] leading-[1.02] tracking-[-0.03em] text-white mb-5 md:mb-7 transition-all duration-[1200ms] ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            Encontrá tu
            <br />
            <span className="relative inline-block">
              {/* Invisible placeholder — sets container width to longest word */}
              <span className="invisible block" aria-hidden="true">
                Transformación
              </span>
              {/* Rotating words — all absolute, stacked, opacity fade only */}
              <span className="absolute inset-0 flex items-end" aria-live="polite">
                {rotatingWords.map((word, i) => (
                  <span
                    key={word}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                      i === currentWordIndex ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {word}
                  </span>
                ))}
              </span>
              {/* Accent underline */}
              <span className="absolute bottom-[0.04em] left-0 w-full h-[3px] bg-sand-400/50 rounded-full" />
            </span>
          </h1>

          <p
            className={`text-white/55 text-base sm:text-lg max-w-md leading-relaxed mb-6 md:mb-8 transition-all duration-700 delay-200 ${
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
            <div className="flex items-center bg-white/[0.12] backdrop-blur-md rounded-xl border border-white/[0.1] p-1.5">
              <Search className="ml-4 h-4 w-4 text-white/40 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="chamanismo, yoga, reiki..."
                className="flex-1 px-4 py-3 bg-transparent text-white placeholder:text-white/35 focus:outline-none text-sm"
              />
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-white/90 text-warmblack rounded-lg hover:bg-white transition-all duration-300 text-sm font-medium shrink-0 group/btn"
              >
                Buscar
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
              </button>
            </div>
          </form>

          {/* Quick links */}
          <div
            className={`flex flex-wrap items-center gap-x-6 gap-y-2 mt-5 transition-all duration-700 delay-[500ms] ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {["Yoga", "Reiki", "Meditación", "Chamanismo"].map((tag) => (
              <button
                key={tag}
                onClick={() =>
                  router.push(`/mapa?q=${encodeURIComponent(tag.toLowerCase())}`)
                }
                className="text-white/40 text-[13px] font-medium hover:text-white/75 transition-colors duration-300 flex items-center gap-1"
              >
                {tag}
                <ArrowUpRight className="h-3 w-3 opacity-50" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gradient to cream */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cream-50 to-transparent" />
    </section>
  );
}
