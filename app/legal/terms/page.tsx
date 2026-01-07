import { Header, Footer } from "@/components/layout";

export default function TermsPage() {
  return (
    <>
      <Header />

      <main className="flex-1 bg-cream-100">
        {/* Header */}
        <section className="bg-gradient-to-b from-cream-100 to-cream-200 py-12">
          <div className="container-narrow">
            <h1 className="mb-4">Terms & Conditions</h1>
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
                These Terms and Conditions govern your use of the Forever Faux
                Wreaths website (foreverfauxwreaths.co.uk) and any purchases made
                through it. By using our website or placing an order, you agree
                to be bound by these terms.
              </p>
              <p>
                Forever Faux Wreaths is a sole trader business operated by Claire,
                based in Preston, Lancashire, United Kingdom.
              </p>

              <h2>2. Products</h2>
              <h3>Product Descriptions</h3>
              <p>
                We make every effort to ensure product descriptions and images
                are accurate. However, as each wreath is handmade, slight
                variations may occur. Colours may also appear differently on
                different screens.
              </p>

              <h3>Availability</h3>
              <p>
                All products are subject to availability. We reserve the right to
                discontinue products without notice. If a product becomes
                unavailable after you have placed an order, we will contact you to
                offer alternatives or a full refund.
              </p>

              <h2>3. Orders and Payment</h2>
              <h3>Placing an Order</h3>
              <p>
                When you place an order, you are making an offer to purchase. We
                will send an order confirmation email, but this does not
                constitute acceptance. Acceptance occurs when we dispatch your
                order.
              </p>

              <h3>Payment Methods</h3>
              <p>
                We accept payment via PayPal (including PayPal Pay Later) and
                card payments via SumUp. All payments must be received before
                dispatch.
              </p>

              <h3>Pricing</h3>
              <p>
                All prices are shown in GBP (£) and include VAT where applicable.
                Delivery charges are shown separately at checkout. We reserve the
                right to change prices without notice, but any changes will not
                affect orders already placed.
              </p>

              <h2>4. Delivery</h2>
              <h3>Delivery Areas</h3>
              <p>
                We currently deliver within the United Kingdom only. For
                international enquiries, please contact us.
              </p>

              <h3>Delivery Times</h3>
              <ul>
                <li>Processing time: 1-3 business days</li>
                <li>Standard delivery: 3-5 working days after dispatch</li>
                <li>Local collection (Preston): By arrangement</li>
              </ul>
              <p>
                During busy periods (e.g., Christmas), delivery times may be
                longer. We are not responsible for delays caused by third-party
                delivery services.
              </p>

              <h3>Delivery Charges</h3>
              <ul>
                <li>Small items (under 30cm): £4.99</li>
                <li>Large items (30cm and above): £7.99</li>
                <li>Local collection (Preston): Free</li>
              </ul>

              <h2>5. Bespoke Orders</h2>
              <h3>Bespoke Process</h3>
              <p>
                Bespoke orders are created specifically for you based on your
                requirements. After submitting an enquiry, we will provide a quote
                and timeline. Work begins only after you approve the quote and
                pay the required amount.
              </p>

              <h3>Bespoke Pricing</h3>
              <p>Starting prices for bespoke wreaths:</p>
              <ul>
                <li>20cm: From £45</li>
                <li>30cm: From £55</li>
                <li>40cm: From £70</li>
                <li>50cm: From £85</li>
                <li>Custom sizes: Quoted individually</li>
              </ul>
              <p>
                Additional features such as ribbons (+£5) and complex designs may
                affect the final price.
              </p>

              <h3>Bespoke Cancellations</h3>
              <p>
                Bespoke orders cannot be cancelled once production has begun.
                Bespoke items are non-refundable as they are made specifically for
                you.
              </p>

              <h2>6. Returns and Refunds</h2>
              <h3>Ready-Made Products</h3>
              <p>
                Under the Consumer Contracts Regulations, you have 14 days from
                delivery to change your mind and request a return for ready-made
                products. Items must be returned in their original condition.
              </p>
              <p>
                To initiate a return, please contact us at{" "}
                <a href="mailto:Info@foreverfauxwreaths.co.uk">
                  Info@foreverfauxwreaths.co.uk
                </a>{" "}
                within 14 days of receiving your order.
              </p>

              <h3>Damaged Items</h3>
              <p>
                If your item arrives damaged, please contact us within 48 hours
                with photographs. We will arrange a replacement or full refund at
                no extra cost.
              </p>

              <h3>Bespoke Products</h3>
              <p>
                Bespoke orders are non-refundable as they are made to your
                specific requirements. This does not affect your statutory rights
                if the item is faulty.
              </p>

              <h3>Refund Process</h3>
              <p>
                Refunds will be processed within 14 days of receiving the
                returned item using the original payment method.
              </p>

              <h2>7. Intellectual Property</h2>
              <p>
                All content on this website, including images, text, designs, and
                logos, is the property of Forever Faux Wreaths and is protected
                by copyright. You may not reproduce, distribute, or use our
                content without written permission.
              </p>

              <h2>8. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by law, Forever Faux Wreaths
                shall not be liable for any indirect, incidental, or
                consequential damages arising from your use of our website or
                products.
              </p>
              <p>
                Nothing in these terms excludes or limits our liability for death
                or personal injury caused by our negligence, fraud, or any other
                liability that cannot be excluded by law.
              </p>

              <h2>9. Force Majeure</h2>
              <p>
                We are not liable for any failure or delay in performing our
                obligations where such failure or delay results from events beyond
                our reasonable control, including but not limited to natural
                disasters, pandemic, strikes, or supply chain disruptions.
              </p>

              <h2>10. Governing Law</h2>
              <p>
                These Terms and Conditions are governed by and construed in
                accordance with the laws of England and Wales. Any disputes shall
                be subject to the exclusive jurisdiction of the courts of England
                and Wales.
              </p>

              <h2>11. Changes to Terms</h2>
              <p>
                We reserve the right to update these Terms and Conditions at any
                time. Changes will be posted on this page with an updated
                revision date. Continued use of the website after changes
                constitutes acceptance of the new terms.
              </p>

              <h2>12. Contact Us</h2>
              <p>
                If you have any questions about these Terms and Conditions,
                please contact us:
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
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
