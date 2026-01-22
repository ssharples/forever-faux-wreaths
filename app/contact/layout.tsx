import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Forever Faux Wreaths",
  description:
    "Get in touch with Forever Faux Wreaths. Questions about orders, bespoke designs, or anything else? We'd love to hear from you.",
  openGraph: {
    title: "Contact | Forever Faux Wreaths",
    description:
      "Get in touch with Forever Faux Wreaths. Questions about orders or bespoke designs? We'd love to hear from you.",
    type: "website",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
