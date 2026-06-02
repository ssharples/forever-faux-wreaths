"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { Star, Quote, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/convex/_generated/api";

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

function formatReviewDate(timestamp: number) {
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).format(new Date(timestamp));
}

export default function ReviewsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const reviews = useQuery(api.reviews.getVisible) ?? [];
  const reviewsPerPage = 6;

  const stats = useMemo(() => {
    if (reviews.length === 0) {
      return { averageRating: 0, totalReviews: 0, fiveStarPercentage: 0 };
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const fiveStarCount = reviews.filter((review) => review.rating === 5).length;

    return {
      averageRating: Number((totalRating / reviews.length).toFixed(1)),
      totalReviews: reviews.length,
      fiveStarPercentage: Math.round((fiveStarCount / reviews.length) * 100),
    };
  }, [reviews]);

  const totalPages = Math.max(1, Math.ceil(reviews.length / reviewsPerPage));
  const paginatedReviews = reviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );
  const featuredReview = reviews[0] ?? null;

  return (
    <>
      <Header />

      <main className="flex-1 bg-cream-100">
        <section className="bg-gradient-to-b from-cream-100 to-cream-200 py-16">
          <div className="container-narrow text-center">
            <p className="font-handwritten text-2xl text-sage-600 mb-4">Kind words</p>
            <h1 className="mb-6">Customer Reviews</h1>
            <p className="text-lg text-charcoal-500 max-w-2xl mx-auto">
              Feedback from customers who have ordered ready-made and bespoke designs.
            </p>
          </div>
        </section>

        <section className="py-8 border-b border-cream-300">
          <div className="container-narrow">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="font-display text-4xl text-charcoal-700">
                    {stats.averageRating || "—"}
                  </span>
                  <Star className="h-8 w-8 fill-amber-400 text-amber-400" />
                </div>
                <p className="text-charcoal-500 text-sm">Average Rating</p>
              </div>
              <div className="text-center">
                <p className="font-display text-4xl text-charcoal-700 mb-2">
                  {stats.totalReviews}
                </p>
                <p className="text-charcoal-500 text-sm">Published Reviews</p>
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

        {featuredReview && (
          <section className="py-12 bg-sage-50">
            <div className="container-narrow">
              <div className="relative text-center">
                <Quote className="h-12 w-12 text-sage-300 mx-auto mb-6" />
                <blockquote className="text-xl sm:text-2xl text-charcoal-600 italic max-w-3xl mx-auto mb-6 leading-relaxed">
                  &ldquo;{featuredReview.text}&rdquo;
                </blockquote>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-sage-200 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-sage-500" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-charcoal-700">{featuredReview.customerName}</p>
                    <p className="text-sm text-charcoal-500">
                      {formatReviewDate(featuredReview.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="py-12">
          <div className="container-wide">
            <h2 className="text-2xl text-center mb-8">All Reviews</h2>

            {reviews.length === 0 ? (
              <div className="text-center py-16">
                <Sparkles className="h-16 w-16 text-sage-300 mx-auto mb-4" />
                <h3 className="text-xl text-charcoal-600 mb-2">No published reviews yet</h3>
                <p className="text-charcoal-500">
                  New customer reviews will appear here once they are approved.
                </p>
              </div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedReviews.map((review) => (
                    <Card
                      key={review._id}
                      className="p-6 border-cream-300 bg-white h-full flex flex-col"
                    >
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center shrink-0">
                            <span className="font-medium text-sage-600">
                              {review.customerName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-charcoal-700">{review.customerName}</p>
                            <p className="text-sm text-charcoal-400">
                              {formatReviewDate(review.createdAt)}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-sage-100 text-sage-700 shrink-0">
                          Published
                        </Badge>
                      </div>

                      <div className="flex items-center gap-3 mb-3">
                        <StarRating rating={review.rating} />
                      </div>

                      <p className="text-charcoal-500 text-sm leading-relaxed flex-1">
                        &ldquo;{review.text}&rdquo;
                      </p>
                    </Card>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-10">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                    <span className="text-sm text-charcoal-500">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <section className="py-16 bg-sage-100">
          <div className="container-narrow text-center">
            <h2 className="mb-4">Ready to order?</h2>
            <p className="text-charcoal-500 mb-8 max-w-lg mx-auto">
              Browse the current collection or send a bespoke enquiry for something more personal.
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

      <Footer />
    </>
  );
}
