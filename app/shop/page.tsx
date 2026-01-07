"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SlidersHorizontal, X, Loader2 } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
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
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const styles = [
  { value: "classic", label: "Classic" },
  { value: "modern", label: "Modern" },
  { value: "rustic", label: "Rustic" },
  { value: "seasonal", label: "Seasonal" },
  { value: "memorial", label: "Memorial" },
];

const sizes = [
  { value: "small", label: "Small (20-30cm)" },
  { value: "large", label: "Large (40-50cm)" },
];

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
    <div className="animate-pulse">
      <div className="aspect-square bg-cream-200 rounded-t-xl" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-cream-200 rounded w-3/4" />
        <div className="h-4 bg-cream-200 rounded w-1/2" />
      </div>
    </div>
  );
}

export default function ShopPage() {
  const [sortBy, setSortBy] = useState("featured");
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Fetch products from Convex
  const products = useQuery(api.products.list, { status: "active" });

  // Filter and sort products
  let filteredProducts = products ? [...products] : [];

  if (selectedStyles.length > 0) {
    filteredProducts = filteredProducts.filter((p) =>
      selectedStyles.includes(p.style)
    );
  }

  if (selectedSizes.length > 0) {
    filteredProducts = filteredProducts.filter((p) =>
      selectedSizes.includes(p.sizeCategory)
    );
  }

  // Sort products
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
      // Featured - sort by featured flag then by creation date
      filteredProducts.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return b.createdAt - a.createdAt;
      });
      break;
  }

  const clearFilters = () => {
    setSelectedStyles([]);
    setSelectedSizes([]);
  };

  const activeFilterCount = selectedStyles.length + selectedSizes.length;

  const filterContent = (
    <div className="space-y-6">
      {/* Style Filter */}
      <div>
        <h4 className="font-medium text-charcoal-600 mb-3">Style</h4>
        <div className="space-y-2">
          {styles.map((style) => (
            <div key={style.value} className="flex items-center space-x-2">
              <Checkbox
                id={`style-${style.value}`}
                checked={selectedStyles.includes(style.value)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedStyles([...selectedStyles, style.value]);
                  } else {
                    setSelectedStyles(
                      selectedStyles.filter((s) => s !== style.value)
                    );
                  }
                }}
              />
              <Label
                htmlFor={`style-${style.value}`}
                className="text-sm text-charcoal-500 cursor-pointer"
              >
                {style.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Size Filter */}
      <div>
        <h4 className="font-medium text-charcoal-600 mb-3">Size</h4>
        <div className="space-y-2">
          {sizes.map((size) => (
            <div key={size.value} className="flex items-center space-x-2">
              <Checkbox
                id={`size-${size.value}`}
                checked={selectedSizes.includes(size.value)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedSizes([...selectedSizes, size.value]);
                  } else {
                    setSelectedSizes(
                      selectedSizes.filter((s) => s !== size.value)
                    );
                  }
                }}
              />
              <Label
                htmlFor={`size-${size.value}`}
                className="text-sm text-charcoal-500 cursor-pointer"
              >
                {size.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <>
          <Separator />
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

  const isLoading = products === undefined;

  return (
    <>
      <Header />

      <main className="flex-1 bg-cream-100">
        {/* Page Header */}
        <section className="bg-gradient-to-b from-cream-100 to-cream-200 py-12">
          <div className="container-wide">
            <h1 className="text-center mb-4">Shop Wreaths</h1>
            <p className="text-center text-charcoal-500 max-w-2xl mx-auto">
              Browse our collection of handcrafted faux floral wreaths, each made
              with love in Preston, Lancashire.
            </p>
          </div>
        </section>

        {/* Filters & Products */}
        <section className="py-8">
          <div className="container-wide">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                {/* Mobile Filter Button */}
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
                  <SheetContent side="left" className="w-80 bg-cream-100">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      {filterContent}
                    </div>
                  </SheetContent>
                </Sheet>

                <p className="text-sm text-charcoal-500">
                  {isLoading ? "Loading..." : `${filteredProducts.length} products`}
                </p>
              </div>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
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

            {/* Active Filters */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedStyles.map((style) => (
                  <Badge
                    key={style}
                    variant="secondary"
                    className="bg-sage-100 text-sage-700 pr-1"
                  >
                    {styles.find((s) => s.value === style)?.label}
                    <button
                      onClick={() =>
                        setSelectedStyles(
                          selectedStyles.filter((s) => s !== style)
                        )
                      }
                      className="ml-1 p-0.5 hover:bg-sage-200 rounded"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {selectedSizes.map((size) => (
                  <Badge
                    key={size}
                    variant="secondary"
                    className="bg-sage-100 text-sage-700 pr-1"
                  >
                    {sizes.find((s) => s.value === size)?.label}
                    <button
                      onClick={() =>
                        setSelectedSizes(
                          selectedSizes.filter((s) => s !== size)
                        )
                      }
                      className="ml-1 p-0.5 hover:bg-sage-200 rounded"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                <button
                  onClick={clearFilters}
                  className="text-sm text-charcoal-500 hover:text-charcoal-700 underline"
                >
                  Clear all
                </button>
              </div>
            )}

            <div className="flex gap-8">
              {/* Desktop Sidebar Filters */}
              <aside className="hidden lg:block w-64 shrink-0">
                <div className="sticky top-24 bg-white rounded-lg border border-cream-300 p-6">
                  <h3 className="font-medium text-charcoal-600 mb-4">Filters</h3>
                  {filterContent}
                </div>
              </aside>

              {/* Product Grid */}
              <div className="flex-1">
                {isLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    {[...Array(6)].map((_, i) => (
                      <ProductSkeleton key={i} />
                    ))}
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 rounded-full bg-sage-100 mx-auto mb-4 flex items-center justify-center">
                      <SlidersHorizontal className="h-8 w-8 text-sage-300" />
                    </div>
                    <h3 className="text-xl text-charcoal-600 mb-2">
                      No products found
                    </h3>
                    <p className="text-charcoal-500 mb-4">
                      Try adjusting your filters to find what you&apos;re looking
                      for.
                    </p>
                    <Button variant="outline" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    {filteredProducts.map((product) => (
                      <Link key={product._id} href={`/shop/${product.slug}`}>
                        <Card className="group overflow-hidden border-cream-300 hover:border-sage-300 transition-colors bg-white h-full !p-0 !gap-0">
                          <div className="aspect-square relative bg-cream-50 overflow-hidden">
                            {product.imageUrls[0] ? (
                              <Image
                                src={product.imageUrls[0]}
                                alt={product.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="(max-width: 768px) 50vw, 33vw"
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
                            {product.stock === 0 && (
                              <div className="absolute inset-0 bg-cream-100/80 flex items-center justify-center">
                                <span className="font-medium text-charcoal-500">
                                  Sold Out
                                </span>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-charcoal-900/0 group-hover:bg-charcoal-900/5 transition-colors" />
                          </div>
                          <CardContent className="p-3 md:p-4">
                            <h3 className="font-medium text-charcoal-600 group-hover:text-sage-600 transition-colors line-clamp-2 text-xs sm:text-sm md:text-base mb-1.5 md:mb-2">
                              {product.title}
                            </h3>
                            <div className="flex items-center justify-between gap-1 md:gap-2">
                              <p className="font-display text-base md:text-lg text-charcoal-700">
                                £{product.price}
                              </p>
                              <StockBadge stock={product.stock} />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
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
