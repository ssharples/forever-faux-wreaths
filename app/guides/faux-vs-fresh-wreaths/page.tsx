import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronRight, Clock, Check, X } from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { generateFAQSchema, generateBreadcrumbSchema } from "@/lib/schema";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Faux vs Fresh Wreaths: Which Should You Choose? | Forever Faux Wreaths",
  description:
    "Compare faux and fresh flower wreaths. Learn the benefits of each option, when to choose faux over fresh, and make the right decision for your needs.",
  keywords: [
    "faux vs fresh wreaths",
    "artificial flowers vs real",
    "faux wreath benefits",
    "are faux flowers better",
    "faux flowers funeral",
    "artificial wreath longevity",
  ],
  openGraph: {
    title: "Faux vs Fresh Wreaths | Forever Faux Wreaths",
    description:
      "Compare faux and fresh flower wreaths. Learn the benefits of each and when to choose one over the other.",
    url: "https://foreverfauxwreaths.co.uk/guides/faux-vs-fresh-wreaths",
  },
};

const faqs = [
  {
    question: "Can you really tell the difference between faux and fresh?",
    answer:
      "With high-quality faux florals, it can be very difficult to tell the difference at a glance. Premium faux flowers replicate the texture, colour variation, and even the subtle imperfections of real blooms. The main giveaways are the lack of fragrance and, upon close inspection, the material composition. From normal viewing distances, quality faux arrangements look remarkably realistic.",
  },
  {
    question: "Are faux flowers environmentally friendly?",
    answer:
      "It's a nuanced question. Fresh flowers have a carbon footprint from growing, refrigeration, and often international shipping. They're also disposed of within days. Faux flowers are typically made from plastic/silk and have an initial environmental cost, but they're reused for years, meaning no repeat purchases or waste. Over their lifespan, reusable faux flowers can be more environmentally considered than repeatedly buying fresh.",
  },
  {
    question: "Do faux wreaths look cheap?",
    answer:
      "Not at all—when you choose quality. There's a significant difference between pound-shop artificial flowers and premium handcrafted faux florals. Our wreaths use carefully selected materials that look realistic and elegant. Cheap faux flowers can look artificial; quality ones look beautiful.",
  },
  {
    question: "How long do faux wreaths really last?",
    answer:
      "With proper care—storing away from direct sunlight when not in use, keeping dry, and occasional dusting—a quality faux wreath can look beautiful for 5+ years. Many customers have had our wreaths for even longer. This makes them excellent value compared to fresh alternatives.",
  },
  {
    question: "Is it appropriate to use faux flowers for a funeral?",
    answer:
      "Absolutely. Faux funeral flowers are increasingly common and completely appropriate. They have distinct advantages: they won't wilt during the service, can be kept by the family afterward as a memorial, and can be placed on the grave as a lasting tribute. Many funeral directors now see them regularly.",
  },
];

