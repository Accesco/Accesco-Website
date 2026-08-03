"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  ShoppingCart,
  Utensils,
  Shirt,
  GlassWater,
  ArrowRight,
  ArrowLeft,
  Check,
  UserRound,
Star,
MessageCircle,
LockKeyhole,
} from "lucide-react";
import styles from "./AppShowcase.module.css";
import {
  addWaitlistEntry,
  validateWaitlistEntry,
  isWaitlistRegistered,
} from "../lib/waitlistService";

export default function AppShowcase() {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    interests: [],
  });
const [feedbackStep, setFeedbackStep] = useState(1);
const [usageLikelihood, setUsageLikelihood] = useState("");
const [earlyAccess, setEarlyAccess] = useState("");
const [feedbackLoading, setFeedbackLoading] = useState(false);
const [feedbackError, setFeedbackError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [feedbackScore, setFeedbackScore] = useState(null);
  const [feedbackReview, setFeedbackReview] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  useEffect(() => {
    let cancelled = false;

    isWaitlistRegistered().then((registered) => {
      if (!cancelled) setAlreadyRegistered(registered);
    });

    return () => {
      cancelled = true;
    };
  }, []);

const handleFeedbackNext = () => {
  if (feedbackScore === null) {
    setFeedbackError("Please select a rating.");
    return;
  }

  setFeedbackError("");
  setFeedbackStep(2);
};

const handleFeedbackSubmit = async () => {
  if (!usageLikelihood || !earlyAccess) {
    setFeedbackError("Please answer both questions.");
    return;
  }

  const feedbackData = {
    user: form.name?.trim() || "User",
    score: feedbackScore,
    review: feedbackReview.trim(),
    usageLikelihood,
    earlyAccess,
  };

  setFeedbackLoading(true);
  setFeedbackError("");

  try {
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(feedbackData),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || "Failed to submit feedback");
    }

    setFeedbackSubmitted(true);
  } catch (err) {
    console.error("Feedback submit failed:", err);
    setFeedbackError(
      err.message || "Could not submit your feedback. Please try again."
    );
  } finally {
    setFeedbackLoading(false);
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
      setAlreadyRegistered(true);
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
          <Image
            src="/images/xpense-banner.jpg"
            alt="Accesco Living - Wanna Skip The Line?"
            className={styles.posterImage}
            width={800}
            height={1000}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Right Panel: Clean Form Wrapper */}
        <div className={styles.rightPanel}>
          <div className={styles.brandLogoRow}>
            <Image
              src="/images/asterik.png"
              alt="Accesco mark"
              className={styles.brandAsterisk}
              width={40}
              height={40}
            />
          </div>

          <h3 className={styles.cardTitle}>Get Early Access</h3>
          <p className={styles.cardSubtitle}>
            {currentStep === 1 &&
              "Join the waitlist for early access to Accesco Living's unified commerce platform, built for groceries, food delivery, fashion, dining, home services, and member-only launch benefits."}
            {currentStep === 2 &&
              "Select the experiences you are most interested in so we can personalize your early access updates, offers, and launch notifications."}
          </p>

          {success ? (
            <div className={styles.successMessage}>
              Welcome to the waitlist! We'll be in touch soon.
            </div>
          ) : alreadyRegistered ? (
            <div className={styles.successMessage}>
              You have already registered on the waitlist — hang tight, we'll
              notify you the moment we launch!
            </div>
          ) : (
          <>
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
          </>
          )}

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
  <div className={styles.feedbackHeaderContent}>
    <span className={styles.feedbackEyebrow}>
      Your opinion matters
    </span>

    <h2 className={styles.feedbackTitle}>How are we doing?</h2>

    <p className={styles.feedbackHeaderText}>
      It’ll be really quick, we promise.
      <br />
      It takes less than <strong>30 seconds.</strong>
    </p>
  </div>

  <Image
    src="/images/asterik.png"
    alt=""
    aria-hidden="true"
    className={styles.feedbackHeaderMark}
    width={63}
    height={71}
  />
