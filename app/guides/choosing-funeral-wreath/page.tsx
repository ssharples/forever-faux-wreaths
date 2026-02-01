import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronRight, Clock, Heart } from "lucide-react";
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
  title:
    "How to Choose a Funeral Wreath | Complete Guide | Forever Faux Wreaths",
  description:
    "A comprehensive guide to choosing the perfect funeral wreath. Learn about colours, styles, sizes, and etiquette. Expert advice from Preston, Lancashire.",
  keywords: [
    "how to choose funeral wreath",
    "funeral wreath guide",
    "funeral flower etiquette",
    "funeral wreath colours",
    "funeral flower meaning",
    "funeral wreath size",
  ],
  openGraph: {
    title: "How to Choose a Funeral Wreath | Forever Faux Wreaths",
    description:
      "A comprehensive guide to selecting the perfect funeral wreath, including colours, styles, and etiquette.",
    url: "https://foreverfauxwreaths.co.uk/guides/choosing-funeral-wreath",
  },
};

const faqs = [
  {
    question: "Is it appropriate to send a wreath to a funeral I cannot attend?",
    answer:
      "Yes, sending a wreath when you cannot attend in person is a thoughtful way to express your condolences. Include a card with your message of sympathy. The funeral director can ensure it is displayed appropriately and may pass on condolence cards to the family.",
  },
  {
    question: "How much should I spend on a funeral wreath?",
    answer:
      "There is no fixed amount you should spend—choose something within your budget that feels appropriate for your relationship with the deceased. Wreaths typically range from £35 to £100+, with bespoke tributes costing more. A simple, sincere tribute is always appropriate regardless of price.",
  },
  {
    question: "Can I send flowers other than a wreath to a funeral?",
    answer:
      "Yes, other common funeral flower arrangements include posies, sheaves, sprays, and shaped tributes (hearts, crosses). However, wreaths are a traditional and popular choice as they symbolise eternity. Check if the family has expressed any preferences regarding flowers.",
  },
  {
    question: "What if the family has requested 'no flowers'?",
    answer:
      "Respect the family's wishes. 'No flowers' requests are common, often with donations to charity suggested instead. If you still wish to send flowers, you might wait and send them to the family home after the funeral, or send a lasting faux arrangement as a memorial gift.",
  },
  {
    question: "Should I send the wreath to the church or the funeral home?",
    answer:
      "Typically, funeral flowers are sent to the funeral home (funeral director) rather than the church or crematorium. Confirm details with the funeral director—they can advise on timing and where tributes should be delivered.",
  },
];

