'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SwadishttHeader from '../../../components/SwadishttHeader';
import { useAuth } from '../../../../../components/AuthProvider';
import styles from './return-container.module.css';

const RETURN_ITEMS = [
  {
    id: 'pizza-box',
    name: 'Pizza Box',
    type: 'Cardboard box',
    icon: '🍕',
    availableQty: 1,
    points: 1,
    defaultSelected: true,
  },
  {
    id: 'garlic-bread-box',
    name: 'Garlic Bread Box',
    type: 'Cardboard box',
    icon: '🥖',
    availableQty: 1,
    points: 1,
    defaultSelected: true,
  },
  {
    id: 'sauce-container',
    name: 'Sauce Container',
    type: 'Plastic container',
    icon: '🥣',
    availableQty: 2,
    points: 1,
    defaultSelected: true,
  },
  {
    id: 'paper-bag',
    name: 'Paper Bag',
    type: 'Paper bag',
    icon: '🛍️',
    availableQty: 1,
    points: 1,
    defaultSelected: true,
  },
  {
    id: 'cutlery',
    name: 'Cutlery (Spoon + Fork)',
    type: 'Reusable cutlery',
    icon: '🍴',
    availableQty: 2,
    points: 0,
    defaultSelected: false,
  },
];

const INITIAL_SELECTIONS = RETURN_ITEMS.reduce((result, item) => {
  result[item.id] = {
    selected: item.defaultSelected,
    quantity: item.defaultSelected ? item.availableQty : 0,
  };

  return result;
}, {});

