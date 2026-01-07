import Link from "next/link";
import { Header, Footer } from "@/components/layout";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />

      <main className="flex-1 bg-cream-100">
        {/* Header */}
        <section className="bg-gradient-to-b from-cream-100 to-cream-200 py-12">
          <div className="container-narrow">
            <h1 className="mb-4">Privacy Policy</h1>
            <p className="text-charcoal-500">
              Last updated: January 2025
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="container-narrow">
            <div className="prose prose-charcoal max-w-none">
              <h2>1. Introduction</h2>
              <p>
                Forever Faux Wreaths (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to
                protecting your privacy. This Privacy Policy explains how we
                collect, use, disclose, and safeguard your information when you
                visit our website foreverfauxwreaths.co.uk and make purchases
                from us.
              </p>
              <p>
                We are based in Preston, Lancashire, United Kingdom and comply
                with the UK General Data Protection Regulation (UK GDPR) and the
                Data Protection Act 2018.
              </p>

              <h2>2. Information We Collect</h2>
              <h3>Personal Information</h3>
              <p>We may collect the following personal information:</p>
              <ul>
                <li>Name and contact details (email address, phone number)</li>
                <li>Delivery address</li>
                <li>Payment information (processed securely through PayPal or SumUp)</li>
                <li>Order history and preferences</li>
                <li>Communications with us (enquiries, feedback, reviews)</li>
              </ul>

              <h3>Automatically Collected Information</h3>
              <p>
                When you visit our website, we may automatically collect certain
                information including:
              </p>
              <ul>
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Device information</li>
                <li>Pages visited and time spent on pages</li>
                <li>Referring website</li>
              </ul>

              <h2>3. How We Use Your Information</h2>
              <p>We use your personal information to:</p>
              <ul>
                <li>Process and fulfil your orders</li>
                <li>Communicate with you about your orders and enquiries</li>
                <li>Send you updates about new products (with your consent)</li>
                <li>Improve our website and services</li>
                <li>Comply with legal obligations</li>
                <li>Prevent fraud and protect our business</li>
              </ul>

              <h2>4. Legal Basis for Processing</h2>
              <p>We process your personal data on the following legal bases:</p>
              <ul>
                <li>
                  <strong>Contract:</strong> Processing necessary to fulfil orders
                  and provide our services
                </li>
                <li>
                  <strong>Consent:</strong> Where you have given explicit consent
                  (e.g., marketing communications)
                </li>
                <li>
                  <strong>Legitimate interests:</strong> For fraud prevention and
                  improving our services
                </li>
                <li>
                  <strong>Legal obligation:</strong> Where we are required by law
                  to process data
                </li>
              </ul>

              <h2>5. Data Sharing</h2>
              <p>We may share your information with:</p>
              <ul>
                <li>
                  <strong>Payment processors:</strong> PayPal and SumUp for secure
                  payment processing
                </li>
                <li>
                  <strong>Delivery services:</strong> To fulfil your orders
                </li>
                <li>
                  <strong>Service providers:</strong> Who assist with website
                  hosting and analytics
                </li>
              </ul>
              <p>
                We do not sell your personal information to third parties.
              </p>

              <h2>6. Data Retention</h2>
              <p>
                We retain your personal information for as long as necessary to
                fulfil the purposes for which it was collected, including to
                satisfy legal, accounting, or reporting requirements.
              </p>
              <ul>
                <li>Order information: 7 years (for tax purposes)</li>
                <li>Marketing preferences: Until you withdraw consent</li>
                <li>Website analytics: 26 months</li>
              </ul>

              <h2>7. Your Rights</h2>
              <p>Under UK GDPR, you have the right to:</p>
              <ul>
                <li>Access your personal data</li>
                <li>Rectify inaccurate data</li>
                <li>Request erasure of your data</li>
                <li>Restrict processing of your data</li>
                <li>Data portability</li>
                <li>Object to processing</li>
                <li>Withdraw consent at any time</li>
              </ul>
              <p>
                To exercise these rights, please contact us at{" "}
                <a href="mailto:Info@foreverfauxwreaths.co.uk">
                  Info@foreverfauxwreaths.co.uk
                </a>
              </p>

              <h2>8. Cookies</h2>
              <p>
                We use cookies to improve your experience on our website. For
                more information, please see our{" "}
                <Link href="/legal/cookies" className="text-sage-600 hover:underline">
                  Cookie Policy
                </Link>
                .
              </p>

              <h2>9. Security</h2>
              <p>
                We implement appropriate technical and organisational measures to
                protect your personal information. Payment processing is handled
                securely by PayPal and SumUp, and we never store your full
                payment card details.
              </p>

              <h2>10. Children&apos;s Privacy</h2>
              <p>
                Our website is not intended for children under 16. We do not
                knowingly collect personal information from children under 16.
              </p>

              <h2>11. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Any changes
                will be posted on this page with an updated revision date.
              </p>

              <h2>12. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or wish to
                exercise your rights, please contact us:
              </p>
              <ul>
                <li>
                  Email:{" "}
                  <a href="mailto:Info@foreverfauxwreaths.co.uk">
                    Info@foreverfauxwreaths.co.uk
                  </a>
                </li>
                <li>Location: Preston, Lancashire, UK</li>
              </ul>
              <p>
                You also have the right to lodge a complaint with the Information
                Commissioner&apos;s Office (ICO) if you believe your data
                protection rights have been violated.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