export default function ChoosingFuneralWreathGuidePage() {
  const faqSchema = generateFAQSchema(faqs);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://foreverfauxwreaths.co.uk" },
    { name: "Guides", url: "https://foreverfauxwreaths.co.uk/guides" },
    { name: "How to Choose a Funeral Wreath" },
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
            <li className="text-charcoal-700 font-medium">
              Choosing a Funeral Wreath
            </li>
          </ol>
        </nav>

        {/* Article Header */}
        <section className="bg-gradient-to-b from-sage-50 to-cream-100 py-12 lg:py-16">
          <div className="container-narrow">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-medium text-sage-600 bg-sage-100 px-3 py-1 rounded-full">
                Funeral & Memorial
              </span>
              <span className="flex items-center gap-1 text-xs text-charcoal-400">
                <Clock className="h-3 w-3" />8 min read
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl mb-6">
              How to Choose a Funeral Wreath: A Complete Guide
            </h1>
            <p className="text-lg text-charcoal-500">
              Choosing a funeral wreath can feel overwhelming during an already
              difficult time. This guide will help you understand the options,
              traditions, and etiquette, so you can select a meaningful tribute
              with confidence.
            </p>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-12 lg:py-16">
          <div className="container-narrow">
            <article className="prose prose-sage max-w-none">
              <h2>Understanding Funeral Wreaths</h2>
              <p>
                A funeral wreath is a circular arrangement of flowers and
                foliage, traditionally used to honour the deceased at funeral
                services. The circular shape holds deep symbolism—it represents
                eternity, the circle of life, and the enduring nature of love
                and memory.
              </p>

              <p>
                Wreaths have been used in funeral traditions across many
                cultures for centuries. In the UK, they remain one of the most
                popular and appropriate funeral flower tributes, suitable for
                all types of services from traditional funerals to modern
                celebrations of life.
              </p>

              <h2>Choosing the Right Colours</h2>
              <p>
                The colours you choose for a funeral wreath can carry meaning and
                reflect both the personality of the deceased and your
                relationship with them. Here&apos;s a guide to common colour
                choices and their associations:
              </p>

              <h3>White</h3>
              <p>
                White flowers symbolise purity, peace, and reverence. They&apos;re
                always appropriate and are particularly common for close family
                tributes. White roses, lilies, and chrysanthemums are classic
                choices.
              </p>

              <h3>Soft Pastels</h3>
              <p>
                Pale pinks, lavenders, and soft blues convey gentleness and
                tenderness. These colours are often chosen for grandmothers,
                mothers, and other beloved women, though they suit anyone with
                a gentle spirit.
              </p>

              <h3>Red</h3>
              <p>
                Deep red roses and flowers signify love and deep respect.
                Red is often chosen by spouses, partners, or close family
                members to express profound love for the deceased.
              </p>

              <h3>Yellow and Gold</h3>
              <p>
                Yellow represents warmth, friendship, and cheerful memories.
                Golden tones add richness and can celebrate a life well-lived.
                These colours are perfect for someone who brought joy and
                sunshine to others&apos; lives.
              </p>

              <h3>Natural Greens</h3>
              <p>
                Green foliage-focused arrangements are increasingly popular,
                particularly for those who loved nature or gardening. They
                convey renewal, peace, and connection to the natural world.
              </p>

              <h2>Size and Scale</h2>
              <p>
                Funeral wreaths come in various sizes. Consider your
                relationship with the deceased and the context of the service:
              </p>

              <ul>
                <li>
                  <strong>Small (25-30cm):</strong> Appropriate for friends,
                  colleagues, or distant relatives. These are modest,
                  respectful tributes.
                </li>
                <li>
                  <strong>Medium (35-40cm):</strong> The most common size for
                  close friends and extended family. Substantial but not
                  overwhelming.
                </li>
                <li>
                  <strong>Large (45-50cm+):</strong> Often chosen by immediate
                  family members or to represent a group (e.g., &quot;From all at the
                  office&quot;). Makes a significant visual statement.
                </li>
              </ul>

              <h2>Choosing Based on Relationship</h2>
              <p>
                Your relationship with the deceased may influence your choice:
              </p>

              <h3>For a Parent</h3>
              <p>
                The loss of a parent is profound. Many choose heartfelt
                tributes with messages like &quot;Mum&quot;, &quot;Dad&quot;, or &quot;Forever in Our
                Hearts&quot;. White and soft pastel colours are common, though you
                might choose colours that held personal meaning.
              </p>

              <h3>For a Spouse or Partner</h3>
              <p>
                Deep reds expressing love, or the deceased&apos;s favourite colours,
                are appropriate. Some include a ribbon with a personal message.
                The tribute often reflects the intimate nature of the
                relationship.
              </p>

              <h3>For a Grandparent</h3>
              <p>
                Soft, traditional arrangements work beautifully. Consider what
                would have pleased them—perhaps garden flowers or colours from
                their favourite blooms. A wreath &quot;from the grandchildren&quot; is
                often treasured.
              </p>

              <h3>For a Friend</h3>
              <p>
                Choose something that reflects their personality. A
                nature-lover might appreciate greenery; someone vibrant might
                suit colourful blooms. A mid-sized wreath is usually
                appropriate.
              </p>

              <h3>For a Colleague</h3>
              <p>
                A simple, tasteful wreath is appropriate. Groups often club
                together for a joint tribute with a card signed by many. Stick
                to classic colours like white, cream, or soft pastels.
              </p>

              <h2>Fresh vs Faux Funeral Wreaths</h2>
              <p>
                Traditionally, funeral flowers were fresh, but faux wreaths are
                increasingly popular. Consider these factors:
              </p>

              <h3>Fresh Wreaths</h3>
              <ul>
                <li>Traditional and expected at conventional funerals</li>
                <li>Natural fragrance and appearance</li>
                <li>Must be disposed of within days as they wilt</li>
                <li>Need to be ordered close to the funeral date</li>
              </ul>

              <h3>Faux Wreaths</h3>
              <ul>
                <li>Stay beautiful throughout the service regardless of conditions</li>
                <li>Can be kept as a memorial afterward</li>
                <li>Can be placed on the grave as a lasting tribute</li>
                <li>Can be ordered in advance without timing pressure</li>
                <li>Particularly meaningful for ongoing remembrance</li>
              </ul>

              <p>
                Many families now appreciate faux funeral wreaths because they
                can keep them after the service—displayed at home or placed on
                the grave as a lasting memorial. This transforms a one-day
                tribute into an ongoing symbol of remembrance.
              </p>

              <h2>Adding Personal Touches</h2>
              <p>
                Personalisation makes your tribute more meaningful:
              </p>

              <ul>
                <li>
                  <strong>Ribbon Messages:</strong> Add a sash with words like
                  &quot;In Loving Memory&quot;, &quot;Grandad&quot;, or a personal message.
                </li>
                <li>
                  <strong>Favourite Colours:</strong> Include the deceased&apos;s
                  favourite colour or flowers they loved.
                </li>
                <li>
                  <strong>Themed Elements:</strong> Subtle references to
                  hobbies or interests can be incorporated into bespoke designs.
                </li>
                <li>
                  <strong>Card Messages:</strong> Write a heartfelt message to
                  accompany your tribute.
                </li>
              </ul>

              <h2>Ordering and Delivery</h2>
              <p>
                When ordering your funeral wreath:
              </p>

              <ul>
                <li>
                  <strong>Order in Good Time:</strong> Place your order at least
                  3-5 days before the funeral for ready-made wreaths, longer for
                  bespoke designs.
                </li>
                <li>
                  <strong>Confirm Delivery Details:</strong> Get the funeral
                  director&apos;s full address and the date/time flowers should
                  arrive.
                </li>
                <li>
                  <strong>Check Family Preferences:</strong> Some families
                  request no flowers, donations only, or family flowers only.
                  Respect their wishes.
                </li>
                <li>
                  <strong>Include Your Details:</strong> Ensure your card is
                  clearly signed so the family knows who sent the tribute.
                </li>
              </ul>

              <h2>Etiquette and Customs</h2>
              <p>
                Some general guidance on funeral flower etiquette:
              </p>

              <ul>
                <li>
                  It&apos;s appropriate for anyone to send funeral flowers—family,
                  friends, colleagues, neighbours.
                </li>
                <li>
                  If the family requests &quot;family flowers only&quot;, only immediate
                  family should send flowers; others should make donations as
                  requested.
                </li>
                <li>
                  &quot;No flowers&quot; means respect the wish entirely and donate to
                  the named charity instead.
                </li>
                <li>
                  There&apos;s no wrong choice as long as your tribute is sincere
                  and respectful.
                </li>
              </ul>
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
              Browse Our Funeral Wreaths
            </h2>
            <p className="text-charcoal-500 mb-8 max-w-xl mx-auto">
              Explore our collection of handcrafted funeral wreaths, made with
              care in Preston, Lancashire. We also offer bespoke designs for
              truly personal tributes.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/collections/funeral-wreaths"
                className="inline-flex items-center px-6 py-3 bg-sage-400 hover:bg-sage-500 text-white rounded-md transition-colors"
              >
                View Funeral Wreaths
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/bespoke"
                className="inline-flex items-center px-6 py-3 border border-sage-300 text-sage-700 hover:bg-sage-50 rounded-md transition-colors"
              >
                Create Bespoke Tribute
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
