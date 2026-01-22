import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQs | Forever Faux Wreaths",
  description:
    "Frequently asked questions about Forever Faux Wreaths. Find answers about ordering, delivery, care instructions, and more.",
  openGraph: {
    title: "FAQs | Forever Faux Wreaths",
    description: "Frequently asked questions about ordering, delivery, and care instructions.",
    type: "website",
  },
};

export default function FAQsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
