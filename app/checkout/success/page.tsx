"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const order = useQuery(
    api.orders.getByStripeSession,
    sessionId ? { stripeSessionId: sessionId } : "skip"
  );

  return (
    <>
      <Header />
      <main className="flex-1 bg-cream-100">
        <section className="py-16">
          <div className="container-narrow text-center">
            {order === undefined ? (
              <div className="space-y-4">
                <Loader2 className="h-12 w-12 text-sage-400 mx-auto animate-spin" />
                <h2 className="text-2xl text-charcoal-700">Processing your order...</h2>
                <p className="text-charcoal-500">
                  Please wait while we confirm your payment.
                </p>
              </div>
            ) : order === null ? (
              <div className="space-y-4">
                <Loader2 className="h-12 w-12 text-sage-400 mx-auto animate-spin" />
                <h2 className="text-2xl text-charcoal-700">Confirming payment...</h2>
                <p className="text-charcoal-500">
                  This usually takes a few seconds. The page will update automatically.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h1 className="text-3xl text-charcoal-700">Order Confirmed!</h1>
                <p className="text-charcoal-500">
                  Thank you for your purchase. We&apos;ll get started on your order right away.
                </p>

                <Card className="p-6 border-cream-300 bg-white text-left max-w-md mx-auto">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-charcoal-500">Order Number</span>
                      <span className="font-medium text-charcoal-700">{order.orderNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-charcoal-500">Total</span>
                      <span className="font-display text-lg text-charcoal-700">
                        £{order.total.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-charcoal-500">Delivery</span>
                      <span className="text-charcoal-700 capitalize">{order.deliveryMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-charcoal-500">Items</span>
                      <span className="text-charcoal-700">{order.items.length}</span>
                    </div>
                  </div>
                </Card>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                  <Button asChild className="bg-sage-400 hover:bg-sage-500 text-white">
                    <Link href="/shop">Continue Shopping</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
