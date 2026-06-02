import { HomePageClient } from "@/components/home/home-page-client";
import { StructuredData } from "@/components/seo/structured-data";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { absoluteUrl } from "@/lib/site-url";
import { getFeaturedProducts } from "@/lib/storefront";

export default async function HomePage() {
  const [featuredProducts, reviews, galleryImages] = await Promise.all([
    getFeaturedProducts(),
    fetchQuery(api.reviews.getVisible, {}).then((items) => items.slice(0, 3)),
    fetchQuery(api.galleryImages.getVisible, {}).then((items) => items.slice(0, 4)),
  ]);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Featured Wreaths",
    itemListElement: featuredProducts.slice(0, 4).map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/shop/${product.slug}`),
      name: product.title,
      image: product.imageUrls[0],
    })),
  };

  return (
    <>
      <StructuredData data={itemListSchema} />
      <HomePageClient
        featuredProducts={featuredProducts}
        featuredReviews={reviews}
        featuredGalleryImages={galleryImages}
      />
    </>
  );
}
