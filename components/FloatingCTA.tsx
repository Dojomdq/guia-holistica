"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { WHATSAPP_LINK } from "@/lib/constants";

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const [nearBottom, setNearBottom] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2000);

    function onScroll() {
      const scrollBottom = window.innerHeight + window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      setNearBottom(scrollBottom >= docHeight - 200);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (pathname === "/mapa" || nearBottom) return null;

  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 right-6 z-50 lg:hidden flex items-center gap-2 px-4 py-3 bg-sage-600 text-white rounded-full shadow-lg hover:bg-terracotta-500 hover:shadow-xl hover:scale-105 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
      }`}
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="text-sm font-medium">WhatsApp</span>
    </a>
  );
}
