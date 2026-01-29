"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <Badge variant="secondary" className="bg-charcoal-100 text-charcoal-500">
        Sold Out
      </Badge>
    );
  }
  if (stock <= 3) {
    return (
      <Badge variant="secondary" className="bg-gold-400/20 text-gold-500">
        Only {stock} left
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="bg-sage-100 text-sage-700">
      In Stock
    </Badge>
  );
}

function ProductSkeleton() {
  return (
    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 animate-pulse">
      <div className="aspect-square bg-cream-200 rounded-lg" />
      <div className="space-y-6">
        <div className="h-8 bg-cream-200 rounded w-3/4" />
        <div className="h-6 bg-cream-200 rounded w-1/4" />
        <div className="space-y-2">
          <div className="h-4 bg-cream-200 rounded" />
          <div className="h-4 bg-cream-200 rounded" />
          <div className="h-4 bg-cream-200 rounded w-2/3" />
        </div>
      </div>
    </div>
  );
}

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;

  // Fetch product from Convex
  const product = useQuery(api.products.getBySlug, { slug });

  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    if (!product || product.stock === 0) return;

    setIsAddingToCart(true);
    // Simulate API call - in real app, use Convex mutation
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsAddingToCart(false);

    toast.success(`${product.title} added to cart`, {
      description: `Quantity: ${quantity}`,
    });
  };

  const nextImage = () => {
    if (!product) return;
    setCurrentImageIndex((prev) =>
      prev === product.imageUrls.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!product) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.imageUrls.length - 1 : prev - 1
    );
  };

  const isLoading = product === undefined;
  const notFound = product === null;

  return (
    <>
      <Header />

      <main className="flex-1 bg-cream-100">
        {/* Breadcrumb */}
        <div className="container-wide py-2 md:py-4">
          <Link
            href="/shop"
            className="inline-flex items-center min-h-[44px] md:min-h-0 px-1 -mx-1 text-sm text-charcoal-500 hover:text-sage-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shop
          </Link>
        </div>

        {/* Product Content */}
        <section className="container-wide pb-16">
          {isLoading ? (
            <ProductSkeleton />
          ) : notFound ? (
            <div className="text-center py-16">
              <h2 className="text-2xl text-charcoal-600 mb-4">Product not found</h2>
              <p className="text-charcoal-500 mb-8">
                Sorry, we couldn&apos;t find the product you&apos;re looking for.
              </p>
              <Button asChild>
                <Link href="/shop">Browse All Products</Link>
              </Button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Image Gallery */}
              <div className="space-y-4">
                {/* Main Image */}
                <div className="relative aspect-square bg-cream-50 rounded-lg overflow-hidden">
                  {product.imageUrls[currentImageIndex] ? (
                    <Image
                      src={product.imageUrls[currentImageIndex]}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-charcoal-400">No image</span>
                    </div>
                  )}

                  {/* Navigation Arrows */}
                  {product.imageUrls.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 h-11 w-11 md:h-10 md:w-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors touch-manipulation"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="h-5 w-5 text-charcoal-600" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 h-11 w-11 md:h-10 md:w-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors touch-manipulation"
                        aria-label="Next image"
                      >
                        <ChevronRight className="h-5 w-5 text-charcoal-600" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                {product.imageUrls.length > 1 && (
                  <div className="flex gap-3">
                    {product.imageUrls.map((url, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                          currentImageIndex === index
                            ? "border-sage-400"
                            : "border-cream-300 hover:border-sage-300"
                        }`}
                      >
                        <Image
                          src={url}
                          alt={`${product.title} thumbnail ${index + 1}`}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <Badge variant="secondary" className="mb-3 bg-sage-100 text-sage-700 capitalize">
                      {product.style}
                    </Badge>
                    <h1 className="text-3xl lg:text-4xl">{product.title}</h1>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-charcoal-400 hover:text-blush-400 hover:bg-blush-400/10"
                  >
                    <Heart className="h-6 w-6" />
                  </Button>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <p className="font-display text-3xl text-charcoal-700">
                    £{product.price}
                  </p>
                  <StockBadge stock={product.stock} />
                </div>

                <p className="text-charcoal-500 leading-relaxed mb-8">
                  {product.description}
                </p>

                {/* Quick Info */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div>
                    <p className="text-xs text-charcoal-400 uppercase tracking-wide mb-1">
                      Size
                    </p>
                    <p className="text-charcoal-600">{product.size}</p>
                  </div>
                  <div>
                    <p className="text-xs text-charcoal-400 uppercase tracking-wide mb-1">
                      Colours
                    </p>
                    <p className="text-charcoal-600 capitalize">{product.colours.join(", ")}</p>
                  </div>
                </div>

                {/* Add to Cart */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-cream-400 rounded-md">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="min-h-[44px] min-w-[44px] flex items-center justify-center text-charcoal-500 hover:text-charcoal-700 hover:bg-cream-100 disabled:opacity-50 transition-colors touch-manipulation"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-12 text-center font-medium text-charcoal-600">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          setQuantity(Math.min(product.stock, quantity + 1))
                        }
                        disabled={quantity >= product.stock}
                        className="min-h-[44px] min-w-[44px] flex items-center justify-center text-charcoal-500 hover:text-charcoal-700 hover:bg-cream-100 disabled:opacity-50 transition-colors touch-manipulation"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <Button
                      size="lg"
                      className="flex-1 bg-sage-400 hover:bg-sage-500 text-white"
                      onClick={handleAddToCart}
                      disabled={product.stock === 0 || isAddingToCart}
                    >
                      {isAddingToCart ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : product.stock === 0 ? (
                        "Sold Out"
                      ) : (
                        <>
                          <ShoppingBag className="h-5 w-5 mr-2" />
                          Add to Cart
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Delivery Info */}
                <Card className="p-4 border-cream-300 bg-sage-50 !gap-0">
                  <div className="flex items-start gap-3">
                    <Truck className="h-5 w-5 text-sage-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-charcoal-600">
                        UK Delivery Available
                      </p>
                      <p className="text-sm text-charcoal-500">
                        Standard delivery from £4.99. Free local collection in
                        Preston.
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Tabs */}
                <Tabs defaultValue="details" className="mt-8">
                  <TabsList className="bg-cream-200">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="shipping">Shipping</TabsTrigger>
                    <TabsTrigger value="care">Care</TabsTrigger>
                  </TabsList>
                  <TabsContent value="details" className="mt-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-charcoal-600 mb-2">
                          Suitable For
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {product.suitableFor.map((item) => (
                            <Badge
                              key={item}
                              variant="secondary"
                              className="bg-cream-200 text-charcoal-500 capitalize"
                            >
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-charcoal-600 mb-2">
                          Materials
                        </h4>
                        <p className="text-sm text-charcoal-500">
                          Premium quality faux florals and foliage on a sturdy base.
                          All materials are carefully selected to ensure a realistic
                          appearance and long-lasting beauty.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="shipping" className="mt-4">
                    <div className="space-y-3 text-sm text-charcoal-500">
                      <p>
                        <strong className="text-charcoal-600">Standard Delivery:</strong>{" "}
                        £4.99 (Small items) / £7.99 (Large items)
                      </p>
                      <p>
                        <strong className="text-charcoal-600">Local Collection:</strong>{" "}
                        Free - Preston, Lancashire
                      </p>
                      <p>
                        <strong className="text-charcoal-600">Processing Time:</strong>{" "}
                        1-3 business days
                      </p>
                      <p>
                        All wreaths are carefully packaged to ensure they arrive in
                        perfect condition.
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent value="care" className="mt-4">
                    <div className="space-y-3 text-sm text-charcoal-500">
                      <p>
                        Your faux floral wreath is designed to be low-maintenance
                        and long-lasting.
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Avoid direct sunlight to prevent fading</li>
                        <li>Dust gently with a soft brush or cloth</li>
                        <li>Store in a cool, dry place when not displayed</li>
                        <li>Keep away from excessive moisture</li>
                      </ul>
                      <p>
                        With proper care, your wreath will bring beauty to your home
                        for years to come.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
