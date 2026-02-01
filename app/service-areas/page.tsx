import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, Truck, Clock, Phone } from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Service Areas | Wreath Delivery & Collection | Forever Faux Wreaths",
  description:
    "Handcrafted faux wreaths available across Lancashire. Free collection in Preston, UK delivery available. Serving Preston, Lancashire, Manchester and beyond.",
  keywords: [
    "wreaths Preston",
    "wreaths Lancashire",
    "wreaths Manchester",
    "funeral wreaths near me",
    "door wreaths delivery",
    "wreath collection Preston",
    "florist Preston",
  ],
  openGraph: {
    title: "Service Areas | Forever Faux Wreaths",
    description:
      "Handcrafted faux wreaths available across Lancashire and beyond. Free collection in Preston.",
    url: "https://foreverfauxwreaths.co.uk/service-areas",
  },
};

const serviceAreas = [
  {
    slug: "preston",
    name: "Preston",
    region: "Our Home Base",
    description:
      "Based in Preston, we offer free local collection and same-day availability for urgent orders. Visit us or have your wreath delivered locally.",
    highlights: [
      "Free local collection",
      "Same-day availability",
      "Local delivery option",
      "Personal service",
    ],
    featured: true,
  },
  {
    slug: "lancashire",
    name: "Lancashire",
    region: "County-Wide Service",
    description:
      "We deliver handcrafted wreaths throughout Lancashire. From Blackpool to Burnley, Blackburn to Lancaster—quality wreaths across the county.",
    highlights: [
      "County-wide delivery",
      "Funeral director delivery",
      "Multiple collection points",
      "Next-day options",
    ],
    featured: false,
  },
  {
    slug: "manchester",
    name: "Manchester",
    region: "Greater Manchester",
    description:
      "Serving Greater Manchester with beautiful handcrafted wreaths. Next-day delivery available to Manchester, Salford, Bolton, and surrounding areas.",
    highlights: [
      "Next-day delivery",
      "Greater Manchester coverage",
      "Funeral director delivery",
      "UK shipping available",
    ],
    featured: false,
  },
];

export default function ServiceAreasPage() {
  return (
    <>
      <Header />

      <main className="flex-1 bg-cream-100">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-sage-50 to-cream-100 py-16 lg:py-24">
          <div className="container-wide text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-sage-600" />
              <span className="text-sm uppercase tracking-wider text-charcoal-400">
                Delivery & Collection
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl mb-6">Service Areas</h1>
            <p className="text-lg text-charcoal-500 max-w-2xl mx-auto mb-8">
              Based in Preston, Lancashire, we deliver handcrafted faux wreaths
              across the North West and nationwide. Free local collection
              available in Preston.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 bg-sage-400 hover:bg-sage-500 text-white rounded-md transition-colors"
              >
                Get in Touch
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center px-6 py-3 border border-sage-300 text-sage-700 hover:bg-sage-50 rounded-md transition-colors"
              >
                Browse Wreaths
              </Link>
            </div>
          </div>
        </section>

        {/* Service Overview */}
        <section className="py-12 bg-white">
          <div className="container-wide">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 border-cream-300 text-center">
                <div className="w-12 h-12 rounded-full bg-sage-100 mx-auto mb-4 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-sage-600" />
                </div>
                <h3 className="font-display text-lg mb-2">Free Collection</h3>
                <p className="text-sm text-charcoal-500">
                  Free collection available in Preston. Contact us to arrange a
                  convenient time.
                </p>
              </Card>
              <Card className="p-6 border-cream-300 text-center">
                <div className="w-12 h-12 rounded-full bg-sage-100 mx-auto mb-4 flex items-center justify-center">
                  <Truck className="h-6 w-6 text-sage-600" />
                </div>
                <h3 className="font-display text-lg mb-2">UK Delivery</h3>
                <p className="text-sm text-charcoal-500">
                  Standard UK delivery from £4.99 for small items, £7.99 for
                  larger wreaths.
                </p>
              </Card>
              <Card className="p-6 border-cream-300 text-center">
                <div className="w-12 h-12 rounded-full bg-sage-100 mx-auto mb-4 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-sage-600" />
                </div>
                <h3 className="font-display text-lg mb-2">Processing Time</h3>
                <p className="text-sm text-charcoal-500">
                  Ready-made wreaths dispatched within 1-3 business days.
                  Bespoke orders 5-10 days.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Service Areas Grid */}
        <section className="py-12 lg:py-16">
          <div className="container-wide">
            <div className="text-center mb-12">
              <h2 className="text-3xl mb-4">Where We Serve</h2>
              <p className="text-charcoal-500 max-w-2xl mx-auto">
                Select your area below to learn more about delivery options,
                timescales, and local services.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {serviceAreas.map((area) => (
                <Link
                  key={area.slug}
                  href={`/service-areas/${area.slug}`}
                  className="group"
                >
                  <Card
                    className={`overflow-hidden border-cream-300 hover:border-sage-300 transition-all duration-300 hover:shadow-lg h-full ${
                      area.featured ? "ring-2 ring-sage-300" : ""
                    }`}
                  >
                    <div className="p-6 bg-gradient-to-br from-sage-50 to-cream-50">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-full bg-sage-100 flex items-center justify-center">
                          <MapPin className="h-6 w-6 text-sage-600" />
                        </div>
                        {area.featured && (
                          <span className="text-xs font-medium text-sage-600 bg-sage-100 px-3 py-1 rounded-full">
                            Home Base
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl font-display text-charcoal-700 mb-1 group-hover:text-sage-600 transition-colors">
                        {area.name}
                      </h3>
                      <p className="text-sm text-sage-600 mb-4">{area.region}</p>
                    </div>
                    <CardContent className="p-6">
                      <p className="text-charcoal-500 text-sm mb-4">
                        {area.description}
                      </p>
                      <ul className="space-y-2 mb-4">
                        {area.highlights.map((highlight, index) => (
                          <li
                            key={index}
                            className="text-sm text-charcoal-500 flex items-center gap-2"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-sage-400" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                      <span className="inline-flex items-center text-sm font-medium text-sage-600 group-hover:text-sage-700">
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Info */}
        <section className="py-12 lg:py-16 bg-cream-50">
          <div className="container-narrow">
            <div className="prose prose-sage mx-auto">
              <h2>UK-Wide Shipping Available</h2>
              <p>
                While we&apos;re based in Preston, Lancashire, we ship our
                handcrafted wreaths throughout the UK. All wreaths are carefully
                packaged to ensure they arrive in perfect condition, no matter
                where you are.
              </p>

              <h3>Delivery to Funeral Directors</h3>
              <p>
                We understand that funeral arrangements require careful
                coordination. We can deliver funeral wreaths directly to funeral
                directors throughout Lancashire and the North West. Simply
                provide the funeral director&apos;s details when ordering, and we&apos;ll
                coordinate timing to ensure your tribute arrives when needed.
              </p>

              <h3>Not Sure About Delivery?</h3>
              <p>
                If you&apos;re unsure about delivery options to your area, please get
                in touch. We&apos;re always happy to discuss the best way to get your
                wreath to you.
              </p>
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 bg-sage-400 hover:bg-sage-500 text-white rounded-md transition-colors"
              >
                Contact Us About Delivery
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
