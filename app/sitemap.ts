import { createClient } from "@supabase/supabase-js";
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_URL;

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

      const [{ data: facilitadores }, { data: categorias }] = await Promise.all([
        supabase.from("facilitadores").select("id").eq("activo", true),
        supabase.from("categorias").select("slug"),
      ]);

      dynamicPages = [
        ...(facilitadores || []).map((f) => ({
          url: `${base}/facilitadores/${f.id}`,
          lastModified: new Date(),
          changeFrequency: "monthly" as const,
          priority: 0.6,
        })),
        ...(categorias || []).map((c) => ({
          url: `${base}/actividades/${c.slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.7,
        })),
      ];
    }
  } catch {
    // Fallback
  }

  return [...staticPages, ...dynamicPages];
}
