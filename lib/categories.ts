import {
  Wand2,
  Flower2,
  HeartHandshake,
  Brain,
  Eye,
  Star,
  Zap,
  Leaf,
  Users,
  Coffee,
  Flower,
  Music,
  Droplets,
  Hash,
  Wind,
  Trees,
  Heart,
  Sparkles,
  Dumbbell,
  Camera,
  Home,
  type LucideIcon,
} from "lucide-react";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  chamanismo: Wand2,
  yoga: Flower2,
  reiki: HeartHandshake,
  meditacion: Brain,
  tarot: Eye,
  astrologia: Star,
  "sanacion-energetica": Zap,
  "terapias-holisticas": Leaf,
  "circulos-de-mujeres": Users,
  "cacao-ceremonia": Coffee,
  "flores-de-bach": Flower,
  "sonidos-y-vibraciones": Music,
  aromaterapia: Droplets,
  numerologia: Hash,
  pranoterapia: Wind,
  "limpieza-energetica": Sparkles,
  "plantas-medicinales": Trees,
  "masajes-terapeuticos": Heart,
  biodanza: Music,
  solidarios: HeartHandshake,
  "artes-marciales-no-competitivas": Dumbbell,
  "terapias-holisticas-alternativas": Leaf,
  servicios: Camera,
  "alquiler-espacios": Home,
  kung: Dumbbell,
  aikido: Dumbbell,
  "pa-kua": Dumbbell,
  tai: Dumbbell,
};

export const CATEGORY_COLORS: Record<string, string> = {
  chamanismo: "bg-amber-50 border-amber-200 text-amber-700",
  yoga: "bg-purple-50 border-purple-200 text-purple-700",
  reiki: "bg-sky-50 border-sky-200 text-sky-700",
  meditacion: "bg-indigo-50 border-indigo-200 text-indigo-700",
  tarot: "bg-violet-50 border-violet-200 text-violet-700",
  astrologia: "bg-yellow-50 border-yellow-200 text-yellow-700",
  "sanacion-energetica": "bg-pink-50 border-pink-200 text-pink-700",
  "terapias-holisticas": "bg-green-50 border-green-200 text-green-700",
  "circulos-de-mujeres": "bg-rose-50 border-rose-200 text-rose-700",
  "cacao-ceremonia": "bg-orange-50 border-orange-200 text-orange-700",
  "flores-de-bach": "bg-pink-50 border-pink-200 text-pink-700",
  "sonidos-y-vibraciones": "bg-cyan-50 border-cyan-200 text-cyan-700",
  aromaterapia: "bg-emerald-50 border-emerald-200 text-emerald-700",
  numerologia: "bg-indigo-50 border-indigo-200 text-indigo-700",
  pranoterapia: "bg-cyan-50 border-cyan-200 text-cyan-700",
  "limpieza-energetica": "bg-violet-50 border-violet-200 text-violet-700",
  "plantas-medicinales": "bg-lime-50 border-lime-200 text-lime-700",
  "masajes-terapeuticos": "bg-teal-50 border-teal-200 text-teal-700",
  biodanza: "bg-rose-50 border-rose-200 text-rose-700",
  solidarios: "bg-amber-50 border-amber-200 text-amber-700",
  "artes-marciales-no-competitivas": "bg-red-50 border-red-200 text-red-700",
  "terapias-holisticas-alternativas": "bg-green-50 border-green-200 text-green-700",
  servicios: "bg-stone-50 border-stone-200 text-stone-700",
  "alquiler-espacios": "bg-amber-50 border-amber-200 text-amber-700",
};

export const CATEGORY_MARKER_COLORS: Record<string, string> = {
  chamanismo: "#d97706",
  yoga: "#6d28d9",
  reiki: "#0369a1",
  meditacion: "#4338ca",
  tarot: "#6d28d9",
  astrologia: "#a16207",
  "sanacion-energetica": "#be185d",
  "terapias-holisticas": "#15803d",
  "circulos-de-mujeres": "#be123c",
  "cacao-ceremonia": "#c2410c",
  "flores-de-bach": "#be185d",
  "sonidos-y-vibraciones": "#0891b2",
  aromaterapia: "#059669",
  numerologia: "#d97706",
  pranoterapia: "#0284c7",
  "limpieza-energetica": "#6d28d9",
  "plantas-medicinales": "#65a30d",
  "masajes-terapeuticos": "#0d9488",
  biodanza: "#e11d48",
  solidarios: "#d97706",
  "artes-marciales-no-competitivas": "#dc2626",
  "terapias-holisticas-alternativas": "#15803d",
  servicios: "#78716c",
  "alquiler-espacios": "#b45309",
  kung: "#dc2626",
  aikido: "#dc2626",
  "pa-kua": "#dc2626",
  tai: "#dc2626",
};

export function getCategoryIcon(slug: string): LucideIcon {
  for (const [key, Icon] of Object.entries(CATEGORY_ICONS)) {
    if (slug.includes(key)) return Icon;
  }
  return Leaf;
}

export function getMarkerColor(slug: string): string {
  for (const [key, color] of Object.entries(CATEGORY_MARKER_COLORS)) {
    if (slug.includes(key)) return color;
  }
  return "#15803d";
}

export function getCategoryColor(slug: string): string {
  for (const [key, color] of Object.entries(CATEGORY_COLORS)) {
    if (slug.includes(key)) return color;
  }
  return "bg-stone-50 border-stone-200 text-stone-700";
}

