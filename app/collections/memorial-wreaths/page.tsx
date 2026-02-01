"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ArrowRight, Heart, ChevronRight, Loader2 } from "lucide-react";
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
    question: "How long do faux memorial wreaths last?",
    answer:
      "Our faux memorial wreaths are designed to last for years with proper care. Unlike fresh flowers that wilt within days, these handcrafted pieces maintain their beauty through all seasons. Many customers keep the same memorial wreath for 3-5 years or longer, making them a meaningful and cost-effective choice for honouring loved ones.",
  },
  {
    question: "Can memorial wreaths be displayed outdoors?",
    answer:
      "Yes, many of our memorial wreaths are suitable for outdoor display. We use high-quality UV-resistant materials that withstand the elements. However, for maximum longevity, we recommend placing them in a sheltered location away from direct sunlight and heavy rain. Indoor memorial wreaths are also popular for home shrines and remembrance corners.",
  },
  {
    question: "Can I customise a memorial wreath with specific colours or flowers?",
    answer:
      "Absolutely! Our bespoke service allows you to create a fully customised memorial wreath. You can choose specific colours that held meaning for your loved one, include their favourite flowers (in faux form), or incorporate special elements like ribbon with personalised messages. Simply fill out our bespoke enquiry form with your vision.",
  },
  {
    question: "Are these wreaths suitable for grave decoration?",
    answer:
      "Yes, our memorial wreaths are perfect for grave decoration. They're particularly popular because they don't require regular replacement like fresh flowers. They remain beautiful through rain, wind, and changing seasons, ensuring your loved one's resting place always looks cared for.",
  },
  {
    question: "What's the difference between memorial and funeral wreaths?",
    answer:
      "While there's overlap, memorial wreaths are typically designed for ongoing remembrance—placed on graves, at home shrines, or displayed during anniversaries. Funeral wreaths are specifically designed for funeral services and may include different styling. We offer both types, and many customers use funeral wreaths as lasting memorial pieces afterward.",
  },
  {
    question: "Do you offer same-day or next-day delivery for memorial wreaths?",
    answer:
      "We aim to dispatch ready-made memorial wreaths within 1-3 business days. For urgent requirements, please contact us directly and we'll do our best to accommodate your needs. Local customers in Preston can often arrange same-day collection. Bespoke memorial wreaths require additional creation time of 5-7 days.",
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

export default function MemorialWreathsPage() {
  // Fetch memorial style products from Convex
  const products = useQuery(api.products.list, { status: "active" });
  const memorialProducts = products?.filter((p) => p.style === "memorial") || [];
  const isLoading = products === undefined;

  const faqSchema = generateFAQSchema(faqs);
  const collectionSchema = generateCollectionPageSchema(
    "Memorial Wreaths",
    "Beautiful handcrafted memorial wreaths that last forever. Perfect for remembering loved ones.",
    "https://foreverfauxwreaths.co.uk/collections/memorial-wreaths"
  );
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://foreverfauxwreaths.co.uk" },
    { name: "Collections", url: "https://foreverfauxwreaths.co.uk/collections" },
    { name: "Memorial Wreaths" },
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
            <li className="text-charcoal-700 font-medium">Memorial Wreaths</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blush-50 to-cream-100 py-12 lg:py-20">
          <div className="container-wide">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-5 w-5 text-blush-500" />
                <span className="text-sm uppercase tracking-wider text-charcoal-400">
                  Memorial Collection
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl mb-6">
                Memorial Wreaths – Lasting Tributes That Never Fade
              </h1>
              <p className="text-lg text-charcoal-500 mb-8">
                Honour the memory of your loved ones with our handcrafted
                memorial wreaths. Each piece is made with care in Preston,
                Lancashire, designed to provide a lasting tribute that remains
                beautiful through every season.
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
                  Create Custom Memorial
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="py-12 lg:py-16">
          <div className="container-wide">
            <div className="max-w-4xl mx-auto prose prose-sage">
              <h2>Why Choose Faux Memorial Wreaths?</h2>
              <p>
                When it comes to honouring those we&apos;ve lost, the choice of
                memorial arrangement matters deeply. Fresh flowers, while
                beautiful, fade within days—leaving graves and memorial sites
                looking neglected between visits. Our faux memorial wreaths
                offer a meaningful alternative: lasting tributes that maintain
                their beauty for years, ensuring your loved one&apos;s memory is
                always surrounded by beauty.
              </p>

              <p>
                Each memorial wreath in our collection is handcrafted with
                premium quality faux florals and foliage. We carefully select
                materials that look remarkably realistic while withstanding the
                test of time. From delicate roses to textured eucalyptus, every
                element is chosen for both its beauty and durability.
              </p>

              <h3>The Benefits of Faux Memorial Wreaths</h3>
              <p>
                There are many reasons why families across Lancashire and beyond
                are choosing faux memorial wreaths over fresh alternatives:
              </p>

              <ul>
                <li>
                  <strong>Lasting Beauty:</strong> Unlike fresh flowers that
                  wilt within a week, our memorial wreaths remain beautiful for
                  years. This means your loved one&apos;s resting place or memorial
                  space always looks cared for, even between visits.
                </li>
                <li>
                  <strong>Weather Resistant:</strong> Preston weather can be
                  unpredictable. Our wreaths are designed to withstand rain,
                  wind, and changing temperatures without deteriorating.
                </li>
                <li>
                  <strong>Cost-Effective:</strong> While the initial investment
                  may be similar to fresh flowers, a faux memorial wreath
                  doesn&apos;t need replacing every week or fortnight. Over time,
                  this represents significant savings.
                </li>
                <li>
                  <strong>Low Maintenance:</strong> No watering, no dead-heading,
                  no cleanup. Simply place your wreath and know it will stay
                  beautiful with minimal attention.
                </li>
                <li>
                  <strong>Allergy-Friendly:</strong> For those with hay fever or
                  pollen allergies, faux florals provide the beauty of flowers
                  without triggering symptoms.
                </li>
              </ul>

              <h3>Popular Memorial Wreath Styles</h3>
              <p>
                Our memorial collection includes a variety of styles to suit
                different preferences and memorial settings. Whether you prefer
                traditional arrangements with roses and lilies, or contemporary
                designs featuring eucalyptus and dried-look florals, we have
                options to match your vision.
              </p>

              <p>
                Many customers choose soft, neutral tones—creams, whites, and
                sage greens—that convey peace and tranquillity. Others prefer
                more colourful arrangements that celebrate their loved one&apos;s
                vibrant personality. Pink roses for a grandmother who loved her
                garden, deep burgundy for someone with a rich, passionate spirit,
                or cheerful sunflowers for those who brought sunshine into every
                room.
              </p>

              <h3>Placing Your Memorial Wreath</h3>
              <p>
                Memorial wreaths can be displayed in many ways. Common placements
                include:
              </p>

              <ul>
                <li>
                  Grave headstones and memorials in cemeteries
                </li>
                <li>
                  Memorial benches in gardens or parks
                </li>
                <li>
                  Home remembrance corners or shrines
                </li>
                <li>
                  Anniversary and birthday tributes
                </li>
                <li>
                  Pet memorial gardens
                </li>
              </ul>

              <p>
                Wherever you choose to place your memorial wreath, it serves as a
                beautiful reminder of the love you shared and the memories you
                cherish.
              </p>

              <h3>Customising Your Memorial Tribute</h3>
              <p>
                While our ready-made memorial wreaths are carefully designed to
                suit most preferences, we understand that sometimes you need
                something truly personal. Our bespoke service allows you to work
                directly with us to create a custom memorial wreath that
                perfectly honours your loved one.
              </p>

              <p>
                You might want to incorporate their favourite flowers, use colours
                that held special meaning, or include specific elements like
                ribbon in their favourite shade. Some customers request wreaths
                that match the colours of their loved one&apos;s favourite sports
                team, or include subtle references to their hobbies and passions.
              </p>

              <h3>Caring for Your Memorial Wreath</h3>
              <p>
                To ensure your memorial wreath remains beautiful for as long as
                possible, we recommend:
              </p>

              <ul>
                <li>
                  Placing in a sheltered location when possible to protect from
                  extreme weather
                </li>
                <li>
                  Gently dusting or brushing off debris periodically
                </li>
                <li>
                  Avoiding prolonged exposure to direct sunlight, which can cause
                  fading over time
                </li>
                <li>
                  Storing indoors during particularly harsh winter months if
                  desired
                </li>
              </ul>

              <p>
                With proper care, your memorial wreath will continue to provide a
                beautiful tribute for many years to come.
              </p>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="py-12 lg:py-16 bg-cream-50">
          <div className="container-wide">
            <div className="text-center mb-12">
              <h2 className="text-3xl mb-4">Shop Memorial Wreaths</h2>
              <p className="text-charcoal-500 max-w-2xl mx-auto">
                Browse our collection of handcrafted memorial wreaths. Each piece
                is made with care and designed to honour your loved one&apos;s memory.
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {[...Array(4)].map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : memorialProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-sage-100 mx-auto mb-4 flex items-center justify-center">
                  <Heart className="h-8 w-8 text-sage-300" />
                </div>
                <h3 className="text-xl text-charcoal-600 mb-2">
                  No memorial wreaths currently available
                </h3>
                <p className="text-charcoal-500 mb-6">
                  Check back soon or create a custom memorial wreath with our
                  bespoke service.
                </p>
                <Button asChild>
                  <Link href="/bespoke">Create Bespoke Memorial</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {memorialProducts.map((product) => (
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
                            <Heart className="h-12 w-12 text-blush-200" />
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
                href="/shop?style=memorial"
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
                Common questions about our memorial wreaths
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
              Create a Personal Memorial Tribute
            </h2>
            <p className="text-charcoal-500 mb-8 max-w-xl mx-auto">
              Want something truly unique? Our bespoke service allows you to
              design a custom memorial wreath that perfectly honours your loved
              one&apos;s memory.
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
