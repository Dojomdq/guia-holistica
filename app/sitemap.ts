import { createClient } from "@supabase/supabase-js";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://www.agenciakoi.com";

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/mapa`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/actividades`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/facilitadores`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ];

  let dynamicPages: MetadataRoute.Sitemap = [];

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (url && key) {
      const supabase = createClient(url, key);
      const { data: facilitadores } = await supabase
        .from("facilitadores")
        .select("id")
        .eq("activo", true);
      dynamicPages = (facilitadores || []).map((f) => ({
        url: `${base}/facilitadores/${f.id}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }));
    }
  } catch {
    // Fallback: return only static pages if Supabase is unreachable at build time
  }

  return [...staticPages, ...dynamicPages];
}
