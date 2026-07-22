import { createClient } from "@supabase/supabase-js";
import type { MetadataRoute } from "next";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://www.agenciakoi.com";

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/mapa`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/actividades`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/facilitadores`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ];

  const { data: facilitadores } = await supabase
    .from("facilitadores")
    .select("id")
    .eq("activo", true);

  const dynamicPages: MetadataRoute.Sitemap =
    (facilitadores || []).map((f) => ({
      url: `${base}/facilitadores/${f.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  return [...staticPages, ...dynamicPages];
}
