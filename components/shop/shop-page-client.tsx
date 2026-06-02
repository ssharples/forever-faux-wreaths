"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  SlidersHorizontal,
  X,
  Sparkles,
  Heart,
  Leaf,
  Home,
  Star,
  Check,
  ChevronRight,
  Ruler,
} from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { QuickAddButton } from "@/components/shop/quick-add-button";
import type { ShopProduct } from "@/lib/storefront";
import { MADE_TO_ORDER_LEAD_TIME } from "@/lib/made-to-order";

const styles = [
  { value: "classic", label: "Classic", icon: Star, desc: "Timeless elegance" },
  { value: "modern", label: "Modern", icon: Sparkles, desc: "Contemporary designs" },
  { value: "rustic", label: "Rustic", icon: Leaf, desc: "Natural textures" },
  { value: "seasonal", label: "Seasonal", icon: Home, desc: "Holiday themes" },
  { value: "memorial", label: "Memorial", icon: Heart, desc: "Tribute pieces" },
];

const sizes = [
  { value: "small", label: "Small", size: "20-30cm", desc: "Perfect for interior doors" },
  { value: "large", label: "Large", size: "40-50cm", desc: "Statement entrance pieces" },
];

const PRODUCTS_PER_BATCH = 24;

function buildBespokeHref(product: ShopProduct) {
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

type ShopPageClientProps = {
  initialProducts: ShopProduct[];
};

export function ShopPageClient({ initialProducts }: ShopPageClientProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [visibleProductCount, setVisibleProductCount] = useState(PRODUCTS_PER_BATCH);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const parseMultiValue = (key: string) => {
    const value = searchParams.get(key);
    return value ? value.split(",").filter(Boolean) : [];
  };

  const sortBy = searchParams.get("sort") ?? "featured";
  const selectedStyles = parseMultiValue("style");
  const selectedSizes = parseMultiValue("size");

  const updateFilters = useMemo(
    () => ({
      multi: (key: string, values: string[]) => {
        const params = new URLSearchParams(searchParams.toString());
        if (values.length === 0) {
          params.delete(key);
        } else {
          params.set(key, values.join(","));
        }
        const next = params.toString();
        router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
      },
      sort: (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === "featured") {
          params.delete("sort");
        } else {
          params.set("sort", value);
        }
        const next = params.toString();
        router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
      },
      clear: () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("style");
        params.delete("size");
        const next = params.toString();
        router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
      },
    }),
    [pathname, router, searchParams]
  );

  const toggleFilterValue = (key: "style" | "size", value: string) => {
    const selectedValues = key === "style" ? selectedStyles : selectedSizes;
    const nextValues = selectedValues.includes(value)
      ? selectedValues.filter((item) => item !== value)
      : [...selectedValues, value];
    updateFilters.multi(key, nextValues);
  };

  let filteredProducts = [...initialProducts];

  if (selectedStyles.length > 0) {
    filteredProducts = filteredProducts.filter((product) =>
      selectedStyles.includes(product.style)
    );
  }

  if (selectedSizes.length > 0) {
    filteredProducts = filteredProducts.filter((product) =>
      selectedSizes.includes(product.sizeCategory)
    );
  }

  switch (sortBy) {
    case "price-asc":
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      filteredProducts.sort((a, b) => b.createdAt - a.createdAt);
      break;
    default:
      filteredProducts.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return b.createdAt - a.createdAt;
      });
      break;
  }

  const clearFilters = () => {
    updateFilters.clear();
  };

  const activeFilterCount = selectedStyles.length + selectedSizes.length;
  const filterSignature = `${sortBy}|${selectedStyles.join(",")}|${selectedSizes.join(",")}`;
  const visibleProducts = filteredProducts.slice(0, visibleProductCount);

  useEffect(() => {
    setVisibleProductCount(PRODUCTS_PER_BATCH);
  }, [filterSignature]);

  const desktopFilterContent = (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium text-charcoal-600 mb-3">Style</h4>
        <div className="space-y-2">
          {styles.map((style) => (
            <div key={style.value} className="flex items-center space-x-2">
              <Checkbox
                id={`desktop-style-${style.value}`}
                checked={selectedStyles.includes(style.value)}
                onCheckedChange={(checked) => {
                  if (checked === "indeterminate") return;
                  toggleFilterValue("style", style.value);
                }}
              />
              <Label
                htmlFor={`desktop-style-${style.value}`}
                className="text-sm text-charcoal-500 cursor-pointer"
              >
                {style.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-cream-300" />

      <div>
        <h4 className="font-medium text-charcoal-600 mb-3">Size</h4>
        <div className="space-y-2">
          {sizes.map((size) => (
            <div key={size.value} className="flex items-center space-x-2">
              <Checkbox
                id={`desktop-size-${size.value}`}
                checked={selectedSizes.includes(size.value)}
                onCheckedChange={(checked) => {
                  if (checked === "indeterminate") return;
                  toggleFilterValue("size", size.value);
                }}
              />
              <Label
                htmlFor={`desktop-size-${size.value}`}
                className="text-sm text-charcoal-500 cursor-pointer"
              >
                {size.label} ({size.size})
              </Label>
            </div>
          ))}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <>
          <div className="border-t border-cream-300" />
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="w-full"
          >
            Clear All Filters
          </Button>
        </>
      )}
    </div>
  );

  const mobileFilterContent = (
    <div className="flex flex-col h-full">
      <div className="relative px-6 pt-6 pb-4 bg-gradient-to-b from-sage-50/80 to-transparent">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sage-100 border-2 border-sage-200">
            <SlidersHorizontal className="h-5 w-5 text-sage-600" />
          </div>
          <div>
            <SheetTitle className="font-display text-lg text-charcoal-700 leading-tight">
              Filter Wreaths
            </SheetTitle>
            <p className="text-[10px] tracking-[0.25em] text-sage-500 uppercase font-medium">
              {filteredProducts.length} products
            </p>
          </div>
        </div>

        <p className="font-handwritten text-sage-400 text-lg mt-4 mb-1">
          Find your perfect wreath
        </p>
      </div>

      <nav className="px-4 pb-6 overflow-y-auto flex-1">
        <div className="mb-6">
          <div className="flex items-center gap-2 px-3 mb-3">
            <Leaf className="h-3.5 w-3.5 text-sage-400" />
            <span className="text-[11px] font-semibold text-sage-500 uppercase tracking-wider">
              Style
            </span>
          </div>
          <ul className="space-y-1">
            {styles.map((style) => {
              const Icon = style.icon;
              const isSelected = selectedStyles.includes(style.value);

              return (
                <li key={style.value}>
                  <button
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => toggleFilterValue("style", style.value)}
                    className={`group flex items-center gap-3 w-full rounded-xl px-3 py-2.5 transition-all duration-200 ${
                      isSelected
                        ? "bg-sage-100 text-charcoal-700"
                        : "text-charcoal-600 hover:bg-sage-50"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                        isSelected ? "bg-sage-200" : "bg-cream-100 group-hover:bg-sage-100"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 ${isSelected ? "text-sage-600" : "text-sage-500"}`}
                      />
                    </span>
                    <div className="flex-1 text-left">
                      <span className="text-[15px] font-medium block">{style.label}</span>
                      <span className="text-xs text-charcoal-400">{style.desc}</span>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 bg-sage-400 rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 px-3 mb-3">
            <Ruler className="h-3.5 w-3.5 text-sage-400" />
            <span className="text-[11px] font-semibold text-sage-500 uppercase tracking-wider">
              Size
            </span>
          </div>
          <ul className="space-y-1">
            {sizes.map((size) => {
              const isSelected = selectedSizes.includes(size.value);

              return (
                <li key={size.value}>
                  <button
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => toggleFilterValue("size", size.value)}
                    className={`group flex items-center gap-3 w-full rounded-xl px-3 py-2.5 transition-all duration-200 ${
                      isSelected
                        ? "bg-sage-100 text-charcoal-700"
                        : "text-charcoal-600 hover:bg-sage-50"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                        isSelected ? "bg-sage-200" : "bg-cream-100 group-hover:bg-sage-100"
                      }`}
                    >
                      <span
                        className={`text-xs font-medium ${
                          isSelected ? "text-sage-600" : "text-charcoal-500"
                        }`}
                      >
                        {size.size.split("-")[0]}
                      </span>
                    </span>
                    <div className="flex-1 text-left">
                      <span className="text-[15px] font-medium block">{size.label}</span>
                      <span className="text-xs text-charcoal-400">{size.desc}</span>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 bg-sage-400 rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {activeFilterCount > 0 && (
          <div className="pt-4 border-t border-cream-300">
            <Button
              variant="outline"
              onClick={() => {
                clearFilters();
                setFiltersOpen(false);
              }}
              className="w-full border-sage-300 text-sage-600 hover:bg-sage-50"
            >
              Clear All Filters ({activeFilterCount})
            </Button>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="font-handwritten text-sage-400 text-base">
            Handcrafted with love
          </p>
          <p className="text-[10px] text-charcoal-300 mt-1 tracking-wide">
            Preston, Lancashire
          </p>
        </div>
      </nav>

      <div className="px-4 py-4 border-t border-cream-300 bg-white">
        <Button
          onClick={() => setFiltersOpen(false)}
          className="w-full bg-sage-400 hover:bg-sage-500 text-white"
        >
          Show {filteredProducts.length} Products
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <Header />

      <main className="flex-1 bg-cream-100">
        <section className="bg-gradient-to-b from-cream-100 to-cream-200 py-12">
          <div className="container-wide">
            <h1 className="text-center mb-4">Shop Wreaths</h1>
            <p className="text-center text-charcoal-500 max-w-2xl mx-auto">
              Browse our collection of handcrafted faux floral wreaths, each made
              with love in Preston, Lancashire.
            </p>
          </div>
        </section>

        <section className="py-8">
          <div className="container-wide">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="lg:hidden border-cream-400"
                    >
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filters
                      {activeFilterCount > 0 && (
                        <Badge className="ml-2 bg-sage-400 text-white h-5 w-5 p-0 flex items-center justify-center rounded-full text-xs">
                          {activeFilterCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="w-full sm:max-w-sm bg-cream-50 border-r border-cream-300 p-0"
                  >
                    {mobileFilterContent}
                  </SheetContent>
                </Sheet>

                <p className="text-sm text-charcoal-500">
                  {filteredProducts.length} products
                </p>
              </div>

              <Select value={sortBy} onValueChange={updateFilters.sort}>
                <SelectTrigger className="w-[180px] bg-white border-cream-400">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedStyles.map((style) => {
                  const styleLabel =
                    styles.find((item) => item.value === style)?.label ?? style;
                  return (
                    <Badge
                      key={style}
                      variant="secondary"
                      className="bg-sage-100 text-sage-700 pr-1"
                    >
                      {styleLabel}
                      <button
                        type="button"
                        aria-label={`Remove ${styleLabel} style filter`}
                        onClick={() => toggleFilterValue("style", style)}
                        className="ml-1 p-0.5 hover:bg-sage-200 rounded"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
                {selectedSizes.map((size) => {
                  const sizeLabel =
                    sizes.find((item) => item.value === size)?.label ?? size;
                  return (
                    <Badge
                      key={size}
                      variant="secondary"
                      className="bg-sage-100 text-sage-700 pr-1"
                    >
                      {sizeLabel}
                      <button
                        type="button"
                        aria-label={`Remove ${sizeLabel} size filter`}
                        onClick={() => toggleFilterValue("size", size)}
                        className="ml-1 p-0.5 hover:bg-sage-200 rounded"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
                <button
                  onClick={clearFilters}
                  className="text-sm text-charcoal-500 hover:text-charcoal-700 underline"
                >
                  Clear all
                </button>
              </div>
            )}

            <div className="flex gap-8">
              <aside className="hidden lg:block w-64 shrink-0">
                <div className="sticky top-24 bg-white rounded-lg border border-cream-300 p-6">
                  <h3 className="font-medium text-charcoal-600 mb-4">Filters</h3>
                  {desktopFilterContent}
                </div>
              </aside>

              <div className="flex-1">
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 rounded-full bg-sage-100 mx-auto mb-4 flex items-center justify-center">
                      <SlidersHorizontal className="h-8 w-8 text-sage-300" />
                    </div>
                    <h3 className="text-xl text-charcoal-600 mb-2">
                      No products found
                    </h3>
                    <p className="text-charcoal-500 mb-4">
                      Try adjusting your filters to find what you&apos;re looking for.
                    </p>
                    <Button variant="outline" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                      {visibleProducts.map((product, index) => (
                        <Card
                          key={product._id}
                          className="group relative overflow-hidden border-cream-300 bg-white h-full transition-colors hover:border-sage-300 !gap-0 !p-0"
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
                                  sizes="(max-width: 768px) 50vw, 33vw"
                                  priority={index === 0}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <span className="text-charcoal-400">No image</span>
                                </div>
                              )}
                              {product.featured && (
                                <Badge className="absolute top-3 left-3 bg-sage-400 hover:bg-sage-400 text-white">
                                  Featured
                                </Badge>
                              )}
                              <div className="absolute inset-0 bg-charcoal-900/0 group-hover:bg-charcoal-900/5 transition-colors" />
                            </div>
                            <CardContent className="p-3 md:p-4">
                              <p className="text-[11px] uppercase tracking-[0.18em] text-charcoal-400 mb-1">
                                {product.categoryName ?? product.style}
                              </p>
                              <h2 className="font-medium text-charcoal-600 group-hover:text-sage-600 transition-colors line-clamp-2 text-xs sm:text-sm md:text-base mb-1.5 md:mb-2">
                                {product.title}
                              </h2>
                              <div className="flex items-center justify-between gap-1 md:gap-2">
                                <p className="font-display text-base md:text-lg text-charcoal-700">
                                  £{product.price}
                                </p>
                                <MadeToOrderBadge />
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
                                  <Link href={buildBespokeHref(product)}>
                                    Customise
                                  </Link>
                                </Button>
                              </div>
                            </CardContent>
                          </div>
                        </Card>
                      ))}
                    </div>
                    {visibleProductCount < filteredProducts.length && (
                      <div className="mt-8 flex justify-center">
                        <Button
                          variant="outline"
                          onClick={() =>
                            setVisibleProductCount((count) => count + PRODUCTS_PER_BATCH)
                          }
                          className="border-sage-300 text-sage-700 hover:bg-sage-50"
                        >
                          Show more wreaths
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
