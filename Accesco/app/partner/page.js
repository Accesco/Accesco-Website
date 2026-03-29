'use client';


import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './partnership.css';

export default function BrandPartnership() {
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
      <Link href="/" className="logo-container">
        <Image src="/images/accesco_original.png" alt="AccesCo" className="logo-img" width={65} height={65} />
        <div className="logo-text">AccesCo Living</div>
      </Link>

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
