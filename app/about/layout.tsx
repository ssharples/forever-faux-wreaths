import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Forever Faux Wreaths",
  description:
    "Learn about Forever Faux Wreaths, a small business creating beautiful handcrafted faux floral wreaths in Preston, Lancashire.",
  openGraph: {
    title: "About | Forever Faux Wreaths",
    description:
      "Learn about Forever Faux Wreaths. Beautiful handcrafted faux florals made in Preston, Lancashire.",
    type: "website",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
