import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Packaging & Delivery | Forever Faux Wreaths",
  description:
    "Learn about our packaging and delivery options. UK delivery available with careful packaging to ensure your wreath arrives in perfect condition.",
  openGraph: {
    title: "Packaging & Delivery | Forever Faux Wreaths",
    description: "UK delivery with careful packaging. Free local collection in Preston.",
    type: "website",
  },
};

export default function PackagingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
