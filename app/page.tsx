"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, Heart, Truck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Header, Footer, SeasonalBanner } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { FeaturedProducts } from "@/components/home/featured-products";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
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
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// Placeholder reviews
const reviews = [
  {
    id: "1",
    name: "Sarah M.",
    rating: 5,
    text: "Absolutely beautiful wreath! The attention to detail is incredible. It looks so realistic that my neighbours thought it was real flowers.",
  },
  {
    id: "2",
    name: "Emily R.",
    rating: 5,
    text: "Kim created the most perfect bespoke memorial wreath for my mum. It was exactly what I envisioned and more. Thank you so much.",
  },
  {
    id: "3",
    name: "Claire T.",
    rating: 5,
    text: "Fast delivery and the wreath exceeded my expectations. The quality is outstanding and it's held up beautifully on my door.",
  },
];

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

export default function HomePage() {
  return (
    <>
      <SeasonalBanner
        text="Free local collection available in Preston, Lancashire"
        variant="sage"
        enabled={true}
      />
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
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

              {/* Hero Image */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <div className="aspect-square rounded-full bg-sage-100/50 absolute -top-10 -right-10 w-[120%] h-[120%] -z-10" />
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-cream-300">
                  <Image
                    src="/images/hero/hero-banner.png"
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

          {/* Decorative Elements */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-cream-100 to-transparent" />
        </section>

        {/* Trust Indicators */}
        <section className="bg-cream-100 py-6 md:py-8 border-y border-cream-300">
          <div className="container-wide">
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
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

        {/* Featured Products */}
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

            <FeaturedProducts />

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

        {/* Bespoke CTA */}
        <section className="section-padding bg-sage-100 overflow-hidden">
          <div className="container-wide">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Workshop Image */}
              <motion.div
                className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-sage-200 order-2 lg:order-1"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <Image
                  src="/images/about-workshop.png"
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

        {/* Reviews */}
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

            <motion.div
              className="grid md:grid-cols-3 gap-4 md:gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
            >
              {reviews.map((review) => (
                <motion.div key={review.id} variants={scaleIn}>
                  <Card className="border-cream-300 bg-white p-4 md:p-6 h-full hover:shadow-md transition-shadow">
                    <StarRating rating={review.rating} />
                    <p className="mt-3 md:mt-4 text-sm md:text-base text-charcoal-600 leading-relaxed">
                      &ldquo;{review.text}&rdquo;
                    </p>
                    <p className="mt-3 md:mt-4 text-xs md:text-sm font-medium text-charcoal-500">
                      — {review.name}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

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

        {/* Gallery Teaser */}
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

            {/* Gallery Grid */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
            >
              {[
                { src: "/images/products/christmas-traditional-pro.png", alt: "Christmas Traditional Wreath" },
                { src: "/images/products/halloween-skeleton-pro.png", alt: "Halloween Skeleton Wreath" },
                { src: "/images/products/autumn-rustic-pro.png", alt: "Autumn Rustic Wreath" },
                { src: "/images/products/spring-garden-hydrangea-pro.png", alt: "Spring Garden Wreath" },
              ].map((img, i) => (
                <motion.div
                  key={i}
                  className="aspect-square rounded-lg bg-charcoal-500 overflow-hidden relative group"
                  variants={scaleIn}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-charcoal-900/0 group-hover:bg-charcoal-900/10 transition-colors duration-300" />
                </motion.div>
              ))}
            </motion.div>

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
                className="bg-sage-400 hover:bg-sage-500 text-white"
              >
                <Link href="/gallery">
                  View Full Gallery
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="section-padding bg-sage-50">
          <motion.div
            className="container-narrow text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.p
              className="font-handwritten text-xl text-sage-600 mb-3"
              variants={fadeInUp}
            >
              Stay in the loop
            </motion.p>
            <motion.h2 className="text-balance mb-4" variants={fadeInUp}>
              Join Our Newsletter
            </motion.h2>
            <motion.p
              className="text-charcoal-500 mb-8 max-w-lg mx-auto"
              variants={fadeInUp}
            >
              Be the first to know about new arrivals, seasonal collections, and
              exclusive offers.
            </motion.p>
            <motion.div className="flex justify-center" variants={fadeInUp}>
              <NewsletterForm variant="hero" />
            </motion.div>
            <motion.p
              className="mt-4 text-xs text-charcoal-400"
              variants={fadeInUp}
            >
              We respect your privacy. Unsubscribe at any time.
            </motion.p>
          </motion.div>
        </section>
      </main>

      <Footer />
    </>
  );
}
