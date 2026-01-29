import type { Metadata } from "next";
import "./globals.css";
import { ConvexClientProvider } from "@/components/providers/convex-provider";
import { Toaster } from "@/components/ui/sonner";
import { CookieConsent } from "@/components/cookie-consent";
import { cormorantGaramond, montserrat, caveat } from "@/lib/fonts";

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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
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
    <html lang="en" className={`${cormorantGaramond.variable} ${montserrat.variable} ${caveat.variable}`}>
      <body className="antialiased min-h-screen flex flex-col font-body">
        <ConvexClientProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "var(--card)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
              },
            }}
          />
          <CookieConsent />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
