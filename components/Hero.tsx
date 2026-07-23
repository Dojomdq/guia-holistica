"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
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
  const [isAnimating, setIsAnimating] = useState(false);
  const [parallaxY, setParallaxY] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const router = useRouter();

  const changeWord = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
      setIsAnimating(false);
    }, 400);
  }, []);

  useEffect(() => {
    setLoaded(true);
    const interval = setInterval(changeWord, 3000);
    return () => clearInterval(interval);
  }, [changeWord]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (sectionRef.current) {
            const rect = sectionRef.current.getBoundingClientRect();
            const scrolled = -rect.top;
            setParallaxY(scrolled * 0.4);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-end overflow-hidden"
    >
      {/* Background image with parallax */}
      <div className="absolute inset-0" style={{ willChange: "transform" }}>
        <div
          className="absolute inset-0"
          style={{
            transform: `translateY(${parallaxY}px) scale(1.15)`,
            willChange: "transform",
          }}
        >
          <Image
            src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1920&q=80&auto=format&fit=crop"
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        {/* Multi-layer gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-warmblack/50 via-warmblack/25 to-warmblack/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-warmblack/40 via-transparent to-warmblack/20" />
      </div>

      {/* Grain texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      {/* Floating orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-[500px] h-[500px] rounded-full blur-[120px] animate-float"
          style={{
            background: "radial-gradient(circle, rgba(93,138,110,0.12) 0%, transparent 70%)",
            top: "10%",
            left: "15%",
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full blur-[100px] animate-float"
          style={{
            background: "radial-gradient(circle, rgba(196,168,130,0.1) 0%, transparent 70%)",
            bottom: "20%",
            right: "10%",
            animationDelay: "3s",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative container-page pb-20 md:pb-28 lg:pb-32 pt-40 w-full">
        <div className="max-w-3xl">
          {/* Location tag */}
          <div
            className={`flex items-center gap-3 mb-8 transition-all duration-1000 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <div className="w-10 h-px bg-sage-400/60" />
            <span className="text-sage-300/80 text-[11px] font-medium tracking-[0.3em] uppercase">
              Mar del Plata, Argentina
            </span>
          </div>

          {/* Main headline with rotating word */}
          <h1
            className={`text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-serif text-white mb-8 leading-[1.05] tracking-tight transition-all duration-1000 delay-200 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Encontrá tu
            <br />
            <span className="relative inline-block h-[1.15em] overflow-hidden align-bottom">
              {/* Rotating word with slide animation */}
              <span
                className={`inline-block relative z-10 text-cream-200 italic transition-all duration-400 ease-out ${
                  isAnimating
                    ? "opacity-0 translate-y-full"
                    : "opacity-100 translate-y-0"
                }`}
                style={{ transitionDuration: "400ms" }}
              >
                {rotatingWords[currentWordIndex]}
              </span>
              {/* Underline accent */}
              <span className="absolute bottom-3 left-0 right-0 h-[3px] bg-sage-400/40 rounded-full" />
              {/* Glow behind word */}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-sage-400/10 blur-xl rounded-full" />
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className={`text-white/45 text-lg sm:text-xl mb-12 max-w-lg leading-relaxed font-light transition-all duration-1000 delay-[400ms] ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Facilitadores, terapeutas y guías de sanación en un solo lugar.
            <br className="hidden sm:block" />
            Explorá, descubrí y conectá con tu esencia.
          </p>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className={`max-w-lg transition-all duration-1000 delay-[600ms] ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-white/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative flex items-center bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden shadow-[0_8px_40px_-12px_rgba(0,0,0,0.3)]">
                <Search className="absolute left-5 h-5 w-5 text-warmblack/25" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="chamanismo, yoga, reiki..."
                  className="flex-1 pl-14 pr-4 py-5 bg-transparent text-warmblack placeholder:text-warmblack/25 focus:outline-none text-base"
                />
                <button
                  type="submit"
                  className="flex items-center gap-2 mr-2 px-6 py-3 bg-warmblack text-white rounded-xl hover:bg-warmblack/85 transition-all duration-300 text-sm font-medium group/btn"
                >
                  Buscar
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </button>
              </div>
            </div>
          </form>

          {/* Quick tags */}
          <div
            className={`flex items-center gap-6 mt-10 transition-all duration-1000 delay-[800ms] ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <span className="text-white/25 text-sm">Explorá por:</span>
            {["Yoga", "Reiki", "Meditación"].map((tag) => (
              <button
                key={tag}
                onClick={() =>
                  router.push(
                    `/mapa?q=${encodeURIComponent(tag.toLowerCase())}`
                  )
                }
                className="text-white/40 text-sm hover:text-white/80 transition-all duration-300 border-b border-white/10 hover:border-white/30 pb-0.5"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade to page background */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-cream-100 via-cream-100/50 to-transparent" />
    </section>
  );
}
