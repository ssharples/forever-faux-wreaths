import { ShopPageClient } from "@/components/shop/shop-page-client";
import { StructuredData } from "@/components/seo/structured-data";
import { absoluteUrl } from "@/lib/site-url";
import { getActiveProducts } from "@/lib/storefront";

export default async function ShopPage() {
  const products = await getActiveProducts();

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Shop Wreaths",
    url: absoluteUrl("/shop"),
    description:
      "Browse our collection of handcrafted faux floral wreaths, each made with love in Preston, Lancashire.",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(`/shop/${product.slug}`),
        name: product.title,
        image: product.imageUrls[0],
      })),
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Shop",
        item: absoluteUrl("/shop"),
      },
    ],
  };

  return (
    <>
      <StructuredData data={[collectionSchema, breadcrumbSchema]} />
      <ShopPageClient initialProducts={products} />
    </>
  );
}
