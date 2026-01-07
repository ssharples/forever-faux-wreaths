"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, MapPin, Clock, Facebook, Instagram, Send } from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

// TikTok icon
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
    </svg>
  );
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    consent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.consent) {
      toast.error("Please agree to the privacy policy to continue");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("Message sent successfully!", {
      description: "We'll get back to you as soon as possible.",
    });

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
      consent: false,
    });
    setIsSubmitting(false);
  };

  return (
    <>
      <Header />

      <main className="flex-1 bg-cream-100">
        {/* Hero */}
        <section className="bg-gradient-to-b from-cream-100 to-cream-200 py-16">
          <div className="container-narrow text-center">
            <p className="font-handwritten text-2xl text-sage-600 mb-4">
              Get in touch
            </p>
            <h1 className="mb-6">Contact Us</h1>
            <p className="text-lg text-charcoal-500 max-w-2xl mx-auto">
              Have a question or just want to say hello? I&apos;d love to hear
              from you! Send me a message and I&apos;ll get back to you as soon
              as possible.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-12">
          <div className="container-wide">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card className="p-6 sm:p-8 border-cream-300">
                  <h2 className="text-2xl mb-6">Send a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                        placeholder="What is this regarding?"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        required
                        rows={6}
                        placeholder="How can I help you?"
                        className="mt-1"
                      />
                    </div>

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="consent"
                        checked={formData.consent}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            consent: checked as boolean,
                          })
                        }
                      />
                      <Label htmlFor="consent" className="text-sm cursor-pointer">
                        I agree to the{" "}
                        <Link
                          href="/legal/privacy"
                          className="text-sage-600 hover:underline"
                        >
                          Privacy Policy
                        </Link>{" "}
                        and consent to Forever Faux Wreaths storing my
                        information to respond to this message.
                      </Label>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="bg-sage-400 hover:bg-sage-500 text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </Card>
              </div>

              {/* Contact Info */}
              <div className="lg:col-span-1">
                <div className="space-y-6">
                  {/* Quick Contact */}
                  <Card className="p-6 border-cream-300">
                    <h3 className="text-lg font-medium text-charcoal-600 mb-4">
                      Quick Contact
                    </h3>
                    <div className="space-y-4">
                      <a
                        href="mailto:Info@foreverfauxwreaths.co.uk"
                        className="flex items-start gap-3 text-charcoal-500 hover:text-sage-600 transition-colors"
                      >
                        <Mail className="h-5 w-5 mt-0.5 shrink-0" />
                        <span className="text-sm break-all">
                          Info@foreverfauxwreaths.co.uk
                        </span>
                      </a>
                      <div className="flex items-start gap-3 text-charcoal-500">
                        <MapPin className="h-5 w-5 mt-0.5 shrink-0" />
                        <span className="text-sm">Preston, Lancashire, UK</span>
                      </div>
                      <div className="flex items-start gap-3 text-charcoal-500">
                        <Clock className="h-5 w-5 mt-0.5 shrink-0" />
                        <div className="text-sm">
                          <p>Response Time:</p>
                          <p className="text-charcoal-400">
                            Usually within 24-48 hours
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Social Media */}
                  <Card className="p-6 border-cream-300">
                    <h3 className="text-lg font-medium text-charcoal-600 mb-4">
                      Follow Us
                    </h3>
                    <p className="text-sm text-charcoal-500 mb-4">
                      Stay connected and see our latest creations on social media
                    </p>
                    <div className="flex gap-2">
                      <a
                        href="https://facebook.com/foreverfauxwreaths"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-11 w-11 rounded-full bg-sage-100 flex items-center justify-center text-sage-600 hover:bg-sage-200 transition-colors"
                      >
                        <Facebook className="h-5 w-5" />
                      </a>
                      <a
                        href="https://instagram.com/foreverfauxwreaths"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-11 w-11 rounded-full bg-sage-100 flex items-center justify-center text-sage-600 hover:bg-sage-200 transition-colors"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                      <a
                        href="https://tiktok.com/@foreverfauxwreaths"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-11 w-11 rounded-full bg-sage-100 flex items-center justify-center text-sage-600 hover:bg-sage-200 transition-colors"
                      >
                        <TikTokIcon className="h-5 w-5" />
                      </a>
                    </div>
                  </Card>

                  {/* FAQ Link */}
                  <Card className="p-6 border-sage-300 bg-sage-50">
                    <h3 className="text-lg font-medium text-charcoal-600 mb-2">
                      Have Questions?
                    </h3>
                    <p className="text-sm text-charcoal-500 mb-4">
                      Check out our frequently asked questions for quick answers.
                    </p>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-sage-400 text-sage-600 hover:bg-white"
                    >
                      <Link href="/info/faqs">View FAQs</Link>
                    </Button>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
