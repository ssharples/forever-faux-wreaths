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
    "Wreaths in Manchester | Next-Day Delivery | Forever Faux Wreaths",
  description:
    "Handcrafted faux wreaths delivered to Greater Manchester. Funeral wreaths, memorial tributes, door wreaths. Next-day delivery to Manchester, Salford, Bolton and surrounding areas.",
  keywords: [
    "wreaths Manchester",
    "funeral wreaths Manchester",
    "door wreaths Manchester",
    "memorial wreaths Manchester",
    "wreaths Salford",
    "wreaths Bolton",
    "wreaths Stockport",
    "faux flowers Manchester",
    "artificial wreaths Manchester",
  ],
  openGraph: {
    title: "Wreaths in Manchester | Forever Faux Wreaths",
    description:
      "Handcrafted faux wreaths delivered to Greater Manchester. Made in Preston, next-day delivery available.",
    url: "https://foreverfauxwreaths.co.uk/service-areas/manchester",
  },
};

const manchesterAreas = [
  { name: "Manchester City Centre", area: "Central" },
  { name: "Salford", area: "Central" },
  { name: "Bolton", area: "North" },
  { name: "Bury", area: "North" },
  { name: "Rochdale", area: "North East" },
  { name: "Oldham", area: "East" },
  { name: "Stockport", area: "South" },
  { name: "Tameside", area: "East" },
  { name: "Trafford", area: "South West" },
  { name: "Wigan", area: "West" },
  { name: "Altrincham", area: "South" },
  { name: "Sale", area: "South" },
];

