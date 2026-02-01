"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ArrowRight, Snowflake, ChevronRight, Gift, Sparkles } from "lucide-react";
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
    question: "When should I order my Christmas wreath?",
    answer:
      "We recommend ordering your Christmas wreath in October or early November to ensure availability, especially for popular designs. Since our faux wreaths don't deteriorate, you can order early without worrying about timing. For bespoke Christmas wreaths, please allow 2-3 weeks for creation.",
  },
  {
    question: "Do faux Christmas wreaths look realistic?",
    answer:
      "Absolutely! Our Christmas wreaths are crafted with premium quality faux pine, fir, and spruce that look remarkably realistic. We carefully select materials that replicate the texture, colour, and fullness of real evergreens. Many visitors won't realise they're faux until they get close!",
  },
  {
    question: "Can I reuse my Christmas wreath next year?",
    answer:
      "Yes! This is one of the biggest advantages of choosing a faux Christmas wreath. With proper storage in a cool, dry place (ideally in a wreath storage box), your Christmas wreath will look just as beautiful next year. Many customers use the same wreath for 5+ years.",
  },
  {
    question: "Do the wreaths have lights?",
    answer:
      "Some of our Christmas wreaths come pre-decorated with battery-operated LED fairy lights. For others, we can add lights as a customisation option through our bespoke service. Let us know your preference when ordering.",
  },
  {
    question: "Are these wreaths suitable for outdoor use at Christmas?",
    answer:
      "Yes, our Christmas wreaths are suitable for outdoor front doors. They're designed to withstand winter weather. However, if using wreaths with lights outdoors, please ensure the lights are rated for outdoor use. Store wreaths undercover during particularly severe weather if possible.",
  },
  {
    question: "Can I get a matching garland or centrepiece?",
    answer:
      "We can create matching Christmas garlands and table centrepieces to complement your wreath through our bespoke service. This creates a cohesive festive look throughout your home. Contact us with your requirements for a custom quote.",
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

export default function ChristmasWreathsPage() {
  // Fetch seasonal style products for Christmas
  const products = useQuery(api.products.list, { status: "active" });
  const christmasProducts = products?.filter((p) => p.style === "seasonal") || [];
  const isLoading = products === undefined;

  const faqSchema = generateFAQSchema(faqs);
  const collectionSchema = generateCollectionPageSchema(
    "Christmas Wreaths",
    "Beautiful handcrafted Christmas wreaths that last year after year. Made in Preston, Lancashire.",
    "https://foreverfauxwreaths.co.uk/collections/christmas-wreaths"
  );
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://foreverfauxwreaths.co.uk" },
    { name: "Collections", url: "https://foreverfauxwreaths.co.uk/collections" },
    { name: "Christmas Wreaths" },
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
            <li className="text-charcoal-700 font-medium">Christmas Wreaths</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-terracotta-50 to-cream-100 py-12 lg:py-20">
          <div className="container-wide">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-4">
                <Snowflake className="h-5 w-5 text-terracotta-500" />
                <span className="text-sm uppercase tracking-wider text-charcoal-400">
                  Festive Collection
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl mb-6">
                Christmas Wreaths – Festive Magic That Lasts
              </h1>
              <p className="text-lg text-charcoal-500 mb-8">
                Celebrate the season with handcrafted Christmas wreaths that
                bring festive cheer without the mess. Made with love in Preston,
                Lancashire, our faux Christmas wreaths stay beautiful year after
                year.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="#products"
                  className="inline-flex items-center px-6 py-3 bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-md transition-colors"
                >
                  View Collection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/bespoke"
                  className="inline-flex items-center px-6 py-3 border border-terracotta-300 text-terracotta-600 hover:bg-terracotta-50 rounded-md transition-colors"
                >
                  Create Custom Design
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Cards */}
        <section className="py-12 bg-white">
          <div className="container-wide">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 border-cream-300 text-center">
                <div className="w-12 h-12 rounded-full bg-terracotta-100 mx-auto mb-4 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-terracotta-500" />
                </div>
                <h3 className="font-display text-lg mb-2">No Needle Drop</h3>
                <p className="text-sm text-charcoal-500">
                  No mess, no cleanup. Our faux pine and fir look real without
                  shedding needles everywhere.
                </p>
              </Card>
              <Card className="p-6 border-cream-300 text-center">
                <div className="w-12 h-12 rounded-full bg-terracotta-100 mx-auto mb-4 flex items-center justify-center">
                  <Gift className="h-6 w-6 text-terracotta-500" />
                </div>
                <h3 className="font-display text-lg mb-2">Reusable</h3>
                <p className="text-sm text-charcoal-500">
                  Use your Christmas wreath year after year. Store it properly
                  and enjoy for 5+ festive seasons.
                </p>
              </Card>
              <Card className="p-6 border-cream-300 text-center">
                <div className="w-12 h-12 rounded-full bg-terracotta-100 mx-auto mb-4 flex items-center justify-center">
                  <Snowflake className="h-6 w-6 text-terracotta-500" />
                </div>
                <h3 className="font-display text-lg mb-2">Order Early</h3>
                <p className="text-sm text-charcoal-500">
                  Order in October and be ready. Your wreath won&apos;t deteriorate
                  while waiting for December.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="py-12 lg:py-16">
          <div className="container-wide">
            <div className="max-w-4xl mx-auto prose prose-sage">
              <h2>Bring Festive Magic to Your Door</h2>
              <p>
                There&apos;s something magical about a Christmas wreath on the front
                door. It signals to neighbours and visitors that the festive
                season has arrived, welcoming all who approach with warmth and
                cheer. Our handcrafted faux Christmas wreaths capture that magic
                without the drawbacks of traditional fresh wreaths.
              </p>

              <p>
                Fresh Christmas wreaths, while beautiful, come with challenges.
                They dry out, drop needles, and often look tired by Boxing Day.
                Our faux alternatives stay lush and full from the day you hang
                them until you pack them away—and they&apos;ll look just as good next
                December.
              </p>

              <h3>Why Choose a Faux Christmas Wreath?</h3>
              <p>
                More and more families are discovering the benefits of faux
                Christmas wreaths:
              </p>

              <ul>
                <li>
                  <strong>No Mess:</strong> Fresh wreaths drop needles constantly,
                  especially as they dry out in heated porches. Our faux wreaths
                  stay neat and tidy throughout the season.
                </li>
                <li>
                  <strong>Early Decorating:</strong> With a faux wreath, you can
                  put up your decorations in November without worrying about it
                  looking sad by Christmas Day.
                </li>
                <li>
                  <strong>Long-Lasting Value:</strong> While a fresh wreath might
                  cost £30-50 each year, a quality faux wreath lasts for many
                  Christmases, making it excellent value over time.
                </li>
                <li>
                  <strong>Allergen-Free:</strong> For family members with pine
                  allergies or sensitivities, faux wreaths allow everyone to enjoy
                  festive décor without discomfort.
                </li>
                <li>
                  <strong>Environmentally Considered:</strong> Rather than
                  discarding a wreath each January, your faux wreath is reused
                  year after year.
                </li>
              </ul>

              <h3>Our Christmas Wreath Styles</h3>
              <p>
                We offer Christmas wreaths to suit every home and aesthetic:
              </p>

              <ul>
                <li>
                  <strong>Traditional:</strong> Classic evergreen bases with red
                  berries, pine cones, and tartan ribbon. Timeless and elegant.
                </li>
                <li>
                  <strong>Modern Minimal:</strong> Sleek designs with frosted
                  eucalyptus, white berries, and subtle metallic accents.
                </li>
                <li>
                  <strong>Rustic Natural:</strong> Woodland-inspired designs with
                  pine cones, dried oranges, cinnamon, and natural textures.
                </li>
                <li>
                  <strong>Luxe Glamour:</strong> Gold, silver, or rose gold
                  accents with premium ribbons and ornamental details.
                </li>
                <li>
                  <strong>Scandinavian:</strong> Clean, simple designs with white
                  and natural tones, embodying Nordic festive style.
                </li>
              </ul>

              <h3>When to Order</h3>
              <p>
                Unlike fresh wreaths that must be ordered at the last minute, our
                faux Christmas wreaths can be ordered well in advance. In fact, we
                recommend ordering in October or early November to ensure you get
                your preferred design. Popular styles sell out quickly as the
                season approaches.
              </p>

              <p>
                For bespoke Christmas wreaths with custom colours, specific
                elements, or coordinated sets (wreaths, garlands, and
                centrepieces), please allow 2-3 weeks for creation.
              </p>

              <h3>Caring for Your Christmas Wreath</h3>
              <p>
                To get the most from your faux Christmas wreath:
              </p>

              <ul>
                <li>
                  <strong>During the Season:</strong> Hang in a sheltered
                  position if possible. While our wreaths can handle rain and
                  cold, protection from the worst weather extends their life.
                </li>
                <li>
                  <strong>After Christmas:</strong> Gently dust off any debris
                  before storing.
                </li>
                <li>
                  <strong>Storage:</strong> Store in a wreath box or large bag in
                  a cool, dry place. Avoid crushing by placing heavier items on
                  top.
                </li>
                <li>
                  <strong>Next Year:</strong> Fluff and reshape any elements that
                  have been compressed. Your wreath is ready to hang again!
                </li>
              </ul>

              <h3>Complementary Decorations</h3>
              <p>
                Create a cohesive festive look by coordinating your wreath with
                matching garlands for staircases, mantels, or doorways. We can
                also create table centrepieces and smaller decorative pieces in
                the same style. Contact us about bespoke matching sets.
              </p>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="py-12 lg:py-16 bg-cream-50">
          <div className="container-wide">
            <div className="text-center mb-12">
              <h2 className="text-3xl mb-4">Shop Christmas Wreaths</h2>
              <p className="text-charcoal-500 max-w-2xl mx-auto">
                Browse our collection of handcrafted Christmas wreaths. Each
                piece is made with care to bring festive joy to your home.
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {[...Array(4)].map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : christmasProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-terracotta-100 mx-auto mb-4 flex items-center justify-center">
                  <Snowflake className="h-8 w-8 text-terracotta-300" />
                </div>
                <h3 className="text-xl text-charcoal-600 mb-2">
                  Christmas collection coming soon
                </h3>
                <p className="text-charcoal-500 mb-6">
                  Check back in October for our festive range, or create a custom
                  Christmas wreath now.
                </p>
                <Button asChild className="bg-terracotta-500 hover:bg-terracotta-600">
                  <Link href="/bespoke">Create Bespoke Christmas Wreath</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {christmasProducts.map((product) => (
                  <Link key={product._id} href={`/shop/${product.slug}`}>
                    <Card className="group overflow-hidden border-cream-300 hover:border-terracotta-300 transition-colors bg-white h-full !p-0 !gap-0">
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
                            <Snowflake className="h-12 w-12 text-terracotta-200" />
                          </div>
                        )}
                        {product.featured && (
                          <Badge className="absolute top-3 left-3 bg-terracotta-500 hover:bg-terracotta-500 text-white">
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
                        <h3 className="font-medium text-charcoal-600 group-hover:text-terracotta-600 transition-colors line-clamp-2 text-sm md:text-base mb-1.5 md:mb-2">
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
                className="inline-flex items-center text-terracotta-600 hover:text-terracotta-700 font-medium"
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
                Common questions about our Christmas wreaths
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="bg-white rounded-lg border border-cream-300 px-6"
                >
                  <AccordionTrigger className="text-left text-charcoal-700 hover:text-terracotta-600">
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
        <section className="py-16 bg-terracotta-50">
          <div className="container-narrow text-center">
            <h2 className="text-2xl lg:text-3xl mb-4">
              Design Your Perfect Christmas Wreath
            </h2>
            <p className="text-charcoal-500 mb-8 max-w-xl mx-auto">
              Want specific colours, matching garlands, or a unique festive
              design? Our bespoke service brings your Christmas vision to life.
            </p>
            <Link
              href="/bespoke"
              className="inline-flex items-center px-6 py-3 bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-md transition-colors"
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
