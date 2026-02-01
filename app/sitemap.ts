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

  // Collection pages
  const collectionPages = [
    "/collections",
    "/collections/memorial-wreaths",
    "/collections/funeral-wreaths",
    "/collections/door-wreaths",
    "/collections/christmas-wreaths",
    "/collections/autumn-wreaths",
  ];

  // Service area pages
  const serviceAreaPages = [
    "/service-areas",
    "/service-areas/preston",
    "/service-areas/lancashire",
    "/service-areas/manchester",
  ];

  // Guide pages
  const guidePages = [
    "/guides",
    "/guides/choosing-funeral-wreath",
    "/guides/faux-vs-fresh-wreaths",
  ];

  const staticRoutes: MetadataRoute.Sitemap = staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/shop" ? 0.9 : 0.7,
  }));

  const collectionRoutes: MetadataRoute.Sitemap = collectionPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "/collections" ? 0.85 : 0.8,
  }));

  const serviceAreaRoutes: MetadataRoute.Sitemap = serviceAreaPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const guideRoutes: MetadataRoute.Sitemap = guidePages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...collectionRoutes,
    ...serviceAreaRoutes,
    ...guideRoutes,
  ];
}
