import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  CloudSun,
  Heart,
  Ruler,
  ShieldCheck,
  Store,
  Users,
} from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { StructuredData } from "@/components/seo/structured-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  MemorialTopperRetailForm,
  MemorialTopperWholesaleForm,
  MemorialTopperWholesaleIntro,
} from "@/components/forms/memorial-topper-lead-forms";
import { absoluteUrl } from "@/lib/site-url";

const productName = "Forever Faux™ Memorial Topper";
const description =
  "A simple, secure, and respectful way to help keep graveside flowers and memorial items where they belong.";

export const metadata: Metadata = {
  title: "Forever Faux Memorial Topper | Launching Soon",
  description:
    "Join the waiting list or request wholesale information for the patent pending Forever Faux Memorial Topper.",
  alternates: {
    canonical: "/memorial-topper",
  },
  openGraph: {
    title: "Forever Faux Memorial Topper | Launching Soon",
    description:
      "A new patent pending memorial product designed to help keep graveside flowers and tributes secure.",
    url: "/memorial-topper",
    type: "website",
    images: [
      {
        url: absoluteUrl("/images/about-workshop.webp"),
        alt: "Forever Faux Wreaths workshop placeholder imagery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Forever Faux Memorial Topper | Launching Soon",
    description:
      "Join the waiting list or request wholesale information for the patent pending Forever Faux Memorial Topper.",
    images: [absoluteUrl("/images/about-workshop.webp")],
  },
};

const features = [
  {
    icon: Ruler,
    title: "Universal fit",
    body: "A lightweight telescopic design adjusts to fit grave vases and memorial arrangements.",
  },
  {
    icon: CloudSun,
    title: "Weather-resistant",
    body: "Designed to help hold flowers, wreaths, and memorial items in place through changing weather.",
  },
  {
    icon: ShieldCheck,
    title: "Discreet and secure",
    body: "Built to sit respectfully with tributes while reducing accidental disturbance.",
  },
];

const audiences = [
  "Families wanting peace of mind",
  "Funeral directors",
  "Florists",
  "Garden centres",
  "Memorial suppliers",
];

export default function MemorialTopperPage() {
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productName,
    description,
    sku: "memorial-topper",
    image: [absoluteUrl("/images/about-workshop.webp")],
    brand: {
      "@type": "Brand",
      name: "Forever Faux Wreaths",
    },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Status", value: "Launching soon" },
      { "@type": "PropertyValue", name: "Patent status", value: "Patent pending" },
      { "@type": "PropertyValue", name: "Fit", value: "Universal adjustable fit" },
      { "@type": "PropertyValue", name: "Material", value: "Lightweight aluminium design" },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Memorial Topper",
        item: absoluteUrl("/memorial-topper"),
      },
    ],
  };

  return (
    <>
      <StructuredData data={[productSchema, breadcrumbSchema]} />
      <Header />

      <main className="flex-1 bg-cream-100">
        <section className="overflow-hidden bg-cream-100">
          <div className="container-wide py-12 lg:py-16">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.86fr)] lg:items-center">
              <div className="max-w-3xl">
                <Badge className="mb-5 bg-sage-100 text-sage-700 hover:bg-sage-100">
                  Patent pending, launching soon
                </Badge>
                <p className="font-handwritten text-2xl text-sage-600">
                  Coming soon
                </p>
                <h1 className="mt-3 text-balance">{productName}</h1>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-charcoal-500">
                  A new patent pending design created to help stop flowers,
                  wreaths, and memorial items from blowing away or being
                  removed.
                </p>
                <div className="mt-7 flex flex-wrap gap-2">
                  {["Universal", "Adjustable", "Weather-resistant"].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-sage-200 bg-white px-4 py-2 text-sm font-medium text-charcoal-600"
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <p className="mt-7 max-w-xl leading-relaxed text-charcoal-500">
                  Designed with care to protect the memories of loved ones.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button
                    asChild
                    size="lg"
                    className="min-h-12 bg-sage-400 text-white hover:bg-sage-500"
                  >
                    <a href="#waiting-list">
                      Join the waiting list
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="min-h-12 border-sage-300 text-sage-700 hover:bg-sage-50"
                  >
                    <a href="#wholesale">Request wholesale information</a>
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-cream-300">
                  <Image
                    src="/images/about-workshop.webp"
                    alt="Forever Faux Wreaths workshop, placeholder imagery for the Memorial Topper launch"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover"
                  />
                </div>
                <div className="absolute bottom-4 left-4 right-4 rounded-lg border border-cream-300 bg-white p-4">
                  <p className="text-sm font-medium text-charcoal-700">
                    Product photography coming soon
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-charcoal-500">
                    This launch page uses Forever Faux brand imagery until the
                    final Memorial Topper photography is available.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-12">
          <div className="container-wide">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <p className="font-handwritten text-2xl text-sage-600">
                  Respectful protection
                </p>
                <h2 className="mt-3 text-balance">
                  Keep graveside flowers and tributes exactly where they belong
                </h2>
                <p className="mt-5 max-w-2xl leading-relaxed text-charcoal-500">
                  The Memorial Topper uses a lightweight aluminium telescopic
                  design that adjusts to fit a grave, vase, or arrangement. Once
                  in place, it helps hold memorial items against wind, weather,
                  and accidental disturbance.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {features.map((feature) => (
                  <Card
                    key={feature.title}
                    className="border-cream-300 bg-cream-50 p-5"
                  >
                    <feature.icon className="h-6 w-6 text-sage-600" />
                    <h3 className="mt-4 text-base font-medium text-charcoal-700">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-charcoal-500">
                      {feature.body}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-cream-100 py-12">
          <div className="container-wide">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <Card className="border-cream-300 bg-white p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sage-100">
                    <Heart className="h-5 w-5 text-sage-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl">Key features</h2>
                    <p className="text-sm text-charcoal-500">
                      Simple, secure, and respectful.
                    </p>
                  </div>
                </div>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    "Universal fit",
                    "Lightweight aluminium design",
                    "Weather-resistant",
                    "Easy to use",
                    "Discreet and respectful",
                    "Patent pending",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-sage-600" />
                      <span className="text-sm text-charcoal-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <div>
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-sage-600" />
                  <h2 className="text-2xl">Perfect for</h2>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {audiences.map((audience) => (
                    <div
                      key={audience}
                      className="rounded-lg border border-cream-300 bg-white px-4 py-3 text-sm font-medium text-charcoal-600"
                    >
                      {audience}
                    </div>
                  ))}
                </div>
                <p className="mt-5 text-sm leading-relaxed text-charcoal-500">
                  Wholesale enquiries are now open for trade customers preparing
                  their memorial range ahead of launch.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="waiting-list" className="scroll-mt-24 bg-white py-12">
          <div className="container-narrow">
            <Card className="border-cream-300 bg-cream-50 p-6 sm:p-8">
              <div className="mb-6">
                <p className="font-handwritten text-2xl text-sage-600">
                  Be first to know
                </p>
                <h2 className="mt-2 text-balance">
                  Join the waiting list or request early access
                </h2>
                <p className="mt-4 max-w-2xl leading-relaxed text-charcoal-500">
                  Leave your email and we will share launch updates for the
                  Forever Faux Memorial Topper as soon as they are available.
                </p>
              </div>
              <MemorialTopperRetailForm />
            </Card>
          </div>
        </section>

        <section id="wholesale" className="scroll-mt-24 bg-sage-50 py-12">
          <div className="container-wide">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <Badge className="bg-white text-sage-700 hover:bg-white">
                  Trade enquiries
                </Badge>
                <h2 className="mt-4 text-balance">
                  Wholesale enquiries for the Memorial Topper
                </h2>
                <p className="mt-5 leading-relaxed text-charcoal-500">
                  Thank you for your interest in stocking our new patent pending
                  memorial product. It is designed to help prevent flowers and
                  memorial items from blowing away or being removed, offering
                  families a simple and secure solution.
                </p>
                <div className="mt-6">
                  <MemorialTopperWholesaleIntro />
                </div>
                <div className="mt-6 rounded-lg border border-sage-200 bg-white p-4">
                  <Store className="h-5 w-5 text-sage-600" />
                  <p className="mt-3 text-sm leading-relaxed text-charcoal-500">
                    Use this form to request wholesale pricing, minimum order
                    quantities, sample availability, launch dates, or trade
                    packs.
                  </p>
                </div>
              </div>

              <Card className="border-cream-300 bg-cream-50 p-6 sm:p-8">
                <MemorialTopperWholesaleForm />
              </Card>
            </div>
          </div>
        </section>

        <section className="bg-charcoal-600 py-10">
          <div className="container-wide">
            <div className="flex flex-col gap-4 text-cream-100 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl text-cream-100">
                  Looking for memorial wreaths?
                </h2>
                <p className="mt-2 text-sm text-cream-300">
                  The Memorial Topper is separate from our handcrafted wreath
                  collection.
                </p>
              </div>
              <Button asChild variant="secondary" className="bg-cream-100">
                <Link href="/shop?style=memorial">
                  View memorial wreaths
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
