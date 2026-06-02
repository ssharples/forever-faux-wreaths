"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QuickAddButton } from "@/components/shop/quick-add-button";
import type { FeaturedProduct } from "@/lib/storefront";
import { MADE_TO_ORDER_LEAD_TIME } from "@/lib/made-to-order";

type FeaturedProductsProps = {
  products: FeaturedProduct[];
};

function buildBespokeHref(product: FeaturedProduct) {
  const params = new URLSearchParams({
    productId: product._id,
    productTitle: product.title,
    productSlug: product.slug,
    productStyle: product.style,
    productSize: product.size,
    productColours: product.colours.join(", "),
  });
  return `/bespoke?${params.toString()}`;
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {featuredProducts.map((product) => (
        <Card
          key={product._id}
          className="group relative overflow-hidden border-cream-300 bg-white transition-colors hover:border-sage-300 !gap-0 !p-0"
        >
          <Link
            href={`/shop/${product.slug}`}
            className="absolute inset-0 z-10"
            aria-label={`View ${product.title}`}
          />
          <div className="pointer-events-none">
            <div className="aspect-square relative bg-cream-50 overflow-hidden">
              {product.imageUrls[0] ? (
                <Image
                  src={product.imageUrls[0]}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-cream-200">
                  <span className="text-charcoal-400">No image</span>
                </div>
              )}
              {product.featured && (
                <Badge className="absolute top-3 left-3 bg-sage-400 hover:bg-sage-400 text-white z-10">
                  Featured
                </Badge>
              )}
              <div className="absolute inset-0 bg-charcoal-900/0 group-hover:bg-charcoal-900/5 transition-colors" />
            </div>
            <CardContent className="p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-charcoal-400 mb-1">
                {product.categoryName ?? product.style}
              </p>
              <h3 className="font-medium text-charcoal-600 group-hover:text-sage-600 transition-colors line-clamp-2 text-sm sm:text-base">
                {product.title}
              </h3>
              <div className="mt-1 flex items-center justify-between gap-2">
                <p className="font-display text-lg text-charcoal-700">
                  £{product.price}
                </p>
                <Badge variant="secondary" className="bg-sage-100 text-sage-700">
                  Made to order
                </Badge>
              </div>
              <p className="mt-1 text-xs text-charcoal-500">
                Ready in {MADE_TO_ORDER_LEAD_TIME}
              </p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                <QuickAddButton
                  productId={product._id}
                  productTitle={product.title}
                  className="pointer-events-auto z-20 min-h-10 bg-sage-400 text-white hover:bg-sage-500"
                />
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="pointer-events-auto z-20 min-h-10 border-sage-300 text-sage-700 hover:bg-sage-50"
                >
                  <Link href={buildBespokeHref(product)}>Customise</Link>
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  );
}
