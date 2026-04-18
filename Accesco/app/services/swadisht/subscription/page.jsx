'use client';

/**
 * Subscription Plans Page
 * @page /services/swadisht/subscription
 * @description EatClub-style subscription plans
 */

import { useState } from 'react';
import Link from 'next/link';
import { SwadishttProvider } from '../contexts/SwadishttContext';
import SwadishttHeader from '../components/SwadishttHeader';
import styles from './subscription.module.css';

const SUBSCRIPTION_PLANS = [
  {
    id: 'basic',
    name: 'Swadishtt Basic',
    price: 99,
    duration: 'month',
    popular: false,
    color: '#1976D2',
    benefits: [
      '10% off on all orders',
      'Free delivery on orders above ₹199',
      'Priority customer support',
      'Early access to new restaurants',
      'Birthday special discount'
    ],
    savings: 'Save up to ₹500/month'
  },
  {
    id: 'premium',
    name: 'Swadishtt Premium',
    price: 299,
    duration: 'month',
    popular: true,
    color: '#E23744',
    benefits: [
      '20% off on all orders',
      'Free delivery on all orders',
      'Exclusive restaurant access',
      'Early access to new features',
      '1 free meal per month (up to ₹300)',
      'Priority customer support',
      'No surge pricing',
      'Special festival offers'
    ],
    savings: 'Save up to ₹1500/month'
  },
  {
    id: 'corporate',
    name: 'Swadishtt Corporate',
    price: 'Custom',
    duration: 'annual',
    popular: false,
    color: '#7B1FA2',
    benefits: [
      'Bulk meal ordering',
      'Employee meal credits',
      'Custom meal plans',
      'Dedicated account manager',
      'Analytics dashboard',
      'Flexible billing',
      'Team coordination tools',
      'Priority delivery'
    ],
    savings: 'Custom pricing for teams'
  }
];

const FAQ_ITEMS = [
  {
    question: 'How does the subscription work?',
    answer: 'Subscribe to any plan and enjoy the benefits immediately. Your subscription renews automatically each month/year. You can cancel anytime.'
  },
  {
    question: 'Can I cancel my subscription?',
    answer: 'Yes, you can cancel your subscription anytime from your account settings. You\'ll continue to enjoy benefits until the end of your billing period.'
  },
  {
    question: 'What happens to my free meal credit?',
    answer: 'Premium members get 1 free meal credit (up to ₹300) every month. Unused credits expire at the end of the month and don\'t roll over.'
  },
  {
    question: 'Is there a minimum order value?',
    answer: 'No minimum order value for Premium members. Basic members need to order above ₹199 for free delivery.'
  },
  {
    question: 'Can I upgrade or downgrade my plan?',
    answer: 'Yes, you can change your plan anytime. The new benefits will apply immediately, and billing will be adjusted accordingly.'
  }
];

function PlanCard({ plan, onSubscribe }) {
  return (
    <div className={`${styles.planCard} ${plan.popular ? styles.popularPlan : ''}`}>
      {plan.popular && (
        <div className={styles.popularBadge}>⭐ Most Popular</div>
      )}
      
      <div className={styles.planHeader} style={{ borderTopColor: plan.color }}>
        <h3 className={styles.planName}>{plan.name}</h3>
        <div className={styles.planPrice}>
          {plan.price === 'Custom' ? (
            <span className={styles.customPrice}>Custom Pricing</span>
          ) : (
            <>
              <span className={styles.currency}>₹</span>
              <span className={styles.amount}>{plan.price}</span>
              <span className={styles.period}>/{plan.duration}</span>
            </>
          )}
        </div>
        <div className={styles.savings}>{plan.savings}</div>
      </div>
      
      <div className={styles.planBenefits}>
        {plan.benefits.map((benefit, idx) => (
          <div key={idx} className={styles.benefit}>
            <svg className={styles.checkIcon} style={{ color: plan.color }} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <span>{benefit}</span>
          </div>
        ))}
      </div>
      
      <button 
        className={styles.subscribeBtn}
        style={{ background: plan.color }}
        onClick={() => onSubscribe(plan)}
      >
        {plan.price === 'Custom' ? 'Contact Sales' : 'Subscribe Now'}
      </button>
    </div>
  );
}

