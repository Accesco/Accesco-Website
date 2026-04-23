'use client';

import { useState } from 'react';
import AccescoHeader from '../../../components/AccescoHeader';
import Footer from '../../../components/Footer';
import './delivery.css';

export default function PartnerAsDelivery() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    vehicleType: '',
    vehicleNumber: '',
    drivingLicense: '',
    age: '',
    experience: '',
    availability: [],
    ownVehicle: '',
    address: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleCheckboxChange = (value) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.includes(value)
        ? prev.availability.filter(time => time !== value)
        : [...prev.availability, value]
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
          'Form Type': 'Delivery Partner',
          'Full Name': formData.fullName,
          '_replyto': formData.email,
          'Phone': formData.phone,
          'City': formData.city,
          'Vehicle Type': formData.vehicleType,
          'Vehicle Number': formData.vehicleNumber,
          'Driving License': formData.drivingLicense,
          'Age': formData.age,
          'Experience': formData.experience,
          'Availability': formData.availability.join(', '),
          'Own Vehicle': formData.ownVehicle,
          'Address': formData.address,
          '_subject': 'New Delivery Partner Application!'
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          city: '',
          vehicleType: '',
          vehicleNumber: '',
          drivingLicense: '',
          age: '',
          experience: '',
          availability: [],
          ownVehicle: '',
          address: ''
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
      <div className="delivery-page">
        {/* Hero Section */}
        <section className="delivery-hero-section">
          <div className="delivery-hero-background">
            <div className="delivery-gradient-orb delivery-orb-1"></div>
            <div className="delivery-gradient-orb delivery-orb-2"></div>
            <div className="delivery-gradient-orb delivery-orb-3"></div>
          </div>
          <div className="delivery-hero-content">
            
            <h1 className="delivery-hero-title">
              Earn Money on
              <span className="delivery-gradient-text"> Your Schedule</span>
            </h1>
            <p className="delivery-hero-subtitle">
              Become a delivery partner with accesco living. Flexible hours, competitive earnings, and weekly payouts.
            </p>
            
            <div className="delivery-hero-cta">
              <button className="delivery-cta-primary" onClick={() => document.getElementById('delivery-application-form').scrollIntoView({ behavior: 'smooth' })}>
                Start Earning Today
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="delivery-benefits-section">
          <div className="delivery-section-header">
            <span className="delivery-section-tag">Why Deliver With Us</span>
            <h2 className="delivery-section-title">India solved delivery in 10 minutes. Nobody solved the household in 10 years.</h2>
            <p className="delivery-section-subtitle">
              We provide the tools, support, and opportunities to help you maximize your earnings
            </p>
          </div>
          
          <div className="delivery-benefits-grid">
            <div className="delivery-benefit-card card-purple">
              <div className="delivery-benefit-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 10V16L20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3>Flexible Hours</h3>
              <p>Work when you want - full-time or part-time, it's your choice</p>
              <div className="delivery-benefit-highlight">Work on your terms</div>
            </div>

            <div className="delivery-benefit-card card-blue">
              <div className="delivery-benefit-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M8 16L12 20L24 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Weekly Payouts</h3>
              <p>Get paid every week directly to your bank account with transparent tracking</p>
              <div className="delivery-benefit-highlight">Fast settlements</div>
            </div>

            <div className="delivery-benefit-card card-green">
              <div className="delivery-benefit-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M16 4L20 12L28 13.5L22 19.5L23.5 28L16 23.5L8.5 28L10 19.5L4 13.5L12 12L16 4Z" fill="currentColor"/>
                </svg>
              </div>
              <h3>Performance Bonuses</h3>
              <p>Earn extra with peak hour bonuses, incentives, and achievement rewards</p>
              <div className="delivery-benefit-highlight">Up to 50% extra earnings</div>
            </div>

            <div className="delivery-benefit-card card-orange">
              <div className="delivery-benefit-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect x="6" y="10" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M6 16H26" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="20" r="1.5" fill="currentColor"/>
                </svg>
              </div>
              <h3>Insurance Coverage</h3>
              <p>Comprehensive insurance for you and your vehicle during deliveries</p>
              <div className="delivery-benefit-highlight">Full protection</div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="delivery-how-it-works-section">
          <div className="delivery-section-header">
            <span className="delivery-section-tag">Simple Process</span>
            <h2 className="delivery-section-title">Start Earning in 3 Steps</h2>
          </div>

          <div className="delivery-steps-container">
            <div className="delivery-step-card">
              <div className="delivery-step-number">01</div>
              <div className="delivery-step-content">
                <h3>Apply & Get Verified</h3>
                <p>Fill out the application form and our team will verify your documents within 24-48 hours</p>
              </div>
              <div className="delivery-step-arrow">→</div>
            </div>

            <div className="delivery-step-card">
              <div className="delivery-step-number">02</div>
              <div className="delivery-step-content">
                <h3>Start Delivering</h3>
                <p>Download the app, go online, and start accepting delivery orders in your area</p>
              </div>
              <div className="delivery-step-arrow">→</div>
            </div>

            <div className="delivery-step-card">
              <div className="delivery-step-number">03</div>
              <div className="delivery-step-content">
                <h3>Get Paid</h3>
                <p>Receive weekly payouts directly to your bank account with transparent earnings tracking</p>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Benefits Section */}
        <section className="delivery-extra-benefits-section">
          <div className="delivery-section-header">
            <span className="delivery-section-tag">More Benefits</span>
            <h2 className="delivery-section-title">Additional Perks for Partners</h2>
          </div>

          <div className="delivery-extra-benefits-grid">
            <div className="delivery-extra-benefit-card">
              <div className="delivery-extra-benefit-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
              </div>
              <h3>Easy-to-Use App</h3>
              <p>Simple app to manage orders, track earnings, and navigate efficiently</p>
            </div>
            <div className="delivery-extra-benefit-card">
              <div className="delivery-extra-benefit-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
              </div>
              <h3>Smart Order Matching</h3>
              <p>AI-powered system assigns orders based on your location and preferences</p>
            </div>
            <div className="delivery-extra-benefit-card">
              <div className="delivery-extra-benefit-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              </div>
              <h3>24/7 Support</h3>
              <p>Dedicated support team always ready to help with any issues</p>
            </div>
            <div className="delivery-extra-benefit-card">
              <div className="delivery-extra-benefit-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
              </div>
              <h3>Earnings Dashboard</h3>
              <p>Real-time tracking of your earnings, trips, and performance metrics</p>
            </div>
          </div>
        </section>

        {/* Requirements Section */}
        <section className="delivery-requirements-section">
          <div className="delivery-section-header">
            <span className="delivery-section-tag">What You Need</span>
            <h2 className="delivery-section-title">Requirements to Join</h2>
          </div>

          <div className="delivery-requirements-grid">
            <div className="delivery-requirement-card">
              <div className="delivery-requirement-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              </div>
              <h3>Documents</h3>
              <ul>
                <li>Valid Driving License</li>
                <li>Aadhaar Card</li>
                <li>PAN Card</li>
                <li>Bank Account Details</li>
              </ul>
            </div>

            <div className="delivery-requirement-card">
              <div className="delivery-requirement-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18.5" cy="17.5" r="3.5"></circle><circle cx="5.5" cy="17.5" r="3.5"></circle><circle cx="9" cy="7.5" r="3.5"></circle><path d="M5.5 17.5v-7.5l3.5-3.5h7.5l3.5 3.5v7.5"></path><line x1="12" y1="7.5" x2="12" y2="17.5"></line></svg>
              </div>
              <h3>Vehicle</h3>
              <ul>
                <li>Two-wheeler or Bicycle</li>
                <li>Valid RC (for motorized)</li>
                <li>Valid Insurance</li>
                <li>Good working condition</li>
              </ul>
            </div>

            <div className="delivery-requirement-card">
              <div className="delivery-requirement-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
              <h3>Personal</h3>
              <ul>
                <li>Age: 18-60 years</li>
                <li>Smartphone with internet</li>
                <li>Good communication</li>
                <li>Local area knowledge</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Application Form Section */}
        <section className="delivery-form-section" id="delivery-application-form">
          <div className="delivery-form-container">
            <div className="delivery-form-header">
              <span className="delivery-form-tag">Ready to Start?</span>
              <h2 className="delivery-form-title">Apply Now</h2>
              <p className="delivery-form-subtitle">Start your journey as a delivery partner today</p>
            </div>

            <form onSubmit={handleSubmit} className="delivery-application-form">
              <div className="delivery-form-grid">
                <div className="delivery-form-field">
                  <label htmlFor="fullName">Full Name *</label>
                  <input
                    type="text"
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div className="delivery-form-field">
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

                <div className="delivery-form-field">
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

                <div className="delivery-form-field">
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

                <div className="delivery-form-field">
                  <label htmlFor="age">Age *</label>
                  <input
                    type="number"
                    id="age"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="Your age"
                    min="18"
                    max="60"
                    required
                  />
                </div>

                <div className="delivery-form-field">
                  <label htmlFor="drivingLicense">Driving License Number *</label>
                  <input
                    type="text"
                    id="drivingLicense"
                    value={formData.drivingLicense}
                    onChange={(e) => setFormData({ ...formData, drivingLicense: e.target.value })}
                    placeholder="DL Number"
                    required
                  />
                </div>

                <div className="delivery-form-field">
                  <label htmlFor="vehicleType">Vehicle Type *</label>
                  <select
                    id="vehicleType"
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                    required
                  >
                    <option value="">Select Vehicle Type</option>
                    <option value="bicycle">Bicycle</option>
                    <option value="scooter">Scooter</option>
                    <option value="motorcycle">Motorcycle</option>
                    <option value="electric">Electric Vehicle</option>
                  </select>
                </div>

                <div className="delivery-form-field">
                  <label htmlFor="vehicleNumber">Vehicle Number</label>
                  <input
                    type="text"
                    id="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                    placeholder="Vehicle registration number"
                  />
                </div>

                <div className="delivery-form-field">
                  <label htmlFor="ownVehicle">Do you own the vehicle? *</label>
                  <select
                    id="ownVehicle"
                    value={formData.ownVehicle}
                    onChange={(e) => setFormData({ ...formData, ownVehicle: e.target.value })}
                    required
                  >
                    <option value="">Select Option</option>
                    <option value="yes">Yes, I own it</option>
                    <option value="no">No, it's rented</option>
                  </select>
                </div>

                <div className="delivery-form-field">
                  <label htmlFor="experience">Delivery Experience</label>
                  <select
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  >
                    <option value="">Select Experience</option>
                    <option value="none">No experience</option>
                    <option value="less-1">Less than 1 year</option>
                    <option value="1-2">1-2 years</option>
                    <option value="2+">2+ years</option>
                  </select>
                </div>
              </div>

              <div className="delivery-form-field full-width">
                <label>Availability (Select all that apply) *</label>
                <div className="delivery-checkbox-group">
                  {[
                    { value: 'morning', label: 'Morning (6 AM - 12 PM)' },
                    { value: 'afternoon', label: 'Afternoon (12 PM - 6 PM)' },
                    { value: 'evening', label: 'Evening (6 PM - 10 PM)' },
                    { value: 'night', label: 'Night (10 PM - 2 AM)' }
                  ].map((slot) => (
                    <label key={slot.value} className="delivery-checkbox-card">
                      <input
                        type="checkbox"
                        checked={formData.availability.includes(slot.value)}
                        onChange={() => handleCheckboxChange(slot.value)}
                      />
                      <span className="delivery-checkbox-label">{slot.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="delivery-form-field full-width">
                <label htmlFor="address">Current Address *</label>
                <textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows="3"
                  placeholder="Your complete address"
                  required
                ></textarea>
              </div>

              {submitStatus === 'success' && (
                <div className="delivery-alert delivery-alert-success">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10L8 14L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Application submitted successfully! We'll contact you within 24-48 hours.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="delivery-alert delivery-alert-error">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 10L10 6M10 14L10 13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Something went wrong. Please try again.
                </div>
              )}

              <button type="submit" className="delivery-submit-button" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="delivery-spinner"></span>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
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
