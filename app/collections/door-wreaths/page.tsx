"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ArrowRight, Home, ChevronRight, Ruler, Sun, Droplets } from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  generateFAQSchema,
  generateCollectionPageSchema,
  generateBreadcrumbSchema,
} from "@/lib/schema";
import Script from "next/script";

const faqs = [
  {
    question: "What size wreath should I choose for my door?",
    answer:
      "As a general guide, measure your door width and choose a wreath that's roughly one-third to one-half that size. For a standard UK front door (around 80cm wide), a 30-40cm wreath works beautifully. For larger doors or to make a bold statement, opt for 40-50cm. Our small wreaths (20-30cm) are perfect for interior doors, windows, or as part of a display.",
  },
  {
    question: "Can faux wreaths be used outdoors?",
    answer:
      "Yes, many of our door wreaths are suitable for outdoor use. We use UV-resistant materials that withstand the elements. However, for maximum longevity, we recommend placing your wreath where it has some shelter from direct sunlight and heavy rain—a covered porch is ideal. Even with outdoor use, you can expect years of beauty.",
  },
  {
    question: "How do I hang a wreath on my door?",
    answer:
      "The easiest method is using an over-door wreath hanger, which hooks over the top of your door without causing damage. Alternatively, you can use a sturdy ribbon attached to a small hook, or a suction cup holder for glass doors. We can add a hanging loop to any wreath if needed.",
  },
  {
    question: "Do the wreaths come with a hanger?",
    answer:
      "All our door wreaths include a secure hanging loop on the back. If you need a specific type of hanging mechanism, let us know and we can accommodate your needs. Over-door hooks are available separately from many home stores.",
  },
  {
    question: "Can I change my wreath seasonally?",
    answer:
      "Absolutely! Many customers enjoy rotating their door wreaths with the seasons. Since our faux wreaths last for years, you can build a collection of seasonal wreaths and swap them throughout the year. Store unused wreaths in a cool, dry place away from direct sunlight.",
  },
  {
    question: "How do I care for my door wreath?",
    answer:
      "Faux wreaths are low-maintenance. Simply dust occasionally with a soft brush or cloth. If outdoors, gently shake off rain and debris. Avoid harsh cleaning chemicals. When storing, keep in a breathable bag or box in a cool, dry place. With basic care, your wreath will stay beautiful for years.",
  },
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

export default function DoorWreathsPage() {
  // Fetch classic style products for door wreaths
  const products = useQuery(api.products.list, { status: "active" });
  const doorProducts = products?.filter((p) =>
    p.style === "classic" || p.style === "modern" || p.style === "rustic"
  ) || [];
  const isLoading = products === undefined;

  const faqSchema = generateFAQSchema(faqs);
  const collectionSchema = generateCollectionPageSchema(
    "Door Wreaths",
    "Beautiful handcrafted door wreaths for year-round elegance. Made in Preston, Lancashire.",
    "https://foreverfauxwreaths.co.uk/collections/door-wreaths"
  );
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://foreverfauxwreaths.co.uk" },
    { name: "Collections", url: "https://foreverfauxwreaths.co.uk/collections" },
    { name: "Door Wreaths" },
  ]);

  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Script
        id="collection-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Header />

      <main className="flex-1 bg-cream-100">
        {/* Breadcrumb */}
        <nav className="container-wide py-4" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-charcoal-500">
            <li>
              <Link href="/" className="hover:text-sage-600 transition-colors">
                Home
              </Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li>
              <Link
                href="/collections"
                className="hover:text-sage-600 transition-colors"
              >
                Collections
              </Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li className="text-charcoal-700 font-medium">Door Wreaths</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-cream-200 to-cream-100 py-12 lg:py-20">
          <div className="container-wide">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-4">
                <Home className="h-5 w-5 text-charcoal-600" />
                <span className="text-sm uppercase tracking-wider text-charcoal-400">
                  Door Collection
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl mb-6">
                Front Door Wreaths – Year-Round Elegance for Your Home
              </h1>
              <p className="text-lg text-charcoal-500 mb-8">
                Welcome guests with stunning door wreaths that last season after
                season. Handcrafted with care in Preston, Lancashire, our faux
                door wreaths bring timeless beauty to your home&apos;s entrance.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="#products"
                  className="inline-flex items-center px-6 py-3 bg-sage-400 hover:bg-sage-500 text-white rounded-md transition-colors"
                >
                  View Collection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/bespoke"
                  className="inline-flex items-center px-6 py-3 border border-sage-300 text-sage-700 hover:bg-sage-50 rounded-md transition-colors"
                >
                  Create Custom Design
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Size Guide Cards */}
        <section className="py-12 bg-white">
          <div className="container-wide">
            <h2 className="text-2xl text-center mb-8">Door Wreath Size Guide</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 border-cream-300 text-center">
                <div className="w-16 h-16 rounded-full bg-sage-100 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-xl font-display text-sage-600">S</span>
                </div>
                <h3 className="font-display text-lg mb-2">Small (20-30cm)</h3>
                <p className="text-sm text-charcoal-500 mb-3">
                  Perfect for interior doors, windows, or as part of a wall
                  display. Ideal for smaller spaces.
                </p>
                <p className="text-sage-600 font-medium">From £35</p>
              </Card>
              <Card className="p-6 border-sage-300 text-center relative">
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sage-400">
                  Most Popular
                </Badge>
                <div className="w-16 h-16 rounded-full bg-sage-100 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-xl font-display text-sage-600">M</span>
                </div>
                <h3 className="font-display text-lg mb-2">Medium (30-40cm)</h3>
                <p className="text-sm text-charcoal-500 mb-3">
                  The perfect size for most standard UK front doors. Creates
                  beautiful impact without overwhelming.
                </p>
                <p className="text-sage-600 font-medium">From £50</p>
              </Card>
              <Card className="p-6 border-cream-300 text-center">
                <div className="w-16 h-16 rounded-full bg-sage-100 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-xl font-display text-sage-600">L</span>
                </div>
                <h3 className="font-display text-lg mb-2">Large (40-50cm)</h3>
                <p className="text-sm text-charcoal-500 mb-3">
                  Statement pieces for larger doors or to create maximum impact.
                  Ideal for grand entrances.
                </p>
                <p className="text-sage-600 font-medium">From £65</p>
              </Card>
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="py-12 lg:py-16">
          <div className="container-wide">
            <div className="max-w-4xl mx-auto prose prose-sage">
              <h2>Transform Your Home with a Beautiful Door Wreath</h2>
              <p>
                Your front door is the first thing guests see when they visit your
                home. It sets the tone for what lies within and creates that all-
                important first impression. A beautiful door wreath transforms an
                ordinary entrance into something special—a warm welcome that speaks
                of care and attention to detail.
              </p>

              <p>
                Our handcrafted faux door wreaths offer the beauty of fresh
                flowers without the constant maintenance. Made with premium
                quality artificial florals and foliage, they stay beautiful
                through every season, requiring nothing more than an occasional
                dusting.
              </p>

              <h3>Why Choose Faux Door Wreaths?</h3>
              <p>
                Traditional fresh wreaths have their charm, but they come with
                significant drawbacks. They wilt, shed needles or petals, and need
                replacing every few weeks. Our faux door wreaths offer a better
                alternative:
              </p>

              <ul>
                <li>
                  <strong>Year-Round Beauty:</strong> Display your wreath all
                  year or rotate seasonally—either way, it remains perfect with
                  no maintenance.
                </li>
                <li>
                  <strong>Weather Resistant:</strong> Our wreaths are designed
                  for the British climate. Rain, wind, and humidity won&apos;t
                  damage them.
                </li>
                <li>
                  <strong>Cost Effective:</strong> While a fresh wreath might
                  cost £30-50 and last a few weeks, our wreaths last for years,
                  making them incredibly economical over time.
                </li>
                <li>
                  <strong>No Mess:</strong> No falling leaves, no dropping
                  petals, no debris on your doorstep.
                </li>
                <li>
                  <strong>Allergy Friendly:</strong> Perfect for households with
                  hay fever sufferers.
                </li>
              </ul>

              <h3>Styles to Suit Every Home</h3>
              <p>
                Whether your home is a Victorian terrace, a modern new-build, or
                a charming country cottage, we have door wreaths to complement
                your style:
              </p>

              <ul>
                <li>
                  <strong>Classic Elegance:</strong> Timeless designs featuring
                  roses, hydrangeas, and traditional greenery. Perfect for period
                  properties and those who appreciate traditional aesthetics.
                </li>
                <li>
                  <strong>Modern Minimal:</strong> Contemporary designs with clean
                  lines, eucalyptus, and subtle colour palettes. Ideal for modern
                  homes and minimalist tastes.
                </li>
                <li>
                  <strong>Rustic Charm:</strong> Natural textures, dried-look
                  florals, and earthy tones. Perfect for country cottages and
                  farmhouse-style homes.
                </li>
                <li>
                  <strong>Seasonal Themes:</strong> Spring pastels, summer
                  brights, autumn warmth, or festive Christmas designs to
                  celebrate each season.
                </li>
              </ul>

              <h3>Indoor vs Outdoor Use</h3>
              <p>
                While our door wreaths are designed primarily for external doors,
                they&apos;re equally stunning indoors. Consider using them on:
              </p>

              <ul>
                <li>Interior doors between rooms</li>
                <li>Above fireplaces as a decorative focal point</li>
                <li>On walls as year-round art</li>
                <li>As centerpiece bases for table displays</li>
              </ul>

              <p>
                For outdoor use, we recommend positioning your wreath where it has
                some protection from harsh weather—a covered porch or inset
                doorway is ideal. This ensures maximum longevity while still
                creating that welcoming entrance.
              </p>

              <h3>Measuring Your Door</h3>
              <p>
                Choosing the right size wreath is important for creating the best
                visual impact. Here&apos;s a simple guide:
              </p>

              <ol>
                <li>Measure the width of your door</li>
                <li>
                  Choose a wreath that&apos;s roughly one-third to one-half that width
                </li>
                <li>
                  For a standard 80cm UK front door, this means a wreath of
                  around 30-40cm works perfectly
                </li>
                <li>
                  Larger doors or those making a bold statement may suit 40-50cm
                  wreaths
                </li>
              </ol>

              <p>
                If in doubt, slightly smaller often looks more refined than
                something too large. However, for contemporary homes with
                oversized doors, don&apos;t be afraid to go big!
              </p>

              <h3>Caring for Your Door Wreath</h3>
              <p>
                One of the joys of faux wreaths is their minimal maintenance
                requirements. To keep your wreath looking its best:
              </p>

              <ul>
                <li>Dust gently with a soft brush or cloth every few weeks</li>
                <li>
                  After heavy rain, give your wreath a gentle shake to remove
                  water droplets
                </li>
                <li>
                  Avoid placing in direct, prolonged sunlight if possible—UV rays
                  can cause fading over time
                </li>
                <li>
                  When storing seasonally, keep in a cool, dry place in a
                  breathable bag or box
                </li>
              </ul>

              <p>
                With these simple steps, your door wreath will remain beautiful
                for years to come.
              </p>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="py-12 lg:py-16 bg-cream-50">
          <div className="container-wide">
            <div className="text-center mb-12">
              <h2 className="text-3xl mb-4">Shop Door Wreaths</h2>
              <p className="text-charcoal-500 max-w-2xl mx-auto">
                Browse our collection of handcrafted door wreaths. Each piece is
                made with care to bring lasting beauty to your home.
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {[...Array(4)].map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : doorProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-sage-100 mx-auto mb-4 flex items-center justify-center">
                  <Home className="h-8 w-8 text-sage-300" />
                </div>
                <h3 className="text-xl text-charcoal-600 mb-2">
                  No door wreaths currently available
                </h3>
                <p className="text-charcoal-500 mb-6">
                  Check back soon or create a custom door wreath with our bespoke
                  service.
                </p>
                <Button asChild>
                  <Link href="/bespoke">Create Bespoke Wreath</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {doorProducts.map((product) => (
                  <Link key={product._id} href={`/shop/${product.slug}`}>
                    <Card className="group overflow-hidden border-cream-300 hover:border-sage-300 transition-colors bg-white h-full !p-0 !gap-0">
                      <div className="aspect-square relative bg-cream-50 overflow-hidden">
                        {product.imageUrls[0] ? (
                          <Image
                            src={product.imageUrls[0]}
                            alt={product.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Home className="h-12 w-12 text-cream-300" />
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
                      </div>
                      <CardContent className="p-3 md:p-4">
                        <h3 className="font-medium text-charcoal-600 group-hover:text-sage-600 transition-colors line-clamp-2 text-sm md:text-base mb-1.5 md:mb-2">
                          {product.title}
                        </h3>
                        <div className="flex items-center justify-between gap-2">
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

            <div className="text-center mt-12">
              <Link
                href="/shop"
                className="inline-flex items-center text-sage-600 hover:text-sage-700 font-medium"
              >
                View all products in shop
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 lg:py-16">
          <div className="container-narrow">
            <div className="text-center mb-12">
              <h2 className="text-3xl mb-4">Frequently Asked Questions</h2>
              <p className="text-charcoal-500">
                Common questions about our door wreaths
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="bg-white rounded-lg border border-cream-300 px-6"
                >
                  <AccordionTrigger className="text-left text-charcoal-700 hover:text-sage-600">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-charcoal-500">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-sage-50">
          <div className="container-narrow text-center">
            <h2 className="text-2xl lg:text-3xl mb-4">
              Want Something Unique for Your Door?
            </h2>
            <p className="text-charcoal-500 mb-8 max-w-xl mx-auto">
              Our bespoke service allows you to create a custom door wreath that
              perfectly matches your home&apos;s style and your personal taste.
            </p>
            <Link
              href="/bespoke"
              className="inline-flex items-center px-6 py-3 bg-sage-400 hover:bg-sage-500 text-white rounded-md transition-colors"
            >
              Start Your Bespoke Order
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
