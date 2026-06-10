'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import SwadishttHeader from '../components/SwadishttHeader';
import styles from './tracking.module.css';

const ORDERS_STORAGE_KEY = 'swadishtt-orders';

const mockRiderData = {
  rider: {
    name: "Rahul Kumar",
    phone: "+91 9876543210",
    vehicleType: "Premium Express Bike",
    vehicleNumber: "KA01AB1234",
    rating: 4.9,
    deliveries: "350+ successful",
    status: "Out For Delivery",
    profileImage: "https://ui-avatars.com/api/?name=Rahul+Kumar&background=7A0042&color=fff",
  },
  assignment: {
    status: "Assigned",
    assignedAt: "10:30 AM",
  },
};

export default function SwadishttTrackingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('id');

  const [order, setOrder] = useState(null);
  const [eta, setEta] = useState(35);
  const [showRiderCallModal, setShowRiderCallModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [activeTab, setActiveTab] = useState('status'); // 'status' or 'summary'

  const steps = [
    { name: 'Placed', label: 'Order Placed', desc: 'Waiting for restaurant confirmation' },
    { name: 'Confirmed', label: 'Confirmed', desc: 'Restaurant accepted your order' },
    { name: 'Preparing', label: 'Preparing', desc: 'Chef is preparing your meal' },
    { name: 'Out For Delivery', label: 'Out for Delivery', desc: 'Rider is on the way with your food' },
    { name: 'Delivered', label: 'Delivered', desc: 'Enjoy your delicious meal!' },
  ];

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedOrders = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || '[]');
    const currentOrder = storedOrders.find((o) => o.id === orderId);

    if (currentOrder) {
      setOrder(currentOrder);
      
      const statusIdx = steps.findIndex(s => s.name === currentOrder.status);
      if (statusIdx === 0) setEta(35);
      else if (statusIdx === 1) setEta(30);
      else if (statusIdx === 2) setEta(20);
      else if (statusIdx === 3) setEta(12);
      else setEta(0);
    }
  }, [orderId]);

  useEffect(() => {
    if (!order || order.status === 'Delivered') return;

    const interval = setInterval(() => {
      setEta((prev) => {
        if (prev <= 1) return 1;
        return prev - 1;
      });
    }, 45000);

    return () => clearInterval(interval);
  }, [order]);

  const updateStatus = (newStatus) => {
    if (typeof window === 'undefined' || !order) return;

    const storedOrders = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || '[]');
    const updatedOrders = storedOrders.map((o) => {
      if (o.id === order.id) {
        return { ...o, status: newStatus };
      }
      return o;
    });

    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
    setOrder((prev) => ({ ...prev, status: newStatus }));

    if (newStatus === 'Confirmed') setEta(30);
    else if (newStatus === 'Preparing') setEta(20);
    else if (newStatus === 'Out For Delivery') setEta(12);
    else if (newStatus === 'Delivered') setEta(0);
  };

  useEffect(() => {
    if (!order) return;
    const currentIdx = steps.findIndex(s => s.name === order.status);
    if (currentIdx === -1 || currentIdx === steps.length - 1) return;

    const autoTimer = setTimeout(() => {
      const nextStep = steps[currentIdx + 1].name;
      updateStatus(nextStep);
    }, 18000); 

    return () => clearTimeout(autoTimer);
  }, [order]);

  const handleCancelOrder = () => {
    if (typeof window === 'undefined' || !order) return;

    const storedOrders = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || '[]');
    const updatedOrders = storedOrders.filter((o) => o.id !== order.id);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));

    setShowCancelModal(false);
    alert('Order cancelled successfully.');
    router.push('/services/swadisht');
  };

  if (!order) {
    return (
      <div className={styles.notFoundWrapper}>
        <div className={styles.notFoundCard}>
          <div className={styles.notFoundIcon}>🍽️</div>
          <h2>Order Not Found</h2>
          <p>We couldn't retrieve details for order #{orderId}.</p>
          <Link href="/services/swadisht" className={styles.primaryBtn}>
            Return to Swadishtt
          </Link>
        </div>
      </div>
    );
  }

  const currentIdx = steps.findIndex(s => s.name === order.status);
  const isDelivered = order.status === 'Delivered';
  const canCancel = currentIdx <= 1;

  // Horizontal bar dynamic progress calculation
  const progressPercent = ((currentIdx + 1) / steps.length) * 100;

  // Custom coordinate steps for the modern map path
  const mapPositions = [
    { x: 40, y: 150 },
    { x: 120, y: 130 },
    { x: 200, y: 110 },
    { x: 280, y: 80 },
    { x: 360, y: 50 }
  ];
  const activeMapPos = mapPositions[currentIdx] || { x: 40, y: 150 };

  return (
    <div className={styles.page}>
      <SwadishttHeader />

      <main className={styles.container}>
        {/* Layout Top Area: Order Tracking ID & Badge Status */}
        <div className={styles.topHeaderArea}>
          <div>
            <span className={styles.trackingSubTag}>ORDER TRACKING</span>
            <h1 className={styles.orderIdTitle}>#{order.id}</h1>
          </div>
          <div className={styles.statusPillBadge}>
            <span className={styles.statusDot}></span>
            {order.status.toUpperCase()}
          </div>
        </div>

        {/* Instastyle Horizontal Order Progress Bar */}
        <div className={styles.progressBarWrapper}>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
          </div>
          <div className={styles.progressLabels}>
            <span className={styles.currentProgressText}>{steps[currentIdx]?.label}</span>
            <span className={styles.arrivingSoonText}>{isDelivered ? 'Arrived' : 'Arriving Soon'}</span>
          </div>
        </div>

        {/* Main Content Layout Grid */}
        <div className={styles.trackingGrid}>
          {/* LEFT PANEL: Hero Widget, Actions, Map, Custom widgets */}
          <div className={styles.leftPanel}>
            {/* Dark Hero Card: ETA and Rider Profile Info */}
            <div className={styles.etaHeroCard}>
              <div className={styles.heroLeft}>
                <span className={styles.heroLabelText}>ESTIMATED ARRIVAL</span>
                <div className={styles.heroEtaValue}>
                  {isDelivered ? '0' : eta} <span className={styles.heroEtaMin}>min</span>
                </div>
                <div className={styles.heroDistanceInfo}>
                  {isDelivered ? 'Delivered successfully' : '2.3 km away • Live tracking'}
                </div>
                <span className={styles.premiumExpressTag}>
                  ⚡ {mockRiderData.rider.vehicleType.toUpperCase()}
                </span>
              </div>
              <div className={styles.heroRight}>
                <div className={styles.riderAvatarContainer}>
                  {/* Circular initials icon style */}
                  <div className={styles.riderInitialsBadge}>JS</div>
                </div>
                <h3 className={styles.riderCardName}>{mockRiderData.rider.name}</h3>
                <p className={styles.riderCardRating}>★ {mockRiderData.rider.rating} • Premium Partner</p>
              </div>
            </div>

            {/* Rider Action Row */}
            <div className={styles.quickActionsRow}>
              <button onClick={() => setShowRiderCallModal(true)} className={styles.heroCallBtn}>
                📞 Call Partner
              </button>
              <a 
                href={`https://wa.me/${mockRiderData.rider.phone.replace(/[^0-9]/g, '')}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.heroMsgBtn}
              >
                💬 MESSAGE
              </a>
            </div>

            {/* Live Tracking Map Card */}
            <div className={styles.liveMapCard}>
              <div className={styles.liveMapHeader}>
                <div>
                  <span className={styles.liveMapSub}>LIVE TRACKING</span>
                  <h3 className={styles.liveMapTitle}>
                    {isDelivered ? 'Order delivered' : `${steps[currentIdx]?.label} your order`}
                  </h3>
                </div>
                <span className={styles.liveBadgeIndicator}>
                  <span className={styles.liveBlinkDot}></span> LIVE
                </span>
              </div>

              {/* Enhanced Minimalist Route Visual Map */}
              <div className={styles.mapGraphicContainer}>
                <svg viewBox="0 0 400 200" className={styles.cleanVectorMap}>
                  {/* Subtle Grid Lines */}
                  <path d="M 0,50 L 400,50 M 0,100 L 400,100 M 0,150 L 400,150 M 100,0 L 100,200 M 200,0 L 200,200 M 300,0 L 300,200" stroke="rgba(122, 0, 66, 0.03)" strokeWidth="1" />
                  
                  {/* Dashed Route Path */}
                  <path 
                    d="M 40,150 C 130,160 170,70 250,110 C 310,130 320,60 360,50" 
                    fill="none" 
                    stroke="#ebdbe2" 
                    strokeWidth="3" 
                    strokeDasharray="5 5" 
                  />

                  {/* Active Covered Path */}
                  <path 
                    d="M 40,150 C 130,160 170,70 250,110 C 310,130 320,60 360,50" 
                    fill="none" 
                    stroke="#7a0042" 
                    strokeWidth="3.5" 
                    strokeLinecap="round" 
                    strokeDasharray="400" 
                    strokeDashoffset={400 - (currentIdx * 80)} 
                    className={styles.activeCoveredPath}
                  />

                  {/* Store Node */}
                  <g transform="translate(40, 150)">
                    <circle r="7" fill="#7a0042" />
                    <circle r="14" fill="none" stroke="rgba(122, 0, 66, 0.15)" strokeWidth="2" />
                  </g>

                  {/* Your Door Node */}
                  <g transform="translate(360, 50)">
                    <circle r="7" fill="#10b981" />
                    <circle r="14" fill="none" stroke="rgba(16, 185, 129, 0.15)" strokeWidth="2" />
                  </g>

                  {/* Moving Scooter indicator */}
                  {!isDelivered && (
                    <g transform={`translate(${activeMapPos.x}, ${activeMapPos.y})`}>
                      <circle r="10" fill="#7a0042" stroke="#ffffff" strokeWidth="2.5" />
                      <text y="3" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">🛵</text>
                    </g>
                  )}
                </svg>

                {/* Bottom Route Legend */}
                <div className={styles.mapRouteLabels}>
                  <div className={styles.legendPoint}>
                    <span className={styles.storeMiniDot}></span> Store
                  </div>
                  <div className={styles.routeConnectorDots}>..................................................</div>
                  <div className={styles.legendPoint}>
                    Your door <span className={styles.doorMiniDot}></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick action widgets below the map */}
            <div className={styles.quickWidgetsGrid}>
              <div className={styles.microWidgetCard}>
                <div className={styles.microWidgetHeader}>
                  <div className={styles.microIconFrame}>🛍️</div>
                  <div>
                    <h4 className={styles.microTitle}>Forgot to add?</h4>
                    <p className={styles.microDesc}>Add items while order is preparing</p>
                  </div>
                </div>
                <Link href="/services/swadisht" className={styles.microWidgetBtn}>
                  Add Items
                </Link>
              </div>

              <div className={styles.microWidgetCard}>
                <div className={styles.microWidgetHeader}>
                  <div className={styles.microIconFrame}>💳</div>
                  <div>
                    <h4 className={styles.microTitle}>Pay ₹{order.totals?.total}</h4>
                    <p className={styles.microDesc}>Pay online before or on delivery</p>
                  </div>
                </div>
                <button disabled className={styles.microWidgetOutlineBtn}>
                  {order.paymentMethod?.toUpperCase()} PAID
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Tab bar for Delivery Timeline & Receipt details */}
          <div className={styles.rightPanel}>
            {/* Interactive Tab Switcher */}
            <div className={styles.tabsSwitcherContainer}>
              <button 
                className={`${styles.tabBtn} ${activeTab === 'status' ? styles.activeTabBtn : ''}`}
                onClick={() => setActiveTab('status')}
              >
                DELIVERY STATUS
              </button>
              <button 
                className={`${styles.tabBtn} ${activeTab === 'summary' ? styles.activeTabBtn : ''}`}
                onClick={() => setActiveTab('summary')}
              >
                ORDER SUMMARY
              </button>
            </div>

            {/* Dynamic Content Panel based on selected tab */}
            {activeTab === 'status' ? (
              <div className={styles.tabContentCard}>
                <h3 className={styles.cardHeaderTitle}>Delivery Timeline</h3>
                <div className={styles.timelineList}>
                  {steps.map((stepItem, idx) => {
                    const isCompleted = idx <= currentIdx;
                    const isActive = idx === currentIdx;
                    
                    return (
                      <div 
                        key={stepItem.name} 
                        className={`${styles.timelineStep} ${isCompleted ? styles.stepCompleted : ''} ${isActive ? styles.stepActive : ''}`}
                      >
                        <div className={styles.bulletContainer}>
                          <div className={styles.timelineBullet}>
                            {isCompleted ? (
                              <svg className={styles.checkIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <div className={styles.bulletDot} />
                            )}
                          </div>
                          {idx < steps.length - 1 && <div className={styles.timelineConnector} />}
                        </div>
                        
                        <div className={styles.stepContent}>
                          <div className={styles.stepTitleRow}>
                            <h4 className={styles.stepTitleText}>{stepItem.label}</h4>
                            {isActive && <span className={styles.activeStepTag}>In Progress</span>}
                          </div>
                          <p className={styles.stepDescription}>{stepItem.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className={styles.tabContentCard}>
                <h3 className={styles.cardHeaderTitle}>Order Receipt</h3>
                <div className={styles.receiptItemList}>
                  {order.items?.map((item, index) => (
                    <div key={index} className={styles.receiptItem}>
                      <div className={styles.receiptItemTitleRow}>
                        <span className={styles.itemQtyBadge}>{item.quantity || 1}x</span>
                        <div>
                          <p className={styles.receiptItemName}>{item.name}</p>
                          {item.restaurant && <span className={styles.receiptItemRest}>{item.restaurant}</span>}
                        </div>
                      </div>
                      <span className={styles.receiptItemPrice}>₹{item.price * (item.quantity || 1)}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.receiptDivider}></div>

                <div className={styles.receiptSummaryRows}>
                  <div className={styles.receiptRow}>
                    <span>Subtotal</span>
                    <span>₹{order.totals?.subtotal}</span>
                  </div>
                  <div className={styles.receiptRow}>
                    <span>Delivery Fee</span>
                    <span>{order.totals?.deliveryFee === 0 ? 'FREE' : `₹${order.totals?.deliveryFee}`}</span>
                  </div>
                  <div className={styles.receiptRow}>
                    <span>Platform Fee</span>
                    <span>₹{order.totals?.platformFee}</span>
                  </div>
                  <div className={styles.receiptRow}>
                    <span>GST</span>
                    <span>₹{order.totals?.gst}</span>
                  </div>
                  
                  <div className={styles.receiptDividerThin}></div>

                  <div className={`${styles.receiptRow} ${styles.finalTotalRow}`}>
                    <span>Grand Total</span>
                    <span>₹{order.totals?.total}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Delivery Address Card */}
            <div className={styles.secondaryDetailsCard}>
              <h4 className={styles.detailCardLabel}>DELIVERY ADDRESS</h4>
              <div className={styles.addressSection}>
                <div className={styles.iconPinCircle}>📍</div>
                <div>
                  <h4 className={styles.recipientName}>{order.delivery?.name || 'Customer'}</h4>
                  <p className={styles.deliveryPhone}>{order.delivery?.phone}</p>
                  <p className={styles.fullAddressText}>
                    {order.delivery?.address}
                    {order.delivery?.landmark && `, Near ${order.delivery.landmark}`}
                  </p>
                  <p className={styles.addressCityZip}>{order.delivery?.city} - {order.delivery?.pincode}</p>
                </div>
              </div>
            </div>

            {/* Payment Details Card */}
            <div className={styles.secondaryDetailsCard}>
              <h4 className={styles.detailCardLabel}>PAYMENT DETAILS</h4>
              <div className={styles.paymentSection}>
                <div className={styles.paymentIconBox}>💳</div>
                <div className={styles.paymentMeta}>
                  <span className={styles.payMethodText}>{order.paymentMethod?.toLowerCase()}</span>
                  <span className={styles.txnIdText}>TXN{order.id}</span>
                </div>
                <span className={styles.paymentSuccessBadge}>SUCCESS</span>
              </div>
            </div>

            {/* Bottom Nav Actions */}
            <div className={styles.bottomNavActionsRow}>
              <Link href="/services/swadisht/orders" className={styles.navSelectionBtn}>
                My Selection
              </Link>
              <Link href="/services/swadisht" className={styles.navExploreBtn}>
                Explore More Styles
              </Link>
            </div>

            {/* Cancel Action Option */}
            {canCancel ? (
              <button onClick={() => setShowCancelModal(true)} className={styles.cancelLinkAction}>
                ❌ Cancel Order
              </button>
            ) : (
              <span className={styles.cancelLockedText}>🔒 Order is confirmed & locked for delivery</span>
            )}
          </div>
        </div>

        {/* Feedback banner for delivered state */}
        {isDelivered && !showFeedback && (
          <div className={styles.feedbackBanner}>
            <div className={styles.feedbackText}>
              <h3>How was your Swadishtt Experience?</h3>
              <p>Your delivery arrived successfully! Let us know how you liked the service.</p>
            </div>
            <div className={styles.feedbackActionArea}>
              <button onClick={() => setShowFeedback(true)} className={styles.feedbackPrimaryBtn}>
                Rate Delivery
              </button>
            </div>
          </div>
        )}

        {/* Feedback Star Overlay Modal */}
        {showFeedback && (
          <div className={styles.modalOverlay}>
            <div className={styles.feedbackModal}>
              <span className={styles.modalEmoji}>⭐</span>
              <h2>Rate Your Delivery Partner</h2>
              <p>How would you rate your interaction with {mockRiderData.rider.name}?</p>
              
              <div className={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star} 
                    className={`${styles.starBtn} ${feedbackRating >= star ? styles.starSelected : ''}`}
                    onClick={() => setFeedbackRating(star)}
                  >
                    ★
                  </button>
                ))}
              </div>

              <div className={styles.modalActions}>
                <button 
                  onClick={() => {
                    alert('Thank you for rating! We shared your appreciation with Rahul.');
                    setShowFeedback(false);
                  }} 
                  className={styles.modalPrimaryBtn}
                >
                  Submit Rating
                </button>
                <button onClick={() => setShowFeedback(false)} className={styles.modalSecondaryBtn}>
                  Skip
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Call Rider Trigger */}
        {showRiderCallModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalCard}>
              <div className={styles.phoneIconRing}>📞</div>
              <h3>Calling {mockRiderData.rider.name}</h3>
              <p className={styles.modalPhoneNumber}>{mockRiderData.rider.phone}</p>
              <p className={styles.modalHint}>This initiates a masked personal call line to your active delivery partner.</p>
              
              <div className={styles.modalActions}>
                <button onClick={() => setShowRiderCallModal(false)} className={styles.modalCancelBtn}>
                  Dismiss Call
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Confirm Cancel */}
        {showCancelModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalCard}>
              <div className={styles.dangerIcon}>⚠️</div>
              <h3>Cancel Swadishtt Order</h3>
              <p>Are you sure you want to cancel this order? This action is permanent.</p>
              
              <div className={styles.modalActions}>
                <button onClick={handleCancelOrder} className={styles.modalConfirmBtn}>
                  Yes, Cancel Order
                </button>
                <button onClick={() => setShowCancelModal(false)} className={styles.modalDismissBtn}>
                  No, Keep Order
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}