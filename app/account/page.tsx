"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import {
  User,
  ShoppingBag,
  Lock,
  ChevronRight,
  Package,
  Clock,
  Leaf,
  Loader2,
  LogOut,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Header, Footer } from "@/components/layout";

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  processing: "bg-amber-100 text-amber-700",
  dispatched: "bg-blue-100 text-blue-700",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  completed: "bg-green-100 text-green-700",
  collected: "bg-green-100 text-green-700",
  issue: "bg-red-100 text-red-700",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  dispatched: "Shipped",
  shipped: "Shipped",
  delivered: "Completed",
  completed: "Completed",
  collected: "Collected",
  issue: "Issue",
};

function AccountShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1 bg-cream-50">{children}</main>
      <Footer />
    </>
  );
}

export default function AccountPage() {
  const { signIn, signOut } = useAuthActions();
  const currentUser = useQuery(api.users.current);
  const orders = useQuery(
    api.orders.getForCurrentUser,
    currentUser ? {} : "skip",
  );

  const [step, setStep] = useState<"signIn" | "signUp">("signIn");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    formData.set("flow", step);

    try {
      await signIn("password", formData);
      toast.success(
        step === "signIn" ? "Signed in successfully" : "Signed up successfully",
      );
    } catch (error) {
      console.error(error);
      toast.error("Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
  };

  if (currentUser === undefined) {
    return (
      <AccountShell>
        <div className="min-h-[60vh] flex items-center justify-center p-4">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-sage-500" />
            <p className="text-charcoal-500">Loading your account...</p>
          </div>
        </div>
      </AccountShell>
    );
  }

  return (
    <AccountShell>
      <div>
        {/* Hero */}
        <div className="bg-gradient-to-b from-sage-50 to-cream-50 border-b border-cream-300 py-12 px-4">
          <div className="max-w-3xl mx-auto text-center relative">
            {currentUser && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="absolute right-0 top-0 text-charcoal-500 hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            )}
            <div className="w-16 h-16 rounded-full bg-sage-100 flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-sage-600" />
            </div>
            <h1 className="text-3xl font-display text-charcoal-700 mb-2">
              {currentUser
                ? `Welcome, ${currentUser.name || currentUser.email}`
                : "My Account"}
            </h1>
            <p className="text-charcoal-500">
              {currentUser
                ? "Track your orders and manage your details"
                : "Sign in to track orders and manage details"}
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-10">
          {!currentUser ? (
            <Tabs value="signin">
              <TabsList className="bg-cream-200 mb-6">
                <TabsTrigger
                  value="signin"
                  className="data-[state=active]:bg-white w-full"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Sign In or Register
                </TabsTrigger>
              </TabsList>
              <TabsContent value="signin">
                <Card className="border-cream-300 bg-white p-8 max-w-md mx-auto">
                  <div className="mb-6">
                    <h2 className="text-lg font-medium text-charcoal-700 mb-1">
                      {step === "signIn"
                        ? "Sign in to your account"
                        : "Create an account"}
                    </h2>
                    <p className="text-sm text-charcoal-500">
                      {step === "signIn"
                        ? "Enter your email and password to access your orders."
                        : "Create an account to track your orders easily."}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {step === "signUp" && (
                      <div>
                        <Label htmlFor="name">Full Name (optional)</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Jane Doe"
                          className="mt-1"
                        />
                      </div>
                    )}
                    <div>
                      <Label htmlFor="email">Email address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="mt-1"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-sage-400 hover:bg-sage-500 text-white"
                      disabled={loading}
                    >
                      {loading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {step === "signIn" ? "Sign In" : "Sign Up"}
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full mt-2 text-sm text-charcoal-500"
                      onClick={() =>
                        setStep(step === "signIn" ? "signUp" : "signIn")
                      }
                    >
                      {step === "signIn"
                        ? "Don't have an account? Sign up"
                        : "Already have an account? Sign in"}
                    </Button>
                  </form>

                  <div className="mt-6 space-y-2 border-t border-cream-200 pt-6">
                    <p className="text-sm font-medium text-charcoal-600">
                      Looking for Inspiration?
                    </p>
                    <Link
                      href="/shop"
                      className="flex items-center justify-between p-3 rounded-lg bg-cream-50 hover:bg-sage-50 transition-colors group"
                    >
                      <span className="text-sm text-charcoal-600 group-hover:text-charcoal-700">
                        Browse our wreath collection
                      </span>
                      <ChevronRight className="h-4 w-4 text-charcoal-400 group-hover:text-sage-500 transition-colors" />
                    </Link>
                    <Link
                      href="/bespoke"
                      className="flex items-center justify-between p-3 rounded-lg bg-cream-50 hover:bg-sage-50 transition-colors group"
                    >
                      <span className="text-sm text-charcoal-600 group-hover:text-charcoal-700">
                        Design a bespoke wreath
                      </span>
                      <ChevronRight className="h-4 w-4 text-charcoal-400 group-hover:text-sage-500 transition-colors" />
                    </Link>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Tabs defaultValue="orders">
              <TabsList className="bg-cream-200 mb-6">
                <TabsTrigger
                  value="orders"
                  className="data-[state=active]:bg-white"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  My Orders
                </TabsTrigger>
              </TabsList>

              <TabsContent value="orders">
                {orders === undefined ? (
                  <div className="flex justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-sage-400" />
                  </div>
                ) : orders.length === 0 ? (
                  <Card className="border-cream-300 bg-white p-12 text-center">
                    <div className="w-14 h-14 rounded-full bg-sage-100 flex items-center justify-center mx-auto mb-4">
                      <Package className="h-7 w-7 text-sage-400" />
                    </div>
                    <h2 className="text-lg font-medium text-charcoal-700 mb-2">
                      No orders yet
                    </h2>
                    <p className="text-charcoal-500 mb-6 text-sm max-w-xs mx-auto">
                      Once you place an order, it will appear here so you can
                      track its progress.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button
                        asChild
                        className="bg-sage-400 hover:bg-sage-500 text-white"
                      >
                        <Link href="/shop">
                          <Leaf className="h-4 w-4 mr-2" />
                          Browse Wreaths
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="border-cream-300"
                      >
                        <Link href="/bespoke">Order Bespoke</Link>
                      </Button>
                    </div>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card
                        key={order.orderNumber}
                        className="border-cream-300 bg-white p-5"
                      >
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <p className="font-medium text-charcoal-700">
                              {order.orderNumber}
                            </p>
                            <p className="text-sm text-charcoal-400 flex items-center gap-1 mt-0.5">
                              <Clock className="h-3.5 w-3.5" />
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge
                              className={
                                statusColors[order.status] ||
                                "bg-gray-100 text-gray-700"
                              }
                            >
                              {statusLabels[order.status] ??
                                order.status.charAt(0).toUpperCase() +
                                  order.status.slice(1)}
                            </Badge>
                            <p className="font-medium text-charcoal-700 mt-1">
                              £{(order.total || 0).toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <ul className="text-sm text-charcoal-500 space-y-0.5">
                          {order.items.map((item, i) => (
                            <li key={i}>
                              {item.quantity}× {item.title}
                            </li>
                          ))}
                        </ul>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </AccountShell>
  );
}
