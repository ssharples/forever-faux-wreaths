import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Heart, Home, Leaf, Snowflake, Sun } from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Wreath Collections | Handcrafted Faux Wreaths | Forever Faux Wreaths",
  description:
    "Browse our curated collections of handcrafted faux wreaths. Memorial wreaths, funeral tributes, door wreaths, Christmas wreaths and more. Made with love in Preston, Lancashire.",
  keywords: [
    "wreath collections",
    "faux wreaths",
    "memorial wreaths",
    "funeral wreaths",
    "door wreaths",
    "Christmas wreaths",
    "autumn wreaths",
    "Preston",
    "Lancashire",
  ],
  openGraph: {
    title: "Wreath Collections | Forever Faux Wreaths",
    description:
      "Browse our curated collections of handcrafted faux wreaths. Memorial, funeral, door, and seasonal wreaths.",
    url: "https://foreverfauxwreaths.co.uk/collections",
  },
};

const collections = [
  {
    slug: "memorial-wreaths",
    title: "Memorial Wreaths",
    subtitle: "Lasting Tributes That Never Fade",
    description:
      "Beautiful memorial wreaths crafted with care for remembering loved ones. Perfect for anniversaries, graves, and year-round remembrance.",
    icon: Heart,
    image: "/images/collections/memorial.jpg",
    color: "bg-blush-100",
    iconColor: "text-blush-500",
  },
  {
    slug: "funeral-wreaths",
    title: "Funeral Wreaths",
    subtitle: "Beautiful Tributes for Your Loved Ones",
    description:
      "Elegant funeral wreaths that stay beautiful throughout the service and beyond. No wilting, just lasting beauty.",
    icon: Heart,
    image: "/images/collections/funeral.jpg",
    color: "bg-sage-100",
    iconColor: "text-sage-600",
  },
  {
    slug: "door-wreaths",
    title: "Door Wreaths",
    subtitle: "Year-Round Elegance for Your Home",
    description:
      "Welcome guests with stunning door wreaths that last season after season. Indoor and outdoor options available.",
    icon: Home,
    image: "/images/collections/door.jpg",
    color: "bg-cream-200",
    iconColor: "text-charcoal-600",
  },
  {
    slug: "christmas-wreaths",
    title: "Christmas Wreaths",
    subtitle: "Festive Magic That Lasts",
    description:
      "Traditional and contemporary Christmas wreaths that bring festive cheer without the mess of falling needles.",
    icon: Snowflake,
    image: "/images/collections/christmas.jpg",
    color: "bg-terracotta-100",
    iconColor: "text-terracotta-500",
  },
  {
    slug: "autumn-wreaths",
    title: "Autumn Wreaths",
    subtitle: "Celebrate the Season of Harvest",
    description:
      "Rich autumnal tones and textures to bring the warmth of the season to your door. Perfect for September through November.",
    icon: Leaf,
    image: "/images/collections/autumn.jpg",
    color: "bg-gold-100",
    iconColor: "text-gold-600",
  },
];

export default function CollectionsPage() {
  return (
    <>
      <Header />

      <main className="flex-1 bg-cream-100">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-sage-50 to-cream-100 py-16 lg:py-24">
          <div className="container-wide text-center">
            <p className="font-handwritten text-xl text-sage-600 mb-4">
              Explore our range
            </p>
            <h1 className="text-4xl lg:text-5xl mb-6">Wreath Collections</h1>
            <p className="text-lg text-charcoal-500 max-w-2xl mx-auto">
              Discover our carefully curated collections of handcrafted faux
              wreaths. Each piece is made with love in Preston, Lancashire, and
              designed to bring lasting beauty to any occasion.
            </p>
          </div>
        </section>

        {/* Collections Grid */}
        <section className="py-12 lg:py-16">
          <div className="container-wide">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {collections.map((collection) => {
                const Icon = collection.icon;
                return (
                  <Link
                    key={collection.slug}
                    href={`/collections/${collection.slug}`}
                    className="group"
                  >
                    <Card className="overflow-hidden border-cream-300 hover:border-sage-300 transition-all duration-300 hover:shadow-lg h-full">
                      <div
                        className={`aspect-[4/3] relative ${collection.color} overflow-hidden`}
                      >
                        {/* Placeholder - will be replaced with actual images */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Icon
                            className={`h-16 w-16 ${collection.iconColor} opacity-30`}
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className={`h-5 w-5 ${collection.iconColor}`} />
                          <span className="text-xs uppercase tracking-wider text-charcoal-400">
                            Collection
                          </span>
                        </div>
                        <h2 className="text-xl font-display text-charcoal-700 mb-1 group-hover:text-sage-600 transition-colors">
                          {collection.title}
                        </h2>
                        <p className="text-sm text-sage-600 mb-3">
                          {collection.subtitle}
                        </p>
                        <p className="text-charcoal-500 text-sm mb-4">
                          {collection.description}
                        </p>
                        <span className="inline-flex items-center text-sm font-medium text-sage-600 group-hover:text-sage-700">
                          Browse Collection
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-sage-50">
          <div className="container-narrow text-center">
            <h2 className="text-2xl lg:text-3xl mb-4">
              Looking for Something Unique?
            </h2>
            <p className="text-charcoal-500 mb-8 max-w-xl mx-auto">
              Can&apos;t find exactly what you&apos;re looking for? Our bespoke
              service allows you to create a custom wreath tailored to your
              vision.
            </p>
            <Link
              href="/bespoke"
              className="inline-flex items-center px-6 py-3 bg-sage-400 hover:bg-sage-500 text-white rounded-md transition-colors"
            >
              Create a Bespoke Wreath
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
