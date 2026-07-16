'use client';

import React, { useState, useRef } from 'react';
import { 
  MapPin, 
  Briefcase, 
  ArrowRight, 
  Check, 
  Menu, 
  X, 
  ChevronDown, 
  UploadCloud, 
  FileText,
  Palette,
  Code,
  Layers,
  Sparkles,
  User,
  Mail,
  Phone
} from 'lucide-react';
import Image from "next/image";
import './careers.css';

// Job Listings Data
const ALL_JOBS = [
  {
    id: 1,
    title: 'UI/UX Designer',
    department: 'Design',
    location: 'Bengaluru, India',
    type: 'Full-time',
    iconType: 'design'
  },
  {
    id: 2,
    title: 'Frontend Developer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    iconType: 'engineering'
  },
  {
    id: 3,
    title: 'Product Manager',
    department: 'Product',
    location: 'Bengaluru, India',
    type: 'Full-time',
    iconType: 'product'
  },
  {
    id: 4,
    title: 'Graphic Designer',
    department: 'Design',
    location: 'Hybrid',
    type: 'Full-time',
    iconType: 'graphic'
  }
];

// Value Cards Data
const VALUE_CARDS = [
  {
    eyebrow: 'The home first',
    title: 'Build around one person',
    desc: 'Every install and care plan starts with how someone actually lives – not a standard spec sheet.'
  },
  {
    eyebrow: 'Craft matters',
    title: 'Trade-quality work',
    desc: 'Grab bars, ramps and lifts are safety equipment. We hire people who won’t cut corners on them.'
  },
  {
    eyebrow: 'Say it straight',
    title: 'Honest timelines',
    desc: 'Clients are often anxious about losing independence. We tell them what’s true, not what’s easy to hear.'
  },
  {
    eyebrow: 'Grow the trade',
    title: 'Real training paths',
    desc: 'OT supports, CAPS certification, apprenticeship – we invest in the license and skills you’ll carry with you.'
  }
];

// Hiring Process Steps
const HIRING_STEPS = [
  {
    id: 'apply',
    title: 'Apply',
    desc: 'Submit your application in just a few clicks.',
    iconName: 'apply'
  },
  {
    id: 'screening',
    title: 'Screening',
    desc: 'We review your profile and get in touch.',
    iconName: 'screening'
  },
  {
    id: 'interview',
    title: 'Interview',
    desc: 'Meet the team and talk about your experience.',
    iconName: 'interview'
  },
  {
    id: 'assignment',
    title: 'Assignment',
    desc: 'A small assignment to know your approach.',
    iconName: 'assignment'
  },
  {
    id: 'offer',
    title: 'Offer',
    desc: "If it’s a match, we’ll make you an offer!",
    iconName: 'offer'
  }
];

// FAQs Data
const FAQ_ITEMS = [
  {
    id: 1,
    question: 'What is the hiring process like?',
    answer: 'Our hiring process typically includes application review, screening, an interview, a short role-specific assignment and a final offer.'
  },
  {
    id: 2,
    question: 'What are the working hours?',
    answer: 'Working hours depend on the role and team. Remote, hybrid and on-site arrangements are mentioned in each job listing.'
  },
  {
    id: 3,
    question: 'How can I track my application?',
    answer: 'Candidates receive updates through the email address used during the application process.'
  }
];

