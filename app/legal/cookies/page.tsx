import Link from "next/link";
import { Header, Footer } from "@/components/layout";

export default function CookiePolicyPage() {
  return (
    <>
      <Header />

      <main className="flex-1 bg-cream-100">
        {/* Header */}
        <section className="bg-gradient-to-b from-cream-100 to-cream-200 py-12">
          <div className="container-narrow">
            <h1 className="mb-4">Cookie Policy</h1>
            <p className="text-charcoal-500">
              Last updated: January 2025
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="container-narrow">
            <div className="prose prose-charcoal max-w-none">
              <h2>1. What Are Cookies?</h2>
              <p>
                Cookies are small text files that are placed on your computer or
                mobile device when you visit a website. They are widely used to
                make websites work more efficiently and provide information to
                website owners.
              </p>

              <h2>2. How We Use Cookies</h2>
              <p>
                Forever Faux Wreaths uses cookies to improve your experience on
                our website. We use cookies to:
              </p>
              <ul>
                <li>Remember items in your shopping cart</li>
                <li>Remember your preferences and settings</li>
                <li>Understand how you use our website</li>
                <li>Improve our website and services</li>
              </ul>

              <h2>3. Types of Cookies We Use</h2>

              <h3>Essential Cookies</h3>
              <p>
                These cookies are necessary for the website to function properly.
                They enable basic features like page navigation and access to
                secure areas. The website cannot function properly without these
                cookies.
              </p>
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left pb-2">Cookie Name</th>
                    <th className="text-left pb-2">Purpose</th>
                    <th className="text-left pb-2">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 border-t border-cream-300">session_id</td>
                    <td className="py-2 border-t border-cream-300">Maintains your session</td>
                    <td className="py-2 border-t border-cream-300">Session</td>
                  </tr>
                  <tr>
                    <td className="py-2 border-t border-cream-300">cart</td>
                    <td className="py-2 border-t border-cream-300">Stores shopping cart contents</td>
                    <td className="py-2 border-t border-cream-300">7 days</td>
                  </tr>
                  <tr>
                    <td className="py-2 border-t border-cream-300">cookie_consent</td>
                    <td className="py-2 border-t border-cream-300">Remembers your cookie preferences</td>
                    <td className="py-2 border-t border-cream-300">1 year</td>
                  </tr>
                </tbody>
              </table>

              <h3>Functional Cookies</h3>
              <p>
                These cookies enable enhanced functionality and personalisation,
                such as remembering your preferences. If you do not allow these
                cookies, some features may not function properly.
              </p>
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left pb-2">Cookie Name</th>
                    <th className="text-left pb-2">Purpose</th>
                    <th className="text-left pb-2">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 border-t border-cream-300">preferences</td>
                    <td className="py-2 border-t border-cream-300">Stores display preferences</td>
                    <td className="py-2 border-t border-cream-300">1 year</td>
                  </tr>
                </tbody>
              </table>

              <h3>Analytics Cookies</h3>
              <p>
                These cookies help us understand how visitors interact with our
                website by collecting and reporting information anonymously.
              </p>
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left pb-2">Cookie Name</th>
                    <th className="text-left pb-2">Purpose</th>
                    <th className="text-left pb-2">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 border-t border-cream-300">_ga</td>
                    <td className="py-2 border-t border-cream-300">Google Analytics - distinguishes users</td>
                    <td className="py-2 border-t border-cream-300">2 years</td>
                  </tr>
                  <tr>
                    <td className="py-2 border-t border-cream-300">_ga_*</td>
                    <td className="py-2 border-t border-cream-300">Google Analytics - maintains session state</td>
                    <td className="py-2 border-t border-cream-300">2 years</td>
                  </tr>
                </tbody>
              </table>

              <h3>Marketing Cookies</h3>
              <p>
                These cookies may be set through our site by our advertising
                partners. They may be used to build a profile of your interests
                and show you relevant adverts on other sites.
              </p>
              <p>
                We currently do not use marketing cookies, but this may change in
                the future. If we do, we will update this policy and request your
                consent.
              </p>

              <h2>4. Third-Party Cookies</h2>
              <p>
                Some cookies may be set by third-party services that appear on
                our pages. We do not control these cookies. These may include:
              </p>
              <ul>
                <li>
                  <strong>PayPal:</strong> For secure payment processing
                </li>
                <li>
                  <strong>Google Analytics:</strong> For website analytics
                </li>
              </ul>

              <h2>5. Managing Cookies</h2>
              <p>
                You can control and manage cookies in various ways. Please note
                that removing or blocking cookies may affect your user experience
                and parts of the website may no longer be fully accessible.
              </p>

              <h3>Browser Settings</h3>
              <p>
                Most browsers allow you to manage your cookie settings. You can
                usually find these settings in the &quot;Options&quot; or
                &quot;Preferences&quot; menu. Here are links to instructions for
                common browsers:
              </p>
              <ul>
                <li>
                  <a
                    href="https://support.google.com/chrome/answer/95647"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sage-600 hover:underline"
                  >
                    Google Chrome
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sage-600 hover:underline"
                  >
                    Mozilla Firefox
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sage-600 hover:underline"
                  >
                    Safari
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.microsoft.com/en-us/windows/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sage-600 hover:underline"
                  >
                    Microsoft Edge
                  </a>
                </li>
              </ul>

              <h3>Opt-Out Links</h3>
              <p>
                You can opt out of Google Analytics by installing the{" "}
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sage-600 hover:underline"
                >
                  Google Analytics Opt-out Browser Add-on
                </a>
                .
              </p>

              <h2>6. Changes to This Policy</h2>
              <p>
                We may update this Cookie Policy from time to time to reflect
                changes in our practices or for other operational, legal, or
                regulatory reasons. Please check this page periodically for
                updates.
              </p>

              <h2>7. Contact Us</h2>
              <p>
                If you have any questions about our use of cookies, please
                contact us:
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
                For more information about how we handle your personal data,
                please see our{" "}
                <Link href="/legal/privacy" className="text-sage-600 hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