function ComparisonTable() {
  const features = [
    { name: 'Discount on orders', basic: '10%', premium: '20%', corporate: 'Custom' },
    { name: 'Free delivery', basic: 'Above ₹199', premium: 'All orders', corporate: 'All orders' },
    { name: 'Free meal credit', basic: '—', premium: '₹300/month', corporate: 'Custom' },
    { name: 'Priority support', basic: '✓', premium: '✓', corporate: '✓' },
    { name: 'No surge pricing', basic: '—', premium: '✓', corporate: '✓' },
    { name: 'Exclusive restaurants', basic: '—', premium: '✓', corporate: '✓' },
    { name: 'Analytics dashboard', basic: '—', premium: '—', corporate: '✓' },
    { name: 'Dedicated manager', basic: '—', premium: '—', corporate: '✓' }
  ];

  return (
    <div className={styles.comparisonSection}>
      <h2 className={styles.sectionTitle}>Compare Plans</h2>
      <div className={styles.comparisonTable}>
        <div className={styles.tableHeader}>
          <div className={styles.featureCol}>Features</div>
          <div className={styles.planCol}>Basic</div>
          <div className={styles.planCol}>Premium</div>
          <div className={styles.planCol}>Corporate</div>
        </div>
        {features.map((feature, idx) => (
          <div key={idx} className={styles.tableRow}>
            <div className={styles.featureCol}>{feature.name}</div>
            <div className={styles.planCol}>{feature.basic}</div>
            <div className={styles.planCol}>{feature.premium}</div>
            <div className={styles.planCol}>{feature.corporate}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className={styles.faqSection}>
      <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
      <div className={styles.faqList}>
        {FAQ_ITEMS.map((item, idx) => (
          <div key={idx} className={styles.faqItem}>
            <button
              className={styles.faqQuestion}
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            >
              <span>{item.question}</span>
              <svg 
                className={`${styles.faqIcon} ${openIndex === idx ? styles.open : ''}`}
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </button>
            {openIndex === idx && (
              <div className={styles.faqAnswer}>{item.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleSubscribe = (plan) => {
    if (plan.price === 'Custom') {
      window.location.href = '/contact';
    } else {
      alert(`Subscribing to ${plan.name}. Payment integration would go here.`);
    }
  };

  return (
    <SwadishttProvider>
      <div className={styles.page}>
        <SwadishttHeader />
        
        <div className={styles.hero}>
          <div className={styles.container}>
            <h1 className={styles.heroTitle}>Save More with Swadishtt Subscription</h1>
            <p className={styles.heroSubtitle}>
              Enjoy exclusive benefits, discounts, and free delivery on every order
            </p>
            <div className={styles.heroBadges}>
              <span className={styles.heroBadge}>💰 Save up to ₹1500/month</span>
              <span className={styles.heroBadge}>🚚 Free Delivery</span>
              <span className={styles.heroBadge}>⭐ Exclusive Access</span>
            </div>
          </div>
        </div>
        
        <div className={styles.container}>
          <div className={styles.plansSection}>
            <h2 className={styles.sectionTitle}>Choose Your Plan</h2>
            <div className={styles.plansGrid}>
              {SUBSCRIPTION_PLANS.map(plan => (
                <PlanCard key={plan.id} plan={plan} onSubscribe={handleSubscribe} />
              ))}
            </div>
          </div>
          
          <ComparisonTable />
          
          <div className={styles.howItWorks}>
            <h2 className={styles.sectionTitle}>How It Works</h2>
            <div className={styles.stepsGrid}>
              <div className={styles.step}>
                <div className={styles.stepNumber}>1</div>
                <h3 className={styles.stepTitle}>Choose a Plan</h3>
                <p className={styles.stepDesc}>Select the subscription that fits your needs</p>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>2</div>
                <h3 className={styles.stepTitle}>Subscribe</h3>
                <p className={styles.stepDesc}>Complete payment and activate instantly</p>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>3</div>
                <h3 className={styles.stepTitle}>Start Saving</h3>
                <p className={styles.stepDesc}>Enjoy benefits on every order immediately</p>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>4</div>
                <h3 className={styles.stepTitle}>Manage Anytime</h3>
                <p className={styles.stepDesc}>Upgrade, downgrade, or cancel from your account</p>
              </div>
            </div>
          </div>
          
          <FAQSection />
        </div>
      </div>
    </SwadishttProvider>
  );
}
