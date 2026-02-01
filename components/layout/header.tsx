"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, ShoppingBag, User, Leaf, Home, Store, Paintbrush, Images, Package, HelpCircle, Star, Mail, UserCircle, ChevronRight, Heart, Snowflake, Grid3X3 } from "lucide-react";
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
  { name: "Home", href: "/", icon: Home },
  { name: "Shop", href: "/shop", icon: Store },
  {
    name: "Collections",
    href: "/collections",
    icon: Grid3X3,
    children: [
      { name: "Memorial Wreaths", href: "/collections/memorial-wreaths", icon: Heart },
      { name: "Funeral Wreaths", href: "/collections/funeral-wreaths", icon: Heart },
      { name: "Door Wreaths", href: "/collections/door-wreaths", icon: Home },
      { name: "Christmas Wreaths", href: "/collections/christmas-wreaths", icon: Snowflake },
      { name: "All Collections", href: "/collections", icon: Grid3X3 },
    ],
  },
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
                  src="/images/logo.png"
                  alt="Forever Faux Wreaths"
                  fill
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
                  className="w-full sm:max-w-sm bg-cream-50 border-l border-cream-300 p-0 overflow-hidden"
                >
                  {/* Header with logo */}
                  <div className="relative px-6 pt-6 pb-4 bg-gradient-to-b from-sage-50/80 to-transparent">
                    <div className="flex items-center gap-3">
                      <Link
                        href="/"
                        className="group"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className="sr-only">Forever Faux Wreaths</span>
                        <div className="relative h-14 w-14 rounded-full overflow-hidden bg-cream-100">
                          <Image
                            src="/images/logo.png"
                            alt="Forever Faux Wreaths"
                            fill
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
                      {navigation.map((item, index) =>
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
