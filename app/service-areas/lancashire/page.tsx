import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  Truck,
  Clock,
  Check,
  ChevronRight,
  Heart,
  Home,
} from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { generateBreadcrumbSchema } from "@/lib/schema";
import Script from "next/script";

export const metadata: Metadata = {
  title:
    "Wreaths in Lancashire | Delivery Across the County | Forever Faux Wreaths",
  description:
    "Handcrafted faux wreaths delivered throughout Lancashire. Funeral wreaths, memorial tributes, door wreaths. Serving Blackpool, Blackburn, Burnley, Lancaster and more.",
  keywords: [
    "wreaths Lancashire",
    "funeral wreaths Lancashire",
    "door wreaths Lancashire",
    "memorial wreaths Lancashire",
    "wreaths Blackpool",
    "wreaths Blackburn",
    "wreaths Lancaster",
    "wreaths Burnley",
    "faux flowers Lancashire",
  ],
  openGraph: {
    title: "Wreaths in Lancashire | Forever Faux Wreaths",
    description:
      "Handcrafted faux wreaths delivered throughout Lancashire. Made in Preston, delivered to your door.",
    url: "https://foreverfauxwreaths.co.uk/service-areas/lancashire",
  },
};

const lancashireTowns = [
  { name: "Blackpool", area: "Fylde Coast" },
  { name: "Blackburn", area: "East Lancashire" },
  { name: "Burnley", area: "East Lancashire" },
  { name: "Lancaster", area: "North Lancashire" },
  { name: "Morecambe", area: "North Lancashire" },
  { name: "Chorley", area: "Central Lancashire" },
  { name: "Leyland", area: "Central Lancashire" },
  { name: "Lytham St Annes", area: "Fylde Coast" },
  { name: "Accrington", area: "East Lancashire" },
  { name: "Nelson", area: "Pendle" },
  { name: "Colne", area: "Pendle" },
  { name: "Clitheroe", area: "Ribble Valley" },
  { name: "Ormskirk", area: "West Lancashire" },
  { name: "Skelmersdale", area: "West Lancashire" },
  { name: "Fleetwood", area: "Fylde Coast" },
  { name: "Garstang", area: "Wyre" },
];