function Breadcrumb({ currentStep }) {
  const steps = [
    'Home',
    'My Orders',
    'Order #12345',
    'Select Return Type',
    'Select Items',
  ];

  if (currentStep === 'option' || currentStep === 'confirmed') {
    steps.push('Return Option');
  }

  if (currentStep === 'confirmed') {
    steps.push('Return Confirmed');
  }

  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;

        return (
          <span key={step} className={styles.breadcrumbPart}>
            <span
              className={
                isLast
                  ? styles.activeBreadcrumb
                  : styles.inactiveBreadcrumb
              }
            >
              {step}
            </span>

            {!isLast && (
              <span className={styles.breadcrumbSeparator}>›</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}

function SustainabilityCard({
  title = 'Good for the planet!',
  description = 'Returning these items helps reduce waste and supports recycling.',
}) {
  return (
    <div className={styles.sustainabilityCard}>
      <div className={styles.leafIcon}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M20 4c-8 0-14 4-14 10 0 4 3 6 6 6 6 0 8-8 8-16Z" />
          <path d="M4 20c3-5 7-8 12-10" />
        </svg>
      </div>

      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
    </div>
  );
}

function ReturnSummary({ selectedItems, totalItems, method }) {
  const methodLabel =
    method === 'store'
      ? 'Swadishtt Store / Partner Outlet'
      : 'Return with next delivery';

  return (
    <aside className={styles.summaryCard}>
      <h2 className={styles.summaryTitle}>Return Summary</h2>

      <div className={styles.summaryHeading}>
        Items Selected <span>({selectedItems.length})</span>
      </div>

      <div className={styles.summaryItems}>
        {selectedItems.length > 0 ? (
          selectedItems.map((item) => (
            <div key={item.id} className={styles.summaryItem}>
              <div className={styles.summaryItemLeft}>
                <span className={styles.summaryItemIcon}>{item.icon}</span>
                <span>{item.name}</span>
              </div>

              <strong>×{item.selectedQuantity}</strong>
            </div>
          ))
        ) : (
          <p className={styles.emptySummary}>No items selected.</p>
        )}
      </div>

      <div className={styles.summaryTotal}>
        <span>Total Items</span>
        <strong>{totalItems}</strong>
      </div>

      <SustainabilityCard />

      {method && (
        <div className={styles.pickupDetails}>
          <h3>Return Details</h3>

          <div className={styles.pickupDetailRow}>
            <span>Return option</span>
            <strong>{methodLabel}</strong>
          </div>

          {method === 'delivery' && (
            <>
              <div className={styles.pickupDetailRow}>
                <span>Pickup time</span>
                <strong>Today, 6:00 PM – 9:00 PM</strong>
              </div>

            <div className={styles.pickupDetailRow}>
  <span>Pickup address</span>
  <p>Same as the delivery address for this order.</p>
</div>
            </>
          )}

          {method === 'store' && (
            <div className={styles.pickupDetailRow}>
              <span>Drop-off location</span>
              <strong>Nearest partner outlet</strong>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}

function HelpFooter() {
  return (
    <footer className={styles.helpFooter}>
      <div className={styles.helpIcon}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M4 13a8 8 0 0 1 16 0" />
          <path d="M4 13v5a2 2 0 0 0 2 2h2v-7H4Z" />
          <path d="M20 13v5a2 2 0 0 1-2 2h-2v-7h4Z" />
        </svg>
      </div>

      <strong>Need help?</strong>

      <span>
        Visit our <u>Help Center</u> or chat with our support team.
      </span>
    </footer>
  );
}

export default function SwadishttReturnContainerPage() {
  const params = useParams();
  const router = useRouter();
  const { user, getIdToken } = useAuth();

  const orderId = params.id || '12345';

  const [currentStep, setCurrentStep] = useState('items');
  const [selections, setSelections] = useState(INITIAL_SELECTIONS);
  const [selectedMethod, setSelectedMethod] = useState('delivery');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestId, setRequestId] = useState('');

  const selectedItems = useMemo(() => {
    return RETURN_ITEMS.filter((item) => selections[item.id]?.selected).map(
      (item) => ({
        ...item,
        selectedQuantity: selections[item.id]?.quantity || 0,
      })
    );
  }, [selections]);

  const totalItems = useMemo(() => {
    return selectedItems.reduce(
      (total, item) => total + item.selectedQuantity,
      0
    );
  }, [selectedItems]);

  const toggleItem = (item) => {
    setSelections((previous) => {
      const current = previous[item.id];

      return {
        ...previous,
        [item.id]: {
          selected: !current.selected,
          quantity: current.selected ? 0 : item.availableQty,
        },
      };
    });
  };

  const updateQuantity = (item, change) => {
    setSelections((previous) => {
      const current = previous[item.id];
      const nextQuantity = Math.min(
        item.availableQty,
        Math.max(0, current.quantity + change)
      );

      return {
        ...previous,
        [item.id]: {
          selected: nextQuantity > 0,
          quantity: nextQuantity,
        },
      };
    });
  };

  const handleItemsContinue = () => {
    if (totalItems === 0) return;

    setCurrentStep('option');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmReturn = async () => {
    if (totalItems === 0 || !selectedMethod) return;

    setIsSubmitting(true);

    try {
      const generatedRequestId = `SR${Date.now()
        .toString()
        .slice(-9)}`;

      const returnRequest = {
        requestId: generatedRequestId,
        orderId,
        items: selectedItems.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.selectedQuantity,
        })),
        returnMethod: selectedMethod,
        timestamp: new Date().toISOString(),
        status: 'scheduled',
      };

      const previousReturns = JSON.parse(
        localStorage.getItem('sw_container_returns') || '[]'
      );

      localStorage.setItem(
        'sw_container_returns',
        JSON.stringify([...previousReturns, returnRequest])
      );

      const headers = { 'Content-Type': 'application/json' };
      if (user?.uid) {
        const token = await getIdToken();
        if (token) {
          headers.Authorization = `Bearer ${token}`;
          headers['x-user-id'] = user.uid;
        }
      }
      await fetch(
        `/api/swadishtt/orders/${orderId}/return-container`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(returnRequest),
        }
      ).catch((error) => {
        console.error('API Error:', error);
      });

      setRequestId(generatedRequestId);
      setCurrentStep('confirmed');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Unable to schedule return:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStep === 'option') {
      setCurrentStep('items');
      return;
    }

    if (currentStep === 'confirmed') {
      router.push('/services/swadisht/orders');
      return;
    }

    router.back();
  };

  return (
    <div className={styles.page}>
      <SwadishttHeader />

      <main className={styles.main}>
        <Breadcrumb currentStep={currentStep} />

        {currentStep === 'items' && (
          <section className={styles.pageSection}>
            <div className={styles.headingBlock}>
              <h1>Select items you want to return</h1>
              <p>Choose the packaging or containers you want to return.</p>
            </div>

            <div className={styles.twoColumnLayout}>
              <div className={styles.leftColumn}>
                <div className={styles.itemsCard}>
                  <h2 className={styles.cardLabel}>
                    Available items from this order
                  </h2>

                  <div className={styles.itemsList}>
                    {RETURN_ITEMS.map((item) => {
                      const selection = selections[item.id];
                      const isSelected = selection?.selected;

                      return (
                        <div
                          key={item.id}
                          className={`${styles.itemRow} ${
                            isSelected ? styles.itemRowSelected : ''
                          }`}
                        >
                          <label className={styles.itemCheckboxWrap}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleItem(item)}
                            />

                            <span className={styles.customCheckbox}>
                              {isSelected && (
                                <svg
                                  width="11"
                                  height="11"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                >
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              )}
                            </span>
                          </label>

                          <span className={styles.itemIcon}>{item.icon}</span>

                          <div className={styles.itemInformation}>
                            <strong>{item.name}</strong>
                            <span>{item.type}</span>
                          </div>

                          <div className={styles.quantityArea}>
                            <div className={styles.quantityControls}>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item, -1)}
                                disabled={!isSelected}
                                aria-label={`Reduce ${item.name} quantity`}
                              >
                                −
                              </button>

                              <span>{selection?.quantity || 0}</span>

                              <button
                                type="button"
                                onClick={() => updateQuantity(item, 1)}
                                disabled={
                                  selection?.quantity >= item.availableQty
                                }
                                aria-label={`Increase ${item.name} quantity`}
                              >
                                +
                              </button>
                            </div>

                            <span className={styles.availableQuantity}>
                              Qty: {item.availableQty}
                            </span>

                            <span className={styles.pointsLabel}>
                              ₹{item.points.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className={styles.recyclingMessage}>
                    <div className={styles.smallLeafIcon}>
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="M20 4c-8 0-14 4-14 10 0 4 3 6 6 6 6 0 8-8 8-16Z" />
                        <path d="M4 20c3-5 7-8 12-10" />
                      </svg>
                    </div>

                    <span>
                      Clean items help us recycle better and protect our
                      planet.
                    </span>
                  </div>
                </div>
              </div>

              <ReturnSummary
                selectedItems={selectedItems}
                totalItems={totalItems}
              />
            </div>

            <button
              type="button"
              className={styles.continueButton}
              onClick={handleItemsContinue}
              disabled={totalItems === 0}
            >
              <span>Continue</span>
              <span>›</span>
            </button>
          </section>
        )}

        {currentStep === 'option' && (
          <section className={styles.pageSection}>
            <button
              type="button"
              className={styles.desktopBackButton}
              onClick={handleBack}
            >
              <span>‹</span>
              Back
            </button>

            <div className={styles.headingBlock}>
              <h1>How would you like to return these items?</h1>
              <p>Choose the most convenient option for you.</p>
            </div>

            <div className={styles.twoColumnLayout}>
              <div className={styles.leftColumn}>
                <div className={styles.returnMethodList}>
                  <button
                    type="button"
                    className={`${styles.returnMethodCard} ${
                      selectedMethod === 'delivery'
                        ? styles.returnMethodSelected
                        : ''
                    }`}
                    onClick={() => setSelectedMethod('delivery')}
                  >
                    <span
                      className={`${styles.methodRadio} ${
                        selectedMethod === 'delivery'
                          ? styles.methodRadioSelected
                          : ''
                      }`}
                    >
                      {selectedMethod === 'delivery' && (
                        <span className={styles.methodRadioDot} />
                      )}
                    </span>

                    <img
                      src="/images/returns/next-delivery.png"
                      alt="Delivery partner on a scooter"
                      className={styles.methodImage}
                    />

                    <div className={styles.methodContent}>
                      <div className={styles.methodTitleRow}>
                        <h2>Return with next delivery</h2>
                        <span className={styles.recommendedBadge}>
                          Recommended
                        </span>
                      </div>

                      <p>
                        Hand over the items to our delivery partner on your
                        next order.
                      </p>

                      <div className={styles.methodTags}>
                        <span>🛍 No extra charges</span>
                        <span>🌿 Eco-friendly</span>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`${styles.returnMethodCard} ${
                      selectedMethod === 'store'
                        ? styles.returnMethodSelected
                        : ''
                    }`}
                    onClick={() => setSelectedMethod('store')}
                  >
                    <span
                      className={`${styles.methodRadio} ${
                        selectedMethod === 'store'
                          ? styles.methodRadioSelected
                          : ''
                      }`}
                    >
                      {selectedMethod === 'store' && (
                        <span className={styles.methodRadioDot} />
                      )}
                    </span>

                    <img
                      src="/images/returns/partner-store.png"
                      alt="Swadishtt partner store"
                      className={styles.methodImage}
                    />

                    <div className={styles.methodContent}>
                      <div className={styles.methodTitleRow}>
                        <h2>
                          Return at Swadishtt Store / Partner Outlet
                        </h2>
                      </div>

                      <p>
                        Drop the items at any nearby Swadishtt store or
                        partner outlet.
                      </p>

                      <div className={styles.methodTags}>
                        <span>📍 Find stores nearby</span>
                        <span>🌿 Eco-friendly</span>
                      </div>
                    </div>
                  </button>
                </div>

                <SustainabilityCard
                  title="Thank you for helping us reduce waste!"
                  description="Your small step towards returning makes a big impact on the planet."
                />
              </div>

              <ReturnSummary
                selectedItems={selectedItems}
                totalItems={totalItems}
                method={selectedMethod}
              />
            </div>

            <button
              type="button"
              className={styles.continueButton}
              onClick={handleConfirmReturn}
              disabled={!selectedMethod || isSubmitting}
            >
              <span>
                {isSubmitting ? 'Submitting...' : 'Continue'}
              </span>
              <span>›</span>
            </button>
          </section>
        )}

        {currentStep === 'confirmed' && (
          <section className={styles.confirmedPage}>
            <div className={styles.confirmationLayout}>
              <div className={styles.confirmationMain}>
                <div className={styles.successBanner}>
                  <div className={styles.successCheck}>
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>

                  <div className={styles.successContent}>
                    <h1>Return request confirmed!</h1>
                    <p>Thank you for returning these items.</p>
                    <p>Your request has been successfully placed.</p>

                    <span className={styles.requestId}>
                      Request ID: {requestId || 'SR123456789'}
                    </span>
                  </div>

                  <img
                    src="/images/returns/packaging.png"
                    alt=""
                    className={styles.successImage}
                  />
                </div>

                <div className={styles.nextStepsCard}>
                  <h2>What happens next?</h2>

                  <div className={styles.nextStep}>
                    <div className={styles.nextStepIcon}>▣</div>
                    <div>
                      <strong>Pickup Scheduled</strong>
                      <p>
                        Our delivery partner will pick up the items on
                      </p>
                      <span>Today, 6:00 PM – 9:00 PM</span>
                    </div>
                  </div>

                  <div className={styles.nextStep}>
                    <div className={styles.nextStepIcon}>▣</div>
                    <div>
                      <strong>Items will be Picked Up</strong>
                      <p>
                        Please keep the items ready and hand them over to
                        our delivery partner.
                      </p>
                    </div>
                  </div>

                  <div className={styles.nextStep}>
                    <div className={styles.nextStepIcon}>♧</div>
                    <div>
                      <strong>We&apos;ll Take Care</strong>
                      <p>
                        The items will be checked and sent for proper
                        recycling.
                      </p>
                    </div>
                  </div>

                  <div className={styles.nextStep}>
                    <div className={styles.nextStepIcon}>♡</div>
                    <div>
                      <strong>Thank You!</strong>
                      <p>
                        You&apos;re helping us reduce waste and build a more
                        sustainable future.
                      </p>
                    </div>
                  </div>
                </div>

                <div className={styles.trackReturnCard}>
                  <div className={styles.trackIcon}>▯</div>

                  <div className={styles.trackContent}>
                    <strong>Track your return anytime</strong>
                    <p>
                      You can check the status of your return in{' '}
                      <span>My Orders &gt; Returns</span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      router.push('/services/swadisht/orders')
                    }
                  >
                    View My Orders
                    <span>›</span>
                  </button>
                </div>

                <button
                  type="button"
                  className={styles.doneButton}
                  onClick={() =>
                    router.push('/services/swadisht/orders')
                  }
                >
                  Done
                </button>
              </div>

              <ReturnSummary
                selectedItems={selectedItems}
                totalItems={totalItems}
                method={selectedMethod}
              />
            </div>
          </section>
        )}
      </main>

      <HelpFooter />
    </div>
  );
}