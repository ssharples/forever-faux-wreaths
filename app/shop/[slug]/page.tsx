import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductPageClient } from "@/components/shop/product-page-client";
import { StructuredData } from "@/components/seo/structured-data";
import { absoluteUrl } from "@/lib/site-url";
import { getPublicProductBySlug } from "@/lib/storefront";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

function buildProductDescription(description: string) {
  return description.length > 160
    ? `${description.slice(0, 157).trimEnd()}...`
    : description;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublicProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | Forever Faux Wreaths",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const description = buildProductDescription(product.description);
  const canonicalPath = `/shop/${product.slug}`;

  return {
    title: `${product.title} | Forever Faux Wreaths`,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: `${product.title} | Forever Faux Wreaths`,
      description,
      url: canonicalPath,
      type: "website",
      images: product.imageUrls[0]
        ? [
            {
              url: product.imageUrls[0],
              alt: product.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} | Forever Faux Wreaths`,
      description,
      images: product.imageUrls[0] ? [product.imageUrls[0]] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getPublicProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const productUrl = absoluteUrl(`/shop/${product.slug}`);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    sku: product.slug,
    image: product.imageUrls,
    category: product.categoryName ?? undefined,
    brand: {
      "@type": "Brand",
      name: "Forever Faux Wreaths",
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "GBP",
      price: product.price.toFixed(2),
      availability: "https://schema.org/PreOrder",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "Forever Faux Wreaths",
      },
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
      {
        "@type": "ListItem",
        position: 3,
        name: product.title,
        item: productUrl,
      },
    ],
  };

  return (
    <>
      <StructuredData data={[productSchema, breadcrumbSchema]} />
      <ProductPageClient product={product} />
    </>
  );
}
