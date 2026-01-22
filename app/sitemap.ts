import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://foreverfauxwreaths.co.uk";

  // Static pages
  const staticPages = [
    "",
    "/shop",
    "/bespoke",
    "/gallery",
    "/about",
    "/contact",
    "/info/faqs",
    "/info/reviews",
    "/info/packaging",
    "/legal/privacy",
    "/legal/terms",
    "/legal/cookies",
  ];

  const staticRoutes: MetadataRoute.Sitemap = staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/shop" ? 0.9 : 0.7,
  }));

  return staticRoutes;
}
