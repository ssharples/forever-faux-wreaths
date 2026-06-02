"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, EyeOff, Trash2, Star } from "lucide-react";
import { toast } from "sonner";

export default function ReviewsAdminPage() {
  const reviews = useQuery(api.reviews.list, {});
  const toggleVisibility = useMutation(api.reviews.toggleVisibility);
  const removeReview = useMutation(api.reviews.remove);

  if (reviews === undefined) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-sage-500" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-3xl text-charcoal-700 mb-1">Reviews</h1>
        <p className="text-charcoal-500">Manage customer testimonials shown on the storefront.</p>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review._id} className="p-6 border-cream-300 bg-white">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-charcoal-700">{review.customerName}</p>
                  <div className="flex gap-0.5">
                    {Array.from({ length: review.rating }).map((_, index) => (
                      <Star key={index} className="h-4 w-4 fill-gold-400 text-gold-400" />
                    ))}
                  </div>
                </div>
                <p className="text-charcoal-600">{review.text}</p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={async () => {
                    try {
                      await toggleVisibility({ id: review._id });
                      toast.success(review.visible ? "Review hidden" : "Review published");
                    } catch (error) {
                      toast.error(
                        error instanceof Error ? error.message : "Failed to update review"
                      );
                    }
                  }}
                >
                  {review.visible ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                  {review.visible ? "Hide" : "Show"}
                </Button>
                <Button
                  variant="outline"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={async () => {
                    try {
                      await removeReview({ id: review._id });
                      toast.success("Review removed");
                    } catch (error) {
                      toast.error(
                        error instanceof Error ? error.message : "Failed to remove review"
                      );
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {reviews.length === 0 && (
          <Card className="p-12 border-cream-300 bg-white text-center text-charcoal-500">
            No reviews yet.
          </Card>
        )}
      </div>
    </div>
  );
}
