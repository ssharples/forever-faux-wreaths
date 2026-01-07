import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    category: "Orders & Shipping",
    questions: [
      {
        question: "How long does delivery take?",
        answer:
          "Standard UK delivery typically takes 3-5 working days. All wreaths are carefully packaged to ensure they arrive in perfect condition. Processing time is usually 1-3 business days before dispatch.",
      },
      {
        question: "Do you offer local collection?",
        answer:
          "Yes! Free local collection is available in Preston, Lancashire. When you place your order, simply select 'Local Collection' at checkout and we'll arrange a convenient time for you to pick up your wreath.",
      },
      {
        question: "What are your delivery charges?",
        answer:
          "Delivery is £4.99 for small items (wreaths under 30cm) and £7.99 for large items. Local collection in Preston is always free.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "Currently, we only ship within the UK. If you're interested in international shipping, please contact us and we'll do our best to accommodate your request.",
      },
    ],
  },
  {
    category: "Products & Care",
    questions: [
      {
        question: "How long will my wreath last?",
        answer:
          "Our faux floral wreaths are designed to last for years with proper care. Unlike fresh flowers, they won't wilt or die, making them a long-lasting investment for your home.",
      },
      {
        question: "Can the wreaths be used outdoors?",
        answer:
          "While our wreaths can be displayed on a front door, we recommend placing them in a covered or sheltered area to protect them from direct sunlight and extreme weather, which can cause fading over time.",
      },
      {
        question: "How do I care for my wreath?",
        answer:
          "Simply dust gently with a soft brush or cloth as needed. Avoid direct sunlight to prevent fading. Store in a cool, dry place when not in use. Keep away from excessive moisture.",
      },
      {
        question: "Are the flowers realistic-looking?",
        answer:
          "We use premium quality faux florals that are carefully selected for their realistic appearance. Many customers tell us their neighbours think they're real!",
      },
    ],
  },
  {
    category: "Bespoke Orders",
    questions: [
      {
        question: "How do I place a bespoke order?",
        answer:
          "Simply fill out our bespoke order enquiry form with your requirements, colour preferences, and any inspiration images. I'll review your request and get back to you within 24-48 hours with a quote.",
      },
      {
        question: "How much do bespoke orders cost?",
        answer:
          "Bespoke pricing starts from £45 for a 20cm wreath, £55 for 30cm, £70 for 40cm, and £85 for 50cm. Additional features like ribbons (+£5) and complex designs may affect the final price. Custom sizes are quoted individually.",
      },
      {
        question: "How long does a bespoke order take?",
        answer:
          "Typically, bespoke orders are completed within 1-2 weeks from approval. During busy periods (e.g., Christmas), this may be longer. If you need your wreath by a specific date, please let me know in your enquiry.",
      },
      {
        question: "Can I request specific flowers or colours?",
        answer:
          "Absolutely! That's what bespoke is all about. Share your vision, colour preferences, and any specific flowers you'd like, and I'll create something unique just for you.",
      },
    ],
  },
  {
    category: "Payment & Returns",
    questions: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept PayPal (including Pay Later) and card payments via SumUp. All transactions are secure and encrypted.",
      },
      {
        question: "Do you offer refunds?",
        answer:
          "We want you to love your wreath! If you're not satisfied, please contact us within 14 days of receiving your order. Bespoke orders are non-refundable as they're made specifically for you.",
      },
      {
        question: "What if my wreath arrives damaged?",
        answer:
          "Please contact us immediately with photos of the damage. We'll arrange a replacement or refund as quickly as possible. All orders are carefully packaged, but we understand accidents can happen in transit.",
      },
    ],
  },
];

export default function FAQsPage() {
  return (
    <>
      <Header />

      <main className="flex-1 bg-cream-100">
        {/* Hero */}
        <section className="bg-gradient-to-b from-cream-100 to-cream-200 py-16">
          <div className="container-narrow text-center">
            <h1 className="mb-6">Frequently Asked Questions</h1>
            <p className="text-lg text-charcoal-500 max-w-2xl mx-auto">
              Find answers to common questions about our wreaths, delivery,
              bespoke orders, and more.
            </p>
          </div>
        </section>

        {/* FAQ Sections */}
        <section className="py-12">
          <div className="container-narrow">
            <div className="space-y-10">
              {faqs.map((category) => (
                <div key={category.category}>
                  <h2 className="text-2xl mb-6">{category.category}</h2>
                  <Accordion type="single" collapsible className="space-y-3">
                    {category.questions.map((faq, index) => (
                      <AccordionItem
                        key={index}
                        value={`${category.category}-${index}`}
                        className="bg-white border border-cream-300 rounded-lg px-6"
                      >
                        <AccordionTrigger className="text-left text-charcoal-600 hover:text-sage-600 hover:no-underline">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-charcoal-500 leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>

            {/* Still Have Questions */}
            <div className="mt-16 text-center bg-sage-50 rounded-lg p-8">
              <h3 className="text-xl mb-4">Still Have Questions?</h3>
              <p className="text-charcoal-500 mb-6">
                Can&apos;t find what you&apos;re looking for? Get in touch and
                I&apos;ll be happy to help.
              </p>
              <Button
                asChild
                className="bg-sage-400 hover:bg-sage-500 text-white"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
