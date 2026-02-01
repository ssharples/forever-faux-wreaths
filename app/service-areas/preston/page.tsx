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
  Phone,
} from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  generateLocalBusinessSchema,
  generateBreadcrumbSchema,
} from "@/lib/schema";
import Script from "next/script";

export const metadata: Metadata = {
  title:
    "Wreaths in Preston | Free Collection | Forever Faux Wreaths Preston",
  description:
    "Handcrafted faux wreaths in Preston, Lancashire. Free local collection available. Memorial wreaths, door wreaths, funeral tributes. Order online or visit us in Preston.",
  keywords: [
    "wreaths Preston",
    "funeral wreaths Preston",
    "door wreaths Preston",
    "florist Preston",
    "memorial wreaths Preston",
    "wreaths near me Preston",
    "faux flowers Preston",
    "artificial wreaths Preston",
  ],
  openGraph: {
    title: "Wreaths in Preston | Forever Faux Wreaths",
    description:
      "Handcrafted faux wreaths in Preston, Lancashire. Free local collection available.",
    url: "https://foreverfauxwreaths.co.uk/service-areas/preston",
  },
};

const localAreas = [
  "Preston City Centre",
  "Fulwood",
  "Penwortham",
  "Ashton-on-Ribble",
  "Ribbleton",
  "Ingol",
  "Lea",
  "Larches",
  "Brookfield",
  "Moor Nook",
  "Deepdale",
  "Holme Slack",
];

