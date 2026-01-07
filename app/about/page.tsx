import Link from "next/link";
import Image from "next/image";
import { Heart, Sparkles, Award, Leaf, Users, MapPin } from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const values = [
  {
    icon: Heart,
    title: "Made with Love",
    description:
      "Every wreath is handcrafted with care and attention to detail. No two pieces are exactly alike.",
  },
  {
    icon: Award,
    title: "Quality First",
    description:
      "We use only premium faux florals that look and feel realistic, built to last for years.",
  },
  {
    icon: Leaf,
    title: "Everlasting Beauty",
    description:
      "Unlike fresh flowers, our wreaths never wilt. Enjoy beautiful blooms all year round.",
  },
  {
    icon: Users,
    title: "Personal Touch",
    description:
      "From bespoke orders to customer service, you'll always deal directly with me.",
  },
];

const timeline = [
  {
    year: "2021",
    title: "A Passion Project Begins",
    description:
      "What started as a hobby making wreaths for friends and family began to grow into something more.",
  },
  {
    year: "2022",
    title: "Forever Faux Wreaths is Born",
    description:
      "The business officially launched, offering handcrafted faux floral wreaths to customers across the UK.",
  },
  {
    year: "2023",
    title: "Growing the Collection",
    description:
      "Expanded our range to include seasonal collections, memorial tributes, and wedding flowers.",
  },
  {
    year: "2024",
    title: "Bespoke Services Launch",
    description:
      "Introduced our bespoke service, allowing customers to create their dream wreaths from scratch.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />

      <main className="flex-1 bg-cream-100">
        {/* Hero */}
        <section className="bg-gradient-to-b from-cream-100 to-cream-200 py-16">
          <div className="container-narrow text-center">
            <p className="font-handwritten text-2xl text-sage-600 mb-4">
              Our story
            </p>
            <h1 className="mb-6">About Forever Faux Wreaths</h1>
            <p className="text-lg text-charcoal-500 max-w-2xl mx-auto">
              Handcrafted faux floral wreaths made with love in Preston,
              Lancashire. Creating everlasting beauty for your home.
            </p>
          </div>
        </section>

        {/* Meet Claire */}
        <section className="py-12">
          <div className="container-wide">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <p className="font-handwritten text-xl text-sage-600 mb-2">
                  Hello, I&apos;m Claire
                </p>
                <h2 className="text-3xl mb-6">The Creator Behind the Wreaths</h2>
                <div className="space-y-4 text-charcoal-500">
                  <p>
                    Welcome to Forever Faux Wreaths! I&apos;m Claire, a
                    self-taught wreath maker based in Preston, Lancashire. What
                    started as a creative outlet has blossomed into a passion
                    for creating beautiful, everlasting floral arrangements.
                  </p>
                  <p>
                    I believe that everyone deserves to have beautiful flowers
                    in their home, without the worry of them wilting away. That&apos;s
                    why I carefully select premium quality faux florals that
                    look so realistic, your neighbours will think they&apos;re real!
                  </p>
                  <p>
                    Every wreath I create is made by hand with love and
                    attention to detail. Whether you choose one of my ready-made
                    designs or work with me on a bespoke creation, you can be
                    sure you&apos;re getting something truly special.
                  </p>
                  <p>
                    Thank you for supporting my small business. It means the
                    world to me!
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-6 text-charcoal-500">
                  <MapPin className="h-5 w-5 text-sage-500" />
                  <span>Based in Preston, Lancashire, UK</span>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-cream-200">
                  <Image
                    src="/images/about-workshop.png"
                    alt="Creating handcrafted wreaths in our workshop"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-12 bg-sage-50">
          <div className="container-wide">
            <div className="text-center mb-10">
              <h2 className="text-2xl mb-4">What We Stand For</h2>
              <p className="text-charcoal-500 max-w-2xl mx-auto">
                Every wreath is created with these core values in mind.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => (
                <Card
                  key={value.title}
                  className="p-6 border-sage-200 bg-white text-center"
                >
                  <div className="w-14 h-14 rounded-full bg-sage-100 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-7 w-7 text-sage-600" />
                  </div>
                  <h3 className="font-medium text-charcoal-700 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-charcoal-500">
                    {value.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-12">
          <div className="container-narrow">
            <h2 className="text-2xl text-center mb-10">Our Journey</h2>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-cream-300 -translate-x-1/2" />

              <div className="space-y-8">
                {timeline.map((item, index) => (
                  <div
                    key={item.year}
                    className={`relative flex gap-6 ${
                      index % 2 === 0
                        ? "sm:flex-row"
                        : "sm:flex-row-reverse sm:text-right"
                    }`}
                  >
                    {/* Timeline Dot */}
                    <div className="absolute left-4 sm:left-1/2 w-4 h-4 rounded-full bg-sage-400 -translate-x-1/2 mt-1 z-10" />

                    {/* Content */}
                    <div
                      className={`flex-1 ml-10 sm:ml-0 ${
                        index % 2 === 0 ? "sm:pr-12" : "sm:pl-12"
                      }`}
                    >
                      <Card className="p-6 border-cream-300 bg-white">
                        <span className="font-handwritten text-xl text-sage-600">
                          {item.year}
                        </span>
                        <h3 className="font-medium text-charcoal-700 mt-1 mb-2">
                          {item.title}
                        </h3>
                        <p className="text-sm text-charcoal-500">
                          {item.description}
                        </p>
                      </Card>
                    </div>

                    {/* Spacer for alternating layout */}
                    <div className="hidden sm:block flex-1" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-cream-200">
          <div className="container-narrow text-center">
            <h2 className="mb-4">Let&apos;s Create Something Beautiful</h2>
            <p className="text-charcoal-500 mb-8 max-w-lg mx-auto">
              Whether you&apos;re looking for a ready-made wreath or want to
              create something unique, I&apos;m here to help.
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
                <Link href="/bespoke">Create Bespoke</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
