"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, Quote, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Placeholder reviews
const reviews = [
  {
    id: "1",
    name: "Sarah M.",
    location: "Manchester",
    rating: 5,
    date: "December 2024",
    product: "Classic Eucalyptus Wreath",
    review:
      "Absolutely stunning wreath! The quality is incredible and it looks so realistic. My neighbours keep asking where I got it from. Will definitely be ordering again!",
    verified: true,
  },
  {
    id: "2",
    name: "Emma T.",
    location: "Preston",
    rating: 5,
    date: "November 2024",
    product: "Bespoke Memorial Wreath",
    review:
      "Claire created the most beautiful memorial wreath for my mum. She took the time to understand exactly what I wanted and the result was perfect. Such a thoughtful and caring service.",
    verified: true,
  },
  {
    id: "3",
    name: "Rachel K.",
    location: "Liverpool",
    rating: 5,
    date: "October 2024",
    product: "Autumn Door Wreath",
    review:
      "This wreath has transformed my front door! The autumn colours are gorgeous and I've had so many compliments. The packaging was excellent too.",
    verified: true,
  },
  {
    id: "4",
    name: "Jennifer L.",
    location: "Leeds",
    rating: 4,
    date: "September 2024",
    product: "Mini Lavender Wreath",
    review:
      "Lovely little wreath, perfect for my small porch. The lavender looks and smells wonderful. Only 4 stars because delivery took a bit longer than expected, but the product itself is beautiful.",
    verified: true,
  },
  {
    id: "5",
    name: "Claire B.",
    location: "Blackpool",
    rating: 5,
    date: "September 2024",
    product: "Spring Blossom Wreath",
    review:
      "I ordered this as a gift for my sister and she absolutely loved it! The craftsmanship is exceptional and it's even more beautiful in person than in the photos.",
    verified: true,
  },
  {
    id: "6",
    name: "Michelle W.",
    location: "Sheffield",
    rating: 5,
    date: "August 2024",
    product: "Rustic Farmhouse Wreath",
    review:
      "Perfect addition to our farmhouse style home. The neutral tones go with everything and it's so well made. Highly recommend Forever Faux Wreaths!",
    verified: true,
  },
  {
    id: "7",
    name: "Amanda D.",
    location: "Bolton",
    rating: 5,
    date: "July 2024",
    product: "Bespoke Wedding Collection",
    review:
      "Claire made our wedding flower arrangements and they were breathtaking! She worked with our colour scheme perfectly and created something truly unique for our special day.",
    verified: true,
  },
  {
    id: "8",
    name: "Lisa H.",
    location: "Chorley",
    rating: 5,
    date: "June 2024",
    product: "Peony & Rose Door Wreath",
    review:
      "The peonies on this wreath are so lifelike! I've had it on my door for months now and it still looks as fresh as the day it arrived. Worth every penny.",
    verified: true,
  },
];

// Stats
const stats = {
  averageRating: 4.9,
  totalReviews: 127,
  fiveStarPercentage: 94,
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? "fill-amber-400 text-amber-400"
              : "fill-cream-300 text-cream-300"
          }`}
        />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 6;
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const paginatedReviews = reviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  return (
    <>
      <Header />

      <main className="flex-1 bg-cream-100">
        {/* Hero */}
        <section className="bg-gradient-to-b from-cream-100 to-cream-200 py-16">
          <div className="container-narrow text-center">
            <p className="font-handwritten text-2xl text-sage-600 mb-4">
              Kind words
            </p>
            <h1 className="mb-6">Customer Reviews</h1>
            <p className="text-lg text-charcoal-500 max-w-2xl mx-auto">
              Don&apos;t just take our word for it! Here&apos;s what our
              wonderful customers have to say about their Forever Faux Wreaths.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="py-8 border-b border-cream-300">
          <div className="container-narrow">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="font-display text-4xl text-charcoal-700">
                    {stats.averageRating}
                  </span>
                  <Star className="h-8 w-8 fill-amber-400 text-amber-400" />
                </div>
                <p className="text-charcoal-500 text-sm">Average Rating</p>
              </div>
              <div className="text-center">
                <p className="font-display text-4xl text-charcoal-700 mb-2">
                  {stats.totalReviews}
                </p>
                <p className="text-charcoal-500 text-sm">Happy Customers</p>
              </div>
              <div className="text-center">
                <p className="font-display text-4xl text-charcoal-700 mb-2">
                  {stats.fiveStarPercentage}%
                </p>
                <p className="text-charcoal-500 text-sm">5-Star Reviews</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Review */}
        <section className="py-12 bg-sage-50">
          <div className="container-narrow">
            <div className="relative text-center">
              <Quote className="h-12 w-12 text-sage-300 mx-auto mb-6" />
              <blockquote className="text-xl sm:text-2xl text-charcoal-600 italic max-w-3xl mx-auto mb-6 leading-relaxed">
                &ldquo;Claire created the most beautiful memorial wreath for my
                mum. She took the time to understand exactly what I wanted and
                the result was perfect. Such a thoughtful and caring
                service.&rdquo;
              </blockquote>
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-sage-200 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-sage-500" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-charcoal-700">Emma T.</p>
                  <p className="text-sm text-charcoal-500">
                    Preston &middot; Bespoke Memorial Wreath
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* All Reviews */}
        <section className="py-12">
          <div className="container-wide">
            <h2 className="text-2xl text-center mb-8">All Reviews</h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedReviews.map((review) => (
                <Card
                  key={review.id}
                  className="p-6 border-cream-300 bg-white h-full flex flex-col"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center shrink-0">
                        <span className="font-medium text-sage-600">
                          {review.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-charcoal-700">
                          {review.name}
                        </p>
                        <p className="text-sm text-charcoal-400">
                          {review.location}
                        </p>
                      </div>
                    </div>
                    {review.verified && (
                      <Badge
                        variant="secondary"
                        className="bg-sage-100 text-sage-700 shrink-0"
                      >
                        Verified
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <StarRating rating={review.rating} />
                    <span className="text-sm text-charcoal-400">
                      {review.date}
                    </span>
                  </div>

                  <p className="text-sm text-sage-600 mb-3">{review.product}</p>

                  <p className="text-charcoal-500 text-sm leading-relaxed flex-1">
                    &ldquo;{review.review}&rdquo;
                  </p>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-10">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="border-cream-400"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <span className="text-sm text-charcoal-500">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="border-cream-400"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Leave a Review CTA */}
        <section className="py-16 bg-cream-200">
          <div className="container-narrow text-center">
            <h2 className="mb-4">Love Your Wreath?</h2>
            <p className="text-charcoal-500 mb-8 max-w-lg mx-auto">
              We&apos;d love to hear from you! Share your experience and help
              others discover Forever Faux Wreaths.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-sage-400 hover:bg-sage-500 text-white"
              >
                <Link href="/contact">Leave a Review</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-sage-400 text-sage-600 hover:bg-white"
              >
                <Link href="/shop">Shop Wreaths</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