export default function PrestonPage() {
  const localBusinessSchema = generateLocalBusinessSchema();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://foreverfauxwreaths.co.uk" },
    {
      name: "Service Areas",
      url: "https://foreverfauxwreaths.co.uk/service-areas",
    },
    { name: "Preston" },
  ]);

  return (
    <>
      <Script
        id="local-business-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
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
            <li className="text-charcoal-700 font-medium">Preston</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-sage-50 to-cream-100 py-12 lg:py-20">
          <div className="container-wide">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-sage-600" />
                <span className="text-sm uppercase tracking-wider text-charcoal-400">
                  Our Home Base
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl mb-6">
                Handcrafted Wreaths in Preston, Lancashire
              </h1>
              <p className="text-lg text-charcoal-500 mb-8">
                Forever Faux Wreaths is proudly based in Preston. As our home
                town, we offer free local collection and personal service to our
                Preston customers. Visit us, collect your wreath, or have it
                delivered locally.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 bg-sage-400 hover:bg-sage-500 text-white rounded-md transition-colors"
                >
                  Arrange Collection
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
          </div>
        </section>

        {/* Key Benefits */}
        <section className="py-12 bg-white">
          <div className="container-wide">
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="p-5 border-cream-300 text-center">
                <div className="w-10 h-10 rounded-full bg-sage-100 mx-auto mb-3 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-sage-600" />
                </div>
                <h3 className="font-medium text-charcoal-700 mb-1">
                  Free Collection
                </h3>
                <p className="text-sm text-charcoal-500">
                  Collect from Preston at no extra cost
                </p>
              </Card>
              <Card className="p-5 border-cream-300 text-center">
                <div className="w-10 h-10 rounded-full bg-sage-100 mx-auto mb-3 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-sage-600" />
                </div>
                <h3 className="font-medium text-charcoal-700 mb-1">
                  Same-Day Available
                </h3>
                <p className="text-sm text-charcoal-500">
                  For urgent local orders
                </p>
              </Card>
              <Card className="p-5 border-cream-300 text-center">
                <div className="w-10 h-10 rounded-full bg-sage-100 mx-auto mb-3 flex items-center justify-center">
                  <Truck className="h-5 w-5 text-sage-600" />
                </div>
                <h3 className="font-medium text-charcoal-700 mb-1">
                  Local Delivery
                </h3>
                <p className="text-sm text-charcoal-500">
                  Delivery across Preston
                </p>
              </Card>
              <Card className="p-5 border-cream-300 text-center">
                <div className="w-10 h-10 rounded-full bg-sage-100 mx-auto mb-3 flex items-center justify-center">
                  <Heart className="h-5 w-5 text-sage-600" />
                </div>
                <h3 className="font-medium text-charcoal-700 mb-1">
                  Personal Service
                </h3>
                <p className="text-sm text-charcoal-500">
                  Meet the maker in person
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
                  <h2>Your Local Wreath Maker in Preston</h2>
                  <p>
                    Forever Faux Wreaths was born in Preston, and this is where
                    every wreath in our collection is lovingly handcrafted. As a
                    local business, we take pride in serving our community with
                    beautiful, lasting floral arrangements.
                  </p>

                  <p>
                    Whether you&apos;re looking for a welcoming door wreath for your
                    home in Fulwood, a memorial tribute for a loved one, or a
                    bespoke creation for a special occasion, we&apos;re here to help.
                    Being based in Preston means we can offer a personal touch
                    that larger, distant companies simply can&apos;t match.
                  </p>

                  <h3>Free Collection in Preston</h3>
                  <p>
                    One of the benefits of ordering from a local maker is the
                    option to collect your wreath in person. This means:
                  </p>

                  <ul>
                    <li>No delivery charges at all</li>
                    <li>See your wreath before taking it home</li>
                    <li>Ask questions and get care advice in person</li>
                    <li>
                      Convenient collection times arranged to suit you
                    </li>
                    <li>Same-day collection available for ready-made items</li>
                  </ul>

                  <p>
                    To arrange collection, simply contact us after placing your
                    order and we&apos;ll find a time that works for you.
                  </p>

                  <h3>Local Delivery Available</h3>
                  <p>
                    If collection isn&apos;t convenient, we offer local delivery
                    throughout Preston and the surrounding areas. We can also
                    deliver directly to funeral directors, care homes, or other
                    locations within Preston.
                  </p>

                  <h3>Services for Preston Customers</h3>
                  <p>
                    As a Preston-based business, we offer the full range of our
                    services to local customers:
                  </p>

                  <ul>
                    <li>
                      <strong>Door Wreaths:</strong> Beautiful entrance
                      decorations for your Preston home
                    </li>
                    <li>
                      <strong>Memorial Wreaths:</strong> Lasting tributes for
                      cemeteries and remembrance
                    </li>
                    <li>
                      <strong>Funeral Wreaths:</strong> Elegant tributes
                      delivered to local funeral directors
                    </li>
                    <li>
                      <strong>Seasonal Wreaths:</strong> Christmas, autumn, and
                      seasonal designs
                    </li>
                    <li>
                      <strong>Bespoke Creations:</strong> Custom designs made to
                      your specifications
                    </li>
                  </ul>

                  <h3>Working with Preston Funeral Directors</h3>
                  <p>
                    We have established relationships with funeral directors
                    across Preston. We can deliver funeral wreaths and tributes
                    directly to them, coordinating timing to ensure your tribute
                    arrives exactly when needed. Simply provide the funeral
                    director&apos;s details when ordering.
                  </p>

                  <h3>Why Choose a Local Preston Wreath Maker?</h3>
                  <p>
                    Supporting local businesses means supporting your community.
                    When you order from Forever Faux Wreaths, you&apos;re supporting
                    a Preston-based small business. You get:
                  </p>

                  <ul>
                    <li>Handcrafted quality, not mass production</li>
                    <li>Personal service and attention to detail</li>
                    <li>Easy communication and quick responses</li>
                    <li>The option to see products in person</li>
                    <li>Flexibility and accommodation for special requests</li>
                    <li>
                      Pride in knowing your purchase supports the local economy
                    </li>
                  </ul>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {/* Areas Served */}
                  <Card className="p-6 border-cream-300">
                    <h3 className="font-display text-lg mb-4">
                      Preston Areas We Serve
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {localAreas.map((area) => (
                        <div
                          key={area}
                          className="flex items-center gap-2 text-sm text-charcoal-500"
                        >
                          <Check className="h-4 w-4 text-sage-500" />
                          {area}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-charcoal-400 mt-4">
                      Plus all other Preston postcodes
                    </p>
                  </Card>

                  {/* Contact Card */}
                  <Card className="p-6 border-sage-300 bg-sage-50">
                    <h3 className="font-display text-lg mb-4">
                      Get in Touch
                    </h3>
                    <div className="space-y-3">
                      <p className="text-sm text-charcoal-600">
                        <strong>Location:</strong>
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
                    <Button asChild className="w-full mt-4 bg-sage-400 hover:bg-sage-500">
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
              Ready to Order Your Wreath?
            </h2>
            <p className="text-charcoal-500 mb-8 max-w-xl mx-auto">
              Browse our collection online and arrange free Preston collection,
              or contact us to discuss your requirements.
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