export default function ManchesterPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://foreverfauxwreaths.co.uk" },
    {
      name: "Service Areas",
      url: "https://foreverfauxwreaths.co.uk/service-areas",
    },
    { name: "Manchester" },
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
            <li className="text-charcoal-700 font-medium">Manchester</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-sage-50 to-cream-100 py-12 lg:py-20">
          <div className="container-wide">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-sage-600" />
                <span className="text-sm uppercase tracking-wider text-charcoal-400">
                  Greater Manchester
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl mb-6">
                Handcrafted Wreaths Delivered to Manchester
              </h1>
              <p className="text-lg text-charcoal-500 mb-8">
                Beautiful faux wreaths delivered to Greater Manchester from our
                workshop in Preston. Next-day delivery available to Manchester,
                Salford, Bolton, Stockport, and all surrounding areas.
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
                  <Clock className="h-6 w-6 text-sage-600" />
                </div>
                <h3 className="font-display text-lg mb-2">
                  Next-Day Delivery
                </h3>
                <p className="text-sm text-charcoal-500">
                  Order before 2pm for next-day delivery to most Manchester
                  postcodes.
                </p>
              </Card>
              <Card className="p-6 border-cream-300 text-center">
                <div className="w-12 h-12 rounded-full bg-sage-100 mx-auto mb-4 flex items-center justify-center">
                  <Truck className="h-6 w-6 text-sage-600" />
                </div>
                <h3 className="font-display text-lg mb-2">Full Coverage</h3>
                <p className="text-sm text-charcoal-500">
                  We deliver to all Greater Manchester boroughs and surrounding
                  areas.
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
                  Direct delivery to funeral homes across Greater Manchester.
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
                  <h2>Serving Greater Manchester</h2>
                  <p>
                    While we&apos;re based in Preston, we have excellent connections
                    to Greater Manchester, making delivery quick and reliable.
                    Whether you&apos;re in the heart of Manchester city centre, the
                    leafy suburbs of Altrincham, or the northern reaches of
                    Bolton and Bury, we can get your handcrafted wreath to you
                    promptly.
                  </p>

                  <p>
                    Manchester customers can expect the same beautiful,
                    handcrafted quality as our local Preston buyers. Every
                    wreath is carefully packaged to ensure it arrives in perfect
                    condition, ready to display.
                  </p>

                  <h3>Delivery to Manchester</h3>
                  <p>Our delivery service to Greater Manchester includes:</p>

                  <ul>
                    <li>
                      <strong>Standard Delivery:</strong> £4.99 for smaller
                      items, £7.99 for larger wreaths
                    </li>
                    <li>
                      <strong>Next-Day Delivery:</strong> Available for orders
                      placed before 2pm on ready-made items
                    </li>
                    <li>
                      <strong>Full Coverage:</strong> All M, BL, OL, SK, WN, and
                      surrounding postcodes
                    </li>
                    <li>
                      <strong>Tracked Delivery:</strong> Full tracking on all
                      orders
                    </li>
                  </ul>

                  <h3>Funeral Wreaths for Manchester Families</h3>
                  <p>
                    We work with funeral directors throughout Greater Manchester
                    to ensure funeral wreaths and tributes arrive exactly when
                    needed. Our service includes:
                  </p>

                  <ul>
                    <li>
                      Direct delivery to Manchester funeral homes
                    </li>
                    <li>
                      Coordination with funeral directors on timing
                    </li>
                    <li>Beautiful presentation of your tribute</li>
                    <li>
                      Priority handling for funeral orders
                    </li>
                  </ul>

                  <p>
                    Simply provide your funeral director&apos;s details when
                    ordering, and we&apos;ll take care of the coordination.
                  </p>

                  <h3>Popular Products for Manchester Customers</h3>
                  <p>
                    Our Manchester customers frequently order:
                  </p>

                  <ul>
                    <li>
                      <strong>Door Wreaths:</strong> Adding character to
                      Manchester&apos;s Victorian terraces and modern apartments
                    </li>
                    <li>
                      <strong>Funeral Wreaths:</strong> Beautiful tributes
                      delivered to funeral homes across the region
                    </li>
                    <li>
                      <strong>Memorial Wreaths:</strong> For cemeteries and
                      crematoria throughout Greater Manchester
                    </li>
                    <li>
                      <strong>Christmas Wreaths:</strong> Festive decorations
                      that survive Manchester&apos;s winter weather
                    </li>
                  </ul>

                  <h3>Why Order from Preston?</h3>
                  <p>
                    You might wonder why order from Preston when there are
                    florists in Manchester. Here&apos;s what makes us different:
                  </p>

                  <ul>
                    <li>
                      <strong>Faux Specialist:</strong> We specialise in
                      high-quality faux floral arrangements that last for years
                    </li>
                    <li>
                      <strong>Handcrafted Quality:</strong> Every wreath is made
                      by hand, not mass-produced
                    </li>
                    <li>
                      <strong>Lasting Beauty:</strong> Your wreath won&apos;t wilt
                      or die—it stays beautiful indefinitely
                    </li>
                    <li>
                      <strong>Quick Delivery:</strong> Preston to Manchester is
                      a quick journey—next-day delivery is standard
                    </li>
                    <li>
                      <strong>Bespoke Service:</strong> Custom designs available
                      to match your exact vision
                    </li>
                  </ul>

                  <h3>UK-Wide Shipping</h3>
                  <p>
                    Of course, we also ship throughout the UK, so if you&apos;re
                    ordering for someone outside Greater Manchester, we can
                    deliver there too. The same careful packaging ensures your
                    wreath arrives in perfect condition wherever it&apos;s going.
                  </p>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {/* Areas We Serve */}
                  <Card className="p-6 border-cream-300">
                    <h3 className="font-display text-lg mb-4">
                      Manchester Areas We Serve
                    </h3>
                    <div className="space-y-2">
                      {manchesterAreas.map((area) => (
                        <div
                          key={area.name}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="flex items-center gap-2 text-charcoal-600">
                            <Check className="h-4 w-4 text-sage-500" />
                            {area.name}
                          </span>
                          <span className="text-charcoal-400 text-xs">
                            {area.area}
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-charcoal-400 mt-4">
                      Plus all Greater Manchester postcodes
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
              Order for Manchester Delivery
            </h2>
            <p className="text-charcoal-500 mb-8 max-w-xl mx-auto">
              Browse our collection and have your handcrafted wreath delivered
              to your Manchester address—often next day.
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
                href="/bespoke"
                className="inline-flex items-center px-6 py-3 border border-sage-300 text-sage-700 hover:bg-sage-50 rounded-md transition-colors"
              >
                Create Bespoke
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
