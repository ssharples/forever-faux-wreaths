import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bespoke Orders | Forever Faux Wreaths",
  description:
    "Create your perfect custom wreath. Whether it's a memorial tribute, special occasion, or unique design for your home, we'll bring your vision to life.",
  openGraph: {
    title: "Bespoke Orders | Forever Faux Wreaths",
    description:
      "Create your perfect custom wreath. Memorial tributes, special occasions, and unique designs made to order.",
    type: "website",
  },
};

export default function BespokeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
