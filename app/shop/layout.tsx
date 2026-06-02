import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Wreaths | Forever Faux Wreaths",
  description:
    "Browse our collection of handcrafted faux floral wreaths. Classic, modern, rustic, seasonal, and memorial designs made with love in Preston, Lancashire.",
  alternates: {
    canonical: "/shop",
  },
  openGraph: {
    title: "Shop Wreaths | Forever Faux Wreaths",
    description:
      "Browse our collection of handcrafted faux floral wreaths. Classic, modern, rustic, seasonal, and memorial designs.",
    url: "/shop",
    type: "website",
  },
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
