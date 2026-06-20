'use client';

import AccescoHeader from '../../components/AccescoHeader';

import './contact.css';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ 
    fullName: '', 
    email: '', 
    category: '', 
    message: '' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ fullName: '', email: '', category: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
      
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <AccescoHeader />
      
      <main className="contact-page">
        {/* Hero Section */}
        <section className="contact-hero">
          <div className="contact-container">
            <div className="hero-content">
              <h1 className="hero-title">We would love to hear from you!
</h1>
              <p className="hero-description">
                Have a question or need support? Our team is here to help you.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Methods & Form Section */}
        <section className="contact-main-section">
          <div className="contact-container">
            <div className="contact-layout">
              {/* Left Side - Contact Methods */}
              <div className="contact-methods">
      

                  <div className="methods-list">
                  <div className="method-card">
                    <div className="method-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M3 8L10.89 13.26C11.5 13.67 12.5 13.67 13.11 13.26L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="method-content">
                      <h3>Email</h3>
                      <a href="mailto:support@accescoliving.com" className="method-link">
                        support@accescoliving.com
                      </a>
                      <span className="method-note">We'll respond within 24 hours</span>
                    </div>
                  </div>

                  <div className="method-card">
                    <div className="method-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="method-content">
                      <h3>Phone</h3>
                      <p>Mon – Sat, 9AM – 6PM IST</p>
                      <span className="method-note">Available for urgent queries</span>
                    </div>
                  </div>

                  <div className="method-card method-card-map">
                    <div className="method-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M17.657 16.657L13.414 20.9C13.039 21.275 12.535 21.487 12.01 21.487C11.485 21.487 10.981 21.275 10.606 20.9L6.343 16.657C5.22422 15.5381 4.46234 14.1127 4.15369 12.5608C3.84504 11.009 4.00349 9.40047 4.60901 7.93868C5.21452 6.4769 6.2399 5.22749 7.55548 4.34846C8.87107 3.46943 10.4178 3 12 3C13.5822 3 15.1289 3.46943 16.4445 4.34846C17.7601 5.22749 18.7855 6.4769 19.391 7.93868C19.9965 9.40047 20.155 11.009 19.8463 12.5608C19.5377 14.1127 18.7758 15.5381 17.657 16.657V16.657Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="method-content">
                      <h3>Office Location</h3>
                      <p>Bengaluru, Karnataka, India</p>
                      <div className="map-embed">
                        <iframe
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d497698.77490949034!2d77.3507609!3d12.9539974!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1234567890"
                          width="100%"
                          height="200"
                          style={{ border: 0, borderRadius: '8px', marginTop: '12px' }}
                          allowFullScreen=""
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          title="accesco living Office Location"
                        ></iframe>
                      </div>
                    </div>
                  </div>

                  <div className="method-card">
                    <div className="method-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="method-content">
                      <h3>Response Time</h3>
                      <p>Usually within 2-4 hours</p>
                      <span className="method-note">During business hours</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Contact Form */}
              <div className="contact-form-wrapper">
                <div className="form-header">
                  <h2>Send us a message</h2>
                  <p>Fill out the form below and we'll get back to you as soon as possible.</p>
                </div>

                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="fullName">Full Name</label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        className="form-input"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-input"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                      id="category"
                      name="category"
                      className="form-input"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="orders">Order Issues</option>
                      <option value="dining">Dining Reservations</option>
                      <option value="technical">Technical Support</option>
                      <option value="payments">Payments & Refunds</option>
                      <option value="partnership">Partnership Inquiry</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      className="form-input"
                      placeholder="Please describe your request in detail..."
                      rows="6"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                    <span className="char-count">{formData.message.length} characters</span>
                  </div>

                  <button type="submit" className="submit-button" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>

                  <p className="form-note">
                    We respect your privacy. Your information will never be shared with third parties.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Social Links */}
        <section className="social-section">
          <div className="contact-container">
            <h3>Connect with us</h3>
            <div className="social-links">
              <a href="https://www.instagram.com/accescoliving" target="_blank" rel="noopener noreferrer" className="social-link">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M14.5 1H5.5C3.01472 1 1 3.01472 1 5.5V14.5C1 16.9853 3.01472 19 5.5 19H14.5C16.9853 19 19 16.9853 19 14.5V5.5C19 3.01472 16.9853 1 14.5 1Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13 9.5C13.1234 10.3766 12.9812 11.2736 12.5937 12.0609C12.2062 12.8482 11.5931 13.4874 10.8416 13.8892C10.0901 14.291 9.23734 14.4357 8.39661 14.3023C7.55588 14.1689 6.77548 13.7641 6.17157 13.1464C5.56766 12.5286 5.17283 11.7373 5.04945 10.8916C4.92608 10.0459 5.08079 9.18755 5.49254 8.43135C5.90429 7.67515 6.55345 7.05925 7.34802 6.67172C8.14259 6.28419 9.04654 6.14201 9.93 6.26501C10.8336 6.39101 11.6708 6.78509 12.3207 7.39351C12.9706 8.00193 13.3993 8.79501 13.55 9.66001" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 5H15.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Instagram
              </a>
              <a href="https://x.com/accesco_living" target="_blank" rel="noopener noreferrer" className="social-link">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M15.751 2H18.818L12.117 9.757L20 18H13.828L8.995 12.347L3.464 18H0.395L7.561 9.731L0 2H6.328L10.698 7.137L15.751 2ZM14.675 16.337H16.374L5.404 3.731H3.581L14.675 16.337Z" fill="currentColor"/>
                </svg>
                Twitter
              </a>
              <a href="https://www.youtube.com/@accescoliving" target="_blank" rel="noopener noreferrer" className="social-link">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M19.615 5.481C19.488 4.99 19.234 4.542 18.878 4.178C18.522 3.814 18.078 3.548 17.591 3.408C16.064 3 10 3 10 3C10 3 3.936 3 2.409 3.408C1.922 3.548 1.478 3.814 1.122 4.178C0.766 4.542 0.512 4.99 0.385 5.481C0 7.042 0 10.333 0 10.333C0 10.333 0 13.624 0.385 15.185C0.512 15.676 0.766 16.124 1.122 16.488C1.478 16.852 1.922 17.118 2.409 17.258C3.936 17.666 10 17.666 10 17.666C10 17.666 16.064 17.666 17.591 17.258C18.078 17.118 18.522 16.852 18.878 16.488C19.234 16.124 19.488 15.676 19.615 15.185C20 13.624 20 10.333 20 10.333C20 10.333 20 7.042 19.615 5.481Z" fill="currentColor"/>
                  <path d="M8 13.333L13.2 10.333L8 7.333V13.333Z" fill="white"/>
                </svg>
                YouTube
              </a>
              <a href="https://www.linkedin.com/company/acceso-living/" target="_blank" rel="noopener noreferrer" className="social-link">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M18.5195 0H1.47656C0.660156 0 0 0.644531 0 1.44141V18.5547C0 19.3516 0.660156 20 1.47656 20H18.5195C19.3359 20 20 19.3516 20 18.5586V1.44141C20 0.644531 19.3359 0 18.5195 0ZM5.93359 17.043H2.96484V7.49609H5.93359V17.043ZM4.44922 6.19531C3.49609 6.19531 2.72656 5.42578 2.72656 4.47656C2.72656 3.52734 3.49609 2.75781 4.44922 2.75781C5.39844 2.75781 6.16797 3.52734 6.16797 4.47656C6.16797 5.42188 5.39844 6.19531 4.44922 6.19531ZM17.043 17.043H14.0781V12.4023C14.0781 11.2969 14.0586 9.87109 12.5352 9.87109C10.9922 9.87109 10.7578 11.0781 10.7578 12.3242V17.043H7.79297V7.49609H10.6406V8.80078H10.6797C11.0742 8.05078 12.043 7.25781 13.4844 7.25781C16.4883 7.25781 17.043 9.23438 17.043 11.8047V17.043Z" fill="currentColor"/>
                </svg>
                LinkedIn
              </a>
            </div>
          </div>
        </section>

        {/* Status Toast */}
        {submitStatus && (
          <div className={`status-toast ${submitStatus}`}>
            {submitStatus === 'success' ? (
              <>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M16.667 5L7.5 14.167L3.333 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Message sent successfully! We'll get back to you soon.
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M10 6V10M10 14H10.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Something went wrong. Please try again.
              </>
            )}
          </div>
        )}
      </main>


    </>
  );
}
