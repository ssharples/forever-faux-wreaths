import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer Reviews | Forever Faux Wreaths",
  description:
    "Read reviews from our happy customers. See what people are saying about their handcrafted faux floral wreaths.",
  openGraph: {
    title: "Customer Reviews | Forever Faux Wreaths",
    description: "Read reviews from our happy customers about their handcrafted wreaths.",
    type: "website",
  },
};

export default function ReviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
