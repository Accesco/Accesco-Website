'use client';
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
} from "firebase/auth";
import {
  ShoppingCart,
  Utensils,
  Shirt,
  GlassWater,
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldCheck,
} from "lucide-react";
import styles from "./AppShowcase.module.css";
import { auth } from "../lib/firebase";
import {
  addWaitlistEntry,
  validateWaitlistEntry,
  sendOtpEmailVerification,
  verifyOtpEmailCode,
} from "../lib/waitlistService";

export default function AppShowcase() {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    interests: [],
    verificationCode: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [phoneCodeSent, setPhoneCodeSent] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const recaptchaVerifierRef = useRef(null);
  const [feedbackScore, setFeedbackScore] = useState(null);
  const [feedbackReview, setFeedbackReview] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleFeedbackSubmit = async () => {
    if (feedbackScore === null) return;

    const feedbackData = {
      user: form.name?.trim() || "User",
      score: feedbackScore,
      review: feedbackReview.trim(),
    };

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedbackData),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to submit feedback");
      }
      setFeedbackSubmitted(true);
    } catch (err) {
      console.error("Feedback submit failed:", err);
      // Still show success to the user — feedback UX shouldn't block on a
      // backend hiccup, but the failure is logged for debugging.
      setFeedbackSubmitted(true);
    }
  };

  // Optional email verification state
  const [emailCode, setEmailCode] = useState("");
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  const interestOptions = [
    { id: 'grokly', label: 'Groceries & Essentials', icon: <ShoppingCart size={22} /> },
    { id: 'swadishtt', label: 'Food Delivery', icon: <Utensils size={22} /> },
    { id: 'instastyle', label: 'Fashion & Styling', icon: <Shirt size={22} /> },
    { id: 'dinex', label: 'Dining Experience', icon: <GlassWater size={22} /> },
  ];

  const toggleInterest = (id) => {
    setForm(prev => ({
      ...prev,
      interests: prev.interests.includes(id)
        ? prev.interests.filter(i => i !== id)
        : [...prev.interests, id]
    }));
  };

  function normalizePhone(phone) {
    const stripped = phone.replace(/[\s\-().]/g, "");
    if (stripped.startsWith("+")) return stripped;
    return "+91" + stripped.replace(/\D/g, "");
  }

  // Create + render the invisible reCAPTCHA once and reuse it (Firebase's recommended
  // pattern). Rendering ahead of time means the widget is already loaded before the
  // user sends an OTP, so the send itself is much faster.
  const ensureRecaptcha = () => {
    if (!recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
        },
      );
      recaptchaVerifierRef.current
        .render()
        .catch((e) => console.error("reCAPTCHA render failed:", e));
    }
    return recaptchaVerifierRef.current;
  };

  const sendPhoneOtp = async () => {
    if (!form.phone?.trim()) {
      setError("Please enter your phone number first");
      return;
    }

    // Prevent overlapping sends while one is still in flight
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const verifier = ensureRecaptcha();
      const phoneNumber = normalizePhone(form.phone.trim());
      const result = await signInWithPhoneNumber(auth, phoneNumber, verifier);
      setConfirmationResult(result);
      setPhoneCodeSent(true);
    } catch (err) {
      console.error("Phone OTP send failed:", err);
      // Reset the verifier so the next attempt starts from a clean state
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
      setError(
        err.message ||
        "Failed to send OTP. Check your phone number and try again.",
      );
      setPhoneCodeSent(false);
    } finally {
      setLoading(false);
    }
  };

  // Optional: send an email verification code
  const sendEmailOtp = async () => {
    if (!form.email?.trim()) {
      setError("Please enter your email first");
      return;
    }

    setEmailLoading(true);
    setError("");

    try {
      await sendOtpEmailVerification(form.email.trim());
      setEmailCodeSent(true);
      setEmailVerified(false);
    } catch (err) {
      console.error("Email OTP send failed:", err);
      setError(err.message || "Failed to send email code");
    } finally {
      setEmailLoading(false);
    }
  };

  // Optional: verify the email code the user entered
  const verifyEmailOtp = async () => {
    if (!/^\d{6}$/.test(emailCode.trim())) {
      setError("Please enter a valid 6-digit email code.");
      return;
    }

    setEmailLoading(true);
    setError("");

    try {
      await verifyOtpEmailCode(form.email.trim(), emailCode.trim());
      setEmailVerified(true);
    } catch (err) {
      console.error("Email OTP verify failed:", err);
      setError(err.message || "Email verification failed");
    } finally {
      setEmailLoading(false);
    }
  };

  const handleNext = () => {
    setError('');

    if (currentStep === 1) {
      if (!form.name?.trim() || !form.email?.trim() || !form.phone?.trim()) {
        setError('Please fill in all fields');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (form.interests.length === 0) {
        setError("Please select at least one interest");
        return;
      }
      setCurrentStep(3);
      if (!phoneCodeSent) {
        sendPhoneOtp();
      }
    }
  };

  const handlePrev = () => {
    setError('');
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (form.interests.length === 0) {
      setError("Please select at least one interest.");
      return;
    }

    const validationErrors = validateWaitlistEntry(form);
    if (validationErrors.length > 0) {
      setError(validationErrors.join(" "));
      return;
    }

    if (loading) {
      setError("Verification code is still being sent. Please wait.");
      return;
    }

    if (!confirmationResult) {
      if (!error) {
        setError("Verification failed to initiate. Please try again.");
      }
      return;
    }

    if (!/^\d{6}$/.test(form.verificationCode.trim())) {
      setError("Please enter a valid 6-digit verification code.");
      return;
    }

    setError('');
    setLoading(true);
    try {
      await confirmationResult.confirm(form.verificationCode.trim());
      setPhoneVerified(true);
      await addWaitlistEntry({
        name: form.name,
        email: form.email,
        phone: form.phone,
        interests: form.interests.join(", "),
        emailVerified, // optional — true only if the user chose to verify their email
      });

      setSuccess(true);
      setForm({
        name: "",
        email: "",
        phone: "",
        interests: [],
        verificationCode: "",
      });
      setPhoneCodeSent(false);
      setPhoneVerified(false);
      setConfirmationResult(null);
      setEmailCode("");
      setEmailCodeSent(false);
      setEmailVerified(false);
      setCurrentStep(1);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error("Waitlist submit failed:", err);
      if (err.code === "auth/invalid-verification-code") {
        setError("Invalid OTP. Please check the code and try again.");
      } else if (err.code === "auth/code-expired") {
        setError("OTP has expired. Please request a new one.");
      } else {
        setError(err.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Pre-warm the invisible reCAPTCHA on mount so the first OTP send is fast
  useEffect(() => {
    try {
      ensureRecaptcha();
    } catch (e) {
      console.error("reCAPTCHA warm-up failed:", e);
    }
    return () => {
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const stack = document.getElementById('stack');
    if (!stack) return;

    const cards = Array.from(stack.querySelectorAll('.stack-card'));
    let currentIndex = 0;

    const rotateStack = () => {
      cards.forEach((card, i) => {
        card.classList.remove('pos-1', 'pos-2', 'pos-3');
        const newPos = (i - currentIndex + 3) % 3;
        card.classList.add(`pos-${newPos + 1}`);
      });
      currentIndex = (currentIndex + 1) % cards.length;
    };

    const interval = setInterval(rotateStack, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="waitlist" className={styles.waitlistSection}>
      <div id="recaptcha-container"></div>

      {/* Centered Heading Block Positioned Symmetrically Above the Card */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 48px', padding: '0', textAlign: 'center' }}>
        <h2 className={styles.waitlistTitle}>
          Join the <span className={styles.highlight}>Revolution</span>
        </h2>
        <p className={styles.waitlistSubtitle}>
          Be the first to experience India's most intelligent commerce platform. Get exclusive early access and special launch benefits.
        </p>
      </div>

      {/* Main 1:1 Sorcerer Grid Card Wrapper */}
      <div className={styles.waitlistCard}>

        {/* Left Panel: Flush Poster Image */}
        <div className={styles.leftPanel}>
          <Image
            src="/images/xpense-banner.jpg"
            alt="Accesco Living - Wanna Skip The Line?"
            className={styles.posterImage}
            onError={(e) => {
              e.currentTarget.src = "/images/accesco_original.png";
              e.currentTarget.style.padding = "40px";
              e.currentTarget.style.background =
                "linear-gradient(135deg, #7A0042, #1A0A0F)";
            }}
          />
        </div>

        {/* Right Panel: Clean Form Wrapper */}
        <div className={styles.rightPanel}>
          <div className={styles.brandLogoRow}>
            <img
              src="/images/asterik.png"
              alt="Accesco mark"
              className={styles.brandAsterisk}
            />
          </div>

          <h3 className={styles.cardTitle}>Get Early Access</h3>
          <p className={styles.cardSubtitle}>
            {currentStep === 1 &&
              "Join the waitlist for early access to Accesco Living's unified commerce platform, built for groceries, food delivery, fashion, dining, home services, and member-only launch benefits."}
            {currentStep === 2 &&
              "Select the experiences you are most interested in so we can personalize your early access updates, offers, and launch notifications."}
            {currentStep === 3 &&
              "Verify your phone number to secure your waitlist entry and receive important early access updates safely."}
          </p>

          {success ? (
            <div className={styles.successMessage}>
              Welcome to the waitlist! We'll be in touch soon.
            </div>
          ) : null}

          {error && <div className={styles.errorMessage}>{error}</div>}

          {/* Form Step Router */}
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>

            {/* Step 1: Base Inputs */}
            {currentStep === 1 && (
              <div className={styles.inputsStack}>
                <div className={styles.inputWrapper}>

                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className={styles.inputWrapper}>

                  <input
                    type="email"
                    className={styles.formInput}
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.inputWrapper}>

                  <input
                    type="tel"
                    className={styles.formInput}
                    placeholder="Enter your phone number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                  />
                </div>

                <button type="button" className={styles.submitButton} onClick={handleNext}>
                  <span>Join Waitlist</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            )}

            {/* Step 2: Bento Interest Grid */}
            {currentStep === 2 && (
              <div className={styles.inputsStack}>
                <div className={styles.interestsGrid}>
                  {interestOptions.map((interest) => {
                    const isSelected = form.interests.includes(interest.id);
                    return (
                      <div
                        key={interest.id}
                        className={`${styles.interestCard} ${isSelected ? styles.interestCardSelected : ''}`}
                        onClick={() => toggleInterest(interest.id)}
                      >
                        <div className={styles.interestCardHeader}>
                          <div className={styles.interestIcon}>{interest.icon}</div>
                          <div className={`${styles.customCheckbox} ${isSelected ? styles.customCheckboxActive : ''}`}>
                            {isSelected && <Check size={12} strokeWidth={3} />}
                          </div>
                        </div>
                        <div className={styles.interestLabel}>{interest.label}</div>
                      </div>
                    );
                  })}
                </div>

                <div className={styles.buttonGroup}>
                  <button
                    type="button"
                    className={styles.prevButton}
                    onClick={handlePrev}
                  >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    className={`${styles.submitButton} ${styles.flexOneButton}`}
                    onClick={handleNext}
                  >
                    <span>Continue</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Verification */}
            {currentStep === 3 && (
              <div className={styles.inputsStack}>
                <div className={styles.verificationCard}>
                  <ShieldCheck
                    size={32}
                    className={styles.verificationShield}
                  />
                  <p className={styles.verificationSubtitle}>
                    {phoneCodeSent ? (
                      <>
                        Sent a passcode to <strong>{form.phone}</strong>
                      </>
                    ) : (
                      "Preparing code transmission..."
                    )}
                  </p>
                </div>

                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    className={`${styles.formInput} ${styles.centeredOtpInput}`}
                    placeholder="Enter 6-digit OTP"
                    value={form.verificationCode}
                    onChange={(e) =>
                      setForm({ ...form, verificationCode: e.target.value })
                    }
                    maxLength={6}
                    required
                  />
                </div>

                {phoneCodeSent && (
                  <p className={styles.otpHelperText}>
                    Didn't receive the SMS?{" "}
                    <button
                      type="button"
                      className={styles.resendCodeButton}
                      onClick={sendPhoneOtp}
                      disabled={loading}
                    >
                      Resend Code
                    </button>
                  </p>
                )}

                {/* Optional Email Verification */}
                <div
                  className={`${styles.verificationSection} ${styles.verifyEmailBlock}`}
                >
                  <div className={styles.verificationInfo}>
                    <p className={styles.verifyEmailTitle}>
                      Verify your email{" "}
                      <span className={styles.verifyEmailOptionalTag}>
                        (optional)
                      </span>
                    </p>
                    {emailVerified ? (
                      <p className={styles.verifyEmailSuccess}>
                        Email verified successfully.
                      </p>
                    ) : (
                      <p className={styles.verifyEmailHint}>
                        Optionally verify <strong>{form.email}</strong> for a
                        more secure account.
                      </p>
                    )}
                  </div>

                  {!emailVerified && (
                    <>
                      {!emailCodeSent ? (
                        <button
                          type="button"
                          className={`${styles.navButton} ${styles.fullWidthButton}`}
                          onClick={sendEmailOtp}
                          disabled={emailLoading}
                        >
                          {emailLoading ? "Sending..." : "Send email code"}
                        </button>
                      ) : (
                        <>
                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                              Email Code
                            </label>
                            <input
                              type="text"
                              className={`${styles.formInput} ${styles.emailOtpInput}`}
                              placeholder="Enter 6-digit code"
                              value={emailCode}
                              onChange={(e) => setEmailCode(e.target.value)}
                              maxLength={6}
                            />
                          </div>
                          <div className={styles.buttonGroup}>
                            <button
                              type="button"
                              className={styles.resendCode}
                              onClick={sendEmailOtp}
                              disabled={emailLoading}
                            >
                              Resend Code
                            </button>
                            <button
                              type="button"
                              className={styles.navButton}
                              onClick={verifyEmailOtp}
                              disabled={emailLoading}
                            >
                              {emailLoading ? "Verifying..." : "Verify Email"}
                            </button>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>

                <div className={styles.buttonGroup}>
                  <button type="button" className={styles.prevButton} onClick={handlePrev}>
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>
                  <button type="submit" className={styles.submitButton} disabled={loading} style={{ flex: 1 }}>
                    {loading ? (
                      <span>Joining...</span>
                    ) : (
                      <>
                        <span>Reserve My Spot</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

          </form>


          {/* Symmetrical Trust Badges */}
          <div className={styles.trustRow}>
            <div className={styles.trustLeft}>
              <div className={styles.trustItem}>
                <span>Join 12,000+ members</span>
              </div>
              <div className={styles.trustDivider}></div>
              <div className={styles.trustItem}>
                <span></span>
                <span>Secure &amp; Spam-Free</span>
              </div>
            </div>
            <div className={styles.launchBadge}>
              Launching Soon
            </div>
          </div>

        </div>

      </div>

      {/* Unchanged bottom app download segments */}
      <div className={styles.downloadAppSection}>
        <Image
          src="/images/download-app-banner-desktop.png"
          alt="Download App"
          className={styles.downloadAppImageDesktop}
          width={1200}
          height={300}
          style={{ width: '100%', height: 'auto' }}
        />
        <Image
          src="/images/download-app-banner-mobile.png"
          alt="Download App"
          className={styles.downloadAppImageMobile}
          width={600}
          height={200}
          style={{ width: '100%', height: 'auto' }}
        />
        <a
          href="#"
          className={styles.playStoreHotspot}
          aria-label="Google Play"
        />
        <a
          href="#"
          className={styles.appStoreHotspot}
          aria-label="App Store"
        />
      </div>

    </section >
  );
}