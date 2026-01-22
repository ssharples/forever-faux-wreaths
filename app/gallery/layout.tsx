import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery | Forever Faux Wreaths",
  description:
    "Browse our gallery of handcrafted faux floral wreaths. See our ready-made designs and bespoke creations from Preston, Lancashire.",
  openGraph: {
    title: "Gallery | Forever Faux Wreaths",
    description:
      "Browse our gallery of handcrafted faux floral wreaths. Ready-made designs and bespoke creations.",
    type: "website",
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
