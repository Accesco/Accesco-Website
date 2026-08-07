'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AccescoHeader from '../../../components/AccescoHeader';
import Footer from '../../../components/Footer';
import './vendor.css';

export default function PartnerAsVendor() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    businessType: '',
    address: '',
    city: '',
    pincode: '',
    gst: '',
    fssai: '',
    experience: '',
    description: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleD2CSelect = (service) => {
    if (service === 'grokly') {
      router.push('/services/grokly');
    } else if (service === 'instastyle') {
      router.push('/services/instastyle');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/partner/vendor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          businessName: '',
          ownerName: '',
          email: '',
          phone: '',
          businessType: '',
          address: '',
          city: '',
          pincode: '',
          gst: '',
          fssai: '',
          experience: '',
          description: ''
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <AccescoHeader />
      <div className="vendor-page">
        {/* Hero Section */}
        <section className="vendor-hero-section">
          <div className="vendor-hero-background">
            <div className="vendor-gradient-orb vendor-orb-1"></div>
            <div className="vendor-gradient-orb vendor-orb-2"></div>
          </div>
          <div className="vendor-hero-content">
          
            <h1 className="vendor-hero-title">
              Grow Your Business with
              <span className="vendor-gradient-text"> Accesco</span>
            </h1>
            <p className="vendor-hero-subtitle">
              Join India's fastest-growing lifestyle platform. Reach millions of customers and scale your business effortlessly.
            </p>
            <p className="vendor-hero-description">
              Accesco Living connects dark stores, restaurants, and D2C brands directly
              with households across Bengaluru through Grokly, Swadishtt, and InstaStyle.
              Fill out the application below and our partnerships team will review your
              business and get back to you within 2–3 business days.
            </p>
            
          </div>
        </section>

        {/* Business Types Info */}
        <section className="vendor-types-section">
          <div className="vendor-section-header">
            <span className="vendor-section-tag">Partner Categories</span>
            <h2 className="vendor-section-title">We Support All Business Types</h2>
          </div>

          <div className="vendor-types-grid">
            <div className="vendor-type-card">
              <div className="vendor-type-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <rect x="8" y="12" width="32" height="28" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 20H40" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="16" cy="28" r="2" fill="currentColor"/>
                  <circle cx="24" cy="28" r="2" fill="currentColor"/>
                  <circle cx="32" cy="28" r="2" fill="currentColor"/>
                </svg>
              </div>
              <h3>Dark Store</h3>
              <p>Quick commerce fulfillment centers for rapid delivery operations</p>
              <ul className="vendor-type-features">
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  10-minute delivery
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Inventory management
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Real-time tracking
                </li>
              </ul>
            </div>

            <div className="vendor-type-card">
              <div className="vendor-type-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <path d="M24 8C16 8 12 12 12 20V40H36V20C36 12 32 8 24 8Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M18 24H30" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M18 30H30" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3>QSR (Quick Service Restaurant)</h3>
              <p>Fast food restaurants and quick service food outlets</p>
              <ul className="vendor-type-features">
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Online ordering
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Menu management
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Customer reviews
                </li>
              </ul>
            </div>

            <div className="vendor-type-card">
              <div className="vendor-type-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <rect x="8" y="14" width="32" height="26" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 22H40" stroke="currentColor" strokeWidth="2"/>
                  <path d="M24 14V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="18" cy="30" r="2" fill="currentColor"/>
                  <circle cx="30" cy="30" r="2" fill="currentColor"/>
                </svg>
              </div>
              <h3>D2C Brand</h3>
              <p>Direct-to-consumer brands selling products online</p>
              <ul className="vendor-type-features">
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Multi-category support
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Brand storefront
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Marketing tools
                </li>
              </ul>
            </div>
          </div>

         
        </section>

        {/* Application Form */}
        <section className="vendor-form-section" id="application-form">
          <div className="vendor-form-container">
            <div className="vendor-form-header">
              <span className="vendor-form-tag">Partner Application</span>
              <h2 className="vendor-form-title">Start Your Partnership Journey</h2>
              <p className="vendor-form-subtitle">Fill in your business details and we'll get back to you within 2-3 business days</p>
            </div>

            <form onSubmit={handleSubmit} className="vendor-application-form">
              <div className="vendor-form-grid">
                <div className="vendor-form-field">
                  <label htmlFor="businessName">Business Name *</label>
                  <input
                    type="text"
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="Your business name"
                    required
                  />
                </div>

                <div className="vendor-form-field">
                  <label htmlFor="ownerName">Owner Name *</label>
                  <input
                    type="text"
                    id="ownerName"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    placeholder="Owner's full name"
                    required
                  />
                </div>

                <div className="vendor-form-field">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="business@email.com"
                    required
                  />
                </div>

                <div className="vendor-form-field">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 XXXXX XXXXX"
                    required
                  />
                </div>

                <div className="vendor-form-field">
                  <label htmlFor="businessType">Business Type *</label>
                  <select
                    id="businessType"
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                    required
                  >
                    <option value="">Select Business Type</option>
                    <option value="darkstore">Dark Store</option>
                    <option value="qsr">QSR (Quick Service Restaurant)</option>
                    <option value="d2c">D2C Brand</option>
                  </select>
                </div>

                <div className="vendor-form-field">
                  <label htmlFor="experience">Years in Business *</label>
                  <select
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    required
                  >
                    <option value="">Select Experience</option>
                    <option value="new">New Business</option>
                    <option value="1-2">1-2 years</option>
                    <option value="2-5">2-5 years</option>
                    <option value="5+">5+ years</option>
                  </select>
                </div>
              </div>

              <div className="vendor-form-field full-width">
                <label htmlFor="address">Business Address *</label>
                <input
                  type="text"
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Complete address"
                  required
                />
              </div>

              <div className="vendor-form-grid">
                <div className="vendor-form-field">
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="City"
                    required
                  />
                </div>

                <div className="vendor-form-field">
                  <label htmlFor="pincode">Pincode *</label>
                  <input
                    type="text"
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    placeholder="6-digit pincode"
                    required
                  />
                </div>

                <div className="vendor-form-field">
                  <label htmlFor="gst">GST Number</label>
                  <input
                    type="text"
                    id="gst"
                    value={formData.gst}
                    onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
                    placeholder="GST Number (if applicable)"
                  />
                </div>

                <div className="vendor-form-field">
                  <label htmlFor="fssai">FSSAI License (for QSR)</label>
                  <input
                    type="text"
                    id="fssai"
                    value={formData.fssai}
                    onChange={(e) => setFormData({ ...formData, fssai: e.target.value })}
                    placeholder="FSSAI License Number"
                  />
                </div>
              </div>

              <div className="vendor-form-field full-width">
                <label htmlFor="description">Business Description</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="4"
                  placeholder="Tell us about your business, products, and services"
                ></textarea>
              </div>

              {submitStatus === 'success' && (
                <div className="vendor-alert vendor-alert-success">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10L8 14L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Application submitted successfully! We'll contact you within 2-3 business days.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="vendor-alert vendor-alert-error">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 10L10 6M10 14L10 13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Something went wrong. Please try again.
                </div>
              )}

              <button type="submit" className="vendor-submit-button" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="vendor-spinner"></span>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                  </>
                )}
              </button>
            </form>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="vendor-benefits-section">
          <div className="vendor-section-header">
            <span className="vendor-section-tag">Why Partner With Us</span>
            <h2 className="vendor-section-title">Grow Your Business with accesco</h2>
          </div>

          <div className="vendor-benefits-grid">
            <div className="vendor-benefit-card">
              <div className="vendor-benefit-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
              </div>
              <h3>Increase Revenue</h3>
              <p>
                Access millions of customers and boost your sales by up to 3x by listing
                your business in front of shoppers already ordering daily on Grokly,
                Swadishtt, and InstaStyle.
              </p>
            </div>
            <div className="vendor-benefit-card">
              <div className="vendor-benefit-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
              </div>
              <h3>Marketing Support</h3>
              <p>
                Featured listings, promotional campaigns, and targeted advertising help
                new partners get discovered fast, without having to run their own
                acquisition marketing.
              </p>
            </div>
            <div className="vendor-benefit-card">
              <div className="vendor-benefit-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
              </div>
              <h3>Quick Settlements</h3>
              <p>
                Fast and transparent payment processing with weekly payouts, so cash
                flow never becomes a bottleneck for growing your operation.
              </p>
            </div>
            <div className="vendor-benefit-card">
              <div className="vendor-benefit-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
              </div>
              <h3>Business Analytics</h3>
              <p>
                A real-time insights and performance tracking dashboard shows order
                volume, customer ratings, and revenue trends as they happen.
              </p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}