export default function LancashirePage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://foreverfauxwreaths.co.uk" },
    {
      name: "Service Areas",
      url: "https://foreverfauxwreaths.co.uk/service-areas",
    },
    { name: "Lancashire" },
  ]);

  return (
    <>
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Header />

      <main className="flex-1 bg-cream-100">
        {/* Breadcrumb */}
        <nav className="container-wide py-4" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-charcoal-500">
            <li>
              <Link href="/" className="hover:text-sage-600 transition-colors">
                Home
              </Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li>
              <Link
                href="/service-areas"
                className="hover:text-sage-600 transition-colors"
              >
                Service Areas
              </Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li className="text-charcoal-700 font-medium">Lancashire</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-sage-50 to-cream-100 py-12 lg:py-20">
          <div className="container-wide">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-sage-600" />
                <span className="text-sm uppercase tracking-wider text-charcoal-400">
                  County-Wide Service
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl mb-6">
                Handcrafted Wreaths Delivered Across Lancashire
              </h1>
              <p className="text-lg text-charcoal-500 mb-8">
                Based in Preston, we deliver beautiful handcrafted faux wreaths
                throughout Lancashire. From Blackpool to Burnley, Lancaster to
                Chorley—quality wreaths delivered to your door or directly to
                funeral directors.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/shop"
                  className="inline-flex items-center px-6 py-3 bg-sage-400 hover:bg-sage-500 text-white rounded-md transition-colors"
                >
                  Browse Wreaths
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 border border-sage-300 text-sage-700 hover:bg-sage-50 rounded-md transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Delivery Info Cards */}
        <section className="py-12 bg-white">
          <div className="container-wide">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 border-cream-300 text-center">
                <div className="w-12 h-12 rounded-full bg-sage-100 mx-auto mb-4 flex items-center justify-center">
                  <Truck className="h-6 w-6 text-sage-600" />
                </div>
                <h3 className="font-display text-lg mb-2">
                  County-Wide Delivery
                </h3>
                <p className="text-sm text-charcoal-500">
                  Standard delivery throughout Lancashire. All areas covered
                  from our Preston base.
                </p>
              </Card>
              <Card className="p-6 border-cream-300 text-center">
                <div className="w-12 h-12 rounded-full bg-sage-100 mx-auto mb-4 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-sage-600" />
                </div>
                <h3 className="font-display text-lg mb-2">Quick Dispatch</h3>
                <p className="text-sm text-charcoal-500">
                  Ready-made wreaths dispatched within 1-3 business days. Most
                  Lancashire addresses receive next day.
                </p>
              </Card>
              <Card className="p-6 border-cream-300 text-center">
                <div className="w-12 h-12 rounded-full bg-sage-100 mx-auto mb-4 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-sage-600" />
                </div>
                <h3 className="font-display text-lg mb-2">
                  Funeral Director Delivery
                </h3>
                <p className="text-sm text-charcoal-500">
                  We deliver directly to funeral directors across Lancashire,
                  coordinating timing perfectly.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 lg:py-16">
          <div className="container-wide">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="prose prose-sage max-w-none">
                  <h2>Serving All of Lancashire</h2>
                  <p>
                    From our workshop in Preston, we proudly serve customers
                    across the whole of Lancashire. Whether you&apos;re on the Fylde
                    Coast enjoying the sea breeze in Blackpool, nestled in the
                    Ribble Valley in Clitheroe, or in the bustling towns of East
                    Lancashire, we can deliver our handcrafted wreaths right to
                    your door.
                  </p>

                  <p>
                    Lancashire is our home county, and we take pride in
                    providing beautiful floral arrangements to communities
                    throughout the region. Our central location in Preston means
                    we can reach most Lancashire addresses quickly and
                    efficiently.
                  </p>

                  <h3>Delivery Across Lancashire</h3>
                  <p>
                    We offer standard UK delivery to all Lancashire addresses.
                    Our delivery service includes:
                  </p>

                  <ul>
                    <li>
                      <strong>Standard Delivery:</strong> £4.99 for smaller
                      items, £7.99 for larger wreaths
                    </li>
                    <li>
                      <strong>Processing Time:</strong> Ready-made wreaths
                      dispatched within 1-3 business days
                    </li>
                    <li>
                      <strong>Typical Delivery:</strong> Most Lancashire
                      addresses receive within 1-2 days of dispatch
                    </li>
                    <li>
                      <strong>Tracking:</strong> Full tracking provided on all
                      deliveries
                    </li>
                  </ul>

                  <h3>Free Preston Collection</h3>
                  <p>
                    If you&apos;re able to travel to Preston, you can save on
                    delivery costs entirely with our free collection option.
                    This is particularly popular with customers from nearby
                    towns like Chorley, Leyland, and the Fylde coast who are
                    passing through Preston anyway.
                  </p>

                  <h3>Funeral Wreaths for Lancashire Families</h3>
                  <p>
                    We understand that when you need a funeral wreath, timing
                    and reliability are essential. We work with funeral
                    directors across Lancashire to ensure your tribute arrives
                    exactly when needed. Services include:
                  </p>

                  <ul>
                    <li>
                      Direct delivery to funeral homes across Lancashire
                    </li>
                    <li>
                      Coordination with funeral directors on timing
                    </li>
                    <li>Beautiful presentation of your tribute</li>
                    <li>
                      Rush orders available for urgent requirements (contact us
                      directly)
                    </li>
                  </ul>

                  <p>
                    Simply provide your funeral director&apos;s details when
                    ordering, and we&apos;ll handle the rest.
                  </p>

                  <h3>Popular in Lancashire</h3>
                  <p>
                    Our most popular products for Lancashire customers include:
                  </p>

                  <ul>
                    <li>
                      <strong>Memorial Wreaths:</strong> For cemeteries and
                      crematoria across the county
                    </li>
                    <li>
                      <strong>Door Wreaths:</strong> Adding curb appeal to
                      Lancashire homes
                    </li>
                    <li>
                      <strong>Funeral Wreaths:</strong> Beautiful tributes for
                      services throughout the region
                    </li>
                    <li>
                      <strong>Seasonal Wreaths:</strong> Christmas and autumn
                      designs for festive Lancashire homes
                    </li>
                  </ul>

                  <h3>Why Choose a Lancashire Maker?</h3>
                  <p>
                    By choosing Forever Faux Wreaths, you&apos;re supporting a local
                    Lancashire business. Your wreath is handcrafted right here
                    in the county, not shipped from a distant warehouse. This
                    means:
                  </p>

                  <ul>
                    <li>Quick delivery times within the county</li>
                    <li>Easy communication with your maker</li>
                    <li>Personal service and attention to detail</li>
                    <li>Supporting the local Lancashire economy</li>
                    <li>
                      Option to collect if you&apos;re passing through Preston
                    </li>
                  </ul>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {/* Towns We Serve */}
                  <Card className="p-6 border-cream-300">
                    <h3 className="font-display text-lg mb-4">
                      Lancashire Towns We Serve
                    </h3>
                    <div className="space-y-2">
                      {lancashireTowns.map((town) => (
                        <div
                          key={town.name}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="flex items-center gap-2 text-charcoal-600">
                            <Check className="h-4 w-4 text-sage-500" />
                            {town.name}
                          </span>
                          <span className="text-charcoal-400 text-xs">
                            {town.area}
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-charcoal-400 mt-4">
                      Plus all other Lancashire postcodes
                    </p>
                  </Card>

                  {/* Contact Card */}
                  <Card className="p-6 border-sage-300 bg-sage-50">
                    <h3 className="font-display text-lg mb-4">Get in Touch</h3>
                    <div className="space-y-3">
                      <p className="text-sm text-charcoal-600">
                        <strong>Based in:</strong>
                        <br />
                        Preston, Lancashire
                      </p>
                      <p className="text-sm text-charcoal-600">
                        <strong>Email:</strong>
                        <br />
                        <a
                          href="mailto:Info@foreverfauxwreaths.co.uk"
                          className="text-sage-600 hover:underline"
                        >
                          Info@foreverfauxwreaths.co.uk
                        </a>
                      </p>
                    </div>
                    <Button
                      asChild
                      className="w-full mt-4 bg-sage-400 hover:bg-sage-500"
                    >
                      <Link href="/contact">Contact Us</Link>
                    </Button>
                  </Card>

                  {/* Quick Links */}
                  <Card className="p-6 border-cream-300">
                    <h3 className="font-display text-lg mb-4">Quick Links</h3>
                    <ul className="space-y-2">
                      <li>
                        <Link
                          href="/collections/memorial-wreaths"
                          className="flex items-center gap-2 text-sm text-charcoal-600 hover:text-sage-600"
                        >
                          <Heart className="h-4 w-4" />
                          Memorial Wreaths
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/collections/funeral-wreaths"
                          className="flex items-center gap-2 text-sm text-charcoal-600 hover:text-sage-600"
                        >
                          <Heart className="h-4 w-4" />
                          Funeral Wreaths
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/collections/door-wreaths"
                          className="flex items-center gap-2 text-sm text-charcoal-600 hover:text-sage-600"
                        >
                          <Home className="h-4 w-4" />
                          Door Wreaths
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/bespoke"
                          className="flex items-center gap-2 text-sm text-charcoal-600 hover:text-sage-600"
                        >
                          <ArrowRight className="h-4 w-4" />
                          Bespoke Orders
                        </Link>
                      </li>
                    </ul>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-sage-50">
          <div className="container-narrow text-center">
            <h2 className="text-2xl lg:text-3xl mb-4">
              Ready to Order?
            </h2>
            <p className="text-charcoal-500 mb-8 max-w-xl mx-auto">
              Browse our collection and have your handcrafted wreath delivered
              anywhere in Lancashire.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center px-6 py-3 bg-sage-400 hover:bg-sage-500 text-white rounded-md transition-colors"
              >
                Browse Wreaths
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/service-areas/preston"
                className="inline-flex items-center px-6 py-3 border border-sage-300 text-sage-700 hover:bg-sage-50 rounded-md transition-colors"
              >
                Free Preston Collection
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
