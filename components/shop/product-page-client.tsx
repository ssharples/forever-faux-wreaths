"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCartSession } from "@/lib/cart-session";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ShieldCheck,
  Clock3,
  Sparkles,
} from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import type { PublicProduct } from "@/lib/storefront";
import {
  MADE_TO_ORDER_LEAD_TIME,
  MAX_ORDER_QUANTITY_PER_PRODUCT,
} from "@/lib/made-to-order";

function buildBespokeHref(product: PublicProduct) {
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

function MadeToOrderBadge() {
  return (
    <Badge variant="secondary" className="bg-sage-100 text-sage-700">
      Made to order
    </Badge>
  );
}

type ProductPageClientProps = {
  product: PublicProduct;
};

export function ProductPageClient({ product }: ProductPageClientProps) {
  const sessionId = useCartSession();
  const addToCart = useMutation(api.cart.addItem);

  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    if (!sessionId) return;

    setIsAddingToCart(true);
    try {
      await addToCart({
        sessionId,
        productId: product._id,
        quantity,
      });
      toast.success(`${product.title} added to cart`, {
        description: `Quantity: ${quantity}`,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to add to cart";
      toast.error(message);
    }
    setIsAddingToCart(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === product.imageUrls.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.imageUrls.length - 1 : prev - 1
    );
  };

  const addToCartLabel = isAddingToCart ? "Adding..." : "Add to Cart";

  return (
    <>
      <Header />

      <main className="flex-1 bg-cream-100 pb-28 md:pb-0">
        <div className="container-wide py-4">
          <Link
            href="/shop"
            className="inline-flex items-center text-sm text-charcoal-500 hover:text-sage-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shop
          </Link>
        </div>

        <section className="container-wide pb-16">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-cream-50">
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
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-charcoal-400">No image</span>
                  </div>
                )}

                {product.imageUrls.length > 1 && (
                  <>
                    <button
                      type="button"
                      aria-label="View previous product image"
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-md transition-colors hover:bg-white"
                    >
                      <ChevronLeft className="h-5 w-5 text-charcoal-600" />
                    </button>
                    <button
                      type="button"
                      aria-label="View next product image"
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-md transition-colors hover:bg-white"
                    >
                      <ChevronRight className="h-5 w-5 text-charcoal-600" />
                    </button>
                  </>
                )}
              </div>

              {product.imageUrls.length > 1 && (
                <div className="flex gap-3">
                  {product.imageUrls.map((url, index) => (
                    <button
                      key={url}
                      type="button"
                      aria-label={`Show ${product.title} image ${index + 1}`}
                      aria-pressed={currentImageIndex === index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-20 w-20 overflow-hidden rounded-md border-2 transition-colors ${
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
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="rounded-lg border border-cream-300 bg-white p-6 sm:p-8">
                <div className="mb-3 flex flex-wrap gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-sage-100 text-sage-700 capitalize"
                  >
                    {product.style}
                  </Badge>
                  {product.categoryName && (
                    <Badge
                      variant="secondary"
                      className="bg-cream-200 text-charcoal-500"
                    >
                      {product.categoryName}
                    </Badge>
                  )}
                </div>

                <h1 className="text-3xl lg:text-4xl">{product.title}</h1>

                <div className="mt-6 flex items-center gap-4">
                  <p className="font-display text-3xl text-charcoal-700">
                    £{product.price}
                  </p>
                  <MadeToOrderBadge />
                </div>

                <p className="mt-3 text-sm text-charcoal-500">
                  Handmade to order. Please allow {MADE_TO_ORDER_LEAD_TIME} before delivery or collection.
                </p>

                <p className="mt-6 text-charcoal-500 leading-relaxed">
                  {product.description}
                </p>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div>
                    <p className="mb-1 text-xs uppercase tracking-wide text-charcoal-400">
                      Size
                    </p>
                    <p className="text-charcoal-600">{product.size}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs uppercase tracking-wide text-charcoal-400">
                      Colours
                    </p>
                    <p className="text-charcoal-600 capitalize">
                      {product.colours.join(", ")}
                    </p>
                  </div>
                </div>

                <div className="mt-8 rounded-lg border border-sage-200 bg-sage-50 p-4 sm:p-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center rounded-md border border-cream-400 bg-white">
                      <button
                        type="button"
                        aria-label={`Decrease quantity of ${product.title}`}
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="p-3 text-charcoal-500 hover:text-charcoal-700 disabled:opacity-50"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span
                        aria-live="polite"
                        className="w-12 text-center font-medium text-charcoal-600"
                      >
                        {quantity}
                      </span>
                      <button
                        type="button"
                        aria-label={`Increase quantity of ${product.title}`}
                        onClick={() =>
                          setQuantity(
                            Math.min(MAX_ORDER_QUANTITY_PER_PRODUCT, quantity + 1)
                          )
                        }
                        disabled={quantity >= MAX_ORDER_QUANTITY_PER_PRODUCT}
                        className="p-3 text-charcoal-500 hover:text-charcoal-700 disabled:opacity-50"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <Button
                      size="lg"
                      className="min-h-12 flex-1 bg-sage-400 text-white hover:bg-sage-500"
                      onClick={handleAddToCart}
                      disabled={isAddingToCart}
                    >
                      {isAddingToCart ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          {addToCartLabel}
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="mr-2 h-5 w-5" />
                          {addToCartLabel}
                        </>
                      )}
                    </Button>
                  </div>

                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="mt-3 min-h-12 w-full border-sage-300 text-sage-700 hover:bg-sage-50"
                  >
                    <Link href={buildBespokeHref(product)}>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Customise this wreath
                    </Link>
                  </Button>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-lg bg-white p-3">
                      <div className="flex items-center gap-2 text-charcoal-700">
                        <Truck className="h-4 w-4 text-sage-500" />
                        <span className="text-sm font-medium">UK delivery</span>
                      </div>
                      <p className="mt-1 text-xs text-charcoal-500">
                        From £4.99, packed carefully.
                      </p>
                    </div>
                    <div className="rounded-lg bg-white p-3">
                      <div className="flex items-center gap-2 text-charcoal-700">
                        <Clock3 className="h-4 w-4 text-sage-500" />
                        <span className="text-sm font-medium">Made to order</span>
                      </div>
                      <p className="mt-1 text-xs text-charcoal-500">
                        Usually ready in {MADE_TO_ORDER_LEAD_TIME}.
                      </p>
                    </div>
                    <div className="rounded-lg bg-white p-3">
                      <div className="flex items-center gap-2 text-charcoal-700">
                        <ShieldCheck className="h-4 w-4 text-sage-500" />
                        <span className="text-sm font-medium">Secure checkout</span>
                      </div>
                      <p className="mt-1 text-xs text-charcoal-500">
                        Stripe checkout with secure payment.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Card className="mt-4 border-cream-300 bg-sage-50 p-4 !gap-0">
                <div className="flex items-start gap-3">
                  <Truck className="mt-0.5 h-5 w-5 text-sage-500" />
                  <div>
                    <p className="font-medium text-charcoal-600">
                      UK Delivery Available
                    </p>
                    <p className="text-sm text-charcoal-500">
                      Standard delivery from £4.99. Free local collection in Preston.
                      All wreaths are made to order before dispatch.
                    </p>
                  </div>
                </div>
              </Card>

              <Tabs defaultValue="details" className="mt-8">
                <TabsList className="bg-cream-200">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="shipping">Shipping</TabsTrigger>
                  <TabsTrigger value="care">Care</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="mt-4">
                  <div className="space-y-4">
                    <div>
                      <h2 className="mb-2 font-medium text-charcoal-600">
                        Suitable For
                      </h2>
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
                      <h2 className="mb-2 font-medium text-charcoal-600">
                        Materials
                      </h2>
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
                      {MADE_TO_ORDER_LEAD_TIME}
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
                      Your faux floral wreath is designed to be low-maintenance and
                      long-lasting.
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
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-cream-300 bg-cream-50/95 px-4 py-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-charcoal-700">
              {product.title}
            </p>
            <div className="mt-0.5 flex items-center gap-2">
              <span className="font-display text-xl text-charcoal-700">
                £{product.price}
              </span>
              <span className="text-xs text-charcoal-500">Qty {quantity}</span>
            </div>
          </div>
          <Button
            className="min-h-12 shrink-0 bg-sage-400 px-5 text-white hover:bg-sage-500"
            onClick={handleAddToCart}
            disabled={isAddingToCart}
          >
            {isAddingToCart ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>

      <Footer />
    </>
  );
}