export const EMOJIS: Record<string, string> = {
  yoga: "🧘", reiki: "🖐️", meditacion: "🧠", chamanismo: "🪶",
  tarot: "🔮", astrologia: "⭐", "sanacion-energetica": "✨",
  "terapias-holisticas": "🌿", biodanza: "💃", aromaterapia: "🌸",
  "circulos-de-mujeres": "🌙", "cacao-ceremonia": "🍫",
  "flores-de-bach": "🌼", "sonidos-y-vibraciones": "🔔",
  numerologia: "🔢", pranoterapia: "🌀", "limpieza-energetica": "💫",
  "plantas-medicinales": "🌱", "masajes-terapeuticos": "💆",
  solidarios: "🤝",
  "artes-marciales-no-competitivas": "🥋",
  "terapias-holisticas-alternativas": "🌿",
  servicios: "📸",
  "alquiler-espacios": "🏠",
  kung: "🥋",
  aikido: "🥋",
  "pa-kua": "🥋",
  tai: "🥋",
};

export function getEmoji(slug: string): string {
  for (const [key, emoji] of Object.entries(EMOJIS)) {
    if (slug.includes(key)) return emoji;
  }
  return "🌿";
}

export const CATEGORY_SVG_PATHS: Record<string, string[]> = {
  chamanismo: [
    "m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.21 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72",
    "m14 7 3 3",
    "M5 6v4",
    "M19 14v4",
    "M10 2v2",
    "M7 8H3",
    "M21 16h-4",
    "M11 3H9",
  ],
  yoga: [
    "M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v1M9 8a3 3 0 1 0 3 3M9 8h1m5 0a3 3 0 1 1-3 3m3-3h-1m-2 3v-1",
    "M12 10v12",
    "M12 22c4.2 0 7-1.667 7-5-4.2 0-7 1.667-7 5Z",
    "M12 22c-4.2 0-7-1.667-7-5 4.2 0 7 1.667 7 5Z",
  ],
  reiki: [
    "M19.414 14.414C21 12.828 22 11.5 22 9.5a5.5 5.5 0 0 0-9.591-3.676.6.6 0 0 1-.818.001A5.5 5.5 0 0 0 2 9.5c0 2.3 1.5 4 3 5.5l5.535 5.362a2 2 0 0 0 2.879.052 2.12 2.12 0 0 0-.004-3 2.124 2.124 0 1 0 3-3 2.124 2.124 0 0 0 3.004 0 2 2 0 0 0 0-2.828l-1.881-1.882a2.41 2.41 0 0 0-3.409 0l-1.71 1.71a2 2 0 0 1-2.828 0 2 2 0 0 1 0-2.828l2.823-2.762",
  ],
  meditacion: [
    "M12 18V5",
    "M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4",
    "M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5",
    "M17.997 5.125a4 4 0 0 1 2.526 5.77",
    "M18 18a4 4 0 0 0 2-7.464",
    "M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517",
    "M6 18a4 4 0 0 1-2-7.464",
    "M6.003 5.125a4 4 0 0 0-2.526 5.77",
  ],
  tarot: [
    "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
  ],
  astrologia: [
    "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
  ],
  "sanacion-energetica": [
    "M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z",
  ],
  "terapias-holisticas": [
    "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z",
    "M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12",
  ],
  "circulos-de-mujeres": [
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
    "M16 3.128a4 4 0 0 1 0 7.744",
    "M22 21v-2a4 4 0 0 0-3-3.87",
  ],
  "cacao-ceremonia": [
    "M10 2v2",
    "M14 2v2",
    "M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1",
    "M6 2v2",
  ],
  "flores-de-bach": [
    "M12 16.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 1 1 12 7.5a4.5 4.5 0 1 1 4.5 4.5 4.5 4.5 0 1 1-4.5 4.5",
    "M12 7.5V9",
    "M7.5 12H9",
    "M16.5 12H15",
    "M12 16.5V15",
    "m8 8 1.88 1.88",
    "M14.12 9.88 16 8",
    "m8 16 1.88-1.88",
    "M14.12 14.12 16 16",
  ],
  "sonidos-y-vibraciones": ["M9 18V5l12-2v13"],
  aromaterapia: [
    "M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z",
    "M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97",
  ],
  numerologia: [
    "M4 9L20 9",
    "M4 15L20 15",
    "M10 3L8 21",
    "M16 3L14 21",
  ],
  pranoterapia: [
    "M12.8 19.6A2 2 0 1 0 14 16H2",
    "M17.5 8a2.5 2.5 0 1 1 2 4H2",
    "M9.8 4.4A2 2 0 1 1 11 8H2",
  ],
  "limpieza-energetica": [
    "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",
    "M20 2v4",
    "M22 4h-4",
  ],
  "plantas-medicinales": [
    "M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z",
    "M7 16v6",
    "M13 19v3",
    "M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5",
  ],
  "masajes-terapeuticos": [
    "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5",
  ],
  artes_marciales: [
    "M17.596 12.768a2 2 0 1 0 2.829-2.829l-1.768-1.767a2 2 0 0 0 2.828-2.829l-2.828-2.828a2 2 0 0 0-2.829 2.828l-1.767-1.768a2 2 0 1 0-2.829 2.829z",
    "m2.5 21.5 1.4-1.4",
    "m20.1 3.9 1.4-1.4",
    "M5.343 21.485a2 2 0 1 0 2.829-2.828l1.767 1.768a2 2 0 1 0 2.829-2.829l-6.364-6.364a2 2 0 1 0-2.829 2.829l1.768 1.767a2 2 0 0 0-2.828 2.829z",
    "m9.6 14.4 4.8-4.8",
  ],
  servicios: [
    "M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z",
  ],
  "alquiler-espacios": [
    "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",
    "M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  ],
};

export function getCategoryIconSVG(slug: string): string {
  for (const [key, paths] of Object.entries(CATEGORY_SVG_PATHS)) {
    if (slug.includes(key)) {
      return paths
        .map((d) => `<path d="${d}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`)
        .join("");
    }
  }
  // Default: leaf icon
  return `<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
}
