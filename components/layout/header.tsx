"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, ShoppingBag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Bespoke", href: "/bespoke" },
  { name: "Gallery", href: "/gallery" },
  {
    name: "Info",
    href: "#",
    children: [
      { name: "Packaging & Delivery", href: "/info/packaging" },
      { name: "FAQs", href: "/info/faqs" },
      { name: "Reviews", href: "/info/reviews" },
    ],
  },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-cream-400 bg-cream-100/95 backdrop-blur supports-[backdrop-filter]:bg-cream-100/80">
      <nav className="container-wide">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo */}
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Forever Faux Wreaths</span>
              <div className="flex items-center gap-2">
                <div className="relative h-12 w-12 lg:h-14 lg:w-14">
                  {/* Placeholder for logo - replace with actual logo */}
                  <div className="h-full w-full rounded-full bg-sage-100 flex items-center justify-center">
                    <span className="font-display text-lg text-sage-600">FF</span>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <p className="font-display text-xl text-charcoal-600 leading-tight">
                    Forever Faux
                  </p>
                  <p className="text-xs tracking-[0.2em] text-charcoal-400 uppercase">
                    Wreaths
                  </p>
                </div>
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
                      <Link href={item.href} legacyBehavior passHref>
                        <NavigationMenuLink
                          className={cn(
                            "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
                            "bg-transparent hover:bg-sage-50 text-charcoal-600 hover:text-charcoal-700",
                            "focus:bg-sage-50 focus:text-sage-700 focus:outline-none"
                          )}
                        >
                          {item.name}
                        </NavigationMenuLink>
                      </Link>
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
                className="text-charcoal-500 hover:text-charcoal-700 hover:bg-sage-50"
              >
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Button>
            </Link>

            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-charcoal-500 hover:text-charcoal-700 hover:bg-sage-50"
              >
                <ShoppingBag className="h-5 w-5" />
                <span className="sr-only">Cart</span>
                {/* Cart count badge - will be dynamic */}
                {/* <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-sage-400 text-[10px] font-medium text-white flex items-center justify-center">
                  0
                </span> */}
              </Button>
            </Link>

            {/* Mobile menu button */}
            <div className="flex lg:hidden">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-charcoal-500 hover:text-charcoal-700 hover:bg-sage-50"
                  >
                    <span className="sr-only">Open menu</span>
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-full sm:max-w-sm bg-cream-100"
                >
                  <div className="flex items-center justify-between">
                    <Link
                      href="/"
                      className="-m-1.5 p-1.5"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="sr-only">Forever Faux Wreaths</span>
                      <div className="flex items-center gap-2">
                        <div className="relative h-10 w-10">
                          <div className="h-full w-full rounded-full bg-sage-100 flex items-center justify-center">
                            <span className="font-display text-sm text-sage-600">
                              FF
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="font-display text-lg text-charcoal-600 leading-tight">
                            Forever Faux
                          </p>
                          <p className="text-[10px] tracking-[0.2em] text-charcoal-400 uppercase">
                            Wreaths
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="mt-8 flow-root">
                    <div className="-my-6 divide-y divide-cream-400">
                      <div className="space-y-1 py-6">
                        {navigation.map((item) =>
                          item.children ? (
                            <div key={item.name}>
                              <p className="px-3 py-2 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">
                                {item.name}
                              </p>
                              {item.children.map((child) => (
                                <Link
                                  key={child.name}
                                  href={child.href}
                                  className="-mx-3 block rounded-lg px-6 py-2 text-base font-medium text-charcoal-600 hover:bg-sage-50"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  {child.name}
                                </Link>
                              ))}
                            </div>
                          ) : (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="-mx-3 block rounded-lg px-3 py-2 text-base font-medium text-charcoal-600 hover:bg-sage-50"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {item.name}
                            </Link>
                          )
                        )}
                      </div>
                      <div className="py-6">
                        <Link
                          href="/account"
                          className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-medium text-charcoal-600 hover:bg-sage-50"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          My Account
                        </Link>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