</div>

          <div className={styles.feedbackBody}>
            {!feedbackSubmitted ? (
              <>
  {feedbackError && (
    <p className={styles.feedbackError}>{feedbackError}</p>
  )}

  {feedbackStep === 1 && (
    <div className={styles.feedbackStage}>
      <div className={styles.feedbackInfoRow}>
        <div className={styles.feedbackIconBox}>
          <UserRound size={18} />
        </div>

        <div>
          <p className={styles.feedbackGreeting}>
            Hi {form.name?.trim() || "User"},
          </p>

          <p className={styles.feedbackDescription}>
            Thank you for being part of the Accesco Living community.
            Your feedback helps us create a smarter and more convenient
            experience for everyone.
          </p>
        </div>
      </div>

      <div className={styles.feedbackQuestionRow}>
        <div className={styles.feedbackIconBox}>
          <Star size={18} />
        </div>

        <div className={styles.feedbackQuestionContent}>
          <h3 className={styles.feedbackQuestion}>
            On a scale of 0–10, how likely are you to recommend
            Accesco Living to a friend, family member, or colleague?
          </h3>

          <span className={styles.feedbackHint}>Select a rating</span>

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
                className={`${styles.ratingButton} ${
                  feedbackScore === index
                    ? styles.ratingButtonSelected
                    : ""
                }`}
                onClick={() => {
                  setFeedbackScore(index);
                  setFeedbackError("");
                }}
              >
                {index}
              </button>
            ))}
          </div>

          <div className={styles.ratingLabels}>
            <span>Not at all likely</span>
            <span>Extremely likely</span>
          </div>
        </div>
      </div>

      <div className={styles.feedbackQuestionRow}>
        <div className={styles.feedbackIconBox}>
          <MessageCircle size={18} />
        </div>

        <div className={styles.feedbackQuestionContent}>
          <label
            htmlFor="feedback-review"
            className={styles.reviewBoxLabel}
          >
            Tell us more
            <span className={styles.reviewOptional}>(optional)</span>
          </label>

          <span className={styles.feedbackHint}>
            Share what you liked or what we could improve.
          </span>

          <div className={styles.reviewBoxContainer}>
            <textarea
              id="feedback-review"
              className={styles.reviewBox}
              placeholder="Share your thoughts..."
              value={feedbackReview}
              onChange={(e) => setFeedbackReview(e.target.value)}
              maxLength={300}
            />

            <span className={styles.reviewCharacterCount}>
              {feedbackReview.length}/300
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        className={styles.feedbackSubmitButton}
        onClick={handleFeedbackNext}
      >
        Next
        <ArrowRight size={16} />
      </button>
    </div>
  )}

  {feedbackStep === 2 && (
    <div className={styles.feedbackStage}>
      <div className={styles.feedbackQuestionRow}>
        <div className={styles.feedbackIconBox}>
          <Star size={18} />
        </div>

        <div className={styles.feedbackQuestionContent}>
          <h3 className={styles.feedbackQuestion}>
            If Accesco Living launched in your city tomorrow, how
            likely would you be to use it?
          </h3>

          <div className={styles.feedbackOptions}>
            {[
              "Definitely",
              "Probably",
              "Not Sure",
              "Probably Not",
              "Definitely Not",
            ].map((option) => (
              <label
                key={option}
                className={`${styles.feedbackOption} ${
                  usageLikelihood === option
                    ? styles.feedbackOptionSelected
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name="usage-likelihood"
                  value={option}
                  checked={usageLikelihood === option}
                  onChange={(e) => {
                    setUsageLikelihood(e.target.value);
                    setFeedbackError("");
                  }}
                />

                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.feedbackQuestionRow}>
        <div className={styles.feedbackIconBox}>
          <MessageCircle size={18} />
        </div>

        <div className={styles.feedbackQuestionContent}>
          <h3 className={styles.feedbackQuestion}>
            Would you like early access to our public beta?
          </h3>

          <div className={styles.earlyAccessOptions}>
            {["Yes", "Maybe Later", "No"].map((option) => (
              <label
                key={option}
                className={`${styles.feedbackOption} ${
                  earlyAccess === option
                    ? styles.feedbackOptionSelected
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name="early-access"
                  value={option}
                  checked={earlyAccess === option}
                  onChange={(e) => {
                    setEarlyAccess(e.target.value);
                    setFeedbackError("");
                  }}
                />

                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        className={styles.feedbackSubmitButton}
        disabled={feedbackLoading}
        onClick={handleFeedbackSubmit}
      >
        {feedbackLoading ? "Submitting..." : "Submit Feedback"}
      </button>
    </div>
  )}
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
                    setUsageLikelihood("");
  setEarlyAccess("");
  setFeedbackStep(1);
  setFeedbackError("");
                    setFeedbackSubmitted(false);
                  }}
                >
                  Change my response
                </button>
              </div>
            )}
          </div>
        </div>
        <p className={styles.feedbackPrivacy}>
  <LockKeyhole size={13} />
  Your feedback is private and helps us improve Accesco Living.
</p>
      </section>

      {/* ── Bengaluru Launch Banner Section ── */}
      <section className="bengaluru-launch-section">
        <div className="bengaluru-launch-wrapper">
          <div className="bengaluru-launch-card">
            <picture>
              <source
                media="(max-width: 768px)"
                srcSet="/images/bengaluru-launch-map.jpg"
              />
              <Image
                src="/images/bengaluru-launch-map.jpg"
                alt="We're Coming, Bengaluru! - Accesco Living Launching Soon"
                width={1920}
                height={1347}
                className="bengaluru-launch-img"
                sizes="(max-width: 768px) 100vw, 1200px"
                quality={90}
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
              />
            </picture>
          </div>
        </div>
      </section>

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
        <a href="#" className={styles.appStoreHotspot} aria-label="App Store" />
      </div>
    </section>
  );
}
