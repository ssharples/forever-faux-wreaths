"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ArrowRight, Leaf, ChevronRight, Sun, Droplets } from "lucide-react";
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
    question: "When is the best time to display an autumn wreath?",
    answer:
      "Autumn wreaths are typically displayed from late August or early September through to late November. Many people put them up when the first leaves start changing colour and keep them until they switch to Christmas decorations. The beauty of faux wreaths is you can put them up whenever you like without worrying about freshness.",
  },
  {
    question: "What colours are typical in autumn wreaths?",
    answer:
      "Autumn wreaths typically feature warm, rich tones: burnt oranges, deep reds, golden yellows, burgundy, rust, and bronze. These are often combined with natural browns and cream for a balanced, organic look. We can create wreaths in any autumn palette to suit your preferences.",
  },
  {
    question: "Can autumn wreaths be used outdoors?",
    answer:
      "Yes! Our autumn wreaths are designed to withstand outdoor conditions. The materials we use are weather-resistant, though as with all faux floral arrangements, they'll last longest with some protection from extreme weather and direct sunlight.",
  },
  {
    question: "Do you use real dried elements in your autumn wreaths?",
    answer:
      "We primarily use high-quality faux materials that replicate the look of dried florals and autumn foliage. This ensures durability and consistency. However, we can incorporate preserved or dried elements on request—just note these may be more fragile and better suited to indoor display.",
  },
  {
    question: "Can I store my autumn wreath and reuse it next year?",
    answer:
      "Absolutely! Store your autumn wreath in a cool, dry place away from direct sunlight. A wreath box or large bag helps protect it from dust and crushing. Properly stored, your autumn wreath will look beautiful for many seasons to come.",
  },
  {
    question: "Do you make harvest-themed wreaths for Thanksgiving?",
    answer:
      "While we're UK-based, we can certainly create harvest or Thanksgiving-themed wreaths for customers who celebrate. Our autumn collection captures the essence of the harvest season, or we can create bespoke designs with specific harvest elements you have in mind.",
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

export default function AutumnWreathsPage() {
  // Fetch seasonal style products for autumn
  const products = useQuery(api.products.list, { status: "active" });
  const autumnProducts = products?.filter((p) => p.style === "seasonal" || p.style === "rustic") || [];
  const isLoading = products === undefined;

  const faqSchema = generateFAQSchema(faqs);
  const collectionSchema = generateCollectionPageSchema(
    "Autumn Wreaths",
    "Beautiful handcrafted autumn wreaths celebrating the season of harvest. Made in Preston, Lancashire.",
    "https://foreverfauxwreaths.co.uk/collections/autumn-wreaths"
  );
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://foreverfauxwreaths.co.uk" },
    { name: "Collections", url: "https://foreverfauxwreaths.co.uk/collections" },
    { name: "Autumn Wreaths" },
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
            <li className="text-charcoal-700 font-medium">Autumn Wreaths</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-gold-100 to-cream-100 py-12 lg:py-20">
          <div className="container-wide">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="h-5 w-5 text-gold-600" />
                <span className="text-sm uppercase tracking-wider text-charcoal-400">
                  Autumn Collection
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl mb-6">
                Autumn Wreaths – Celebrate the Season of Harvest
              </h1>
              <p className="text-lg text-charcoal-500 mb-8">
                Embrace the warmth and richness of autumn with our handcrafted
                fall wreaths. Made with love in Preston, Lancashire, each piece
                captures the beauty of the season with colours that never fade.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="#products"
                  className="inline-flex items-center px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white rounded-md transition-colors"
                >
                  View Collection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/bespoke"
                  className="inline-flex items-center px-6 py-3 border border-gold-300 text-gold-700 hover:bg-gold-50 rounded-md transition-colors"
                >
                  Create Custom Design
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Colour Palette */}
        <section className="py-12 bg-white">
          <div className="container-wide">
            <h2 className="text-2xl text-center mb-8">Autumn Colour Palette</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-amber-500 mx-auto mb-2 shadow-md" />
                <span className="text-sm text-charcoal-500">Amber</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-orange-600 mx-auto mb-2 shadow-md" />
                <span className="text-sm text-charcoal-500">Burnt Orange</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-red-800 mx-auto mb-2 shadow-md" />
                <span className="text-sm text-charcoal-500">Burgundy</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-yellow-600 mx-auto mb-2 shadow-md" />
                <span className="text-sm text-charcoal-500">Golden</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-amber-800 mx-auto mb-2 shadow-md" />
                <span className="text-sm text-charcoal-500">Rust</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-yellow-100 mx-auto mb-2 shadow-md border border-cream-300" />
                <span className="text-sm text-charcoal-500">Cream</span>
              </div>
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="py-12 lg:py-16">
          <div className="container-wide">
            <div className="max-w-4xl mx-auto prose prose-sage">
              <h2>Welcome Autumn to Your Home</h2>
              <p>
                As summer fades and the days grow shorter, there&apos;s something
                magical about watching nature transform. Leaves turn from green to
                gold, orange, and red. The air becomes crisp, and thoughts turn to
                cosy evenings and warm gatherings. Our autumn wreaths capture this
                seasonal magic, bringing the warmth and richness of fall to your
                front door.
              </p>

              <p>
                Unlike fresh autumn decorations that fade and dry out, our faux
                autumn wreaths maintain their vibrant colours and textures
                throughout the season. Display them from September through November
                and enjoy the same stunning appearance from the first day to the
                last.
              </p>

              <h3>The Beauty of Autumn Wreaths</h3>
              <p>
                Autumn wreaths offer a unique aesthetic that bridges the gap
                between summer&apos;s brightness and winter&apos;s festivity. They
                celebrate the harvest season, the changing leaves, and the cosy
                atmosphere of fall. Here&apos;s what makes our autumn wreaths special:
              </p>

              <ul>
                <li>
                  <strong>Rich Colour Palette:</strong> Burnt oranges, deep reds,
                  golden yellows, burgundy, and rust combine to create warm,
                  inviting displays.
                </li>
                <li>
                  <strong>Textural Interest:</strong> We incorporate a variety of
                  elements—faux leaves, berries, pine cones, wheat, and dried-look
                  florals—for visual depth.
                </li>
                <li>
                  <strong>Long-Lasting Beauty:</strong> Our faux materials don&apos;t
                  crumble, fade, or deteriorate like real dried flowers and
                  leaves.
                </li>
                <li>
                  <strong>Reusable:</strong> Store your autumn wreath properly
                  and enjoy it for many seasons to come.
                </li>
              </ul>

              <h3>Popular Autumn Wreath Elements</h3>
              <p>
                Our autumn wreaths may feature a variety of seasonal elements:
              </p>

              <ul>
                <li>
                  <strong>Faux Foliage:</strong> Maple leaves, oak leaves, and
                  autumn branches in shades of red, orange, and gold.
                </li>
                <li>
                  <strong>Berries:</strong> Orange bittersweet, red rosehips, and
                  burgundy berries add pops of colour.
                </li>
                <li>
                  <strong>Pine Cones:</strong> Natural or touched with gold or
                  cream for a rustic accent.
                </li>
                <li>
                  <strong>Wheat and Grasses:</strong> Symbolic of the harvest,
                  adding texture and movement.
                </li>
                <li>
                  <strong>Gourds and Pumpkins:</strong> Mini faux pumpkins and
                  gourds in traditional or muted colours.
                </li>
                <li>
                  <strong>Dried-Look Florals:</strong> Sunflowers, chrysanthemums,
                  and dahlias in autumn tones.
                </li>
                <li>
                  <strong>Ribbon:</strong> Burlap, velvet, or grosgrain in
                  coordinating colours.
                </li>
              </ul>

              <h3>Styling Your Autumn Wreath</h3>
              <p>
                An autumn wreath makes a beautiful addition to various spaces:
              </p>

              <ul>
                <li>
                  <strong>Front Door:</strong> The classic placement, welcoming
                  visitors with seasonal warmth.
                </li>
                <li>
                  <strong>Interior Doors:</strong> Bring autumn inside by hanging
                  on a bedroom, kitchen, or closet door.
                </li>
                <li>
                  <strong>Above Fireplace:</strong> A perfect focal point for
                  autumn gatherings.
                </li>
                <li>
                  <strong>Wall Display:</strong> Hang on a prominent wall as
                  seasonal art.
                </li>
                <li>
                  <strong>Dining Table:</strong> Lay flat as a unique table
                  centrepiece, perhaps with a candle in the centre.
                </li>
              </ul>

              <h3>When to Display</h3>
              <p>
                The traditional autumn wreath season runs from late August or early
                September through late November, though there are no strict rules.
                Many people put up their autumn wreaths when:
              </p>

              <ul>
                <li>School is back in session and summer holidays end</li>
                <li>The first leaves begin to change colour</li>
                <li>After the August bank holiday</li>
                <li>When they feel ready to embrace the cosy autumn atmosphere</li>
              </ul>

              <p>
                Autumn wreaths are typically taken down when Christmas decorations
                go up, usually in late November or early December.
              </p>

              <h3>Caring for Your Autumn Wreath</h3>
              <p>
                To keep your autumn wreath looking beautiful:
              </p>

              <ul>
                <li>
                  <strong>Outdoors:</strong> Position in a sheltered location when
                  possible. Shake off water after rain.
                </li>
                <li>
                  <strong>Cleaning:</strong> Dust gently with a soft brush or use
                  a hairdryer on a cool setting.
                </li>
                <li>
                  <strong>Storage:</strong> Store in a wreath box or large bag in
                  a cool, dry location away from sunlight.
                </li>
                <li>
                  <strong>Next Season:</strong> Fluff and reshape any compressed
                  elements before rehanging.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="py-12 lg:py-16 bg-cream-50">
          <div className="container-wide">
            <div className="text-center mb-12">
              <h2 className="text-3xl mb-4">Shop Autumn Wreaths</h2>
              <p className="text-charcoal-500 max-w-2xl mx-auto">
                Browse our collection of handcrafted autumn wreaths. Each piece
                captures the warmth and beauty of the harvest season.
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {[...Array(4)].map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : autumnProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-gold-100 mx-auto mb-4 flex items-center justify-center">
                  <Leaf className="h-8 w-8 text-gold-400" />
                </div>
                <h3 className="text-xl text-charcoal-600 mb-2">
                  Autumn collection coming soon
                </h3>
                <p className="text-charcoal-500 mb-6">
                  Check back in August for our autumn range, or create a custom
                  autumn wreath now.
                </p>
                <Button asChild className="bg-gold-500 hover:bg-gold-600">
                  <Link href="/bespoke">Create Bespoke Autumn Wreath</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {autumnProducts.map((product) => (
                  <Link key={product._id} href={`/shop/${product.slug}`}>
                    <Card className="group overflow-hidden border-cream-300 hover:border-gold-300 transition-colors bg-white h-full !p-0 !gap-0">
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
                            <Leaf className="h-12 w-12 text-gold-200" />
                          </div>
                        )}
                        {product.featured && (
                          <Badge className="absolute top-3 left-3 bg-gold-500 hover:bg-gold-500 text-white">
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
                        <h3 className="font-medium text-charcoal-600 group-hover:text-gold-600 transition-colors line-clamp-2 text-sm md:text-base mb-1.5 md:mb-2">
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
                href="/shop?style=seasonal"
                className="inline-flex items-center text-gold-600 hover:text-gold-700 font-medium"
              >
                View all seasonal products
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
                Common questions about our autumn wreaths
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="bg-white rounded-lg border border-cream-300 px-6"
                >
                  <AccordionTrigger className="text-left text-charcoal-700 hover:text-gold-600">
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
        <section className="py-16 bg-gold-50">
          <div className="container-narrow text-center">
            <h2 className="text-2xl lg:text-3xl mb-4">
              Create Your Perfect Autumn Wreath
            </h2>
            <p className="text-charcoal-500 mb-8 max-w-xl mx-auto">
              Want specific autumn colours, particular elements, or a unique
              size? Our bespoke service lets you design exactly what you&apos;re
              looking for.
            </p>
            <Link
              href="/bespoke"
              className="inline-flex items-center px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white rounded-md transition-colors"
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
