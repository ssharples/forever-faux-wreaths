"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ArrowRight, Heart, ChevronRight, Truck, Clock, Award } from "lucide-react";
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
    question: "Why choose faux wreaths for funerals instead of fresh flowers?",
    answer:
      "Faux funeral wreaths offer several advantages. They won't wilt during the service, regardless of venue temperature or service length. They can be kept afterward as a lasting memorial, placed on the grave or displayed at home. They're also ideal for families who want to avoid the heartbreak of watching beautiful flowers fade in the days following the service.",
  },
  {
    question: "Can I have a funeral wreath delivered to the funeral director?",
    answer:
      "Yes, we can arrange delivery directly to funeral directors in Preston and the wider Lancashire area. Simply provide the funeral director's details when ordering, and we'll coordinate delivery timing to ensure your tribute arrives in perfect condition.",
  },
  {
    question: "What sizes are available for funeral wreaths?",
    answer:
      "Our funeral wreaths come in various sizes to suit different needs and budgets. Standard sizes range from 30cm to 50cm in diameter. For larger tributes or custom sizes, our bespoke service can create exactly what you need. We're happy to advise on appropriate sizes for different settings.",
  },
  {
    question: "How far in advance should I order a funeral wreath?",
    answer:
      "For ready-made funeral wreaths, we recommend ordering at least 3-5 days before the funeral to ensure availability and smooth delivery. For bespoke funeral tributes with specific customisation, please allow 7-10 days. For urgent requirements, contact us directly—we'll always try our best to help.",
  },
  {
    question: "Can the family keep the wreath after the funeral?",
    answer:
      "Absolutely—this is one of the main benefits of choosing a faux funeral wreath. Unlike fresh flowers that must be disposed of after wilting, our wreaths can be placed on the grave as a lasting tribute, kept at home, or given to a family member as a keepsake. Many families find comfort in having this tangible reminder.",
  },
  {
    question: "Do you offer wreaths with personal messages or ribbons?",
    answer:
      "Yes, we can add personalised satin ribbons to any funeral wreath. Choose your ribbon colour and provide your message, and we'll create a beautiful finishing touch. Popular messages include 'In Loving Memory', 'Forever in Our Hearts', or simply the loved one's name and dates.",
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

export default function FuneralWreathsPage() {
  // Fetch memorial style products (funeral wreaths typically fall under memorial)
  const products = useQuery(api.products.list, { status: "active" });
  const funeralProducts = products?.filter((p) => p.style === "memorial") || [];
  const isLoading = products === undefined;

  const faqSchema = generateFAQSchema(faqs);
  const collectionSchema = generateCollectionPageSchema(
    "Funeral Wreaths",
    "Beautiful handcrafted funeral wreaths that stay perfect throughout the service. Made in Preston, Lancashire.",
    "https://foreverfauxwreaths.co.uk/collections/funeral-wreaths"
  );
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://foreverfauxwreaths.co.uk" },
    { name: "Collections", url: "https://foreverfauxwreaths.co.uk/collections" },
    { name: "Funeral Wreaths" },
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
            <li className="text-charcoal-700 font-medium">Funeral Wreaths</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-sage-50 to-cream-100 py-12 lg:py-20">
          <div className="container-wide">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-5 w-5 text-sage-600" />
                <span className="text-sm uppercase tracking-wider text-charcoal-400">
                  Funeral Collection
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl mb-6">
                Funeral Wreaths – Beautiful Tributes for Your Loved Ones
              </h1>
              <p className="text-lg text-charcoal-500 mb-8">
                Elegant faux funeral wreaths that stay beautiful throughout the
                service and beyond. Handcrafted with care in Preston, Lancashire,
                each wreath is designed to honour your loved one with lasting
                beauty.
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
                  Create Custom Tribute
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
                <div className="w-12 h-12 rounded-full bg-sage-100 mx-auto mb-4 flex items-center justify-center">
                  <Award className="h-6 w-6 text-sage-600" />
                </div>
                <h3 className="font-display text-lg mb-2">No Wilting</h3>
                <p className="text-sm text-charcoal-500">
                  Stays perfect throughout the service, regardless of venue
                  temperature or service length.
                </p>
              </Card>
              <Card className="p-6 border-cream-300 text-center">
                <div className="w-12 h-12 rounded-full bg-sage-100 mx-auto mb-4 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-sage-600" />
                </div>
                <h3 className="font-display text-lg mb-2">Lasting Memory</h3>
                <p className="text-sm text-charcoal-500">
                  Can be kept afterward as a memorial, placed on the grave or
                  displayed at home.
                </p>
              </Card>
              <Card className="p-6 border-cream-300 text-center">
                <div className="w-12 h-12 rounded-full bg-sage-100 mx-auto mb-4 flex items-center justify-center">
                  <Truck className="h-6 w-6 text-sage-600" />
                </div>
                <h3 className="font-display text-lg mb-2">Direct Delivery</h3>
                <p className="text-sm text-charcoal-500">
                  We can deliver directly to funeral directors throughout
                  Lancashire.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="py-12 lg:py-16">
          <div className="container-wide">
            <div className="max-w-4xl mx-auto prose prose-sage">
              <h2>Why Choose Faux Funeral Wreaths?</h2>
              <p>
                During the difficult time of saying goodbye to a loved one, the
                last thing you need is to worry about flowers wilting. Traditional
                fresh funeral flowers, while beautiful, can begin to droop within
                hours—especially in warm venues or during longer services. Our
                faux funeral wreaths eliminate this concern entirely.
              </p>

              <p>
                Each funeral wreath is handcrafted using premium quality faux
                florals that look remarkably realistic. From soft roses to elegant
                lilies, delicate carnations to textured greenery, every element is
                carefully selected and arranged to create a tribute worthy of your
                loved one.
              </p>

              <h3>The Advantages of Faux Funeral Tributes</h3>
              <p>
                Families across Preston, Lancashire, and beyond are increasingly
                choosing faux funeral wreaths for several compelling reasons:
              </p>

              <ul>
                <li>
                  <strong>Perfect Throughout the Service:</strong> Whether the
                  funeral is held in a warm crematorium or a cool church, your
                  wreath will look exactly as intended from the first moment to
                  the last.
                </li>
                <li>
                  <strong>A Keepsake to Treasure:</strong> Unlike fresh flowers
                  that must be disposed of within days, a faux funeral wreath can
                  be kept indefinitely. Many families place them on the grave,
                  display them at home, or give them to a close family member as
                  a meaningful keepsake.
                </li>
                <li>
                  <strong>No Time Pressure:</strong> Fresh funeral flowers must be
                  ordered at the last minute to ensure freshness. With faux
                  wreaths, you can order in advance with confidence, reducing
                  stress during an already difficult time.
                </li>
                <li>
                  <strong>Environmentally Considered:</strong> While fresh flowers
                  are typically discarded after a few days, a faux wreath can be
                  repurposed and enjoyed for years, reducing waste.
                </li>
              </ul>

              <h3>Working with Funeral Directors</h3>
              <p>
                We have established relationships with funeral directors throughout
                Preston and Lancashire. We can arrange delivery directly to the
                funeral home, ensuring your tribute arrives in perfect condition
                and on time. Simply provide the funeral director&apos;s details when
                placing your order.
              </p>

              <p>
                If you&apos;re unsure about timing or logistics, we&apos;re always happy to
                help coordinate. Our goal is to make this aspect of funeral
                planning as stress-free as possible.
              </p>

              <h3>Choosing the Right Funeral Wreath</h3>
              <p>
                Selecting a funeral wreath is a personal decision. Consider what
                would have been meaningful to your loved one:
              </p>

              <ul>
                <li>
                  <strong>Traditional Elegance:</strong> Classic white and cream
                  arrangements convey peace, purity, and respect. These timeless
                  designs are appropriate for any funeral setting.
                </li>
                <li>
                  <strong>Soft Pastels:</strong> Gentle pinks, lavenders, and soft
                  blues offer a tender, comforting aesthetic. These work
                  beautifully for grandmothers, mothers, and others with a gentle
                  spirit.
                </li>
                <li>
                  <strong>Vibrant Colours:</strong> For those who lived life
                  colourfully, a bright arrangement can celebrate their vibrant
                  personality. Bold yellows, oranges, and reds make a statement of
                  celebration rather than mourning.
                </li>
                <li>
                  <strong>Natural & Rustic:</strong> Eucalyptus, dried-look
                  florals, and natural textures create a contemporary, organic
                  feel that appeals to those who loved the outdoors.
                </li>
              </ul>

              <h3>Personalising Your Tribute</h3>
              <p>
                Every funeral wreath can be personalised to make it truly
                meaningful. Consider adding:
              </p>

              <ul>
                <li>
                  A satin ribbon with a personal message, such as &quot;In Loving
                  Memory&quot;, &quot;Forever in Our Hearts&quot;, or simply their name
                </li>
                <li>
                  Flowers in their favourite colour or those that held special
                  meaning
                </li>
                <li>
                  Elements that reflect their interests—subtle touches that tell
                  their story
                </li>
              </ul>

              <p>
                For fully customised funeral tributes, our bespoke service allows
                you to work directly with us to create something truly unique.
                Whether you&apos;re looking for a specific colour scheme, particular
                flowers, or a non-traditional shape, we can bring your vision to
                life.
              </p>

              <h3>Pricing Guide</h3>
              <p>
                Our funeral wreaths are priced to offer excellent value while
                maintaining the highest quality. Ready-made funeral wreaths start
                from approximately £45 for smaller tributes, with larger and more
                elaborate arrangements available at higher price points. Bespoke
                funeral tributes are quoted individually based on your specific
                requirements.
              </p>

              <p>
                We believe that beautiful funeral tributes should be accessible to
                everyone, which is why we offer options across a range of budgets.
              </p>

              <h3>Delivery and Collection</h3>
              <p>
                We offer several options to suit your needs:
              </p>

              <ul>
                <li>
                  <strong>Free Local Collection:</strong> Collect from Preston at
                  no additional cost
                </li>
                <li>
                  <strong>Lancashire Delivery:</strong> We deliver throughout
                  Lancashire, including directly to funeral directors
                </li>
                <li>
                  <strong>UK-Wide Shipping:</strong> Carefully packaged wreaths
                  can be sent anywhere in the UK
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="py-12 lg:py-16 bg-cream-50">
          <div className="container-wide">
            <div className="text-center mb-12">
              <h2 className="text-3xl mb-4">Shop Funeral Wreaths</h2>
              <p className="text-charcoal-500 max-w-2xl mx-auto">
                Browse our collection of handcrafted funeral wreaths. Each piece
                is made with care to honour your loved one.
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {[...Array(4)].map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : funeralProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-sage-100 mx-auto mb-4 flex items-center justify-center">
                  <Heart className="h-8 w-8 text-sage-300" />
                </div>
                <h3 className="text-xl text-charcoal-600 mb-2">
                  No funeral wreaths currently available
                </h3>
                <p className="text-charcoal-500 mb-6">
                  Check back soon or create a custom funeral tribute with our
                  bespoke service.
                </p>
                <Button asChild>
                  <Link href="/bespoke">Create Bespoke Tribute</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {funeralProducts.map((product) => (
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
                            <Heart className="h-12 w-12 text-sage-200" />
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
                Common questions about our funeral wreaths
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
              Need a Custom Funeral Tribute?
            </h2>
            <p className="text-charcoal-500 mb-8 max-w-xl mx-auto">
              Our bespoke service allows you to create a unique funeral wreath
              tailored to your loved one. We&apos;ll work with you to bring your
              vision to life.
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
