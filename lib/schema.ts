// Schema.org structured data helpers for SEO

export interface LocalBusinessSchema {
  "@context": "https://schema.org";
  "@type": "LocalBusiness";
  name: string;
  image?: string;
  address: {
    "@type": "PostalAddress";
    addressLocality: string;
    addressRegion: string;
    addressCountry: string;
  };
  geo?: {
    "@type": "GeoCoordinates";
    latitude: number;
    longitude: number;
  };
  url: string;
  telephone?: string;
  email?: string;
  priceRange: string;
  description?: string;
  sameAs?: string[];
}

export interface ProductSchema {
  "@context": "https://schema.org";
  "@type": "Product";
  name: string;
  image: string[];
  description: string;
  sku?: string;
  brand?: {
    "@type": "Brand";
    name: string;
  };
  offers: {
    "@type": "Offer";
    price: number;
    priceCurrency: string;
    availability: string;
    seller?: {
      "@type": "Organization";
      name: string;
    };
  };
}

export interface FAQSchema {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: Array<{
    "@type": "Question";
    name: string;
    acceptedAnswer: {
      "@type": "Answer";
      text: string;
    };
  }>;
}

export interface CollectionPageSchema {
  "@context": "https://schema.org";
  "@type": "CollectionPage";
  name: string;
  description: string;
  url: string;
  mainEntity?: {
    "@type": "ItemList";
    numberOfItems: number;
    itemListElement: Array<{
      "@type": "ListItem";
      position: number;
      url: string;
      name: string;
    }>;
  };
}

export interface BreadcrumbSchema {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item?: string;
  }>;
}

// Helper functions to generate schema

export function generateLocalBusinessSchema(): LocalBusinessSchema {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Forever Faux Wreaths",
    image: "https://foreverfauxwreaths.co.uk/images/logo.png",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Preston",
      addressRegion: "Lancashire",
      addressCountry: "GB",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 53.7632,
      longitude: -2.7031,
    },
    url: "https://foreverfauxwreaths.co.uk",
    email: "Info@foreverfauxwreaths.co.uk",
    priceRange: "££",
    description:
      "Handcrafted faux floral wreaths made with love in Preston, Lancashire. Specialising in memorial wreaths, door wreaths, and bespoke designs.",
    sameAs: [
      "https://facebook.com/foreverfauxwreaths",
      "https://instagram.com/foreverfauxwreaths",
      "https://tiktok.com/@foreverfauxwreaths",
    ],
  };
}

export function generateProductSchema(product: {
  title: string;
  description: string;
  price: number;
  imageUrls: string[];
  stock: number;
  slug: string;
}): ProductSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.imageUrls,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: "Forever Faux Wreaths",
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "GBP",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Forever Faux Wreaths",
      },
    },
  };
}

export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
): FAQSchema {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateCollectionPageSchema(
  name: string,
  description: string,
  url: string,
  items?: Array<{ url: string; name: string }>
): CollectionPageSchema {
  const schema: CollectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url,
  };

  if (items && items.length > 0) {
    schema.mainEntity = {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: item.url,
        name: item.name,
      })),
    };
  }

  return schema;
}

export function generateBreadcrumbSchema(
  breadcrumbs: Array<{ name: string; url?: string }>
): BreadcrumbSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      ...(crumb.url ? { item: crumb.url } : {}),
    })),
  };
}
