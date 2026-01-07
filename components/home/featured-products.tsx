"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-square bg-cream-200 rounded-t-xl" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-cream-200 rounded w-3/4" />
        <div className="h-4 bg-cream-200 rounded w-1/2" />
      </div>
    </div>
  );
}

export function FeaturedProducts() {
  const products = useQuery(api.products.getFeatured);
  const isLoading = products === undefined;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(4)].map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Only show first 4 featured products
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {featuredProducts.map((product) => (
        <Link key={product._id} href={`/shop/${product.slug}`}>
          <Card className="group overflow-hidden border-cream-300 hover:border-sage-300 transition-colors bg-white !p-0 !gap-0">
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
              <h3 className="font-medium text-charcoal-600 group-hover:text-sage-600 transition-colors line-clamp-2 text-sm sm:text-base">
                {product.title}
              </h3>
              <p className="mt-1 font-display text-lg text-charcoal-700">
                £{product.price}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
