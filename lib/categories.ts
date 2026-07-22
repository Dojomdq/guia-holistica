import {
  Feather,
  Flower2,
  Hand,
  Flame,
  Eye,
  Star,
  Sparkles,
  Leaf,
  Moon,
  Coffee,
  Bell,
  Droplets,
  Hash,
  Wind,
  Trees,
  Heart,
  type LucideIcon,
} from "lucide-react";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  chamanismo: Feather,
  yoga: Flower2,
  reiki: Hand,
  meditacion: Flame,
  tarot: Eye,
  astrologia: Star,
  "sanacion-energetica": Sparkles,
  "terapias-holisticas": Leaf,
  "circulos-de-mujeres": Moon,
  "cacao-ceremonia": Coffee,
  "flores-de-bach": Flower2,
  "sonidos-y-vibraciones": Bell,
  aromaterapia: Droplets,
  numerologia: Hash,
  pranoterapia: Wind,
  "limpieza-energetica": Sparkles,
  "plantas-medicinales": Trees,
  "masajes-terapeuticos": Heart,
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
  "flores-de-bach": "bg-rose-50 border-rose-200 text-rose-700",
  "sonidos-y-vibraciones": "bg-cyan-50 border-cyan-200 text-cyan-700",
  aromaterapia: "bg-emerald-50 border-emerald-200 text-emerald-700",
  numerologia: "bg-amber-50 border-amber-200 text-amber-700",
  pranoterapia: "bg-sky-50 border-sky-200 text-sky-700",
  "limpieza-energetica": "bg-violet-50 border-violet-200 text-violet-700",
  "plantas-medicinales": "bg-lime-50 border-lime-200 text-lime-700",
  "masajes-terapeuticos": "bg-teal-50 border-teal-200 text-teal-700",
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
  "flores-de-bach": "#be123c",
  "sonidos-y-vibraciones": "#0891b2",
  aromaterapia: "#059669",
  numerologia: "#d97706",
  pranoterapia: "#0284c7",
  "limpieza-energetica": "#6d28d9",
  "plantas-medicinales": "#65a30d",
  "masajes-terapeuticos": "#0d9488",
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