export default function CareersPage() {
  // Mobile navigation drawer toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Department Filter State
  const [selectedDept, setSelectedDept] = useState('All Departments');

  // FAQ Accordion State (only one open at a time, or none)
  const [activeFaqId, setActiveFaqId] = useState(null);

  // Application Modal state
  const [selectedJobForModal, setSelectedJobForModal] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  // Form input states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [coverLetter, setCoverLetter] = useState('');

  const fileInputRef = useRef(null);

  // Smooth scroll handler
  const handleScrollToSection = (sectionId) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // FAQ Toggle
  const handleFaqToggle = (faqId) => {
    if (activeFaqId === faqId) {
      setActiveFaqId(null);
    } else {
      setActiveFaqId(faqId);
    }
  };

  // Filtering Job Listings
  const filteredJobs = selectedDept === 'All Departments'
    ? ALL_JOBS
    : ALL_JOBS.filter(job => job.department === selectedDept);

  // Drag and Drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFileName(file.name);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFileName(e.target.files[0].name);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSelectedJobForModal(null);
      // Reset form fields
      setFullName('');
      setEmail('');
      setPhone('');
      setCoverLetter('');
      setUploadedFileName('');
      // Show custom success toast
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 4000);
    }, 1500);
  };

  // Icon renderer helper for open roles
  const renderJobIcon = (iconType) => {
    switch (iconType) {
      case 'design':
        return <Palette className="careers-job-icon" size={24} />;
      case 'engineering':
        return <Code className="careers-job-icon" size={24} />;
      case 'product':
        return <Layers className="careers-job-icon" size={24} />;
      case 'graphic':
        return <Palette className="careers-job-icon" size={24} />;
      default:
        return <Briefcase className="careers-job-icon" size={24} />;
    }
  };

  // Icon renderer helper for hiring process steps
  const renderStepIcon = (iconName) => {
    switch (iconName) {
      case 'apply':
        return <FileText size={28} />;
      case 'screening':
        return <User size={28} />;
      case 'interview':
        return <Sparkles size={28} />;
      case 'assignment':
        return <FileText size={28} />;
      case 'offer':
        return <Check size={28} />;
      default:
        return <Check size={28} />;
    }
  };

  return (
    <div className="careers-page careers-font-inter">
      {/* ==========================================
         HEADER
         ========================================== */}
      <header className="careers-header-wrapper" id="careers-header">
        <div className="careers-container careers-header">
          {/* Logo Area */}
          <a href="#" className="careers-logo-area" onClick={(e) => { e.preventDefault(); window.scrollTo({top: 0, behavior: 'smooth'}); }}>
           <Image
  src="/images/logo.png"
  alt="Accesco Living"
  width={40}
  height={40}
  className="careers-logo-image"
/>
              <rect x="5" y="5" width="30" height="30" rx="6" fill="#91004b" opacity="0.1" />
              <path d="M12 28L20 12L28 28H24L20 20L16 28H12Z" fill="#91004b" />
              <circle cx="20" cy="15" r="3" fill="#ffffff" />
            
            <span className="careers-logo-text">ACCESCO</span>
          </a>

          {/* Desktop Nav */}
          <nav className="careers-nav">
            <span onClick={() => handleScrollToSection('why-work-here')} className="careers-nav-link">Why Accesco</span>
            <span onClick={() => handleScrollToSection('open-roles')} className="careers-nav-link">Open roles</span>
            <span onClick={() => handleScrollToSection('hiring-process')} className="careers-nav-link">Life here</span>
          </nav>

          {/* Header CTA */}
          <button onClick={() => handleScrollToSection('open-roles')} className="careers-header-cta" id="header-see-roles-btn">
            See open roles <ArrowRight size={16} />
          </button>

          {/* Mobile Menu Icon */}
          <button 
            className="careers-mobile-menu-btn" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <div className={`careers-mobile-drawer ${isMobileMenuOpen ? 'active' : ''}`}>
          <span onClick={() => handleScrollToSection('why-work-here')} className="careers-mobile-link">Why Accesco</span>
          <span onClick={() => handleScrollToSection('open-roles')} className="careers-mobile-link">Open roles</span>
          <span onClick={() => handleScrollToSection('hiring-process')} className="careers-mobile-link">Life here</span>
          <button 
            onClick={() => handleScrollToSection('open-roles')} 
            className="careers-mobile-cta"
            style={{ border: 'none', cursor: 'pointer', display: 'block', width: '100%' }}
          >
            See open roles →
          </button>
        </div>
      </header>

      {/* Full-width dark-magenta strip below the header */}
      <div className="careers-header-strip"></div>

      {/* ==========================================
         HERO SECTION
         ========================================== */}
      <section className="careers-hero-section">
        <div className="careers-container careers-hero-grid">
          {/* Left Content Column */}
          <div className="careers-hero-left">
            <div className="careers-hero-eyebrow">— CAREERS AT ACCESCO LIVING</div>
            <h1 className="careers-hero-title">
              Build the Future of<br />Everyday Living.
            </h1>
            <p className="careers-hero-desc">
              Join Accesco Living and help create innovative experiences across Grocery, Food, Fashion and Smart Living.
            </p>
            <div className="careers-hero-buttons">
              <button onClick={() => handleScrollToSection('open-roles')} className="careers-btn-primary" id="hero-view-roles-btn">
                View Open Positions <ArrowRight size={18} />
              </button>
              <button onClick={() => handleScrollToSection('why-work-here')} className="careers-btn-secondary" id="hero-life-btn">
                Life at Accesco <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Right Column: Custom SVG Team Meeting Illustration */}
          <div className="careers-hero-illustration-wrapper">
  <div className="careers-hero-cream-bg"></div>

  <div className="careers-illustration-canvas">
    <Image
      src="/images/careers/team-meeting.png"
      alt="Accesco team meeting"
      width={700}
      height={500}
      className="careers-hero-image"
      priority
    />
  </div>
