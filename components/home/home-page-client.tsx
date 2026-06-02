"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, Heart, Truck, Sparkles, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Header, Footer, SeasonalBanner } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { FeaturedProducts } from "@/components/home/featured-products";
import type { FeaturedProduct } from "@/lib/storefront";
type FeaturedReview = {
  _id: string;
  customerName: string;
  rating: number;
  text: string;
};

type FeaturedGalleryImage = {
  _id: string;
  url: string | null;
  title?: string;
  category?: string;
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? "fill-gold-400 text-gold-400" : "fill-cream-400 text-cream-400"
          }`}
        />
      ))}
    </div>
  );
}

type HomePageClientProps = {
  featuredProducts: FeaturedProduct[];
  featuredReviews: FeaturedReview[];
  featuredGalleryImages: FeaturedGalleryImage[];
};

export function HomePageClient({
  featuredProducts,
  featuredReviews,
  featuredGalleryImages,
}: HomePageClientProps) {
  return (
    <>
      <SeasonalBanner
        text="Free local collection available in Preston, Lancashire"
        variant="sage"
        enabled={true}
      />
      <Header />

      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-b from-cream-100 to-cream-200">
          <div className="container-wide section-padding">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                className="max-w-xl"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.p
                  className="font-handwritten text-2xl text-sage-500 mb-4"
                  variants={fadeInUp}
                >
                  Handcrafted with love
                </motion.p>
                <motion.h1
                  className="hero-title text-balance mb-6"
                  variants={fadeInUp}
                >
                  Beautiful faux florals for every season
                </motion.h1>
                <motion.p
                  className="text-lg text-charcoal-500 mb-8 leading-relaxed"
                  variants={fadeInUp}
                >
                  Each wreath is lovingly handcrafted in Preston, Lancashire.
                  From classic door wreaths to bespoke memorial designs, we
                  create lasting beauty that brings joy all year round.
                </motion.p>
                <motion.div
                  className="flex flex-col sm:flex-row gap-4"
                  variants={fadeInUp}
                >
                  <Button
                    asChild
                    size="lg"
                    className="bg-sage-400 hover:bg-sage-500 text-white"
                  >
                    <Link href="/shop">
                      Shop Wreaths
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-sage-400 text-sage-600 hover:bg-sage-50"
                  >
                    <Link href="/bespoke">Order Bespoke</Link>
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.3,
                  ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
                }}
              >
                <div className="aspect-square rounded-full bg-sage-100/50 absolute -top-10 -right-10 w-[120%] h-[120%] -z-10" />
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-cream-300">
                  <Image
                    src="/images/hero/hero-banner.webp"
                    alt="Beautiful handcrafted faux floral wreath"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </motion.div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-cream-100 to-transparent" />
        </section>

        <section className="bg-cream-100 py-6 md:py-8 border-y border-cream-300">
          <div className="container-wide">
            <motion.div
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
            >
              {[
                { icon: Heart, title: "Handcrafted", subtitle: "With love & care" },
                { icon: Truck, title: "UK Delivery", subtitle: "Careful packaging" },
                { icon: Sparkles, title: "Bespoke Orders", subtitle: "Custom designs" },
                { icon: Star, title: "5 Star Reviews", subtitle: "Happy customers" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-center justify-center gap-2 md:gap-3"
                  variants={fadeInUp}
                >
                  <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-sage-100 flex items-center justify-center shrink-0">
                    <item.icon className="h-4 w-4 md:h-5 md:w-5 text-sage-500" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm font-medium text-charcoal-600">
                      {item.title}
                    </p>
                    <p className="text-[10px] md:text-xs text-charcoal-400">{item.subtitle}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="section-padding bg-cream-100">
          <div className="container-wide">
            <motion.div
              className="text-center mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <h2 className="text-balance mb-4">Featured Wreaths</h2>
              <p className="text-charcoal-500 max-w-2xl mx-auto">
                Discover our most popular handcrafted designs, ready to bring
                beauty to your home
              </p>
            </motion.div>

            <FeaturedProducts products={featuredProducts} />

            <motion.div
              className="text-center mt-10"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-sage-400 text-sage-600 hover:bg-sage-50"
              >
                <Link href="/shop">
                  View All Wreaths
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        <section className="bg-white py-10">
          <div className="container-wide">
            <motion.div
              className="grid gap-6 rounded-lg border border-sage-200 bg-sage-50 p-6 md:grid-cols-[auto_1fr_auto] md:items-center md:p-8"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94] as const,
              }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                <ShieldCheck className="h-6 w-6 text-sage-600" />
              </div>
              <div>
                <p className="font-handwritten text-xl text-sage-600">
                  Launching soon
                </p>
                <h2 className="mt-1 text-2xl text-charcoal-700">
                  Forever Faux Memorial Topper
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-charcoal-500">
                  A patent pending memorial product designed to help keep
                  graveside flowers and tributes secure. Waiting list and
                  wholesale enquiries are now open.
                </p>
              </div>
              <Button
                asChild
                size="lg"
                className="min-h-12 bg-sage-400 text-white hover:bg-sage-500"
              >
                <Link href="/memorial-topper">
                  View Memorial Topper
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        <section className="section-padding bg-sage-100 overflow-hidden">
          <div className="container-wide">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-sage-200 order-2 lg:order-1"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.7,
                  ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
                }}
              >
                <Image
                  src="/images/about-workshop.webp"
                  alt="Handcrafting bespoke wreaths in our workshop"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </motion.div>

              <motion.div
                className="order-1 lg:order-2"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                <motion.p
                  className="font-handwritten text-xl text-sage-600 mb-3"
                  variants={fadeInUp}
                >
                  Something special in mind?
                </motion.p>
                <motion.h2
                  className="text-balance mb-6"
                  variants={fadeInUp}
                >
                  Create Your Perfect Wreath
                </motion.h2>
                <motion.p
                  className="text-charcoal-500 mb-6 leading-relaxed"
                  variants={fadeInUp}
                >
                  Whether it&apos;s a memorial tribute, a special occasion, or a
                  unique design for your home, I love bringing your vision to
                  life. Share your ideas and let&apos;s create something
                  beautiful together.
                </motion.p>
                <motion.ul className="space-y-3 mb-8" variants={fadeInUp}>
                  {[
                    "Custom colour schemes",
                    "Various sizes available",
                    "Memorial & seasonal designs",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-charcoal-600">
                      <div className="h-6 w-6 rounded-full bg-sage-200 flex items-center justify-center">
                        <span className="text-sage-600 text-sm">✓</span>
                      </div>
                      {item}
                    </li>
                  ))}
                </motion.ul>
                <motion.div variants={fadeInUp}>
                  <Button
                    asChild
                    size="lg"
                    className="bg-sage-400 hover:bg-sage-500 text-white"
                  >
                    <Link href="/bespoke">
                      Start Your Bespoke Order
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="section-padding bg-cream-100">
          <div className="container-wide">
            <motion.div
              className="text-center mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <h2 className="text-balance mb-4">What Our Customers Say</h2>
              <p className="text-charcoal-500 max-w-2xl mx-auto">
                We&apos;re proud to have created beautiful wreaths for hundreds
                of happy customers
              </p>
            </motion.div>

            {featuredReviews.length > 0 ? (
              <motion.div
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={staggerContainer}
              >
                {featuredReviews.map((review) => (
                  <motion.div key={review._id} variants={scaleIn}>
                    <Card className="border-cream-300 bg-white p-4 md:p-6 h-full hover:shadow-md transition-shadow">
                      <StarRating rating={review.rating} />
                      <p className="mt-3 md:mt-4 text-sm md:text-base text-charcoal-600 leading-relaxed">
                        &ldquo;{review.text}&rdquo;
                      </p>
                      <p className="mt-3 md:mt-4 text-xs md:text-sm font-medium text-charcoal-500">
                        — {review.customerName}
                      </p>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <Card className="mx-auto max-w-2xl border-cream-300 bg-white p-8 text-center">
                <p className="text-charcoal-500">
                  New customer reviews will appear here once they&apos;ve been published.
                </p>
              </Card>
            )}

            <motion.div
              className="text-center mt-10"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Button
                asChild
                variant="outline"
                className="border-sage-400 text-sage-600 hover:bg-sage-50"
              >
                <Link href="/info/reviews">Read More Reviews</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        <section className="section-padding bg-charcoal-600 overflow-hidden">
          <div className="container-wide">
            <motion.div
              className="text-center mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <h2 className="text-cream-100 mb-4">Browse Our Gallery</h2>
              <p className="text-cream-300 max-w-2xl mx-auto">
                See the full range of our creations, from ready-made designs to
                bespoke pieces
              </p>
            </motion.div>

            {featuredGalleryImages.length > 0 ? (
              <motion.div
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={staggerContainer}
              >
                {featuredGalleryImages.map((img) => (
                  <motion.div
                    key={img._id}
                    className="aspect-square rounded-lg bg-charcoal-500 overflow-hidden relative group"
                    variants={scaleIn}
                  >
                    {img.url ? (
                      <Image
                        src={img.url}
                        alt={img.title || "Gallery image"}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Sparkles className="h-8 w-8 text-cream-300" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <Card className="mx-auto max-w-2xl border-charcoal-500 bg-charcoal-500/40 p-8 text-center">
                <p className="text-cream-300">
                  Fresh gallery images will appear here as new work is added.
                </p>
              </Card>
            )}

            <motion.div
              className="text-center mt-10"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Button
                asChild
                size="lg"
                className="bg-cream-100 text-charcoal-700 hover:bg-cream-200"
              >
                <Link href="/gallery">
                  View Gallery
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        <section className="section-padding bg-cream-100">
          <div className="container-narrow text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.p
                className="font-handwritten text-2xl text-sage-500 mb-4"
                variants={fadeInUp}
              >
                Join our floral family
              </motion.p>
              <motion.h2 className="mb-6" variants={fadeInUp}>
                Stay Inspired
              </motion.h2>
              <motion.p
                className="text-charcoal-500 mb-8 max-w-xl mx-auto"
                variants={fadeInUp}
              >
                Subscribe for new arrivals, seasonal inspiration, care tips,
                and exclusive offers.
              </motion.p>
              <motion.div variants={fadeInUp}>
                <NewsletterForm />
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
