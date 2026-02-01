import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, HelpCircle, Lightbulb } from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Wreath Guides & Advice | Forever Faux Wreaths",
  description:
    "Helpful guides on choosing funeral wreaths, understanding faux vs fresh flowers, and caring for your wreaths. Expert advice from Preston, Lancashire.",
  keywords: [
    "funeral wreath guide",
    "faux flowers advice",
    "wreath care tips",
    "funeral flower etiquette",
    "artificial wreath benefits",
  ],
  openGraph: {
    title: "Wreath Guides & Advice | Forever Faux Wreaths",
    description:
      "Helpful guides on choosing wreaths, understanding faux vs fresh flowers, and caring for your arrangements.",
    url: "https://foreverfauxwreaths.co.uk/guides",
  },
};

const guides = [
  {
    slug: "choosing-funeral-wreath",
    title: "How to Choose a Funeral Wreath",
    description:
      "A comprehensive guide to selecting the perfect funeral wreath, including colour meanings, appropriate styles, and etiquette for different relationships.",
    icon: HelpCircle,
    readTime: "8 min read",
    category: "Funeral & Memorial",
  },
  {
    slug: "faux-vs-fresh-wreaths",
    title: "Faux vs Fresh Wreaths: Which to Choose?",
    description:
      "Compare the benefits of faux and fresh flower wreaths. Learn when each option is best suited and make an informed decision for your needs.",
    icon: Lightbulb,
    readTime: "6 min read",
    category: "General Advice",
  },
];

export default function GuidesPage() {
  return (
    <>
      <Header />

      <main className="flex-1 bg-cream-100">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-sage-50 to-cream-100 py-16 lg:py-24">
          <div className="container-wide text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-sage-600" />
              <span className="text-sm uppercase tracking-wider text-charcoal-400">
                Resources
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl mb-6">Wreath Guides & Advice</h1>
            <p className="text-lg text-charcoal-500 max-w-2xl mx-auto">
              Helpful guides to help you choose the perfect wreath, understand
              the benefits of faux florals, and care for your arrangements.
            </p>
          </div>
        </section>

        {/* Guides Grid */}
        <section className="py-12 lg:py-16">
          <div className="container-wide">
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
              {guides.map((guide) => {
                const Icon = guide.icon;
                return (
                  <Link
                    key={guide.slug}
                    href={`/guides/${guide.slug}`}
                    className="group"
                  >
                    <Card className="overflow-hidden border-cream-300 hover:border-sage-300 transition-all duration-300 hover:shadow-lg h-full">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-full bg-sage-100 flex items-center justify-center">
                            <Icon className="h-6 w-6 text-sage-600" />
                          </div>
                          <div>
                            <span className="text-xs text-sage-600 font-medium">
                              {guide.category}
                            </span>
                            <p className="text-xs text-charcoal-400">
                              {guide.readTime}
                            </p>
                          </div>
                        </div>
                        <h2 className="text-xl font-display text-charcoal-700 mb-3 group-hover:text-sage-600 transition-colors">
                          {guide.title}
                        </h2>
                        <p className="text-charcoal-500 text-sm mb-4">
                          {guide.description}
                        </p>
                        <span className="inline-flex items-center text-sm font-medium text-sage-600 group-hover:text-sage-700">
                          Read Guide
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* More Help Section */}
        <section className="py-16 bg-sage-50">
          <div className="container-narrow text-center">
            <h2 className="text-2xl lg:text-3xl mb-4">Need More Help?</h2>
            <p className="text-charcoal-500 mb-8 max-w-xl mx-auto">
              If you have questions not covered in our guides, we&apos;re here to
              help. Get in touch and we&apos;ll be happy to offer personalised
              advice.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 bg-sage-400 hover:bg-sage-500 text-white rounded-md transition-colors"
              >
                Contact Us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/info/faqs"
                className="inline-flex items-center px-6 py-3 border border-sage-300 text-sage-700 hover:bg-sage-50 rounded-md transition-colors"
              >
                View FAQs
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
