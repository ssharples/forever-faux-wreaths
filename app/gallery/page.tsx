"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "convex/react";
import { Sparkles, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { api } from "@/convex/_generated/api";

const categories = [
  { value: "all", label: "All" },
  { value: "classic", label: "Classic" },
  { value: "seasonal", label: "Seasonal" },
  { value: "memorial", label: "Memorial" },
  { value: "modern", label: "Modern" },
  { value: "rustic", label: "Rustic" },
  { value: "special", label: "Special" },
];

const IMAGES_PER_BATCH = 24;

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [visibleImageCount, setVisibleImageCount] = useState(IMAGES_PER_BATCH);
  const images = useQuery(api.galleryImages.getVisible) ?? [];

  const filteredImages = useMemo(
    () =>
      selectedCategory === "all"
        ? images
        : images.filter((image) => image.category === selectedCategory),
    [images, selectedCategory]
  );
  const displayedImages = filteredImages.slice(0, visibleImageCount);

  useEffect(() => {
    setVisibleImageCount(IMAGES_PER_BATCH);
    setCurrentImageIndex(0);
  }, [selectedCategory]);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === filteredImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? filteredImages.length - 1 : prev - 1
    );
  };

  return (
    <>
      <Header />

      <main className="flex-1 bg-cream-100">
        <section className="bg-gradient-to-b from-cream-100 to-cream-200 py-10 sm:py-16">
          <div className="container-narrow text-center px-5">
            <p className="font-handwritten text-xl sm:text-2xl text-sage-600 mb-3 sm:mb-4">
              Inspiration awaits
            </p>
            <h1 className="mb-4 sm:mb-6 text-2xl sm:text-4xl">Our Gallery</h1>
            <p className="text-base sm:text-lg text-charcoal-500 max-w-2xl mx-auto">
              Browse recent work, seasonal pieces, and bespoke commissions.
            </p>
          </div>
        </section>

        <section className="py-8 sm:py-12">
          <div className="container-wide">
            <div className="mb-6 sm:mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                <div className="flex sm:flex-wrap sm:justify-center gap-2 min-w-max sm:min-w-0">
                  {categories.map((category) => (
                    <button
                      type="button"
                      aria-pressed={selectedCategory === category.value}
                      key={category.value}
                      onClick={() => setSelectedCategory(category.value)}
                      className={`px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                        selectedCategory === category.value
                          ? "bg-sage-400 text-white shadow-sm"
                          : "bg-cream-200 text-charcoal-600 hover:bg-cream-300"
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-charcoal-400 text-center mt-2 sm:hidden">
                Swipe to see more categories →
              </p>
            </div>

            {filteredImages.length === 0 ? (
              <div className="text-center py-16">
                <Sparkles className="h-16 w-16 text-sage-300 mx-auto mb-4" />
                <h3 className="text-xl text-charcoal-600 mb-2">
                  No images in this category yet
                </h3>
                <p className="text-charcoal-500">
                  Check back soon or browse another category.
                </p>
              </div>
            ) : (
              <div className="columns-2 md:columns-3 lg:columns-4 gap-2 md:gap-4 space-y-2 md:space-y-4">
                {displayedImages.map((image, index) => (
                  <button
                    key={image._id}
                    type="button"
                    aria-label={`Open ${image.title || "gallery image"} in the lightbox`}
                    onClick={() => openLightbox(index)}
                    className="break-inside-avoid block w-full group"
                  >
                    <div
                      className={`relative rounded-lg overflow-hidden bg-cream-200 ${
                        index % 3 === 0
                          ? "aspect-[3/4]"
                          : index % 3 === 1
                            ? "aspect-square"
                            : "aspect-[4/3]"
                      }`}
                    >
                      {image.url ? (
                        <Image
                          src={image.url}
                          alt={image.title || "Gallery image"}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Sparkles className="h-8 w-8 text-sage-300" />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-charcoal-900/0 group-hover:bg-charcoal-900/40 transition-colors flex items-end">
                        <div className="w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                          <p className="text-white font-medium text-sm">
                            {image.title || "Untitled"}
                          </p>
                          {image.category && (
                            <p className="text-white/80 text-xs capitalize mt-1">{image.category}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {visibleImageCount < filteredImages.length && (
              <div className="mt-8 flex justify-center">
                <Button
                  variant="outline"
                  onClick={() =>
                    setVisibleImageCount((count) => count + IMAGES_PER_BATCH)
                  }
                  className="border-sage-300 text-sage-700 hover:bg-white"
                >
                  Show more images
                </Button>
              </div>
            )}
          </div>
        </section>

        <section className="py-16 bg-sage-100">
          <div className="container-narrow text-center">
            <h2 className="mb-4">Love what you see?</h2>
            <p className="text-charcoal-500 mb-8 max-w-lg mx-auto">
              Browse ready-made wreaths or start a bespoke enquiry for your own design.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-sage-400 hover:bg-sage-500 text-white">
                <Link href="/shop">Shop Wreaths</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-sage-400 text-sage-600 hover:bg-white"
              >
                <Link href="/bespoke">Order Bespoke</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-w-4xl bg-charcoal-900 border-none p-0"
        >
          <DialogTitle className="sr-only">
            {filteredImages[currentImageIndex]?.title || "Gallery image"}
          </DialogTitle>
          <div className="relative aspect-[4/3] bg-charcoal-800">
            {filteredImages[currentImageIndex]?.url && (
              <Image
                src={filteredImages[currentImageIndex].url!}
                alt={filteredImages[currentImageIndex].title || "Gallery image"}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 80vw"
              />
            )}

            {filteredImages.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="View previous gallery image"
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="h-6 w-6 text-white" />
                </button>
                <button
                  type="button"
                  aria-label="View next gallery image"
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="h-6 w-6 text-white" />
                </button>
              </>
            )}

            <button
              type="button"
              aria-label="Close gallery lightbox"
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 h-11 w-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>

          <div className="p-4 bg-charcoal-800">
            <p className="text-white font-medium">
              {filteredImages[currentImageIndex]?.title || "Gallery image"}
            </p>
            {filteredImages[currentImageIndex]?.category && (
              <p className="text-charcoal-400 text-sm capitalize">
                {filteredImages[currentImageIndex].category}
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
}
