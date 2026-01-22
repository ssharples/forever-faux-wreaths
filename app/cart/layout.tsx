import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Cart | Forever Faux Wreaths",
  description: "Review your shopping cart and proceed to checkout.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
