import type { Metadata } from "next";
import "./globals.css";
import { ConvexClientProvider } from "@/components/providers/convex-provider";
import { Toaster } from "@/components/ui/sonner";
import { CookieConsent } from "@/components/cookie-consent";

export const metadata: Metadata = {
  title: "Forever Faux Wreaths | Handcrafted Faux Florals",
  description:
    "Beautiful handcrafted faux floral wreaths made with meaning. Ready-made wreaths and bespoke designs from Preston, Lancashire.",
  keywords: [
    "faux wreaths",
    "artificial flowers",
    "handcrafted wreaths",
    "Preston",
    "Lancashire",
    "door wreaths",
    "memorial wreaths",
    "seasonal wreaths",
  ],
  authors: [{ name: "Forever Faux Wreaths" }],
  openGraph: {
    title: "Forever Faux Wreaths | Handcrafted Faux Florals",
    description:
      "Beautiful handcrafted faux floral wreaths made with meaning. Ready-made wreaths and bespoke designs from Preston, Lancashire.",
    url: "https://foreverfauxwreaths.co.uk",
    siteName: "Forever Faux Wreaths",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Forever Faux Wreaths | Handcrafted Faux Florals",
    description:
      "Beautiful handcrafted faux floral wreaths made with meaning.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <ConvexClientProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#FFFFFF",
                border: "1px solid #E2D9CC",
                color: "#4A5248",
              },
            }}
          />
          <CookieConsent />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
