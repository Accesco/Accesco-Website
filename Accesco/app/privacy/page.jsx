'use client';

import AccescoHeader from '../../components/AccescoHeader';
import '../terms/style.css';

export default function PrivacyPage() {
  return (
    <>
      <AccescoHeader />
      <div className="page-wrapper">
        <aside className="sidebar">
          <h4>Contents</h4>
          <ul>
            <li><a href="#overview">Overview</a></li>
            <li><a href="#section1">1. Company Info</a></li>
            <li><a href="#section2">2. Info We Collect</a></li>
            <li><a href="#section3">3. How We Use It</a></li>
            <li><a href="#section4">4. Data Sharing</a></li>
            <li><a href="#section5">5. Security & Retention</a></li>
            <li><a href="#section6">6. Your Rights</a></li>
            <li><a href="#section7">7. Cookies</a></li>
            <li><a href="#section8">8. Children's Privacy</a></li>
            <li><a href="#section9">9. Data Transfers</a></li>
            <li><a href="#section10">10. Policy Changes</a></li>
            <li><a href="#section11">11. Contact Info</a></li>
          </ul>
        </aside>

        <main className="content">
          <header>
            <div className="effective-date">ACCESCO LIVING PRIVATE LIMITED</div>
            <h1>Legal Policies</h1>
            <p className="effective-date">Privacy Policy · Refund Policy · Cancellation Policy</p>
            
            <div className="disclosure-card">
              <strong>ISSUED BY</strong>
              Accesco Living Private Limited<br />
              CIN: U47912WB2025PTC285309<br />
              Bengaluru, Karnataka, India<br /><br />
              <strong>EFFECTIVE DATE</strong><br />
              02 June 2026 (Subject to revision with 30 days notice)<br /><br />
              <strong>JURISDICTION</strong><br />
              Republic of India<br />
              Governing law: IT Act 2000, Consumer Protection Act 2019, Indian Contract Act 1872
            </div>
            
            <p>
              These policies govern all users of the Accesco Living platform, including the mobile application,
              website, and any associated services. By accessing or using Accesco Living's services, you agree to
              be bound by these policies in their entirety. Please read them carefully.
            </p>
          </header>

          <section className="policy-section" id="overview">
            <h2>PART A — PRIVACY POLICY</h2>
            <p>
              This Privacy Policy describes how Accesco Living Private Limited ('Accesco Living', 'we', 'our', or 'us')
              collects, uses, stores, and protects the personal information you provide when you use our platform, including
              our mobile application, website (accescoliving.com), and all associated services including Grokly, Swadisht,
              DineX, InstaStyle, LocalMeds, FarmChain, and Xpense Meter.
            </p>
            <p>
              This policy is published in accordance with Rule 3(1) of the Information Technology (Intermediaries
              Guidelines) Rules, 2011 and the Information Technology (Reasonable Security Practices and Procedures
              and Sensitive Personal Data or Information) Rules, 2011.
            </p>
          </section>

          <section className="policy-section" id="section1">
            <h2>1. Company Information & Scope</h2>
            <div className="clause">
              <span className="clause-num">1.1</span>
              <div>
                <strong>Who We Are</strong><br />
                Accesco Living Private Limited is a company incorporated under the Companies Act, 2013, with its registered
                office in West Bengal and its primary operations based in Bengaluru, Karnataka, India. We operate an
                intelligent circular commerce ecosystem offering grocery delivery (Grokly), food and cloud kitchen services
                (Swadisht), dining experiences (DineX), fashion (InstaStyle), and pharmacy services (LocalMeds).
              </div>
            </div>
            <div className="clause">
              <span className="clause-num">1.2</span>
              <div>
                <strong>Scope of This Policy</strong><br />
                This policy applies to all users of the Accesco Living platform — including registered customers, guest users,
                delivery partners, dark store staff, and any individual whose personal data is processed by us. It covers all
                devices, platforms, and channels through which you interact with Accesco Living.
              </div>
            </div>
            <div className="clause">
              <span className="clause-num">1.3</span>
              <div>
                <strong>Consent</strong><br />
                By creating an account, placing an order, or otherwise using our services, you expressly consent to the
                collection, use, storage, and disclosure of your personal information as described in this policy. If you do not
                agree, please discontinue use of our services.
              </div>
            </div>
          </section>

          <section className="policy-section" id="section2">
            <h2>2. Information We Collect</h2>
            <div className="clause">
              <span className="clause-num">2.1</span>
              <div>
                <strong>Information You Provide Directly</strong>
                <ul>
                  <li>Account registration: Full name, mobile number, email address, date of birth, and gender (optional).</li>
                  <li>Delivery addresses: Complete delivery address including flat/door number, building name, street, locality, city, state, and PIN code.</li>
                  <li>Payment information: UPI IDs, saved card details (stored in encrypted, tokenised form via PCI-DSS-compliant payment gateways — we do not store raw card numbers), bank account details for refunds.</li>
                  <li>Identity documents: Government-issued ID (for age-restricted products such as alcohol or certain medications through LocalMeds) — stored only for verification and deleted within 48 hours of verification.</li>
                  <li>Health and dietary information: Dietary preferences, allergen flags, household health profiles entered in Grokly's Precision Health Mode — treated as Sensitive Personal Data.</li>
                  <li>Communication: Messages, queries, complaints, and feedback submitted to our customer support team.</li>
                </ul>
              </div>
            </div>
            <div className="clause">
              <span className="clause-num">2.2</span>
              <div>
                <strong>Information Collected Automatically</strong>
                <ul>
                  <li>Device information: Device type, operating system version, unique device identifiers, and mobile network information.</li>
                  <li>Location data: Precise GPS location (with your permission) for delivery address auto-detection, rider tracking, and service availability checks. Approximate location derived from IP address when GPS is not available.</li>
                  <li>Usage data: Pages visited, features used, search queries, products viewed, cart history, order history, session duration, and click-through patterns.</li>
                  <li>App performance data: Crash reports, error logs, and diagnostic data to improve platform stability.</li>
                  <li>Network information: IP address, browser type, referring URL, and time zone.</li>
                </ul>
              </div>
            </div>
            <div className="clause">
              <span className="clause-num">2.3</span>
              <div>
                <strong>Information from Third Parties</strong>
                <ul>
                  <li>Payment gateways: Transaction status and payment confirmation from Razorpay, PhonePe, and other integrated payment partners.</li>
                  <li>Social login providers: If you sign in via Google or Facebook, we receive your name, email, and profile picture as permitted by your privacy settings on those platforms.</li>
                  <li>FarmChain partners: Farmer and supplier details for supply chain traceability.</li>
                  <li>Analytics providers: Aggregated, anonymised behavioural data from Firebase Analytics and similar tools.</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="policy-section" id="section3">
            <h2>3. How We Use Your Information</h2>
            <div className="clause">
              <span className="clause-num">3.1</span>
              <div>
                <strong>To Provide and Improve Our Services</strong>
                <ul>
                  <li>Process and fulfil your orders across all verticals (Grokly, Swadisht, InstaStyle, LocalMeds, DineX).</li>
                  <li>Calculate delivery routes and assign the nearest available rider.</li>
                  <li>Power the Xpense Meter AI budget intelligence feature using your spending patterns.</li>
                  <li>Enable SwipeStyle and virtual try-on features in InstaStyle using your size preferences and interaction history.</li>
                  <li>Personalise your home screen, recommendations, and offers based on past behaviour.</li>
                  <li>Detect and prevent fraud, unauthorised access, and abuse of our platform.</li>
                </ul>
              </div>
            </div>
            <div className="clause">
              <span className="clause-num">3.2</span>
              <div>
                <strong>To Communicate with You</strong>
                <ul>
                  <li>Send order confirmations, dispatch notifications, and delivery updates via SMS, push notification, and email.</li>
                  <li>Respond to your support queries and complaints.</li>
                  <li>Send promotional offers, discount codes, and marketing communications — only with your consent and with an easy opt-out mechanism.</li>
                  <li>Send service-related announcements that are necessary for your use of the platform (these cannot be opted out of while you remain a registered user).</li>
                </ul>
              </div>
            </div>
            <div className="clause">
              <span className="clause-num">3.3</span>
              <div>
                <strong>Legal and Compliance Purposes</strong>
                <ul>
                  <li>Comply with applicable Indian laws including the IT Act 2000, GST law, FSSAI regulations, and Consumer Protection Act 2019.</li>
                  <li>Respond to lawful requests from law enforcement and government authorities.</li>
                  <li>Enforce our Terms of Service and protect the rights, property, and safety of Accesco Living, our users, and the public.</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="policy-section" id="section4">
            <h2>4. Data Sharing & Third Parties</h2>
            <div className="clause">
              <span className="clause-num">4.1</span>
              <div>
                <strong>Who We Share Your Data With</strong>
                <div className="table-responsive">
                  <table>
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>What Is Shared</th>
                        <th>Purpose</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Delivery riders</strong></td>
                        <td>Name, order summary, delivery address, contact number</td>
                        <td>To fulfil delivery</td>
                      </tr>
                      <tr>
                        <td><strong>Payment gateways</strong></td>
                        <td>Order amount, billing address, payment instrument</td>
                        <td>To process payment</td>
                      </tr>
                      <tr>
                        <td><strong>Dark store partners</strong></td>
                        <td>Order item list, pick instructions</td>
                        <td>For order fulfilment</td>
                      </tr>
                      <tr>
                        <td><strong>Cloud service providers</strong></td>
                        <td>Encrypted personal data</td>
                        <td>Data hosting (AWS/GCP)</td>
                      </tr>
                      <tr>
                        <td><strong>Analytics providers</strong></td>
                        <td>Anonymised usage data</td>
                        <td>Platform improvement</td>
                      </tr>
                      <tr>
                        <td><strong>SMS/email providers</strong></td>
                        <td>Phone number, email</td>
                        <td>Delivery notifications</td>
                      </tr>
                      <tr>
                        <td><strong>Legal authorities</strong></td>
                        <td>As required by law</td>
                        <td>Legal compliance</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="clause">
              <span className="clause-num">4.2</span>
              <div>
                <strong>What We Never Do</strong><br />
                Accesco Living does not sell, rent, or trade your personal data to any third party for their independent
                marketing purposes. We do not share your Sensitive Personal Data (health profiles, financial data) with
                any third party except as strictly necessary to fulfil the service you have requested or as required by law.
              </div>
            </div>
            <div className="clause">
              <span className="clause-num">4.3</span>
              <div>
                <strong>Business Transfers</strong><br />
                In the event of a merger, acquisition, restructuring, or sale of assets, your personal data may be transferred to
                the acquiring entity. You will be notified of any such transfer via the contact details on your account, and the
                acquiring entity will be required to honour this Privacy Policy.
              </div>
            </div>
          </section>

          <section className="policy-section" id="section5">
            <h2>5. Data Storage, Security & Retention</h2>
            <div className="clause">
              <span className="clause-num">5.1</span>
              <div>
                <strong>Where Your Data Is Stored</strong><br />
                Your personal data is stored on servers located within India, operated by AWS (ap-south-1, Mumbai) and
                Google Cloud Platform. We do not transfer your personal data outside India except as specified in Section 9.
              </div>
            </div>
            <div className="clause">
              <span className="clause-num">5.2</span>
              <div>
                <strong>Security Measures</strong>
                <ul>
                  <li>AES-256 encryption at rest for all personal data and sensitive records.</li>
                  <li>TLS 1.3 encryption in transit for all data exchanged between your device and our servers.</li>
                  <li>Tokenisation of payment card data — we never store raw card numbers.</li>
                  <li>Role-based access controls — only authorised personnel access personal data on a need-to-know basis.</li>
                  <li>Regular security audits, penetration testing, and vulnerability assessments.</li>
                  <li>Multi-factor authentication required for all internal admin access.</li>
                </ul>
              </div>
            </div>
            <div className="clause">
              <span className="clause-num">5.3</span>
              <div>
                <strong>Data Retention</strong>
                <div className="table-responsive">
                  <table>
                    <thead>
                      <tr>
                        <th>Data Category</th>
                        <th>Retention Period</th>
                        <th>Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Account information</strong></td>
                        <td>Duration of account + 3 years post-closure</td>
                        <td>Legal compliance, dispute resolution</td>
                      </tr>
                      <tr>
                        <td><strong>Order history</strong></td>
                        <td>7 years</td>
                        <td>GST and tax law requirements</td>
                      </tr>
                      <tr>
                        <td><strong>Payment records</strong></td>
                        <td>7 years</td>
                        <td>RBI and GST regulations</td>
                      </tr>
                      <tr>
                        <td><strong>Support communications</strong></td>
                        <td>3 years from last interaction</td>
                        <td>Dispute resolution</td>
                      </tr>
                      <tr>
                        <td><strong>Location data (precise GPS)</strong></td>
                        <td>90 days</td>
                        <td>Service improvement, fraud detection</td>
                      </tr>
                      <tr>
                        <td><strong>Health/dietary profiles</strong></td>
                        <td>Until you delete them or close account</td>
                        <td>User-controlled sensitive data</td>
                      </tr>
                      <tr>
                        <td><strong>Marketing consent records</strong></td>
                        <td>3 years from consent withdrawal</td>
                        <td>Legal proof of consent</td>
                      </tr>
                      <tr>
                        <td><strong>ID verification documents</strong></td>
                        <td>48 hours post-verification</td>
                        <td>Minimal retention principle</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          <section className="policy-section" id="section6">
            <h2>6. Your Rights & Choices</h2>
            <div className="clause">
              <span className="clause-num">6.1</span>
              <div>
                <strong>Your Rights Under Indian Law</strong>
                <ul>
                  <li>Right to access: Request a copy of all personal data we hold about you.</li>
                  <li>Right to correction: Request correction of inaccurate or incomplete data.</li>
                  <li>Right to deletion: Request deletion of your personal data, subject to legal retention requirements. Deleting your account will erase profile and preference data; order and payment history is retained per Section 5.3.</li>
                  <li>Right to withdraw consent: Withdraw consent for marketing communications at any time — use the 'Unsubscribe' link in any email or the notification settings in the app.</li>
                  <li>Right to data portability: Request a machine-readable export of your personal data.</li>
                  <li>Right to object: Object to processing of your data for direct marketing or profiling.</li>
                </ul>
              </div>
            </div>
            <div className="clause">
              <span className="clause-num">6.2</span>
              <div>
                <strong>How to Exercise Your Rights</strong><br />
                To exercise any of the above rights, contact our Grievance Officer at grievance@accescoliving.com or through
                the 'Privacy Settings' section in the Accesco Living app. We will respond to all verified requests within 30
                days.
              </div>
            </div>
            <div className="clause">
              <span className="clause-num">6.3</span>
              <div>
                <strong>Location Permissions</strong><br />
                Precise location access is optional but recommended for accurate delivery. You may grant approximate
                location access or enter your address manually. You can revoke location permissions at any time via your
                device settings — this will not prevent you from using the platform but may affect delivery accuracy.
              </div>
            </div>
          </section>

          <section className="policy-section" id="section7">
            <h2>7. Cookies & Tracking Technologies</h2>
            <div className="clause">
              <span className="clause-num">7.1</span>
              <div>
                <strong>What We Use</strong>
                <ul>
                  <li>Essential cookies: Required for the platform to function — session management, authentication, cart persistence. Cannot be disabled.</li>
                  <li>Analytics cookies: Firebase Analytics, Google Analytics — used to understand usage patterns. You may opt out via app settings.</li>
                  <li>Marketing cookies: Used to serve personalised offers. You may opt out via app settings or cookie preference centre.</li>
                  <li>Performance cookies: Monitor app performance, load times, and errors.</li>
                </ul>
              </div>
            </div>
            <div className="clause">
              <span className="clause-num">7.2</span>
              <div>
                <strong>Your Choices</strong><br />
                You may manage cookie preferences via the 'Privacy Settings' section in the app. Note that disabling
                non-essential cookies may affect the personalisation features of the platform. We do not use cookies to track
                you across third-party websites.
              </div>
            </div>
          </section>

          <section className="policy-section" id="section8">
            <h2>8. Children's Privacy</h2>
            <p>
              Accesco Living's services are not directed to individuals under the age of 18. We do not knowingly collect
              personal information from children. If you believe a child under 18 has provided us with personal data,
              please contact our Grievance Officer immediately at grievance@accescoliving.com and we will delete such
              information promptly.
            </p>
          </section>

          <section className="policy-section" id="section9">
            <h2>9. Cross-Border Data Transfers</h2>
            <p>
              We process and store your data primarily within India. Where data is transferred outside India — for example,
              to analytics providers or cloud infrastructure providers with servers in other jurisdictions — we ensure
              adequate safeguards are in place, including standard contractual clauses and data processing agreements,
              to protect your data to the same standard as required under Indian law.
            </p>
          </section>

          <section className="policy-section" id="section10">
            <h2>10. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices, applicable law, or
              platform features. Material changes will be communicated to you via push notification or email at least 30
              days before taking effect. Your continued use of the platform after the effective date of any change
              constitutes your acceptance of the updated policy.
            </p>
            <p>
              The most current version of this policy is always available at accescoliving.com/privacy-policy and within the
              Accesco Living app under Settings &gt; Legal &gt; Privacy Policy.
            </p>
          </section>

          <section className="policy-section" id="section11">
            <h2>11. Grievance Officer & Contact</h2>
            <p>
              In accordance with the Information Technology Act, 2000 and the rules thereunder, the name and contact
              details of the Grievance Officer are provided below:
            </p>
            <div className="contact-card">
              <div className="contact-field">
                <strong>Name</strong>
                <span>Grievance Officer, Accesco Living Private Limited</span>
              </div>
              <div className="contact-field">
                <strong>Designation</strong>
                <span>Data Protection & Compliance Officer</span>
              </div>
              <div className="contact-field">
                <strong>Email</strong>
                <span><a href="mailto:grievance@accescoliving.com">grievance@accescoliving.com</a></span>
              </div>
              <div className="contact-field">
                <strong>Address</strong>
                <span>Accesco Living Private Limited, Bengaluru, Karnataka, India</span>
              </div>
              <div className="contact-field" style={{ gridColumn: '1 / -1' }}>
                <strong>Response time</strong>
                <span>Acknowledgement within 48 hours. Resolution within 30 days.</span>
              </div>
            </div>
            <p style={{ marginTop: '20px', fontSize: '0.9rem', color: '#6b5b65' }}>
              If you are not satisfied with our response, you may approach the Consumer Disputes Redressal Commission under
              the Consumer Protection Act, 2019, or the adjudicating officer appointed under the Information Technology Act,
              2000.
            </p>
          </section>
        </main>
      </div>
    </>
  );
}
