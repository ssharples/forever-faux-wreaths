import Link from "next/link";
import {
  Package,
  Truck,
  MapPin,
  Clock,
  Shield,
  Leaf,
  Heart,
  CheckCircle2,
} from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const deliveryOptions = [
  {
    icon: Package,
    title: "Small Items",
    subtitle: "Wreaths under 30cm",
    price: "£4.99",
    timeframe: "3-5 working days",
    description:
      "Perfect for our mini wreaths and smaller decorative pieces. Carefully boxed to protect every petal.",
  },
  {
    icon: Truck,
    title: "Large Items",
    subtitle: "Wreaths 30cm and above",
    price: "£7.99",
    timeframe: "3-5 working days",
    description:
      "Our standard and large wreaths are shipped in specially designed boxes to maintain their shape during transit.",
  },
  {
    icon: MapPin,
    title: "Local Collection",
    subtitle: "Preston, Lancashire",
    price: "Free",
    timeframe: "Arrange at checkout",
    description:
      "Collect your wreath directly from us in Preston. A great option for local customers who want to save on delivery.",
  },
];

const packagingFeatures = [
  {
    icon: Shield,
    title: "Protective Packaging",
    description:
      "Every wreath is carefully wrapped and secured in custom-sized boxes to prevent any movement during transit.",
  },
  {
    icon: Leaf,
    title: "Eco-Conscious Materials",
    description:
      "We use recyclable cardboard boxes and biodegradable packing materials wherever possible.",
  },
  {
    icon: Heart,
    title: "Handwritten Note",
    description:
      "Each order includes a handwritten thank you note, adding a personal touch to your delivery.",
  },
  {
    icon: CheckCircle2,
    title: "Quality Checked",
    description:
      "Before dispatch, every wreath is inspected to ensure it meets our high standards of quality.",
  },
];

export default function PackagingPage() {
  return (
    <>
      <Header />

      <main className="flex-1 bg-cream-100">
        {/* Hero */}
        <section className="bg-gradient-to-b from-cream-100 to-cream-200 py-16">
          <div className="container-narrow text-center">
            <p className="font-handwritten text-2xl text-sage-600 mb-4">
              Delivered with care
            </p>
            <h1 className="mb-6">Packaging & Delivery</h1>
            <p className="text-lg text-charcoal-500 max-w-2xl mx-auto">
              We take great care in packaging your wreath to ensure it arrives
              in perfect condition, ready to display in your home.
            </p>
          </div>
        </section>

        {/* Delivery Options */}
        <section className="py-12">
          <div className="container-wide">
            <h2 className="text-2xl text-center mb-8">Delivery Options</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {deliveryOptions.map((option) => (
                <Card
                  key={option.title}
                  className="p-6 border-cream-300 bg-white text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-sage-100 flex items-center justify-center mx-auto mb-4">
                    <option.icon className="h-8 w-8 text-sage-600" />
                  </div>
                  <h3 className="text-xl font-medium text-charcoal-700 mb-1">
                    {option.title}
                  </h3>
                  <p className="text-sm text-charcoal-400 mb-4">
                    {option.subtitle}
                  </p>
                  <p className="font-display text-3xl text-sage-600 mb-2">
                    {option.price}
                  </p>
                  <p className="text-sm text-charcoal-500 mb-4">
                    {option.timeframe}
                  </p>
                  <p className="text-sm text-charcoal-500">
                    {option.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Packaging Info */}
        <section className="py-12 bg-sage-50">
          <div className="container-wide">
            <div className="text-center mb-10">
              <h2 className="text-2xl mb-4">Packaged with Love</h2>
              <p className="text-charcoal-500 max-w-2xl mx-auto">
                Every wreath is prepared and packaged by hand to ensure it
                arrives looking as beautiful as the day it was made.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {packagingFeatures.map((feature) => (
                <Card
                  key={feature.title}
                  className="p-6 border-sage-200 bg-white"
                >
                  <feature.icon className="h-8 w-8 text-sage-500 mb-4" />
                  <h3 className="font-medium text-charcoal-700 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-charcoal-500">
                    {feature.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-12">
          <div className="container-narrow">
            <h2 className="text-2xl text-center mb-10">What to Expect</h2>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-cream-300 hidden sm:block" />

              <div className="space-y-8">
                {[
                  {
                    step: "1",
                    title: "Order Placed",
                    description:
                      "You'll receive an email confirmation with your order details.",
                  },
                  {
                    step: "2",
                    title: "Crafting Your Wreath",
                    description:
                      "Your wreath is carefully prepared and quality checked (1-3 business days).",
                  },
                  {
                    step: "3",
                    title: "Dispatch Notification",
                    description:
                      "We'll email you when your wreath is on its way with tracking information.",
                  },
                  {
                    step: "4",
                    title: "Delivery",
                    description:
                      "Your wreath arrives at your door, ready to display (3-5 working days from dispatch).",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex gap-6 items-start">
                    <div className="w-12 h-12 rounded-full bg-sage-400 flex items-center justify-center shrink-0 relative z-10">
                      <span className="text-white font-medium">{item.step}</span>
                    </div>
                    <div className="pt-2">
                      <h3 className="font-medium text-charcoal-700 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-charcoal-500 text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Important Info */}
        <section className="py-12 bg-cream-200">
          <div className="container-narrow">
            <h2 className="text-2xl text-center mb-8">Important Information</h2>

            <div className="grid sm:grid-cols-2 gap-6">
              <Card className="p-6 border-cream-300 bg-white">
                <div className="flex items-start gap-4">
                  <Clock className="h-6 w-6 text-sage-500 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium text-charcoal-700 mb-2">
                      Processing Times
                    </h3>
                    <p className="text-sm text-charcoal-500">
                      Ready-made wreaths typically ship within 1-3 business
                      days. Bespoke orders may take 1-2 weeks depending on
                      complexity. During peak seasons (Christmas), please allow
                      additional time.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-cream-300 bg-white">
                <div className="flex items-start gap-4">
                  <Shield className="h-6 w-6 text-sage-500 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium text-charcoal-700 mb-2">
                      Damage in Transit
                    </h3>
                    <p className="text-sm text-charcoal-500">
                      While we package carefully, accidents can happen. If your
                      wreath arrives damaged, please contact us within 48 hours
                      with photos and we&apos;ll arrange a replacement or
                      refund.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-cream-300 bg-white">
                <div className="flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-sage-500 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium text-charcoal-700 mb-2">
                      UK Delivery Only
                    </h3>
                    <p className="text-sm text-charcoal-500">
                      We currently only ship within the United Kingdom. If
                      you&apos;re interested in international shipping, please
                      contact us and we&apos;ll do our best to help.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-cream-300 bg-white">
                <div className="flex items-start gap-4">
                  <Heart className="h-6 w-6 text-sage-500 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium text-charcoal-700 mb-2">
                      Gift Wrapping
                    </h3>
                    <p className="text-sm text-charcoal-500">
                      Sending a wreath as a gift? Let us know at checkout and
                      we&apos;ll add a special ribbon and gift tag. You can also
                      include a personal message at no extra charge.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container-narrow text-center">
            <h2 className="mb-4">Ready to Order?</h2>
            <p className="text-charcoal-500 mb-8 max-w-lg mx-auto">
              Browse our collection and find the perfect wreath for your home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-sage-400 hover:bg-sage-500 text-white"
              >
                <Link href="/shop">Shop Wreaths</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-sage-400 text-sage-600 hover:bg-white"
              >
                <Link href="/info/faqs">View FAQs</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
