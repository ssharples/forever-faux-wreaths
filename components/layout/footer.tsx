import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";
import { NewsletterForm } from "@/components/forms/newsletter-form";

const footerNavigation = {
  collections: [
    { name: "All Collections", href: "/collections" },
    { name: "Memorial Wreaths", href: "/collections/memorial-wreaths" },
    { name: "Funeral Wreaths", href: "/collections/funeral-wreaths" },
    { name: "Door Wreaths", href: "/collections/door-wreaths" },
    { name: "Christmas Wreaths", href: "/collections/christmas-wreaths" },
  ],
  shop: [
    { name: "All Wreaths", href: "/shop" },
    { name: "Bespoke Orders", href: "/bespoke" },
    { name: "Gallery", href: "/gallery" },
  ],
  support: [
    { name: "Packaging & Delivery", href: "/info/packaging" },
    { name: "FAQs", href: "/info/faqs" },
    { name: "Reviews", href: "/info/reviews" },
    { name: "Contact Us", href: "/contact" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/legal/privacy" },
    { name: "Terms & Conditions", href: "/legal/terms" },
    { name: "Cookie Policy", href: "/legal/cookies" },
  ],
};

const socialLinks = [
  {
    name: "Facebook",
    href: "https://facebook.com/foreverfauxwreaths",
    icon: Facebook,
  },
  {
    name: "Instagram",
    href: "https://instagram.com/foreverfauxwreaths",
    icon: Instagram,
  },
];

// TikTok icon component (not in Lucide)
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
    </svg>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal-600" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      <div className="container-wide py-12 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand and Newsletter */}
          <div className="space-y-8">
            {/* Logo */}
            <Link href="/" className="inline-block">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-sage-400/20 flex items-center justify-center">
                  <span className="font-display text-lg text-cream-100">FF</span>
                </div>
                <div>
                  <p className="font-display text-xl text-cream-100 leading-tight">
                    Forever Faux
                  </p>
                  <p className="text-xs tracking-[0.2em] text-cream-300 uppercase">
                    Wreaths
                  </p>
                </div>
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-cream-300 max-w-xs">
              Handcrafted faux florals made with meaning. Beautiful wreaths for
              every season and every memory.
            </p>

            {/* Social links - touch-friendly */}
            <div className="flex space-x-2">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-cream-400 hover:text-sage-300 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-5 w-5" />
                </a>
              ))}
              <a
                href="https://tiktok.com/@foreverfauxwreaths"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center text-cream-400 hover:text-sage-300 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">TikTok</span>
                <TikTokIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-cream-100">
                  Collections
                </h3>
                <ul role="list" className="mt-4 space-y-1">
                  {footerNavigation.collections.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="block min-h-[44px] md:min-h-0 py-2 md:py-1 text-sm leading-6 text-cream-400 hover:text-sage-300 transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-cream-100">
                  Shop
                </h3>
                <ul role="list" className="mt-4 space-y-1">
                  {footerNavigation.shop.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="block min-h-[44px] md:min-h-0 py-2 md:py-1 text-sm leading-6 text-cream-400 hover:text-sage-300 transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-cream-100">
                  Support
                </h3>
                <ul role="list" className="mt-4 space-y-1">
                  {footerNavigation.support.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="block min-h-[44px] md:min-h-0 py-2 md:py-1 text-sm leading-6 text-cream-400 hover:text-sage-300 transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-cream-100">
                  Legal
                </h3>
                <ul role="list" className="mt-4 space-y-1">
                  {footerNavigation.legal.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="block min-h-[44px] md:min-h-0 py-2 md:py-1 text-sm leading-6 text-cream-400 hover:text-sage-300 transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 border-t border-charcoal-500 pt-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="max-w-md">
              <h3 className="text-sm font-semibold leading-6 text-cream-100">
                Stay updated
              </h3>
              <p className="mt-2 text-sm text-cream-400">
                Subscribe for new arrivals, seasonal collections, and special
                offers.
              </p>
            </div>
            <div className="mt-4 md:mt-0 md:ml-8">
              <NewsletterForm variant="footer" />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-charcoal-500 pt-8">
          <div className="md:flex md:items-center md:justify-between">
            <p className="text-xs text-cream-400">
              &copy; {currentYear} Forever Faux Wreaths. All rights reserved.
            </p>
            <p className="mt-4 md:mt-0 text-xs text-cream-500">
              Preston, Lancashire, UK |{" "}
              <a
                href="mailto:Info@foreverfauxwreaths.co.uk"
                className="hover:text-sage-300 transition-colors"
              >
                Info@foreverfauxwreaths.co.uk
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
