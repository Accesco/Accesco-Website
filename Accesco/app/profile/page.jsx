"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import AccescoHeader from "../../components/AccescoHeader";
import AuthModal from "../components/AuthModal";
import { useAuth } from "../components/AuthProvider";
import ActiveOrdersWidget from "../../components/ActiveOrdersWidget";
import "./profile.css";

const exploreLinks = [
  {
    label: "Invite & Earn",
    href: "/referral",
    icon: "ri-gift-line",
    text: "Refer friends and unlock milestone gifts",
  },
  {
    label: "Accesco Library",
    href: "/accesco-library",
    icon: "ri-play-circle-line",
    text: "Watch curated stories and brand updates",
  },
  {
    label: "Xpense Meter",
    href: "/calculator",
    icon: "ri-calculator-line",
    text: "Plan and manage monthly spending",
  },
  {
    label: "Partner with Us",
    href: "/partner",
    icon: "ri-team-line",
    text: "Collaborate and grow with Accesco",
  },
];

export default function ProfilePage() {
  const { user, loading, signOut, signIn } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [totalOrders, setTotalOrders] = useState(0);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [accountForm, setAccountForm] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const handleLoginSuccess = (userData) => {
    signIn(userData);
    closeLoginModal();
  };

  const displayName = user?.name || "Accesco User";

  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .map((name) => name[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "AU";

  const fileInputRef = useRef(null);
  const profileImage = user?.profileImage || "";

  const handleOpenPhotoPicker = () => {
    fileInputRef.current?.click();
  };

  const handleProfileImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file || !user) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a JPG, PNG, or WEBP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 1.5 * 1024 * 1024) {
      alert("Please choose an image smaller than 1.5 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const updatedUser = {
        ...user,
        profileImage: reader.result,
      };

      signIn(updatedUser);
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleRemoveProfileImage = () => {
    if (!user) return;

    const updatedUser = { ...user };
    delete updatedUser.profileImage;

    signIn(updatedUser);
  };
  useEffect(() => {
    if (user) {
      setAccountForm({
        name: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleAccountFormChange = (event) => {
    const { name, value } = event.target;

    setAccountForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditAccountDetails = () => {
    setIsEditingDetails(true);
  };

  const handleCancelAccountEdit = () => {
    setAccountForm({
      name: user?.name || "",
      phone: user?.phone || "",
      email: user?.email || "",
    });

    setIsEditingDetails(false);
  };

  const handleSaveAccountDetails = (event) => {
    event.preventDefault();

    const name = accountForm.name.trim();
    const phone = accountForm.phone.trim();
    const email = accountForm.email.trim();

    if (!name) {
      alert("Please enter your name.");
      return;
    }

    if (phone && !/^[0-9]{10}$/.test(phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    const updatedUser = {
      ...user,
      name,
      phone,
      email,
    };

    signIn(updatedUser);
    setIsEditingDetails(false);
  };
  useEffect(() => {
    const grokly = JSON.parse(localStorage.getItem("grokly_orders") || "[]");
    const swadishtt = JSON.parse(
      localStorage.getItem("swadishtt-orders") || "[]",
    );
    const instastyle = JSON.parse(
      localStorage.getItem("instastyle_orders") || "[]",
    );

    setTotalOrders(grokly.length + swadishtt.length + instastyle.length);
  }, []);

  return (
    <>
      <AccescoHeader />

      <main className="profile-page">
        <section className="profile-hero">
          <div className="profile-hero-main">
            <div className="profile-hero-badge">
              <i className="ri-user-3-line"></i>
              <span>Your Account</span>
            </div>

            <h1>My Profile</h1>

            <p>
              Manage your profile details, order activity, and Accesco services
              from one clean dashboard.
            </p>
          </div>

          <div className="profile-hero-side">
            <div
              className={`profile-hero-avatar ${profileImage ? "has-image" : ""}`}
            >
              {profileImage ? (
                <img src={profileImage} alt={`${displayName} profile`} />
              ) : (
                initials
              )}
            </div>

            <div className="profile-hero-user">
              <span>Welcome back</span>
              <strong>{displayName}</strong>
            </div>
          </div>
        </section>

        {loading && (
          <section className="profile-loading">
            <span>Loading profile...</span>
          </section>
        )}

        {!loading && !user && (
          <section className="profile-login-card">
            <div className="profile-login-icon">
              <i className="ri-user-line"></i>
            </div>

            <p className="profile-kicker">Login Required</p>
            <h2>You are not logged in</h2>
            <p>
              Continue to view your orders, profile details, and saved account
              information.
            </p>

            <button className="profile-primary-btn" onClick={openLoginModal}>
              <i className="ri-login-box-line"></i>
              Continue
            </button>
          </section>
        )}

        {!loading && user && (
          <>
            <input
              ref={fileInputRef}
              className="profile-photo-input"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleProfileImageChange}
            />
            <section className="profile-main-card">
              <div className="profile-avatar-box clean-avatar-box">
                <button
                  type="button"
                  className={`profile-avatar profile-avatar-button ${profileImage ? "has-image" : ""}`}
                  onClick={handleOpenPhotoPicker}
                  aria-label="Update profile picture"
                >
                  {profileImage ? (
                    <img src={profileImage} alt={`${displayName} profile`} />
                  ) : (
                    initials
                  )}
                </button>

                <button
                  type="button"
                  className="profile-avatar-edit-clean"
                  onClick={handleOpenPhotoPicker}
                  aria-label="Edit profile picture"
                >
                  <i className="ri-pencil-line"></i>
                </button>
              </div>

              <div className="profile-user-info">
                <p className="profile-kicker">Verified Member</p>
                <h2>{displayName}</h2>

                <div className="profile-contact-list">
                  {user.phone && (
                    <span>
                      <i className="ri-phone-line"></i>
                      {user.phone}
                    </span>
                  )}

                  {user.email && (
                    <span>
                      <i className="ri-mail-line"></i>
                      {user.email}
                    </span>
                  )}
                </div>
                {profileImage && (
                  <div className="profile-photo-actions">
                    <button
                      type="button"
                      className="profile-photo-action secondary"
                      onClick={handleRemoveProfileImage}
                    >
                      <i className="ri-close-circle-line"></i>
                      Remove Picture
                    </button>
                  </div>
                )}
              </div>

              <button className="profile-outline-btn" onClick={signOut}>
                <i className="ri-logout-box-r-line"></i>
                Sign Out
              </button>
            </section>

            <section className="profile-stats">
              <div className="profile-stats-header">
                <p>Account Overview</p>
                <h3>Your activity at a glance</h3>
              </div>

              <div className="profile-stats-list">
                <div className="profile-stat-card">
                  <div className="profile-stat-icon">
                    <i className="ri-shopping-bag-3-line"></i>
                  </div>

                  <div>
                    <span>Total Orders</span>
                    <strong>{totalOrders}</strong>
                  </div>
                </div>

                <div className="profile-stat-card">
                  <div className="profile-stat-icon">
                    <i className="ri-gift-line"></i>
                  </div>

                  <div>
                    <span>Rewards</span>
                    <strong>0</strong>
                  </div>
                </div>

                <div className="profile-stat-card">
                  <div className="profile-stat-icon">
                    <i className="ri-shield-check-line"></i>
                  </div>

                  <div>
                    <span>Status</span>
                    <strong>Active</strong>
                  </div>
                </div>
              </div>
            </section>

            <ActiveOrdersWidget />

            <section className="profile-grid">
              <div className="profile-settings-group">
                <p className="profile-group-label">Account</p>
                <article className="profile-card profile-settings-card">
                  <div className="profile-card-heading profile-card-heading-between">
                    <div className="profile-card-title">
                      <i className="ri-user-settings-line"></i>
                      <h3>Account Details</h3>
                    </div>

                    {!isEditingDetails && (
                      <button
                        type="button"
                        className="profile-edit-details-btn"
                        onClick={handleEditAccountDetails}
                      >
                        <i className="ri-pencil-line"></i>
                        Edit
                      </button>
                    )}
                  </div>

                  {!isEditingDetails ? (
                    <div className="profile-settings-list">
                      <div className="profile-setting-row">
                        <div className="profile-setting-row-left">
                          <i className="ri-user-line profile-setting-row-icon"></i>
                          <span>Name</span>
                        </div>
                        <strong>{displayName}</strong>
                      </div>

                      <div className="profile-setting-row">
                        <div className="profile-setting-row-left">
                          <i className="ri-phone-line profile-setting-row-icon"></i>
                          <span>Phone</span>
                        </div>
                        <strong>{user.phone || "Not added"}</strong>
                      </div>

                      <div className="profile-setting-row">
                        <div className="profile-setting-row-left">
                          <i className="ri-mail-line profile-setting-row-icon"></i>
                          <span>Email</span>
                        </div>
                        <strong>{user.email || "Not added"}</strong>
                      </div>
                    </div>
                  ) : (
                    <form
                      className="profile-edit-form profile-settings-form"
                      onSubmit={handleSaveAccountDetails}
                    >
                      <label className="profile-setting-row profile-setting-row-edit">
                        <div className="profile-setting-row-left">
                          <i className="ri-user-line profile-setting-row-icon"></i>
                          <span>Name</span>
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={accountForm.name}
                          onChange={handleAccountFormChange}
                          placeholder="Enter your name"
                        />
                      </label>

                      <label className="profile-setting-row profile-setting-row-edit">
                        <div className="profile-setting-row-left">
                          <i className="ri-phone-line profile-setting-row-icon"></i>
                          <span>Phone</span>
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          value={accountForm.phone}
                          onChange={handleAccountFormChange}
                          placeholder="Enter your phone number"
                          maxLength="10"
                        />
                      </label>

                      <label className="profile-setting-row profile-setting-row-edit">
                        <div className="profile-setting-row-left">
                          <i className="ri-mail-line profile-setting-row-icon"></i>
                          <span>Email</span>
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={accountForm.email}
                          onChange={handleAccountFormChange}
                          placeholder="Enter your email"
                        />
                      </label>

                      <div className="profile-edit-actions">
                        <button
                          type="submit"
                          className="profile-save-details-btn"
                        >
                          <i className="ri-check-line"></i>
                          Save Changes
                        </button>

                        <button
                          type="button"
                          className="profile-cancel-details-btn"
                          onClick={handleCancelAccountEdit}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </article>
              </div>

              <div className="profile-settings-group">
                <p className="profile-group-label">Security</p>
                <article className="profile-card profile-settings-card">
                  <div className="profile-card-heading">
                    <i className="ri-shield-check-line"></i>
                    <h3>Account Security</h3>
                  </div>

                  <div className="profile-settings-list">
                    <div className="profile-setting-row">
                      <div className="profile-setting-row-left">
                        <i className="ri-shield-check-line profile-setting-row-icon"></i>
                        <span>Protected Account</span>
                      </div>
                      <span className="profile-pill">Protected Account</span>
                    </div>

                    <div className="profile-setting-row">
                      <div className="profile-setting-row-left">
                        <i className="ri-notification-3-line profile-setting-row-icon"></i>
                        <span>Recovery details</span>
                      </div>
                      <strong>
                        Keep your phone number and email updated for order
                        alerts and support.
                      </strong>
                    </div>
                  </div>
                </article>
              </div>

              <div className="profile-settings-group">
                <p className="profile-group-label">Explore</p>
                <article className="profile-card profile-settings-card">
                  <div className="profile-card-heading">
                    <i className="ri-apps-line"></i>
                    <h3>Explore Accesco</h3>
                  </div>

                  <div className="profile-settings-list">
                    {exploreLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="profile-setting-link-row"
                      >
                        <span className="profile-setting-row-left">
                          <span className="profile-setting-row-icon profile-setting-row-icon-image">
                            <i className={item.icon}></i>
                          </span>

                          <span className="profile-setting-row-copy">
                            <strong>{item.label}</strong>
                            <small>{item.text}</small>
                          </span>
                        </span>

                        <i className="ri-arrow-right-up-line profile-service-arrow"></i>
                      </Link>
                    ))}
                  </div>
                </article>
              </div>
            </section>
          </>
        )}
      </main>

      <AuthModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onSuccess={handleLoginSuccess}
      />
    </>
  );
}