</div>
        </div>
      </section>

      {/* ==========================================
         STATISTICS
         ========================================== */}
      <section className="careers-stats-section">
        <div className="careers-container">
          <div className="careers-stats-grid">
            <div className="careers-stat-item">
              <div className="careers-stat-num">1400 +</div>
              <div className="careers-stat-label">Homes Made Accessible</div>
            </div>
            <div className="careers-stat-item">
              <div className="careers-stat-num">19</div>
              <div className="careers-stat-label">Field & Clinical Teams</div>
            </div>
            <div className="careers-stat-item">
              <div className="careers-stat-num">4.8</div>
              <div className="careers-stat-label">Client Satisfaction / 5</div>
            </div>
          </div>

          {/* Slightly rotated dashed divider below the statistics */}
          <div className="careers-divider-wrapper">
            <div className="careers-dashed-line"></div>
          </div>
        </div>
      </section>

      {/* ==========================================
         WHY WORK HERE
         ========================================== */}
      <section className="careers-why-section" id="why-work-here">
        <div className="careers-container">
          <div className="careers-why-eyebrow">— WHY WORK HERE</div>
          
          <div className="careers-why-header-grid">
            <h2 className="careers-why-title">
              The job changes daily.<br />The reason doesn’t.
            </h2>
            <p className="careers-why-subtitle">
              Four things every team at Accesco holds itself to, whether you’re on site or on the phone with a client.
            </p>
          </div>

          {/* Connected Cards */}
          <div className="careers-cards-row">
            {VALUE_CARDS.map((card, idx) => (
              <div key={idx} className="careers-value-card">
                <div className="careers-card-eyebrow">{card.eyebrow}</div>
                <h3 className="careers-card-title">{card.title}</h3>
                <p className="careers-card-desc">{card.desc}</p>
              </div>
            ))}
          </div>

          {/* Slightly rotated dashed divider below this section */}
          <div className="careers-divider-wrapper" style={{ marginTop: '50px' }}>
            <div className="careers-dashed-line-reverse"></div>
          </div>
        </div>
      </section>

      {/* ==========================================
         OPEN ROLES (WITH REACT FILTERING)
         ========================================== */}
      <section className="careers-roles-section" id="open-roles">
        <div className="careers-container">
          <div className="careers-roles-eyebrow">— OPEN ROLES</div>
          <h2 className="careers-roles-title">Find your next opportunity</h2>

          {/* Department Filters */}
          <div className="careers-filter-bar">
            {['All Departments', 'Design', 'Engineering', 'Product', 'Marketing', 'Operations'].map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`careers-filter-pill ${selectedDept === dept ? 'active' : ''}`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Jobs Listing */}
          <div className="careers-jobs-list">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div 
                  key={job.id} 
                  className="careers-job-card" 
                  onClick={() => setSelectedJobForModal(job)}
                  id={`job-card-${job.id}`}
                >
                  {/* Left block */}
                  <div className="careers-job-left">
                    <div className="careers-job-icon-box">
                      {renderJobIcon(job.iconType)}
                    </div>
                    <div className="careers-job-details">
                      <div className="careers-job-name">{job.title}</div>
                      <div className="careers-job-dept">{job.department}</div>
                    </div>
                  </div>

                  {/* Right meta and arrow */}
                  <div className="careers-job-meta">
                    <div className="careers-meta-item">
                      <MapPin className="careers-meta-icon" />
                      <span>{job.location}</span>
                    </div>
                    <div className="careers-meta-item">
                      <Briefcase className="careers-meta-icon" />
                      <span>{job.type}</span>
                    </div>
                    <ArrowRight className="careers-job-arrow" size={20} />
                  </div>
                </div>
              ))
            ) : (
              <div className="careers-empty-jobs">
                No open positions found in the selected department. Please try another filter!
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ==========================================
         HIRING PROCESS
         ========================================== */}
      <section className="careers-hiring-section" id="hiring-process">
        <div className="careers-container">
          <div className="careers-hiring-eyebrow">— OUR HIRING PROCESS</div>
          <h2 className="careers-hiring-title">How we bring you onboard</h2>

          {/* Horizontal Steps with Connector Line */}
          <div className="careers-steps-row">
            <div className="careers-steps-connector"></div>
            
            {HIRING_STEPS.map((step) => (
              <div key={step.id} className="careers-step-item">
                <div className="careers-step-circle">
                  {renderStepIcon(step.iconName)}
                </div>
                <h3 className="careers-step-title">{step.title}</h3>
                <p className="careers-step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
         FAQ SECTION
         ========================================== */}
      <section className="careers-faq-section" id="career-faq">
        <div className="careers-container">
          <div className="careers-faq-eyebrow">FAQs</div>
          <h2 className="careers-faq-title">Everything you want to know</h2>

          <div className="careers-faq-grid">
            {/* Left Graphic Column */}
            <div className="careers-faq-graphics">
              <div className="careers-faq-circle">?</div>
              
              {/* Animated Typing Dot Bubble */}
              <div className="careers-faq-bubble">
                <div className="careers-faq-bubble-dot"></div>
                <div className="careers-faq-bubble-dot"></div>
                <div className="careers-faq-bubble-dot"></div>
              </div>

              {/* Plant Pot vector at the bottom left */}
              <div className="careers-faq-plant">
                <svg viewBox="0 0 80 130" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                  {/* Clay Pot */}
                  <path d="M25 90 L55 90 L51 125 L29 125 Z" fill="#d84315" opacity="0.85" />
                  <rect x="22" y="84" width="36" height="7" rx="1.5" fill="#bf360c" />
                  {/* Stem */}
                  <path d="M40 84 Q38 40 43 20" stroke="#81c784" strokeWidth="3" />
                  {/* Rich leaves */}
                  <path d="M40 65 Q60 55 52 42 C45 49 41 58 40 65 Z" fill="#4caf50" />
                  <path d="M39 52 Q20 42 28 28 C34 35 38 45 39 52 Z" fill="#4caf50" />
                  <path d="M42 35 Q55 25 48 12 C42 18 41 27 42 35 Z" fill="#2e7d32" />
                </svg>
              </div>
            </div>

            {/* Right Accordion Column */}
            <div className="careers-accordion">
              {FAQ_ITEMS.map((item) => {
                const isOpen = activeFaqId === item.id;
                return (
                  <div 
                    key={item.id} 
                    className={`careers-faq-item ${isOpen ? 'active' : ''}`}
                  >
                    <button 
                      className="careers-faq-question-btn"
                      onClick={() => handleFaqToggle(item.id)}
                      aria-expanded={isOpen}
                    >
                      <span>{item.question}</span>
                      <ChevronDown className="careers-faq-caret" size={20} />
                    </button>
                    
                    <div className="careers-faq-answer-panel">
                      <div className="careers-faq-answer">
                        {item.answer}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
         FOOTER
         ========================================== */}
      <footer className="careers-footer">
        <div className="careers-container careers-footer-grid">
          {/* Brand Col */}
          <div>
            <div className="careers-footer-brand">
              ACCESCO
              <span className="careers-footer-brand-sub">LIVING</span>
            </div>
            <div className="careers-footer-copyright">
              © 2026 Accesco Living. All rights reserved.
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="careers-footer-col-title">Company</h4>
            <ul className="careers-footer-links">
              <li><a href="/about" className="careers-footer-link" onClick={(e) => e.preventDefault()}>About Us</a></li>
              <li><a href="#" className="careers-footer-link  " onClick={(e) => { e.preventDefault(); handleScrollToSection('careers-header'); }}>Careers</a></li>
              <li><a href="/blogs" className="careers-footer-link" onClick={(e) => e.preventDefault()}>Blogs</a></li>
              <li><a href="#" className="careers-footer-link" onClick={(e) => e.preventDefault()}>Contact Us</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="careers-footer-col-title">Our Platforms</h4>
            <ul className="careers-footer-links">
              <li><a href="/services/grokly" className="careers-footer-link" onClick={(e) => e.preventDefault()}>Grokly (Grocery)</a></li>
              <li><a href="/services/swadisht" className="careers-footer-link" onClick={(e) => e.preventDefault()}>Swadishtt (Food)</a></li>
              <li><a href="/services/instastyle" className="careers-footer-link" onClick={(e) => e.preventDefault()}>Instastyle (Fashion)</a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="careers-footer-col-title">Resources</h4>
            <ul className="careers-footer-links">
              <li><a href="/contact" className="careers-footer-link" onClick={(e) => e.preventDefault()}>Help Center</a></li>
              <li><a href="/privacy" className="careers-footer-link" onClick={(e) => e.preventDefault()}>Privacy Policy</a></li>
              <li><a href="/terms" className="careers-footer-link" onClick={(e) => e.preventDefault()}>Terms & Condition</a></li>
              <li><a href="/partner" className="careers-footer-link" onClick={(e) => e.preventDefault()}>Partner With Us</a></li>
            </ul>
          </div>
        </div>
      </footer>

      {/* ==========================================
         INTERACTIVE JOB APPLICATION MODAL
         ========================================== */}
      {selectedJobForModal && (
        <div className="careers-apply-modal-backdrop" onClick={() => setSelectedJobForModal(null)}>
          <div 
            className="careers-apply-modal" 
            onClick={(e) => e.stopPropagation()}
            id="careers-application-modal"
          >
            <div className="careers-modal-header">
              <div>
                <span className="careers-card-eyebrow" style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700 }}>Apply for role</span>
                <h3 className="careers-modal-title">{selectedJobForModal.title}</h3>
                <div style={{ fontSize: '0.82rem', color: 'var(--muted-text)', marginTop: '4px' }}>
                  {selectedJobForModal.department} • {selectedJobForModal.location} • {selectedJobForModal.type}
                </div>
              </div>
              <button className="careers-modal-close-btn" onClick={() => setSelectedJobForModal(null)} aria-label="Close modal">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="careers-modal-form">
              <div className="careers-form-group">
                <label className="careers-form-label" htmlFor="applicant-name">
                  Full Name <span style={{ color: 'var(--primary)' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    id="applicant-name" 
                    className="careers-form-input" 
                    placeholder="Enter your first and last name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div className="careers-form-group">
                <label className="careers-form-label" htmlFor="applicant-email">
                  Email Address <span style={{ color: 'var(--primary)' }}>*</span>
                </label>
                <input 
                  type="email" 
                  id="applicant-email" 
                  className="careers-form-input" 
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>

              <div className="careers-form-group">
                <label className="careers-form-label" htmlFor="applicant-phone">
                  Phone Number
                </label>
                <input 
                  type="tel" 
                  id="applicant-phone" 
                  className="careers-form-input" 
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="careers-form-group">
                <label className="careers-form-label" htmlFor="applicant-letter">
                  Cover Letter / Brief Intro
                </label>
                <textarea 
                  id="applicant-letter" 
                  className="careers-form-textarea" 
                  rows="4" 
                  placeholder="Tell us why you are a great fit for Accesco Living..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                ></textarea>
              </div>

              {/* Usability Pattern: Drag-and-drop & Manual Resume Upload */}
              <div className="careers-form-group">
                <label className="careers-form-label">
                  Upload Resume / CV <span style={{ color: 'var(--primary)' }}>*</span>
                </label>
                
                <div 
                  className="careers-form-file-dropzone"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  style={{
                    borderColor: isDragOver ? 'var(--primary)' : 'var(--border-pink)',
                    backgroundColor: isDragOver ? 'rgba(145, 0, 75, 0.05)' : ''
                  }}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    style={{ display: 'none' }} 
                    accept=".pdf,.doc,.docx"
                    required={!uploadedFileName}
                  />
                  <UploadCloud className="careers-dropzone-icon" size={32} />
                  <div className="careers-dropzone-text" style={{ fontWeight: 600, color: 'var(--text)' }}>
                    {uploadedFileName ? 'Selected File:' : 'Drag & drop your resume here'}
                  </div>
                  <div className="careers-dropzone-text" style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                    {uploadedFileName ? (
                      <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{uploadedFileName}</span>
                    ) : (
                      'or click to browse from computer (PDF, DOC up to 5MB)'
                    )}
                  </div>
                </div>
              </div>

              <div className="careers-form-footer">
                <button 
                  type="button" 
                  className="careers-btn-secondary" 
                  onClick={() => setSelectedJobForModal(null)}
                  style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="careers-btn-primary" 
                  style={{ padding: '10px 24px', fontSize: '0.9rem', backgroundColor: 'var(--primary)' }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUCCESS TOAST NOTIFICATION */}
      {showToast && (
        <div className="careers-toast">
          <Check className="careers-toast-icon" size={20} />
          <span>Application successfully submitted! We will be in touch shortly.</span>
        </div>
      )}
    </div>
  );
}