export default function FauxVsFreshGuidePage() {
  const faqSchema = generateFAQSchema(faqs);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://foreverfauxwreaths.co.uk" },
    { name: "Guides", url: "https://foreverfauxwreaths.co.uk/guides" },
    { name: "Faux vs Fresh Wreaths" },
  ]);

  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
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
                href="/guides"
                className="hover:text-sage-600 transition-colors"
              >
                Guides
              </Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li className="text-charcoal-700 font-medium">Faux vs Fresh</li>
          </ol>
        </nav>

        {/* Article Header */}
        <section className="bg-gradient-to-b from-sage-50 to-cream-100 py-12 lg:py-16">
          <div className="container-narrow">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-medium text-sage-600 bg-sage-100 px-3 py-1 rounded-full">
                General Advice
              </span>
              <span className="flex items-center gap-1 text-xs text-charcoal-400">
                <Clock className="h-3 w-3" />6 min read
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl mb-6">
              Faux vs Fresh Wreaths: Which Should You Choose?
            </h1>
            <p className="text-lg text-charcoal-500">
              Both faux and fresh flower wreaths have their place. This guide
              compares the two options to help you decide which is right for
              your situation, whether it&apos;s a door wreath, funeral tribute, or
              seasonal display.
            </p>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-12 lg:py-16">
          <div className="container-narrow">
            <h2 className="text-2xl font-display text-charcoal-700 mb-8 text-center">
              At a Glance: Faux vs Fresh
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-16">
              {/* Faux Column */}
              <Card className="border-sage-300">
                <CardContent className="p-6">
                  <h3 className="text-xl font-display text-sage-700 mb-4 text-center">
                    Faux Wreaths
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-sage-500 shrink-0 mt-0.5" />
                      <span className="text-charcoal-600">
                        Lasts for years with proper care
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-sage-500 shrink-0 mt-0.5" />
                      <span className="text-charcoal-600">
                        No maintenance required
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-sage-500 shrink-0 mt-0.5" />
                      <span className="text-charcoal-600">
                        Weather resistant for outdoor use
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-sage-500 shrink-0 mt-0.5" />
                      <span className="text-charcoal-600">
                        Allergy-friendly (no pollen)
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-sage-500 shrink-0 mt-0.5" />
                      <span className="text-charcoal-600">
                        Can be ordered well in advance
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-sage-500 shrink-0 mt-0.5" />
                      <span className="text-charcoal-600">
                        Cost-effective over time
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <X className="h-5 w-5 text-charcoal-300 shrink-0 mt-0.5" />
                      <span className="text-charcoal-400">No natural fragrance</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <X className="h-5 w-5 text-charcoal-300 shrink-0 mt-0.5" />
                      <span className="text-charcoal-400">
                        Not biodegradable
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Fresh Column */}
              <Card className="border-cream-300">
                <CardContent className="p-6">
                  <h3 className="text-xl font-display text-charcoal-600 mb-4 text-center">
                    Fresh Wreaths
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-sage-500 shrink-0 mt-0.5" />
                      <span className="text-charcoal-600">
                        Natural fragrance
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-sage-500 shrink-0 mt-0.5" />
                      <span className="text-charcoal-600">
                        Traditional choice
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-sage-500 shrink-0 mt-0.5" />
                      <span className="text-charcoal-600">Biodegradable</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <X className="h-5 w-5 text-charcoal-300 shrink-0 mt-0.5" />
                      <span className="text-charcoal-400">
                        Wilts within days to a week
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <X className="h-5 w-5 text-charcoal-300 shrink-0 mt-0.5" />
                      <span className="text-charcoal-400">
                        May need watering
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <X className="h-5 w-5 text-charcoal-300 shrink-0 mt-0.5" />
                      <span className="text-charcoal-400">
                        Affected by temperature
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <X className="h-5 w-5 text-charcoal-300 shrink-0 mt-0.5" />
                      <span className="text-charcoal-400">
                        Can trigger allergies
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <X className="h-5 w-5 text-charcoal-300 shrink-0 mt-0.5" />
                      <span className="text-charcoal-400">
                        Repeat purchase costs
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Article Content */}
            <article className="prose prose-sage max-w-none">
              <h2>When to Choose Faux Wreaths</h2>
              <p>
                Faux wreaths are the ideal choice in many situations. Consider
                choosing faux when:
              </p>

              <h3>For Year-Round Door Displays</h3>
              <p>
                If you want a beautiful wreath on your door all year, faux is
                the practical choice. A fresh wreath would need replacing every
                week or two, quickly becoming expensive and inconvenient. A
                quality faux wreath stays beautiful for years, through all
                weather conditions.
              </p>

              <h3>For Outdoor Exposure</h3>
              <p>
                Fresh flowers deteriorate quickly when exposed to sun, wind,
                and rain. Faux wreaths are designed to withstand the elements.
                While no outdoor decoration lasts forever, a faux wreath will
                maintain its appearance far longer than fresh alternatives when
                hung on an external door.
              </p>

              <h3>For Memorial and Grave Decoration</h3>
              <p>
                One of the most meaningful uses for faux wreaths is memorial
                decoration. Placing a fresh wreath on a grave means returning
                frequently to replace wilted flowers. A faux memorial wreath
                provides lasting beauty, ensuring your loved one&apos;s resting place
                always looks cared for between visits.
              </p>

              <h3>For Funeral Tributes You Want to Keep</h3>
              <p>
                After a funeral, fresh flowers must be disposed of as they wilt.
                But what if you want to keep that tribute? A faux funeral wreath
                can be taken home, displayed as a memorial, or placed on the
                grave. It transforms a temporary tribute into a lasting
                keepsake.
              </p>

              <h3>For Allergy Sufferers</h3>
              <p>
                Pollen from fresh flowers can trigger hay fever and allergies.
                Faux flowers are completely allergy-friendly, allowing everyone
                to enjoy floral décor without discomfort.
              </p>

              <h3>For Seasonal Displays</h3>
              <p>
                Want a Christmas wreath in early November? Autumn décor in late
                August? With faux, you can put up seasonal displays whenever you
                like, without worrying about timing or freshness. And you can
                store them and reuse them year after year.
              </p>

              <h2>When Fresh May Be Preferred</h2>
              <p>
                Fresh flowers still have their place. Consider fresh when:
              </p>

              <ul>
                <li>
                  <strong>Fragrance is essential:</strong> Nothing replicates
                  the scent of real flowers. If fragrance is important to you,
                  fresh is the only option.
                </li>
                <li>
                  <strong>For short-term indoor display:</strong> A fresh
                  bouquet or wreath for a dinner party or special occasion
                  indoors can be beautiful.
                </li>
                <li>
                  <strong>When tradition matters:</strong> Some people strongly
                  prefer the tradition of fresh flowers, and that&apos;s a valid
                  choice.
                </li>
                <li>
                  <strong>For occasions where disposal is expected:</strong> If
                  you know the flowers will be discarded afterward anyway.
                </li>
              </ul>

              <h2>The Quality Factor</h2>
              <p>
                It&apos;s worth noting that the quality of faux flowers varies
                enormously. There&apos;s a world of difference between cheap
                artificial flowers that look obviously fake and premium
                handcrafted faux florals that are difficult to distinguish from
                real at a glance.
              </p>

              <p>
                When investing in a faux wreath, choose quality. Look for:
              </p>

              <ul>
                <li>Realistic colour variations and textures</li>
                <li>Attention to detail in petals and leaves</li>
                <li>Quality base materials</li>
                <li>Handcrafted construction</li>
                <li>Positive reviews from other customers</li>
              </ul>

              <p>
                A well-made faux wreath is an investment that pays off over
                years of use.
              </p>

              <h2>Cost Comparison</h2>
              <p>
                While a faux wreath might cost £50-80, a fresh wreath of similar
                size might cost £30-50. However, consider the true cost:
              </p>

              <ul>
                <li>
                  <strong>Fresh:</strong> £40 x 12 replacements per year = £480
                  annually for year-round display
                </li>
                <li>
                  <strong>Faux:</strong> £60 one-time purchase, lasting 5+ years
                  = £12 per year
                </li>
              </ul>

              <p>
                For anything other than a single, short-term use, faux offers
                significantly better value.
              </p>

              <h2>Making Your Decision</h2>
              <p>
                Ultimately, the choice between faux and fresh depends on your
                priorities:
              </p>

              <ul>
                <li>
                  Choose <strong>faux</strong> for longevity, practicality,
                  value, and lasting tributes.
                </li>
                <li>
                  Choose <strong>fresh</strong> for natural fragrance, short-term
                  indoor displays, or strong personal tradition.
                </li>
              </ul>

              <p>
                There&apos;s no wrong answer—only what&apos;s right for your particular
                situation and preferences.
              </p>
            </article>

            {/* FAQ Section */}
            <div className="mt-16">
              <h2 className="text-2xl font-display text-charcoal-700 mb-6">
                Frequently Asked Questions
              </h2>
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`faq-${index}`}
                    className="bg-white rounded-lg border border-cream-300 px-6"
                  >
                    <AccordionTrigger className="text-left text-charcoal-700 hover:text-sage-600">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-charcoal-500">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-sage-50">
          <div className="container-narrow text-center">
            <h2 className="text-2xl lg:text-3xl mb-4">
              Explore Our Faux Wreath Collections
            </h2>
            <p className="text-charcoal-500 mb-8 max-w-xl mx-auto">
              Browse our handcrafted faux wreaths, made with care in Preston,
              Lancashire. Lasting beauty for every occasion.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/collections"
                className="inline-flex items-center px-6 py-3 bg-sage-400 hover:bg-sage-500 text-white rounded-md transition-colors"
              >
                Browse Collections
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center px-6 py-3 border border-sage-300 text-sage-700 hover:bg-sage-50 rounded-md transition-colors"
              >
                Shop All Wreaths
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
