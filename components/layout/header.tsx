"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useQuery } from "convex/react";
import {
  Menu,
  ShoppingBag,
  User,
  Leaf,
  Home,
  Store,
  Paintbrush,
  Images,
  Package,
  HelpCircle,
  Star,
  Mail,
  UserCircle,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import { api } from "@/convex/_generated/api";
import { useCartSession } from "@/lib/cart-session";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Shop", href: "/shop", icon: Store },
  { name: "Memorial Topper", href: "/memorial-topper", icon: ShieldCheck },
  { name: "Bespoke", href: "/bespoke", icon: Paintbrush },
  { name: "Gallery", href: "/gallery", icon: Images },
  {
    name: "Info",
    href: "#",
    children: [
      { name: "Packaging & Delivery", href: "/info/packaging", icon: Package },
      { name: "FAQs", href: "/info/faqs", icon: HelpCircle },
      { name: "Reviews", href: "/info/reviews", icon: Star },
    ],
  },
  { name: "Contact", href: "/contact", icon: Mail },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const sessionId = useCartSession();
  const cart = useQuery(
    api.cart.getWithProducts,
    sessionId ? { sessionId } : "skip"
  );

  const cartItems = cart?.items ?? [];
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-cream-400 bg-cream-100/95 backdrop-blur supports-[backdrop-filter]:bg-cream-100/80">
      <nav className="container-wide">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo */}
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Forever Faux Wreaths</span>
              <div className="relative h-12 w-12 lg:h-14 lg:w-14 rounded-full overflow-hidden bg-cream-100">
                <Image
                  src="/images/logo.webp"
                  alt="Forever Faux Wreaths"
                  fill
                  sizes="(max-width: 1024px) 48px, 56px"
                  className="object-cover"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:gap-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                {navigation.map((item) =>
                  item.children ? (
                    <NavigationMenuItem key={item.name}>
                      <NavigationMenuTrigger className="bg-transparent hover:bg-sage-50 text-charcoal-600 hover:text-charcoal-700">
                        {item.name}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-48 gap-1 p-2">
                          {item.children.map((child) => (
                            <li key={child.name}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={child.href}
                                  className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-sage-50 hover:text-sage-700 focus:bg-sage-50"
                                >
                                  <span className="text-sm font-medium text-charcoal-600">
                                    {child.name}
                                  </span>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  ) : (
                    <NavigationMenuItem key={item.name}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
                            "bg-transparent hover:bg-sage-50 text-charcoal-600 hover:text-charcoal-700",
                            "focus:bg-sage-50 focus:text-sage-700 focus:outline-none"
                          )}
                        >
                          {item.name}
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  )
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right side - Cart & Account */}
          <div className="flex flex-1 items-center justify-end gap-2">
            <Link href="/account">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open account"
                className="text-charcoal-500 hover:text-charcoal-700 hover:bg-sage-50"
              >
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Button>
            </Link>

            <Sheet open={cartOpen} onOpenChange={setCartOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open cart"
                  className="relative text-charcoal-500 hover:text-charcoal-700 hover:bg-sage-50"
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span className="sr-only">Cart</span>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-sage-500 px-1 text-[10px] font-medium text-white">
                      {cartItemCount > 99 ? "99+" : cartItemCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full sm:max-w-md bg-cream-50 border-l border-cream-300 p-0"
              >
                <div className="flex h-full flex-col">
                  <div className="border-b border-cream-300 bg-gradient-to-b from-sage-50/80 to-transparent px-6 py-5">
                    <SheetTitle className="font-display text-2xl text-charcoal-700">
                      Your cart
                    </SheetTitle>
                    <SheetDescription className="mt-1 text-charcoal-500">
                      {cartItemCount > 0
                        ? `${cartItemCount} item${cartItemCount === 1 ? "" : "s"} ready for checkout`
                        : "Add a wreath to get started."}
                    </SheetDescription>
                  </div>

                  {cartItems.length === 0 ? (
                    <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-sage-100">
                        <Sparkles className="h-8 w-8 text-sage-400" />
                      </div>
                      <p className="font-display text-2xl text-charcoal-700">
                        Your cart is empty
                      </p>
                      <p className="mt-2 max-w-sm text-sm leading-relaxed text-charcoal-500">
                        Browse the latest wreaths or commission something bespoke.
                      </p>
                      <div className="mt-6 flex w-full flex-col gap-3">
                        <Button
                          asChild
                          className="bg-sage-400 text-white hover:bg-sage-500"
                        >
                          <Link href="/shop" onClick={() => setCartOpen(false)}>
                            Shop Wreaths
                          </Link>
                        </Button>
                        <Button asChild variant="outline">
                          <Link href="/bespoke" onClick={() => setCartOpen(false)}>
                            Start Bespoke Enquiry
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 overflow-y-auto px-4 py-4">
                        <div className="space-y-3">
                          {cartItems.map((item) => (
                            <Link
                              key={item.product._id}
                              href={`/shop/${item.product.slug}`}
                              className="flex gap-3 rounded-2xl border border-cream-300 bg-white p-3 transition-colors hover:border-sage-300"
                              onClick={() => setCartOpen(false)}
                            >
                              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-cream-100">
                                {item.product.imageUrl ? (
                                  <Image
                                    src={item.product.imageUrl}
                                    alt={item.product.title}
                                    fill
                                    className="object-cover"
                                    sizes="80px"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center">
                                    <Sparkles className="h-5 w-5 text-sage-300" />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-[11px] uppercase tracking-[0.18em] text-charcoal-400">
                                  {item.product.categoryName ?? item.product.style}
                                </p>
                                <p className="mt-1 line-clamp-2 font-medium text-charcoal-700">
                                  {item.product.title}
                                </p>
                                <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                                  <span className="text-charcoal-500">
                                    Qty {item.quantity}
                                  </span>
                                  <span className="font-display text-lg text-charcoal-700">
                                    £{(item.product.price * item.quantity).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-cream-300 bg-white px-6 py-5">
                        <div className="flex items-center justify-between text-sm text-charcoal-500">
                          <span>Subtotal</span>
                          <span className="font-display text-2xl text-charcoal-700">
                            £{subtotal.toFixed(2)}
                          </span>
                        </div>
                        <Separator className="my-4" />
                        <div className="flex flex-col gap-3">
                          <Button
                            asChild
                            className="bg-sage-400 text-white hover:bg-sage-500"
                          >
                            <Link href="/cart" onClick={() => setCartOpen(false)}>
                              View Cart & Checkout
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                          <Button asChild variant="outline">
                            <Link href="/shop" onClick={() => setCartOpen(false)}>
                              Continue Shopping
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* Mobile menu button */}
            <div className="flex lg:hidden">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Open site menu"
                    className="text-charcoal-500 hover:text-charcoal-700 hover:bg-sage-50"
                  >
                    <span className="sr-only">Open menu</span>
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-full sm:max-w-sm bg-cream-50 border-l border-cream-300 p-0 overflow-hidden"
                >
                  {/* Header with logo */}
                  <div className="relative px-6 pt-6 pb-4 bg-gradient-to-b from-sage-50/80 to-transparent">
                    <SheetTitle className="sr-only">Site menu</SheetTitle>
                    <div className="flex items-center gap-3">
                      <Link
                        href="/"
                        className="group"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className="sr-only">Forever Faux Wreaths</span>
                        <div className="relative h-14 w-14 rounded-full overflow-hidden bg-cream-100">
                          <Image
                            src="/images/logo.webp"
                            alt="Forever Faux Wreaths"
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                      </Link>
                      <div>
                        <p className="font-display text-lg text-charcoal-700 leading-tight">
                          Forever Faux
                        </p>
                        <p className="text-[10px] tracking-[0.25em] text-sage-500 uppercase font-medium">
                          Wreaths
                        </p>
                      </div>
                    </div>

                    {/* Decorative handwritten text */}
                    <p className="font-handwritten text-sage-400 text-lg mt-4 mb-1">
                      Explore our collection
                    </p>
                  </div>

                  {/* Navigation links */}
                  <nav className="px-4 pb-6 overflow-y-auto max-h-[calc(100vh-200px)]">
                    <ul className="space-y-1">
                      {navigation.map((item) =>
                        item.children ? (
                          <li key={item.name} className="pt-4 first:pt-0">
                            {/* Section header */}
                            <div className="flex items-center gap-2 px-3 mb-2">
                              <Leaf className="h-3.5 w-3.5 text-sage-400" />
                              <span className="text-[11px] font-semibold text-sage-500 uppercase tracking-wider">
                                {item.name}
                              </span>
                            </div>
                            {/* Sub-items */}
                            <ul className="space-y-0.5">
                              {item.children.map((child) => {
                                const ChildIcon = child.icon;
                                return (
                                  <li key={child.name}>
                                    <Link
                                      href={child.href}
                                      className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-charcoal-600 hover:bg-sage-100/70 hover:text-charcoal-700 transition-all duration-200"
                                      onClick={() => setMobileMenuOpen(false)}
                                    >
                                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cream-100 group-hover:bg-sage-200/60 transition-colors">
                                        <ChildIcon className="h-4 w-4 text-sage-500 group-hover:text-sage-600" />
                                      </span>
                                      <span className="text-[15px] font-medium">{child.name}</span>
                                      <ChevronRight className="h-4 w-4 text-cream-400 ml-auto group-hover:text-sage-400 group-hover:translate-x-0.5 transition-all" />
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          </li>
                        ) : (
                          <li key={item.name}>
                            <Link
                              href={item.href}
                              className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-charcoal-600 hover:bg-sage-100/70 hover:text-charcoal-700 transition-all duration-200"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cream-100 group-hover:bg-sage-200/60 transition-colors">
                                {item.icon && <item.icon className="h-4 w-4 text-sage-500 group-hover:text-sage-600" />}
                              </span>
                              <span className="text-[15px] font-medium">{item.name}</span>
                              <ChevronRight className="h-4 w-4 text-cream-400 ml-auto group-hover:text-sage-400 group-hover:translate-x-0.5 transition-all" />
                            </Link>
                          </li>
                        )
                      )}
                    </ul>

                    {/* Account section */}
                    <div className="mt-6 pt-6 border-t border-cream-300">
                      <Link
                        href="/account"
                        className="group flex items-center gap-3 rounded-xl px-3 py-3 bg-sage-100/50 hover:bg-sage-100 transition-all duration-200"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-200/70 group-hover:bg-sage-300/70 transition-colors">
                          <UserCircle className="h-5 w-5 text-sage-600" />
                        </span>
                        <div className="flex-1">
                          <span className="text-[15px] font-medium text-charcoal-700">My Account</span>
                          <p className="text-xs text-charcoal-400">Orders, wishlist & settings</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-sage-400 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>

                    {/* Footer decoration */}
                    <div className="mt-8 text-center">
                      <p className="font-handwritten text-sage-400 text-base">
                        Handcrafted with love
                      </p>
                      <p className="text-[10px] text-charcoal-300 mt-1 tracking-wide">
                        Preston, Lancashire
                      </p>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
