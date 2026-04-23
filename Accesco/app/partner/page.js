'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import './partnership.css';

export default function BrandPartnership() {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [formData, setFormData] = useState({
    brandName: '',
    email: '',
    collabTypes: [],
    budget: '',
    campaignBrief: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleCheckboxChange = (value) => {
    setFormData(prev => ({
      ...prev,
      collabTypes: prev.collabTypes.includes(value)
        ? prev.collabTypes.filter(type => type !== value)
        : [...prev.collabTypes, value]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('https://formspree.io/f/mdaojdag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'Brand Name': formData.brandName,
          '_replyto': formData.email,
          'Collab Type': formData.collabTypes.join(', '),
          'Budget Range': formData.budget,
          'Campaign Brief': formData.campaignBrief,
          '_subject': 'New Brand Partnership Inquiry!'
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          brandName: '',
          email: '',
          collabTypes: [],
          budget: '',
          campaignBrief: ''
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
    <div className="page-wrapper">
      <nav className="partner-nav">
        <Link href="/" className="logo-container">
          <Image src="/images/accesco_original.png" alt="accesco" className="logo-img" width={65} height={65} />
          <div className="logo-text">Accesco Living</div>
        </Link>

        <div className="partner-dropdown-container">
          <button 
            className="partner-dropdown-btn"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            Partner Programs ▼
          </button>
          {showDropdown && (
            <div className="partner-dropdown-menu">
              <Link href="/partner/creator" className="dropdown-item">
                <span className="dropdown-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.5 1.5"></path><path d="M7.5 9L2 2"></path></svg>
                </span>
                <div>
                  <strong>Partner as Creator</strong>
                  <p>Join as content creator</p>
                </div>
              </Link>
              <Link href="/partner/vendor" className="dropdown-item">
                <span className="dropdown-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                </span>
                <div>
                  <strong>Partner as Vendor</strong>
                  <p>Grow your business</p>
                </div>
              </Link>
              <Link href="/partner/delivery" className="dropdown-item">
                <span className="dropdown-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18.5" cy="17.5" r="3.5"></circle><circle cx="5.5" cy="17.5" r="3.5"></circle><circle cx="9" cy="7.5" r="3.5"></circle><path d="M5.5 17.5v-7.5l3.5-3.5h7.5l3.5 3.5v7.5"></path><line x1="12" y1="7.5" x2="12" y2="17.5"></line></svg>
                </span>
                <div>
                  <strong>Partner as Delivery</strong>
                  <p>Earn flexible income</p>
                </div>
              </Link>
              <Link href="/partner" className="dropdown-item active">
                <span className="dropdown-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                </span>
                <div>
                  <strong>Brand Partnership</strong>
                  <p>Collaborate with us</p>
                </div>
              </Link>
            </div>
          )}
        </div>
      </nav>

      <div className="form-container">
        <h1>Let&apos;s Collaborate</h1>
        <p className="subtitle">
          Partner with us to create something extraordinary. Fill out the details below to start the conversation.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="brand">Brand / Company Name</label>
            <input
              type="text"
              id="brand"
              value={formData.brandName}
              onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
              placeholder="e.g. Nike India"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Work Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="marketing@brand.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Nature of Collaboration</label>
            <div className="checkbox-group">
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={formData.collabTypes.includes('Instagram')}
                  onChange={() => handleCheckboxChange('Instagram')}
                />
                Instagram/Socials
              </label>
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={formData.collabTypes.includes('YouTube')}
                  onChange={() => handleCheckboxChange('YouTube')}
                />
                YouTube Integration
              </label>
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={formData.collabTypes.includes('UGC')}
                  onChange={() => handleCheckboxChange('UGC')}
                />
                UGC Creation
              </label>
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={formData.collabTypes.includes('Ambassador')}
                  onChange={() => handleCheckboxChange('Ambassador')}
                />
                Ambassadorship
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="budget">Estimated Budget (INR)</label>
            <select
              id="budget"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              required
            >
              <option value="">Select Budget Range</option>
              <option value="10k-50k">₹10,000 — ₹50,000</option>
              <option value="50k-1L">₹50,000 — ₹1,00,000</option>
              <option value="1L-5L">₹1,00,000 — ₹5,00,000</option>
              <option value="5L+">₹5,00,000+</option>
              <option value="barter">Barter / Product Exchange</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="details">Campaign Brief</label>
            <textarea
              id="details"
              value={formData.campaignBrief}
              onChange={(e) => setFormData({ ...formData, campaignBrief: e.target.value })}
              rows="4"
              placeholder="Describe your goals and timelines..."
            ></textarea>
          </div>

          {submitStatus === 'success' && (
            <div className="success-message">
              ✓ Thank you! Your inquiry has been submitted successfully.
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="error-message">
              ✗ Something went wrong. Please try again.
            </div>
          )}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
          </button>
        </form>
      </div>
    </div>
  );
}
