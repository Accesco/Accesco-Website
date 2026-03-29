
export const metadata = {
  title: 'Terms & Conditions | Accesco Living',
  description: 'Read the Accesco Living terms and conditions — the legal contract between Accesco Living Private Limited and its users covering service, payments, cancellations and conduct.',
};
export default function TermsPage() {
  return (
    <div className="page-wrapper">
      <aside className="sidebar">
        <h4>Navigation</h4>
        <ul>
          <li><a href="#section-a">1. Nature of Service</a></li>
          <li><a href="#section-b">2. Service Modules</a></li>
          <li><a href="#section-c">3. Payments & Cancellations</a></li>
          <li><a href="#section-d">4. User Conduct</a></li>
        </ul>
      </aside>

      <main className="content">
        <header>
          <h1>Terms & Conditions</h1>
          <p className="effective-date">Last Updated: January 12, 2026</p>
          <p>This is the legal contract between <strong>Accesco Living</strong> and the user.</p>
        </header>

        {/* SECTION 1 */}
        <section id="section-a">
          <h2>1. Nature of Service (Aggregator Disclosure)</h2>

          <div className="disclosure-card">
            <strong>IMPORTANT: PLATFORM ROLE & AGENCY LIMITATION</strong>
            Accesco Living is a technology platform connecting users with third-party vendors
            (restaurants, stores) and independent delivery partners.
            Accesco Living is <u>not</u> the seller of food/groceries or the direct provider of transport,
            but a facilitator.
          </div>

          <div className="clause">
            <div className="clause-num">1.1</div>
            <div>
              We do not control the quality, safety, or legality of the items or services provided by third-party vendors.
            </div>
          </div>
        </section>

        {/* SECTION 2 */}
        <section id="section-b">
          <h2>2. Specific Service Modules</h2>

          <h3>2.1 Ride-Hailing</h3>
          <div className="clause">
            <div className="clause-num">2.1.1</div>
            <div>
              <strong>Conduct:</strong> Passengers must adhere to all safety protocols and local laws.
              Aggressive or unsafe behavior will result in a permanent ban.
            </div>
          </div>
          <div className="clause">
            <div className="clause-num">2.1.2</div>
            <div>
              <strong>No-Show Fees:</strong> A fee will be charged if the user is not present at the pickup location
              within the designated grace period.
            </div>
          </div>

          <h3>2.2 Food & Grocery Delivery</h3>
          <div className="clause">
            <div className="clause-num">2.2.1</div>
            <div>
              <strong>Pricing:</strong> Product prices are set by Merchants and may differ from the in-store MRP.
            </div>
          </div>
          <div className="clause">
            <div className="clause-num">2.2.2</div>
            <div>
              <strong>Liability:</strong> The Merchant is solely responsible for quality, packaging, and hygiene.
            </div>
          </div>

          <h3>2.3 Pick-up & Drop (Logistics)</h3>
          <div className="clause">
            <div className="clause-num">2.3.1</div>
            <div>
              <strong>Prohibited Items:</strong> Users are strictly forbidden from sending illegal substances,
              cash, jewelry, or hazardous materials.
            </div>
          </div>
          <div className="clause">
            <div className="clause-num">2.3.2</div>
            <div>
              <strong>Limits:</strong> Packages must comply with weight and dimension limits specified in the app interface.
            </div>
          </div>
        </section>

        {/* SECTION 3 */}
        <section id="section-c">
          <h2>3. Payments & Cancellations</h2>

          <div className="clause">
            <div className="clause-num">3.1</div>
            <div>
              <strong>Pricing Structure:</strong> Total charges include the base price, service fees,
              delivery charges, and applicable government taxes.
            </div>
          </div>

          <div className="clause">
            <div className="clause-num">3.2</div>
            <div>
              <strong>Cancellations:</strong> Food orders cannot be canceled once the restaurant begins preparation.
              Ride cancellations after dispatch may incur a flat fee.
            </div>
          </div>

          <div className="clause">
            <div className="clause-num">3.3</div>
            <div>
              <strong>Refunds:</strong> Refunds for failed transactions or quality disputes are subject to a formal
              investigation by our support team.
            </div>
          </div>
        </section>

        {/* SECTION 4 */}
        <section id="section-d">
          <h2>4. User Conduct & Accounts</h2>

          <div className="clause">
            <div className="clause-num">4.1</div>
            <div>
              <strong>Eligibility:</strong> Users must be 18 years of age or older to book rides or purchase restricted items.
            </div>
          </div>

          <div className="clause">
            <div className="clause-num">4.2</div>
            <div>
              <strong>Account Security:</strong> Users are solely responsible for all activities under their account.
              You must safeguard your OTPs and login credentials. Accesco Living will never ask for your password via phone.
            </div>
          </div>
        </section>

        <footer
          style={{
            marginTop: "80px",
            paddingTop: "20px",
            borderTop: "1px solid var(--border)",
            fontSize: "0.8rem",
            color: "var(--secondary)",
          }}
        >
          © 2026 Accesco Living. All rights reserved.
        </footer>
      </main>
    </div>
  );
}
