import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { getIndexableProducts } from "@/lib/storefront";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const products = await getIndexableProducts();

  const staticPages = [
    "",
    "/memorial-topper",
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
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/shop" ? 0.9 : 0.7,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/shop/${product.slug}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
