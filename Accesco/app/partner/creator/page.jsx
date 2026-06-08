'use client';

import { useState } from 'react';
import AccescoHeader from '../../../components/AccescoHeader';
import Footer from '../../../components/Footer';
import './creator.css';

export default function PartnerAsCreator() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    instagram: '',
    youtube: '',
    category: '',
    followers: '',
    city: '',
    contentType: [],
    experience: '',
    portfolio: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleCheckboxChange = (value) => {
    setFormData(prev => ({
      ...prev,
      contentType: prev.contentType.includes(value)
        ? prev.contentType.filter(type => type !== value)
        : [...prev.contentType, value]
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
          'Form Type': 'Creator Partnership',
          'Full Name': formData.fullName,
          '_replyto': formData.email,
          'Phone': formData.phone,
          'Instagram': formData.instagram,
          'YouTube': formData.youtube,
          'Category': formData.category,
          'Followers': formData.followers,
          'City': formData.city,
          'Content Type': formData.contentType.join(', '),
          'Experience': formData.experience,
          'Portfolio': formData.portfolio,
          '_subject': 'New Creator Partnership Application!'
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          instagram: '',
          youtube: '',
          category: '',
          followers: '',
          city: '',
          contentType: [],
          experience: '',
          portfolio: ''
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
      <div className="creator-page">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-background">
            <div className="gradient-orb orb-1"></div>
            <div className="gradient-orb orb-2"></div>
            <div className="gradient-orb orb-3"></div>
          </div>
          <div className="hero-content">
            <h1 className="hero-title">
              Turn Your Passion Into
              <span className="gradient-text"> Profit</span>
            </h1>
            <p className="hero-subtitle">
              Partner with accesco living and unlock unlimited earning potential. 
              Create content, build your brand, and get paid for what you love.
            </p>
            
            <div className="hero-cta">
              <button className="cta-primary" onClick={() => document.getElementById('application-form').scrollIntoView({ behavior: 'smooth' })}>
                Start Your Journey
              </button>
              
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="benefits-section">
          <div className="section-header">
            <span className="section-tag">Why Choose Us</span>
            <h2 className="section-title">India solved delivery in 10 minutes. Nobody solved the household in 10 years.</h2>
            <p className="section-subtitle">
              We provide the tools, support, and opportunities to help you grow your creator business
            </p>
          </div>
          
          <div className="benefits-grid">
            <div className="benefit-card card-purple">
              <div className="benefit-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M16 4L20 12L28 13.5L22 19.5L23.5 28L16 23.5L8.5 28L10 19.5L4 13.5L12 12L16 4Z" fill="currentColor"/>
                </svg>
              </div>
              <h3>Premium Earnings</h3>
              <p>Industry-leading rates with performance bonuses and monthly incentives</p>
              <div className="benefit-highlight">Up to 70% revenue share</div>
            </div>

            <div className="benefit-card card-blue">
              <div className="benefit-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 10V16L20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3>Exclusive Brand Deals</h3>
              <p>Access to premium brand partnerships and sponsored content opportunities</p>
              <div className="benefit-highlight">100+ active campaigns</div>
            </div>

            <div className="benefit-card card-green">
              <div className="benefit-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M4 16L12 24L28 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Growth Support</h3>
              <p>Dedicated account manager, analytics dashboard, and content strategy guidance</p>
              <div className="benefit-highlight">24/7 creator support</div>
            </div>

            <div className="benefit-card card-orange">
              <div className="benefit-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M16 4V16M16 16L24 24M16 16L8 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Platform Reach</h3>
              <p>Get featured on our platform and reach millions of engaged users</p>
              <div className="benefit-highlight">5M+ monthly visitors</div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works-section">
          <div className="section-header">
            <span className="section-tag">Simple Process</span>
            <h2 className="section-title">Start Earning in 3 Steps</h2>
          </div>

          <div className="steps-container">
            <div className="step-card">
              <div className="step-number">01</div>
              <div className="step-content">
                <h3>Apply & Get Verified</h3>
                <p>Fill out the application form and our team will review your profile within 48 hours</p>
              </div>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <div className="step-content">
                <h3>Create Content</h3>
                <p>Start creating amazing content and collaborate with top brands on our platform</p>
              </div>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <div className="step-content">
                <h3>Get Paid</h3>
                <p>Receive weekly payouts directly to your bank account with transparent tracking</p>
              </div>
            </div>
          </div>
        </section>

        {/* Application Form Section */}
        <section className="form-section" id="application-form">
          <div className="form-container">
            <div className="form-header">
              <span className="form-tag">Ready to Start?</span>
              <h2 className="form-title">Apply Now</h2>
              <p className="form-subtitle">Join thousands of creators earning with accesco living</p>
            </div>

            <form onSubmit={handleSubmit} className="application-form">
              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="fullName">Full Name *</label>
                  <input
                    type="text"
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div className="form-field">
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

                <div className="form-field">
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Your city"
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="instagram">Instagram Handle</label>
                  <input
                    type="text"
                    id="instagram"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    placeholder="@yourusername"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="youtube">YouTube Channel</label>
                  <input
                    type="text"
                    id="youtube"
                    value={formData.youtube}
                    onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                    placeholder="Channel URL or name"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="category">Content Category *</label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="fashion">Fashion & Style</option>
                    <option value="food">Food & Cooking</option>
                    <option value="lifestyle">Lifestyle</option>
                    <option value="tech">Tech & Gadgets</option>
                    <option value="fitness">Fitness & Health</option>
                    <option value="travel">Travel</option>
                    <option value="beauty">Beauty & Makeup</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="followers">Total Followers *</label>
                  <select
                    id="followers"
                    value={formData.followers}
                    onChange={(e) => setFormData({ ...formData, followers: e.target.value })}
                    required
                  >
                    <option value="">Select Range</option>
                    <option value="1k-10k">1K - 10K</option>
                    <option value="10k-50k">10K - 50K</option>
                    <option value="50k-100k">50K - 100K</option>
                    <option value="100k-500k">100K - 500K</option>
                    <option value="500k+">500K+</option>
                  </select>
                </div>
              </div>

              <div className="form-field full-width">
                <label>Content Type (Select all that apply)</label>
                <div className="checkbox-group">
                  {['reels', 'posts', 'videos', 'stories'].map((type) => (
                    <label key={type} className="checkbox-card">
                      <input
                        type="checkbox"
                        checked={formData.contentType.includes(type)}
                        onChange={() => handleCheckboxChange(type)}
                      />
                      <span className="checkbox-label">
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-field full-width">
                <label htmlFor="experience">Years of Experience *</label>
                <select
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  required
                >
                  <option value="">Select Experience</option>
                  <option value="beginner">Less than 1 year</option>
                  <option value="1-2">1-2 years</option>
                  <option value="2-5">2-5 years</option>
                  <option value="5+">5+ years</option>
                </select>
              </div>

              <div className="form-field full-width">
                <label htmlFor="portfolio">Portfolio/Best Work Link</label>
                <textarea
                  id="portfolio"
                  value={formData.portfolio}
                  onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                  rows="4"
                  placeholder="Share links to your best content or portfolio"
                ></textarea>
              </div>

              {submitStatus === 'success' && (
                <div className="alert alert-success">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10L8 14L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Application submitted successfully! We'll contact you soon.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="alert alert-error">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 10L10 6M10 14L10 13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Something went wrong. Please try again.
                </div>
              )}

              <button type="submit" className="submit-button" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
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
      </div>
      <Footer />
    </>
  );
}
