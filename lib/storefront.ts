import { cache } from "react";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { MADE_TO_ORDER_LEAD_TIME, MAX_ORDER_QUANTITY_PER_PRODUCT } from "@/lib/made-to-order";

export { MADE_TO_ORDER_LEAD_TIME, MAX_ORDER_QUANTITY_PER_PRODUCT };

export const getActiveProducts = cache(async () => {
  return await fetchQuery(api.products.list, { status: "active" });
});

export const getIndexableProducts = getActiveProducts;

export const getFeaturedProducts = cache(async () => {
  return await fetchQuery(api.products.getFeatured, {});
});

export const getPublicProductBySlug = cache(async (slug: string) => {
  const product = await fetchQuery(api.products.getBySlug, { slug });
  if (!product || product.status !== "active") {
    return null;
  }
  return product;
});

export type ShopProduct = Awaited<ReturnType<typeof getActiveProducts>>[number];
export type FeaturedProduct = Awaited<
  ReturnType<typeof getFeaturedProducts>
>[number];
export type PublicProduct = NonNullable<
  Awaited<ReturnType<typeof getPublicProductBySlug>>
>;
