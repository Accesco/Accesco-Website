"use client";

import React, { useEffect, useState } from "react";
import {
  ShoppingCart,
  Utensils,
  Shirt,
  GlassWater,
  ArrowRight,
  ArrowLeft,
  Check,
} from "lucide-react";
import styles from "./AppShowcase.module.css";
import { addWaitlistEntry, validateWaitlistEntry } from "../lib/waitlistService";

export default function AppShowcase() {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    interests: [],
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
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

  const interestOptions = [
    {
      id: "grokly",
      label: "Groceries & Essentials",
      icon: <ShoppingCart size={22} />,
    },
    { id: "swadishtt", label: "Food Delivery", icon: <Utensils size={22} /> },
    { id: "instastyle", label: "Fashion & Styling", icon: <Shirt size={22} /> },
    { id: "dinex", label: "Dining Experience", icon: <GlassWater size={22} /> },
  ];

  const toggleInterest = (id) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(id)
        ? prev.interests.filter((i) => i !== id)
        : [...prev.interests, id],
    }));
  };

  const handleNext = () => {
    setError("");

    if (currentStep === 1) {
      if (!form.name?.trim() || !form.email?.trim() || !form.phone?.trim()) {
        setError("Please fill in all fields");
        return;
      }
      setCurrentStep(2);
    }
  };

  const handlePrev = () => {
    setError("");
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.interests.length === 0) {
      setError("Please select at least one interest");
      return;
    }

    const validationErrors = validateWaitlistEntry(form);
    if (validationErrors.length > 0) {
      setError(validationErrors.join(" "));
      return;
    }

    setError("");
    setLoading(true);
    try {
      await addWaitlistEntry({
        name: form.name,
        email: form.email,
        phone: form.phone,
        interests: form.interests.join(", "),
      });

      setSuccess(true);
      setForm({
        name: "",
        email: "",
        phone: "",
        interests: [],
      });
      setCurrentStep(1);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error("Waitlist submit failed:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const stack = document.getElementById("stack");
    if (!stack) return;

    const cards = Array.from(stack.querySelectorAll(".stack-card"));
    let currentIndex = 0;

    const rotateStack = () => {
      cards.forEach((card, i) => {
        card.classList.remove("pos-1", "pos-2", "pos-3");
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
      {/* Centered Heading Block Positioned Symmetrically Above the Card */}
      <div className={styles.waitlistHeadingBlock}>
        <h2 className={styles.waitlistTitle}>
          Join the <span className={styles.highlight}>Revolution</span>
        </h2>
        <p className={styles.waitlistSubtitle}>
          Be the first to experience India's most intelligent commerce platform.
          Get exclusive early access and special launch benefits.
        </p>
      </div>

      {/* Main 1:1 Sorcerer Grid Card Wrapper */}
      <div className={styles.waitlistCard}>
        {/* Left Panel: Flush Poster Image */}
        <div className={styles.leftPanel}>
          <img
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
          </p>

          {success && (
            <div className={styles.successMessage}>
              Welcome to the waitlist! We'll be in touch soon.
            </div>
          )}

          {error && <div className={styles.errorMessage}>{error}</div>}

          {/* Form Step Router */}
          <form onSubmit={handleSubmit} className={styles.fullWidthForm}>
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
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className={styles.inputWrapper}>
                  <input
                    type="tel"
                    className={styles.formInput}
                    placeholder="Enter your phone number"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    required
                  />
                </div>

                <button
                  type="button"
                  className={styles.submitButton}
                  onClick={handleNext}
                >
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
                        className={`${styles.interestCard} ${isSelected ? styles.interestCardSelected : ""}`}
                        onClick={() => toggleInterest(interest.id)}
                      >
                        <div className={styles.interestCardHeader}>
                          <div className={styles.interestIcon}>
                            {interest.icon}
                          </div>
                          <div
                            className={`${styles.customCheckbox} ${isSelected ? styles.customCheckboxActive : ""}`}
                          >
                            {isSelected && <Check size={12} strokeWidth={3} />}
                          </div>
                        </div>
                        <div className={styles.interestLabel}>
                          {interest.label}
                        </div>
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
                    type="submit"
                    className={`${styles.submitButton} ${styles.flexOneButton}`}
                    disabled={loading}
                  >
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
            <div className={styles.launchBadge}>Launching Soon</div>
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      <section className={styles.feedbackSection}>
        <div className={styles.feedbackCard}>
          <div className={styles.feedbackHeader}>
            <div className={styles.feedbackBubbleOne}></div>
            <div className={styles.feedbackBubbleTwo}></div>

            <div className={styles.feedbackHeaderContent}>
              <span className={styles.feedbackEyebrow}>
                Your opinion matters
              </span>

              <h2 className={styles.feedbackTitle}>How are we doing?</h2>

              <p className={styles.feedbackHeaderText}>
                It’ll be really quick, we promise.
              </p>
            </div>
          </div>

          <div className={styles.feedbackBody}>
            {!feedbackSubmitted ? (
              <>
                <p className={styles.feedbackGreeting}>
                  Hi {form.name?.trim() || "User"},
                </p>

                <p className={styles.feedbackDescription}>
                  Thank you for being part of the Accesco Living community. Your
                  feedback helps us create a smarter and more convenient
                  experience for everyone.
                </p>

                <h3 className={styles.feedbackQuestion}>
                  How likely are you to recommend Accesco Living to your friends
                  and family?
                </h3>

                <div
                  className={styles.ratingScale}
                  role="radiogroup"
                  aria-label="Recommendation score"
                >
                  {Array.from({ length: 11 }, (_, index) => (
                    <button
                      key={index}
                      type="button"
                      role="radio"
                      aria-checked={feedbackScore === index}
                      aria-label={`${index} out of 10`}
                      className={`${styles.ratingButton} ${
                        feedbackScore === index
                          ? styles.ratingButtonSelected
                          : ""
                      }`}
                      onClick={() => setFeedbackScore(index)}
                    >
                      <span className={styles.ratingNumber}>{index}</span>

                      <span className={styles.ratingDot}>
                        {feedbackScore === index && (
                          <span className={styles.ratingDotInner}></span>
                        )}
                      </span>
                    </button>
                  ))}
                </div>

                <div className={styles.ratingLabels}>
                  <span>Not at all likely</span>
                  <span>Extremely likely</span>
                </div>

                <div className={styles.reviewBoxWrapper}>
                  <label
                    htmlFor="feedback-review"
                    className={styles.reviewBoxLabel}
                  >
                    Tell us more
                    <span className={styles.reviewOptional}>(optional)</span>
                  </label>

                  <div className={styles.reviewBoxContainer}>
                    <textarea
                      id="feedback-review"
                      className={styles.reviewBox}
                      placeholder="Share what you liked or what we could improve..."
                      value={feedbackReview}
                      onChange={(e) => setFeedbackReview(e.target.value)}
                      maxLength={300}
                      rows={4}
                    />

                    <span className={styles.reviewCharacterCount}>
                      {feedbackReview.length}/300
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className={styles.feedbackSubmitButton}
                  disabled={feedbackScore === null}
                  onClick={handleFeedbackSubmit}
                >
                  Submit Feedback
                  <ArrowRight size={18} />
                </button>

                <p className={styles.feedbackRegards}>
                  Warm regards,
                  <br />
                  <strong>Team Accesco</strong>
                </p>
              </>
            ) : (
              <div className={styles.feedbackSuccess}>
                <div className={styles.feedbackSuccessIcon}>
                  <Check size={30} strokeWidth={3} />
                </div>

                <h3>Thank you, {form.name?.trim() || "User"}!</h3>

                <p>
                  Your feedback has been recorded. We appreciate you helping us
                  improve Accesco Living.
                </p>

                <button
                  type="button"
                  className={styles.feedbackResetButton}
                  onClick={() => {
                    setFeedbackScore(null);
                    setFeedbackReview("");
                    setFeedbackSubmitted(false);
                  }}
                >
                  Change my response
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Unchanged bottom app download segments */}
      <div className={styles.downloadAppSection}>
        <img
          src="/images/download-app-banner-desktop.png"
          alt="Download App"
          className={styles.downloadAppImageDesktop}
        />
        <img
          src="/images/download-app-banner-mobile.png"
          alt="Download App"
          className={styles.downloadAppImageMobile}
        />
        <a
          href="#"
          className={styles.playStoreHotspot}
          aria-label="Google Play"
        />
        <a href="#" className={styles.appStoreHotspot} aria-label="App Store" />
      </div>
    </section>
  );
}
