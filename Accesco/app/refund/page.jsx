'use client';

import AccescoHeader from '../../components/AccescoHeader';
import '../terms/style.css';

export default function RefundPage() {
  return (
    <>
      <AccescoHeader />
      <div className="page-wrapper">
        <aside className="sidebar">
          <h4>Policy Sections</h4>
          <ul>
            <li><a href="#overview">Overview</a></li>
            <li><a href="#section12">12. Customer Cancel</a></li>
            <li><a href="#section13">13. Accesco Cancel</a></li>
            <li><a href="#section14">14. Refund Eligibility</a></li>
            <li><a href="#section15">15. Process & Timelines</a></li>
            <li><a href="#section16">16. Non-Refundable</a></li>
            <li><a href="#section17">17. Damaged/Incorrect Items</a></li>
            <li><a href="#section18">18. Returns — InstaStyle</a></li>
            <li><a href="#section19">19. Returns — LocalMeds</a></li>
            <li><a href="#section20">20. Subscription Cancel</a></li>
            <li><a href="#section21">21. Dispute Resolution</a></li>
            <li><a href="#section22">22. Governing Law</a></li>
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
            <h2>PART B — REFUND & CANCELLATION POLICY</h2>
            <p>
              This Refund and Cancellation Policy applies to all orders placed on the Accesco Living platform across all
              verticals — Grokly (grocery), Swadisht (food / cloud kitchen), DineX (dining), InstaStyle (fashion), and
              LocalMeds (pharmacy). This policy is designed to be fair, transparent, and compliant with the Consumer
              Protection Act, 2019.
            </p>
          </section>

          <section className="policy-section" id="section12">
            <h2>12. Order Cancellation — By Customer</h2>
            <div className="clause">
              <span className="clause-num">12.1</span>
              <div>
                <strong>Cancellation Window</strong><br />
                You may cancel your order free of charge within the cancellation window applicable to each vertical. Once an
                order moves beyond the cancellation window, the order cannot be cancelled and a refund will only be
                applicable under Section 14 (Refund Eligibility).
                
                <div className="table-responsive">
                  <table>
                    <thead>
                      <tr>
                        <th>Vertical</th>
                        <th>Cancellation Window</th>
                        <th>Condition</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Grokly (Grocery)</strong></td>
                        <td>Within 60 seconds of order placement</td>
                        <td>Before order is accepted by dark store</td>
                      </tr>
                      <tr>
                        <td><strong>Swadisht (Food / Kitchen)</strong></td>
                        <td>Within 60 seconds of order placement</td>
                        <td>Before kitchen begins preparation</td>
                      </tr>
                      <tr>
                        <td><strong>DineX (Dining / Table)</strong></td>
                        <td>Up to 2 hours before reservation time</td>
                        <td>Full cancellation, no charge</td>
                      </tr>
                      <tr>
                        <td><strong>InstaStyle (Fashion)</strong></td>
                        <td>Within 10 minutes of order placement</td>
                        <td>Before item is dispatched from dark store</td>
                      </tr>
                      <tr>
                        <td><strong>LocalMeds (Pharmacy)</strong></td>
                        <td>Within 60 seconds of order placement</td>
                        <td>Before pharmacist processes prescription</td>
                      </tr>
                      <tr>
                        <td><strong>Any vertical — subscription</strong></td>
                        <td>Up to 24 hours before next billing cycle</td>
                        <td>See Section 20</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="clause">
              <span className="clause-num">12.2</span>
              <div>
                <strong>How to Cancel</strong>
                <ul>
                  <li>Open the Accesco Living app → My Orders → Select the order → Tap 'Cancel Order'.</li>
                  <li>Cancellation requests submitted within the applicable window will be processed immediately.</li>
                  <li>You will receive a cancellation confirmation via push notification and SMS.</li>
                  <li>For DineX reservations, cancellation can also be done via the email confirmation link.</li>
                </ul>
              </div>
            </div>

            <div className="clause">
              <span className="clause-num">12.3</span>
              <div>
                <strong>Late Cancellation</strong><br />
                If you cancel after the cancellation window has elapsed, the order is not eligible for a standard cancellation
                refund. However, if the order is subsequently delayed beyond the SLA commitment or arrives in unacceptable
                condition, you remain entitled to a refund under Sections 14 and 17.
              </div>
            </div>
          </section>

          <section className="policy-section" id="section13">
            <h2>13. Order Cancellation — By Accesco Living</h2>
            <div className="clause">
              <span className="clause-num">13.1</span>
              <div>
                <strong>When We May Cancel Your Order</strong><br />
                Accesco Living reserves the right to cancel an order in the following circumstances. In all such cases, a full
                refund will be initiated within the timelines specified in Section 15:
                <ul>
                  <li>Item unavailability: One or more items in your order are out of stock at the time of picking and no suitable substitute is available.</li>
                  <li>No rider available: We are unable to assign a delivery partner within a reasonable time due to high demand or adverse conditions.</li>
                  <li>Delivery address unreachable: The delivery address is outside our serviceable zone, inaccessible, or involves safety concerns for our riders.</li>
                  <li>Payment failure: Payment could not be verified or processed, and the issue is not resolved within the retry window.</li>
                  <li>Force majeure: Natural disasters, government-mandated restrictions, civil unrest, or other events beyond our reasonable control.</li>
                  <li>Fraud detection: Our systems detect suspicious activity associated with the order or account.</li>
                  <li>Regulatory restrictions: Delivery of certain items (e.g. age-restricted products) where verification cannot be completed.</li>
                </ul>
              </div>
            </div>
            <div className="clause">
              <span className="clause-num">13.2</span>
              <div>
                <strong>Notification</strong><br />
                In the event of a cancellation by Accesco Living, you will be notified via push notification, SMS, and email as
                soon as the cancellation is confirmed. A full refund will be processed automatically — you do not need to
                raise a request.
              </div>
            </div>
          </section>

          <section className="policy-section" id="section14">
            <h2>14. Refund Eligibility</h2>
            <div className="clause">
              <span className="clause-num">14.1</span>
              <div>
                <strong>You Are Eligible for a Full Refund If:</strong>
                <ul>
                  <li>Your order was cancelled within the applicable cancellation window (Section 12).</li>
                  <li>Accesco Living cancelled your order for any reason (Section 13).</li>
                  <li>Your order was never delivered and is confirmed lost by our system.</li>
                  <li>You received an incorrect item that you did not order.</li>
                  <li>You received a damaged, spoiled, or unusable item.</li>
                  <li>You received an item significantly different from its description on the platform.</li>
                  <li>The delivered quantity was materially less than what you paid for.</li>
                  <li>A food order from Swadisht arrived with a confirmed foreign object or quality issue.</li>
                  <li>A LocalMeds order contained an expired medication or incorrect prescription item.</li>
                </ul>
              </div>
            </div>
            <div className="clause">
              <span className="clause-num">14.2</span>
              <div>
                <strong>You Are Eligible for a Partial Refund If:</strong>
                <ul>
                  <li>Only some items in your order were unavailable, incorrect, or damaged — the refund will be for the affected items only.</li>
                  <li>A Swadisht order was significantly delayed beyond the committed SLA and you still received the order.</li>
                  <li>An InstaStyle item has a manufacturing defect discovered after delivery (within the return window).</li>
                </ul>
              </div>
            </div>
            <div className="clause">
              <span className="clause-num">14.3</span>
              <div>
                <strong>Refund Amount</strong><br />
                The refund amount will be the amount paid by you for the affected item(s), inclusive of applicable taxes and
                the proportionate delivery fee for that item where delivery was the sole purpose of the order. Delivery fees are
                non-refundable if at least one item in a multi-item order was correctly fulfilled.
              </div>
            </div>
          </section>

          <section className="policy-section" id="section15">
            <h2>15. Refund Process & Timelines</h2>
            <div className="clause">
              <span className="clause-num">15.1</span>
              <div>
                <strong>How Refunds Are Processed</strong>
                <ul>
                  <li>Refunds are credited to the original payment method used at the time of purchase.</li>
                  <li>Alternatively, with your preference, refunds may be credited to your Accesco Living Wallet for instant availability.</li>
                  <li>Refunds are initiated by Accesco Living within 24 hours of a refund being confirmed.</li>
                  <li>The actual credit to your account depends on your bank or payment provider's processing time.</li>
                </ul>
                
                <div className="table-responsive">
                  <table>
                    <thead>
                      <tr>
                        <th>Payment Method</th>
                        <th>Refund Timeline (after initiation)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>UPI (GPay, PhonePe, Paytm, BHIM)</strong></td>
                        <td>Instant to 2 business days</td>
                      </tr>
                      <tr>
                        <td><strong>Credit card</strong></td>
                        <td>5–7 business days</td>
                      </tr>
                      <tr>
                        <td><strong>Debit card</strong></td>
                        <td>5–7 business days</td>
                      </tr>
                      <tr>
                        <td><strong>Net banking</strong></td>
                        <td>3–5 business days</td>
                      </tr>
                      <tr>
                        <td><strong>Accesco Living Wallet</strong></td>
                        <td>Instant</td>
                      </tr>
                      <tr>
                        <td><strong>Cash on Delivery</strong></td>
                        <td>Credited to Accesco Living Wallet (default) or bank transfer within 5–7 business days upon request</td>
                      </tr>
                      <tr>
                        <td><strong>BNPL / EMI</strong></td>
                        <td>Refund to BNPL provider within 5–7 business days; EMI cancellation per provider's terms</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="clause">
              <span className="clause-num">15.2</span>
              <div>
                <strong>Refund Tracking</strong><br />
                Once a refund is initiated, you will receive a confirmation notification in the app and via SMS. You can track
                the status of your refund via My Orders &gt; [Order] &gt; Refund Status. If a refund has not been received within
                the timelines above, please contact our support team before raising a dispute with your bank.
              </div>
            </div>
          </section>

          <section className="policy-section" id="section16">
            <h2>16. Non-Refundable Situations</h2>
            <p>
              The following situations are not eligible for a refund. Please review carefully before placing your order.
            </p>
            <ul>
              <li><strong>Change of mind:</strong> You no longer want the item after the cancellation window has passed.</li>
              <li><strong>Incorrect address:</strong> Delivery was attempted and failed due to an incorrect address provided by you, and the order was returned.</li>
              <li><strong>Customer absence:</strong> Delivery was attempted but you or your representative were not available to receive the order, and the item is perishable (Grokly / Swadisht).</li>
              <li><strong>Partial consumption:</strong> Food or grocery items that have been partially consumed cannot be returned or refunded unless a quality defect is specifically identified in the unconsumed portion.</li>
              <li><strong>Misuse of promotional credits:</strong> Refunds will not include cashback, referral credits, or discount vouchers used at the time of purchase.</li>
              <li><strong>Clearly disclosed non-returnable items:</strong> Products marked as 'non-returnable' on the product page (e.g. certain personal care items, undergarments in InstaStyle, opened medications in LocalMeds).</li>
              <li><strong>Prescription medications (LocalMeds):</strong> Opened prescription items cannot be returned or refunded unless there is a clear dispensing error or the item is damaged.</li>
              <li><strong>Digital / prepaid services:</strong> Activated gift cards, prepaid plans, or digital products that have been utilised.</li>
            </ul>
          </section>

          <section className="policy-section" id="section17">
            <h2>17. Damaged, Incorrect & Missing Items</h2>
            <div className="clause">
              <span className="clause-num">17.1</span>
              <div>
                <strong>Reporting Window</strong><br />
                All complaints regarding damaged, incorrect, or missing items must be reported within the following windows
                from the time of delivery. Reports submitted after these windows will not be eligible for a refund.
                
                <div className="table-responsive">
                  <table>
                    <thead>
                      <tr>
                        <th>Vertical</th>
                        <th>Reporting Window</th>
                        <th>How to Report</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Grokly (Grocery)</strong></td>
                        <td>Within 6 hours of delivery</td>
                        <td>App: My Orders &gt; Report Issue</td>
                      </tr>
                      <tr>
                        <td><strong>Swadisht (Food)</strong></td>
                        <td>Within 2 hours of delivery</td>
                        <td>App: My Orders &gt; Report Issue</td>
                      </tr>
                      <tr>
                        <td><strong>InstaStyle (Fashion)</strong></td>
                        <td>Within 48 hours of delivery</td>
                        <td>App: My Orders &gt; Return/Report</td>
                      </tr>
                      <tr>
                        <td><strong>LocalMeds (Pharmacy)</strong></td>
                        <td>Within 24 hours of delivery</td>
                        <td>App: My Orders &gt; Report Issue</td>
                      </tr>
                      <tr>
                        <td><strong>DineX (Dining)</strong></td>
                        <td>At time of experience</td>
                        <td>In-app or directly to support</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="clause">
              <span className="clause-num">17.2</span>
              <div>
                <strong>Evidence Required</strong>
                <ul>
                  <li>A clear photograph or short video of the damaged or incorrect item(s).</li>
                  <li>The item must be in its original packaging where applicable.</li>
                  <li>The order ID and delivery timestamp must be visible or confirmable via the app.</li>
                </ul>
              </div>
            </div>
            <div className="clause">
              <span className="clause-num">17.3</span>
              <div>
                <strong>Resolution</strong><br />
                Upon verification of a valid complaint, Accesco Living will offer one of the following resolutions at its discretion
                or per your preference: (a) full or partial refund to original payment method, (b) replacement delivery at no
                additional cost, or (c) Accesco Living Wallet credit of equivalent value with an additional 10% goodwill credit.
              </div>
            </div>
          </section>

          <section className="policy-section" id="section18">
            <h2>18. Returns — InstaStyle (Fashion Vertical)</h2>
            <div className="clause">
              <span className="clause-num">18.1</span>
              <div>
                <strong>Return Eligibility</strong><br />
                InstaStyle supports returns for eligible fashion items within 7 days of delivery. To be eligible for a return:
                <ul>
                  <li>The item must be unworn, unwashed, and in its original condition.</li>
                  <li>All original tags, labels, and packaging must be intact.</li>
                  <li>The item must not be on the non-returnable list (visible on the product page at time of purchase).</li>
                  <li>The return request must be submitted within 7 days of delivery.</li>
                </ul>
              </div>
            </div>
            <div className="clause">
              <span className="clause-num">18.2</span>
              <div>
                <strong>Non-Returnable Fashion Items</strong>
                <ul>
                  <li>Innerwear, lingerie, socks, and swimwear (for hygiene reasons).</li>
                  <li>Items purchased during Final Sale or Clearance events (explicitly marked at checkout).</li>
                  <li>Customised or personalised items.</li>
                  <li>Items damaged after delivery due to customer handling.</li>
                </ul>
              </div>
            </div>
            <div className="clause">
              <span className="clause-num">18.3</span>
              <div>
                <strong>Trial at Your Doorstep — Special Provision</strong><br />
                InstaStyle's 'Trial at Your Doorstep' feature allows you to try selected items before purchase. Items returned
                under a Trial at Your Doorstep session are not treated as a 'return' — you simply hand the item back to the
                rider at the time of delivery. No refund request is necessary; you are only charged for items you keep.
              </div>
            </div>
            <div className="clause">
              <span className="clause-num">18.4</span>
              <div>
                <strong>Return Pickup</strong><br />
                Once a return request is approved via the app, a rider will be assigned to collect the item within 24–48 hours.
                Refunds are initiated within 24 hours of the returned item being quality-checked at our dark store.
              </div>
            </div>
          </section>

          <section className="policy-section" id="section19">
            <h2>19. Returns — LocalMeds (Pharmacy Vertical)</h2>
            <div className="clause">
              <span className="clause-num">19.1</span>
              <div>
                <strong>General Rule</strong><br />
                Due to the nature of pharmaceutical products and regulatory requirements under the Drugs and Cosmetics Act, 1940,
                most medicines and pharmacy products cannot be returned or exchanged once delivered. Exceptions apply only
                where Accesco Living is at fault.
              </div>
            </div>
            <div className="clause">
              <span className="clause-num">19.2</span>
              <div>
                <strong>Refund Eligible Situations (LocalMeds)</strong>
                <ul>
                  <li>Medication delivered is past its expiry date at the time of delivery.</li>
                  <li>Wrong medication dispensed — differs from the prescription or order placed.</li>
                  <li>Damaged packaging that compromises the integrity of the medication.</li>
                  <li>Medication quantity is short of what was billed.</li>
                  <li>Order was cancelled by Accesco Living due to prescription verification failure.</li>
                </ul>
              </div>
            </div>
            <div className="clause">
              <span className="clause-num">19.3</span>
              <div>
                <strong>Non-Returnable (LocalMeds)</strong>
                <ul>
                  <li>Opened or partially used medications.</li>
                  <li>Refrigerated medications (cold-chain items) once delivered.</li>
                  <li>Controlled substances and scheduled medications.</li>
                  <li>Any medication returned without valid reason under Section 19.2.</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="policy-section" id="section20">
            <h2>20. Subscription & Membership Cancellation</h2>
            <div className="clause">
              <span className="clause-num">20.1</span>
              <div>
                <strong>Accesco Living Pass / Membership Plans</strong><br />
                If Accesco Living offers subscription plans (e.g. Accesco Pass for free delivery, priority access, or exclusive discounts), the following cancellation terms apply:
                <ul>
                  <li>You may cancel your subscription at any time from the app via Settings &gt; Subscription &gt; Cancel.</li>
                  <li>Cancellation takes effect at the end of the current billing cycle — you retain access to benefits until then.</li>
                  <li>No pro-rata refunds are provided for unused days in a billing cycle unless the plan is cancelled within 24 hours of initial purchase.</li>
                  <li>If cancelled within 24 hours of initial purchase and no premium features have been used, a full refund will be provided.</li>
                  <li>Accesco Living reserves the right to terminate a membership if the account is found to be in violation of our Terms of Service.</li>
                </ul>
              </div>
            </div>
            <div className="clause">
              <span className="clause-num">20.2</span>
              <div>
                <strong>Auto-Renewal</strong><br />
                Subscriptions are auto-renewed at the end of each billing cycle. You will receive a reminder notification 3
                days before renewal. You may disable auto-renewal at any time from the subscription management screen in the app.
              </div>
            </div>
          </section>

          <section className="policy-section" id="section21">
            <h2>21. Dispute Resolution</h2>
            <div className="clause">
              <span className="clause-num">21.1</span>
              <div>
                <strong>Raising a Dispute</strong><br />
                If you are dissatisfied with a refund decision, you may escalate via the following channels in order:
                <ul>
                  <li><strong>Step 1 — In-app support:</strong> Raise a dispute via My Orders &gt; [Order] &gt; I Have an Issue. Our team will review within 48 hours.</li>
                  <li><strong>Step 2 — Email escalation:</strong> Write to <a href="mailto:support@accescoliving.in">support@accescoliving.in</a> with your order ID, the nature of the issue, and any supporting evidence. Response within 5 business days.</li>
                  <li><strong>Step 3 — Grievance Officer:</strong> If unresolved, escalate to <a href="mailto:grievance@accescoliving.com">grievance@accescoliving.com</a>. Response and resolution within 30 days.</li>
                  <li><strong>Step 4 — Consumer Forum:</strong> If still unresolved, you may approach the Consumer Disputes Redressal Commission in your jurisdiction under the Consumer Protection Act, 2019.</li>
                </ul>
              </div>
            </div>
            <div className="clause">
              <span className="clause-num">21.2</span>
              <div>
                <strong>Chargebacks</strong><br />
                We strongly request that you exhaust the above steps before initiating a chargeback with your bank.
                Unwarranted chargebacks may result in suspension of your Accesco Living account. Where a chargeback is
                initiated, we reserve the right to contest it with all relevant transaction documentation.
              </div>
            </div>
          </section>

          <section className="policy-section" id="section22">
            <h2>22. Governing Law</h2>
            <p>
              These policies are governed by and construed in accordance with the laws of the Republic of India. Any
              disputes arising under or in connection with these policies shall be subject to the exclusive jurisdiction of the
              courts located in Bengaluru, Karnataka, India.
            </p>
            <p style={{ marginTop: '30px', fontWeight: 'bold' }}>
              By using the Accesco Living platform, you acknowledge that you have read, understood, and agree to be
              bound by this Privacy Policy and Refund & Cancellation Policy in their entirety.
            </p>
          </section>

          <section className="policy-section">
            <div className="disclosure-card" style={{ borderLeft: '4px solid #c8963e' }}>
              <strong>FOR ACCESCO LIVING PRIVATE LIMITED</strong><br /><br />
              Authorised Signatory<br />
              Founder & CEO<br />
              Bengaluru, Karnataka<br /><br />
              <strong>EFFECTIVE DATE:</strong> 02 June 2026<br />
              <strong>Next review:</strong> 02 June 2027<br />
              <strong>DOCUMENT VERSION:</strong> Version 1.0 (Supersedes all prior versions)<br /><br />
              <span style={{ fontSize: '0.82rem', opacity: 0.8 }}>
                Accesco Living Private Limited · CIN: U47912WB2025PTC285309 · Bengaluru, Karnataka, India · accescoliving.com ·
                support@accescoliving.in · Your Life Simplified
              </span>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
