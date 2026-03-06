"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Loader2, Minus, Plus, Sparkles, Trash2 } from "lucide-react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCartSession } from "@/lib/cart-session";
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import type { Id } from "@/convex/_generated/dataModel";

export default function CartPage() {
  const sessionId = useCartSession();
  const cart = useQuery(
    api.cart.getWithProducts,
    sessionId ? { sessionId } : "skip"
  );
  const updateItemQuantity = useMutation(api.cart.updateItemQuantity);
  const removeItemMutation = useMutation(api.cart.removeItem);
  const createCheckoutSession = useAction(api.stripe.createCheckoutSession);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<"collection" | "standard">("collection");

  const cartItems = cart?.items ?? [];
  const isEmpty = cartItems.length === 0;
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const hasLargeItems = cartItems.some(item => item.product.sizeCategory === "large");

  // Determine delivery cost based on largest item
  let deliveryCost = 0;
  if (deliveryMethod !== "collection") {
    deliveryCost = hasLargeItems ? 7.99 : 4.99;
  }

  const total = subtotal + deliveryCost;

  const updateQuantity = async (productId: Id<"products">, newQuantity: number) => {
    if (!sessionId) return;
    if (newQuantity < 1) {
      removeItem(productId);
      return;
    }
    try {
      await updateItemQuantity({ sessionId, productId, quantity: newQuantity });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update quantity";
      toast.error(message);
    }
  };

  const removeItem = async (productId: Id<"products">) => {
    if (!sessionId) return;
    await removeItemMutation({ sessionId, productId });
    toast.success("Item removed from cart");
  };

  const handleCheckout = async () => {
    if (!sessionId || !cart?.items.length) return;
    setIsCheckingOut(true);
    try {
      const result = await createCheckoutSession({
        items: cart.items.map((item) => ({
          productId: item.product._id,
          title: item.product.title,
          price: item.product.price,
          quantity: item.quantity,
          imageUrl: item.product.imageUrl ?? undefined,
        })),
        deliveryMethod,
        deliveryCost,
        sessionId,
      });
      if (result?.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to start checkout. Please try again.";
      toast.error(message);
      setIsCheckingOut(false);
    }
  };

  // Loading state
  if (cart === undefined && sessionId) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-cream-100">
          <section className="py-16">
            <div className="container-narrow text-center">
              <Loader2 className="h-12 w-12 text-sage-400 mx-auto animate-spin" />
              <p className="text-charcoal-500 mt-4">Loading your cart...</p>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="flex-1 bg-cream-100">
        {/* Page Header */}
        <section className="py-8 border-b border-cream-300">
          <div className="container-wide">
            <Link
              href="/shop"
              className="inline-flex items-center text-sm text-charcoal-500 hover:text-sage-600 transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
            <h1>Your Cart</h1>
          </div>
        </section>

        {isEmpty ? (
          /* Empty Cart */
          <section className="py-16">
            <div className="container-narrow text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-sage-100 flex items-center justify-center">
                <Sparkles className="h-12 w-12 text-sage-300" />
              </div>
              <h2 className="text-2xl mb-4">Your cart is empty</h2>
              <p className="text-charcoal-500 mb-8">
                Looks like you haven&apos;t added any wreaths yet. Browse our
                collection to find something beautiful!
              </p>
              <Button
                asChild
                size="lg"
                className="bg-sage-400 hover:bg-sage-500 text-white"
              >
                <Link href="/shop">
                  Shop Wreaths
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </section>
        ) : (
          /* Cart with Items */
          <section className="py-8">
            <div className="container-wide">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <Card
                        key={item.product._id}
                        className="p-4 sm:p-6 border-cream-300 bg-white"
                      >
                        <div className="flex gap-4">
                          {/* Image */}
                          <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg bg-cream-200 shrink-0 overflow-hidden">
                            {item.product.imageUrl ? (
                              <Image
                                src={item.product.imageUrl}
                                alt={item.product.title}
                                fill
                                className="object-cover"
                                sizes="128px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Sparkles className="h-8 w-8 text-sage-300" />
                              </div>
                            )}
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <Link
                                href={`/shop/${item.product.slug}`}
                                className="font-medium text-charcoal-600 hover:text-sage-600 transition-colors line-clamp-2"
                              >
                                {item.product.title}
                              </Link>
                              <button
                                onClick={() => removeItem(item.product._id)}
                                className="min-h-[44px] min-w-[44px] -mr-3 -mt-2 flex items-center justify-center text-charcoal-400 hover:text-destructive transition-colors shrink-0"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>

                            <p className="text-sm text-charcoal-400 mt-1 capitalize">
                              {item.product.sizeCategory} item
                            </p>
                            <p className="text-xs text-charcoal-500 mt-1">
                              {item.product.stock === 0
                                ? "No longer available"
                                : item.product.stock === 1
                                  ? "1 available"
                                  : `${item.product.stock} available`}
                            </p>

                            <div className="flex items-center justify-between mt-4">
                              {/* Quantity Controls - touch-friendly */}
                              <div className="flex items-center border border-cream-400 rounded-md">
                                <button
                                  onClick={() =>
                                    updateQuantity(item.product._id, item.quantity - 1)
                                  }
                                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-charcoal-500 hover:text-charcoal-700 hover:bg-cream-100 transition-colors"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="w-10 text-center font-medium text-charcoal-600">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(item.product._id, item.quantity + 1)
                                  }
                                  disabled={item.quantity >= item.product.stock}
                                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-charcoal-500 hover:text-charcoal-700 hover:bg-cream-100 transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>

                              {/* Price */}
                              <p className="font-display text-xl text-charcoal-700">
                                £{(item.product.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <Card className="p-6 border-cream-300 bg-white sticky top-24">
                    <h3 className="text-xl mb-6">Order Summary</h3>

                    {/* Delivery Options */}
                    <div className="mb-6">
                      <h4 className="font-medium text-charcoal-600 mb-3">
                        Delivery Method
                      </h4>
                      <RadioGroup
                        value={deliveryMethod}
                        onValueChange={(value) => setDeliveryMethod(value as "collection" | "standard")}
                        className="space-y-3"
                      >
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="collection" id="collection" />
                          <Label
                            htmlFor="collection"
                            className="flex-1 cursor-pointer"
                          >
                            <span className="font-medium text-charcoal-600">
                              Local Collection
                            </span>
                            <span className="block text-sm text-charcoal-400">
                              Free - Preston, Lancashire
                            </span>
                          </Label>
                          <span className="text-sage-600 font-medium">Free</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="standard" id="standard" />
                          <Label
                            htmlFor="standard"
                            className="flex-1 cursor-pointer"
                          >
                            <span className="font-medium text-charcoal-600">
                              Standard Delivery
                            </span>
                            <span className="block text-sm text-charcoal-400">
                              3-5 working days
                            </span>
                          </Label>
                          <span className="text-charcoal-600 font-medium">
                            £{hasLargeItems ? "7.99" : "4.99"}
                          </span>
                        </div>
                      </RadioGroup>
                    </div>

                    <Separator className="my-6" />

                    {/* Totals */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-charcoal-500">
                        <span>Subtotal</span>
                        <span>£{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-charcoal-500">
                        <span>Delivery</span>
                        <span>
                          {deliveryCost === 0
                            ? "Free"
                            : `£${deliveryCost.toFixed(2)}`}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg">
                        <span className="font-medium text-charcoal-700">
                          Total
                        </span>
                        <span className="font-display text-2xl text-charcoal-700">
                          £{total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <Button
                      size="lg"
                      className="w-full mt-6 bg-sage-400 hover:bg-sage-500 text-white"
                      onClick={handleCheckout}
                      disabled={isCheckingOut || isEmpty}
                    >
                      {isCheckingOut ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Redirecting to Stripe...
                        </>
                      ) : (
                        <>
                          Proceed to Checkout
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-charcoal-400 text-center mt-4">
                      Secure checkout powered by Stripe
                    </p>
                  </Card>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
