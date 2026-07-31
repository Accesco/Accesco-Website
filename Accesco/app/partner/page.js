'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AccescoHeader from '@/components/AccescoHeader';
import usePartnerForm from '@/app/hooks/usePartnerForm';
import './partnership.css';

export default function BrandPartnership() {
  const {
    formData,
    isSubmitting,
    submitStatus,
    errorMessage,
    handleInputChange,
    handleSelectChange,
    toggleCollabType,
    handleSubmit
  } = usePartnerForm();

  const collabOptions = [
    'Instagram / Socials',
    'YouTube Integration',
    'UGC Creation',
    'Ambassadorship',
    'Barter / Exchange'
  ];

  return (
    <div className="page-container">
      <AccescoHeader />

      {/* Main 2-Column Split Content */}
      <main className="split-layout">
        {/* Left Column: Brand Hero Section */}
        <section className="brand-intro-column">
          <div className="waves-overlay"></div>
          
          <div className="brand-intro-content">
            <span className="intro-tag">Partnership Programs</span>
            <h1 className="intro-heading">
              Let&apos;s build <br />
              something great <br />
              <span className="accent-word">together.</span>
            </h1>
            <p className="intro-text">
              At Accesco Living, we believe in the power of partnerships. Collaborate with us and be part of a shared vision for innovative living across India.
            </p>

            <ul className="benefit-list">
              <li>
                <strong>Reach engaged households</strong> across our Grokly grocery,
                Swadishtt food, and InstaStyle fashion audiences with one collaboration.
              </li>
              <li>
                <strong>Flexible collaboration formats</strong> — Instagram and social
                campaigns, YouTube integrations, UGC creation, ambassadorships, or
                straightforward barter/product exchange.
              </li>
              <li>
                <strong>Fast turnaround</strong> — our partnerships team typically responds
                to new brand requests within 48 hours.
              </li>
              <li>
                Not a brand?{' '}
                <Link href="/partner/vendor">List as a vendor</Link>,{' '}
                <Link href="/partner/delivery">join as a delivery partner</Link>, or{' '}
                <Link href="/partner/creator">apply as a creator</Link> using the tabs below.
              </li>
            </ul>

            {/* Real Accesco Logo — white-filtered for dark background */}
            <div className="al-brand-graphic-wrapper">
              <Image
                src="/images/accesco_original.png"
                alt="Accesco Living Logo"
                width={340}
                height={340}
                className="al-brand-logo-img"
                priority
              />
            </div>

            {/* Trust Section */}
            <div className="trust-container">
              <div className="avatar-group">
                <span className="avatar-badge">A</span>
                <span className="avatar-badge">B</span>
                <span className="avatar-badge">C</span>
                <span className="avatar-badge plus-badge">+</span>
              </div>
              <div className="trust-text">
                <strong>Trusted by innovators.</strong>
                <p>Driven by collaboration.</p>
              </div>
            </div>

            {/* Bottom Role Navigation Pills */}
            <div className="role-navigation-pills">
              <Link href="/partner" className="role-pill active">Brand Collab</Link>
              <Link href="/partner/vendor" className="role-pill">Vendor</Link>
              <Link href="/partner/delivery" className="role-pill">Delivery</Link>
              <Link href="/partner/creator" className="role-pill">Creator</Link>
            </div>
          </div>
        </section>

        {/* Right Column: Partnership Request Form */}
        <section className="form-column">
          <div className="form-column-content">
            <span className="form-tag">Brand Collaboration</span>
            <h2 className="form-heading">Partner with Accesco Living</h2>
            <p className="form-subtitle">
              Fill in your details below and our team will get back to you to explore collaboration opportunities.
            </p>
            <p className="form-note-text">
              We work with brands of every size — from single-city D2C labels
              looking for their first retail moment, to established names
              wanting a direct line into households already ordering groceries,
              food, and fashion through Accesco Living every day. Tell us a bit
              about your brand and what you're hoping to achieve, and our
              partnerships team will follow up with next steps, timelines, and
              a proposal tailored to your budget.
            </p>

            <form onSubmit={handleSubmit} className="partnership-form">
              {/* First & Last Name row */}
              <div className="form-row">
                <div className="form-field half-width">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="First Name"
                    required
                  />
                </div>
                <div className="form-field half-width">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Last Name"
                    required
                  />
                </div>
              </div>

              {/* Work Email */}
              <div className="form-field">
                <label htmlFor="email">Work Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@company.com"
                  required
                />
              </div>

              {/* Company / Brand Name */}
              <div className="form-field">
                <label htmlFor="company">Company / Brand Name</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Company / Brand Name"
                  required
                />
              </div>

              {/* Nature of Collaboration pills multi-select */}
              <div className="form-field">
                <label>Nature of Collaboration</label>
                <div className="collab-pills-group">
                  {collabOptions.map((option) => {
                    const isSelected = formData.natureOfCollaboration.includes(option);
                    return (
                      <button
                        key={option}
                        type="button"
                        className={`collab-toggle-pill ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleCollabType(option)}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Estimated Budget dropdown */}
              <div className="form-field">
                <label htmlFor="estimatedBudget">Estimated Budget (INR)</label>
                <div className="select-wrapper">
                  <select
                    id="estimatedBudget"
                    name="estimatedBudget"
                    value={formData.estimatedBudget}
                    onChange={(e) => handleSelectChange('estimatedBudget', e.target.value)}
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
              </div>

              {/* Campaign Brief textarea */}
              <div className="form-field">
                <label htmlFor="campaignBrief">Campaign Brief</label>
                <textarea
                  id="campaignBrief"
                  name="campaignBrief"
                  value={formData.campaignBrief}
                  onChange={handleInputChange}
                  placeholder="Tell us about your brand and collaboration ideas..."
                  rows="4"
                ></textarea>
              </div>

              {/* Feedback and Alerts */}
              {submitStatus === 'success' && (
                <div className="success-toast">
                  <span className="toast-icon">✓</span>
                  <div>
                    <strong>Submission Received!</strong>
                    <p>Thank you. Our partnership team will contact you shortly.</p>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="error-toast">
                  <span className="toast-icon">✗</span>
                  <div>
                    <strong>Oops, something went wrong!</strong>
                    <p>{errorMessage || 'Please fill in all required fields correctly.'}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button 
                type="submit" 
                className="submit-request-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="loader-container">
                    <span className="spinner"></span> Submitting...
                  </span>
                ) : 'Submit Request'}
              </button>
            </form>

            {/* Bottom Stats Row */}
            <div className="form-stats-footer">
              <div className="stat-box">
                <span className="stat-number">150+</span>
                <span className="stat-label">Brand Partners</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">48hr</span>
                <span className="stat-label">Response Time</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">3 Cities</span>
                <span className="stat-label">Live & Expanding</span>
              </div>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}
