'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './homepage.css';
import AccescoHeader from '../components/AccescoHeader';
import Hero from '../components/Hero';
import AppShowcase from '../components/AppShowcase';
import Footer from '../components/Footer';
import XpenseIntro from '@/components/XpenseIntro';

const CHATBOT_LOGO = '/logo.png';

function getChatTime() {
  return new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getAccescoReply(message) {
  const text = message.toLowerCase();

  if (text.includes('milk')) {
    return 'Sure, I can help you with milk. Are you looking for toned milk, full cream milk, or fresh dairy options?';
  }

  if (text.includes('grocery') || text.includes('groceries')) {
    return 'I can help you find groceries. What items do you need today?';
  }

  if (text.includes('food') || text.includes('restaurant')) {
    return 'I can help you discover food options. What cuisine are you craving?';
  }

  if (text.includes('fashion') || text.includes('clothes')) {
    return 'I can help you explore fashion. Are you looking for ethnic, casual, or premium wear?';
  }

  return "Hi there! You're at Accesco. What can I assist you with?";
}

function AccescoInlineChatbot() {
 const [open, setOpen] = useState(false)
const [showPreview, setShowPreview] = useState(true)
const [input, setInput] = useState('')
const [typing, setTyping] = useState(false)
  const endRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'bot',
      text: 'Welcome to Accesco! How may I support you today?',
      time: getChatTime(),
    },
  ]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = (e) => {
    e.preventDefault();

    const value = input.trim();
    if (!value) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: 'user',
        text: value,
        time: getChatTime(),
      },
    ]);

    setInput('');
    setTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'bot',
          text: getAccescoReply(value),
          time: getChatTime(),
        },
      ]);

      setTyping(false);
    }, 650);
  };

  return (
    <>
{!open && (
  <div className="ac-ai-preview-wrap">
    {showPreview && (
      <div
        className="ac-ai-preview-card"
        onClick={() => setOpen(true)}
        role="button"
        tabIndex={0}
      >
        <div className="ac-ai-preview-bubble">
          <p className="ac-ai-preview-text">
            Hi there! You're at Accesco. What can I assist you with?
          </p>
        </div>

        <button
          type="button"
          className="ac-ai-preview-close"
          onClick={(e) => {
            e.stopPropagation()
            setShowPreview(false)
          }}
          aria-label="Close preview"
        >
          ×
        </button>
      </div>
    )}

    <button
      className="ac-ai-chatbot-icon"
      onClick={() => setOpen(true)}
      aria-label="Open Accesco AI"
      type="button"
    >
      <svg
        viewBox="0 0 64 64"
        fill="none"
        aria-hidden="true"
        className="ac-ai-bot-svg"
      >
        <path
          d="M32 15V10"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
        />

        <circle cx="32" cy="8" r="3.6" fill="white" />

        <rect x="18" y="20" width="28" height="22" rx="10" fill="white" />

        <rect x="12" y="27" width="6" height="9" rx="3" fill="white" />

        <rect x="46" y="27" width="6" height="9" rx="3" fill="white" />

        <circle cx="26.5" cy="31" r="2.4" fill="#97004F" />
        <circle cx="37.5" cy="31" r="2.4" fill="#97004F" />

        <path
          d="M27 36.5C28.7 38 30.5 38.6 32 38.6C33.5 38.6 35.3 38 37 36.5"
          stroke="#97004F"
          strokeWidth="2.6"
          strokeLinecap="round"
        />

        <path d="M25 41L21 49L31 43.5" fill="white" />
      </svg>
    </button>
  </div>
)}

      {open && (
        <>
          <section className="ac-ai-window">
            <header className="ac-ai-header">
              <div className="ac-ai-brand">
                <div className="ac-ai-header-logo">
                  <img src={CHATBOT_LOGO} alt="Accesco AI" />
                </div>

                <div>
                  <h3>Accesco AI</h3>
                  <p>Your intelligent assistant</p>
                </div>
              </div>

              <div className="ac-ai-actions">
                <button type="button" onClick={() => setOpen(false)}>
                  ×
                </button>
              </div>
            </header>

            <main className="ac-ai-messages">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`ac-ai-row ${msg.role === 'user' ? 'user' : 'bot'}`}
                >
                  {msg.role === 'bot' && (
                    <div className="ac-ai-avatar">
                      <img src={CHATBOT_LOGO} alt="Accesco" />
                    </div>
                  )}

                  <div className="ac-ai-message-stack">
                    <div className="ac-ai-bubble">
                      <span>{msg.text}</span>

                      {msg.role === 'user' && (
                        <span className="ac-ai-user-time">
                          {msg.time}
                        </span>
                      )}
                    </div>

                    {msg.role === 'bot' && (
                      <div className="ac-ai-time">{msg.time}</div>
                    )}
                  </div>
                </div>
              ))}

              {typing && (
                <div className="ac-ai-row bot">
                  <div className="ac-ai-avatar">
                    <img src={CHATBOT_LOGO} alt="Accesco" />
                  </div>

                  <div className="ac-ai-message-stack">
                    <div className="ac-ai-bubble typing">
                      <i />
                      <i />
                      <i />
                    </div>
                  </div>
                </div>
              )}

              <div ref={endRef} />
            </main>

            <form className="ac-ai-input-area" onSubmit={sendMessage}>
              <div className="ac-ai-input-pill">
                <span className="ac-ai-sparkle">✦</span>

                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask something..."
                />

                <button type="submit" aria-label="Send">
                  <svg width="27" height="27" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M22 2L11 13"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22 2L15 22L11 13L2 9L22 2Z"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </section>

          <button
            className="ac-ai-floating-close"
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close Accesco AI"
          >
            ×
          </button>
        </>
      )}

      <style jsx>{`
        .ac-ai-launcher,
        .ac-ai-floating-close {
          position: fixed;
          right: 38px;
          bottom: 34px;
          z-index: 99999;
          width: 74px;
          height: 74px;
          border-radius: 999px;
          border: 0;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(145deg, #8a0048 0%, #650035 100%);
          box-shadow:
            0 22px 52px rgba(80, 0, 40, 0.42),
            inset 0 1px 0 rgba(255, 255, 255, 0.22);
          transition:
            transform 180ms ease,
            box-shadow 180ms ease;
        }

        .ac-ai-launcher:hover,
        .ac-ai-floating-close:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow:
            0 28px 68px rgba(80, 0, 40, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.26);
        }

        .ac-ai-launcher img {
          width: 48px;
          height: 48px;
          object-fit: contain;
          filter: brightness(0) invert(1);
        }

        .ac-ai-floating-close {
          color: #ffffff;
          font-size: 48px;
          font-weight: 300;
          line-height: 1;
        }

        .ac-ai-window {
          position: fixed;
          right: 72px;
          bottom: 82px;
          z-index: 99998;
          width: min(850px, calc(100vw - 36px));
          height: min(830px, calc(100vh - 110px));
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border-radius: 28px;
          background:
            radial-gradient(circle at 20% 10%, rgba(255, 255, 255, 0.34), transparent 32%),
            linear-gradient(180deg, #fffaf3 0%, #fff8ef 100%);
          border: 1px solid rgba(255, 255, 255, 0.72);
          box-shadow:
            0 36px 90px rgba(45, 22, 20, 0.26),
            0 12px 34px rgba(110, 0, 55, 0.14);
        }

        .ac-ai-header {
          height: 126px;
          flex: 0 0 126px;
          padding: 26px 42px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background:
            radial-gradient(circle at 18% 0%, rgba(255, 255, 255, 0.13), transparent 28%),
            linear-gradient(135deg, #76003d 0%, #9a004f 50%, #72003b 100%);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.16),
            0 18px 46px rgba(90, 0, 48, 0.15);
        }

        .ac-ai-brand {
          display: flex;
          align-items: center;
          gap: 24px;
          color: #ffffff;
        }

        .ac-ai-header-logo {
          width: 78px;
          height: 78px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ac-ai-header-logo img {
          width: 78px;
          height: 78px;
          object-fit: contain;
          filter: brightness(0) invert(1);
        }

        .ac-ai-brand h3 {
          margin: 0 0 7px;
          color: #ffffff;
          font-size: 31px;
          line-height: 1;
          font-weight: 700;
          letter-spacing: -0.035em;
        }

        .ac-ai-brand p {
          margin: 0;
          color: rgba(255, 255, 255, 0.86);
          font-size: 21px;
          line-height: 1.2;
          font-weight: 400;
          letter-spacing: -0.02em;
        }

        .ac-ai-actions {
          display: flex;
          align-items: center;
          gap: 30px;
        }

        .ac-ai-actions button {
          width: 38px;
          height: 38px;
          border: 0;
          background: transparent;
          color: #ffffff;
          cursor: pointer;
          font-size: 43px;
          line-height: 1;
          font-weight: 300;
        }

        .ac-ai-actions button:first-child {
          font-size: 38px;
          transform: translateY(-5px);
        }

        .ac-ai-messages {
          flex: 1;
          overflow-y: auto;
          padding: 42px 42px 24px;
          background:
            radial-gradient(circle at 8% 8%, rgba(255, 255, 255, 0.95), transparent 28%),
            linear-gradient(180deg, #fffaf3 0%, #fff8ef 100%);
          scrollbar-width: thin;
          scrollbar-color: #8a0048 transparent;
        }

        .ac-ai-messages::-webkit-scrollbar {
          width: 8px;
        }

        .ac-ai-messages::-webkit-scrollbar-track {
          background: transparent;
        }

        .ac-ai-messages::-webkit-scrollbar-thumb {
          background: #8a0048;
          border-radius: 999px;
        }

        .ac-ai-row {
          display: flex;
          gap: 22px;
          margin-bottom: 30px;
        }

        .ac-ai-row.user {
          justify-content: flex-end;
          margin-bottom: 24px;
        }

        .ac-ai-avatar {
          width: 62px;
          height: 62px;
          border-radius: 999px;
          overflow: hidden;
          background: linear-gradient(145deg, #95004d, #71003c);
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
          box-shadow:
            0 12px 30px rgba(120, 0, 62, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.14);
        }

        .ac-ai-avatar img {
          width: 48px;
          height: 48px;
          object-fit: contain;
          filter: brightness(0) invert(1);
        }

        .ac-ai-message-stack {
          max-width: 520px;
        }

        .ac-ai-row.user .ac-ai-message-stack {
          max-width: 470px;
        }

        .ac-ai-bubble {
          border-radius: 22px;
          padding: 21px 26px;
          color: #121722;
          background: rgba(255, 255, 255, 0.86);
          border: 1px solid rgba(90, 0, 48, 0.08);
          box-shadow:
            0 12px 30px rgba(40, 18, 15, 0.055),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          font-size: 24px;
          line-height: 1.42;
          font-weight: 400;
          letter-spacing: -0.03em;
        }

        .ac-ai-row.user .ac-ai-bubble {
          min-width: 390px;
          min-height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 28px;
          padding: 20px 25px 20px 30px;
          color: #ffffff;
          background:
            radial-gradient(circle at 15% 0%, rgba(255, 255, 255, 0.12), transparent 35%),
            linear-gradient(135deg, #8f0049 0%, #77003e 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 25px;
          box-shadow:
            0 16px 36px rgba(120, 0, 62, 0.22),
            inset 0 1px 0 rgba(255, 255, 255, 0.14);
        }

        .ac-ai-user-time {
          white-space: nowrap;
          color: rgba(255, 255, 255, 0.9);
          font-size: 19px;
          font-weight: 400;
        }

        .ac-ai-time {
          margin-top: 14px;
          color: #8a0048;
          font-size: 18px;
          font-weight: 500;
        }

        .ac-ai-bubble.typing {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 22px 28px;
        }

        .ac-ai-bubble.typing i {
          width: 9px;
          height: 9px;
          border-radius: 999px;
          background: #8a0048;
          animation: acTyping 1s infinite ease-in-out;
        }

        .ac-ai-bubble.typing i:nth-child(2) {
          animation-delay: 0.14s;
        }

        .ac-ai-bubble.typing i:nth-child(3) {
          animation-delay: 0.28s;
        }

        .ac-ai-input-area {
          flex: 0 0 auto;
          padding: 18px 40px 28px;
          background: #fff8ef;
        }

        .ac-ai-input-pill {
          height: 74px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.88);
          border: 1px solid rgba(100, 0, 52, 0.08);
          box-shadow:
            0 14px 34px rgba(40, 20, 16, 0.07),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 0 18px 0 30px;
        }

        .ac-ai-sparkle {
          color: #8a0048;
          font-size: 31px;
          line-height: 1;
        }

        .ac-ai-input-pill input {
          flex: 1;
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: #151923;
          font-size: 23px;
          font-weight: 400;
          font-family: inherit;
          letter-spacing: -0.03em;
        }

        .ac-ai-input-pill input::placeholder {
          color: rgba(20, 25, 35, 0.56);
        }

        .ac-ai-input-pill button {
          width: 58px;
          height: 58px;
          border-radius: 999px;
          border: 0;
          cursor: pointer;
          color: #ffffff;
          background: linear-gradient(145deg, #8f0049, #73003c);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow:
            0 14px 30px rgba(120, 0, 62, 0.22),
            inset 0 1px 0 rgba(255, 255, 255, 0.16);
        }

        @keyframes acTyping {
          0%,
          80%,
          100% {
            opacity: 0.35;
            transform: translateY(0);
          }
          40% {
            opacity: 1;
            transform: translateY(-4px);
          }
        }

        @media (max-width: 900px) {
          .ac-ai-window {
            right: 18px;
            left: 18px;
            bottom: 92px;
            width: auto;
            height: min(760px, calc(100vh - 116px));
          }

          .ac-ai-header {
            height: 106px;
            flex-basis: 106px;
            padding: 22px 24px;
          }

          .ac-ai-header-logo,
          .ac-ai-header-logo img {
            width: 62px;
            height: 62px;
          }

          .ac-ai-brand {
            gap: 16px;
          }

          .ac-ai-brand h3 {
            font-size: 24px;
          }

          .ac-ai-brand p {
            font-size: 16px;
          }

          .ac-ai-actions {
            gap: 14px;
          }

          .ac-ai-messages {
            padding: 28px 18px 18px;
          }

          .ac-ai-bubble {
            font-size: 18px;
          }

          .ac-ai-row.user .ac-ai-bubble {
            min-width: 0;
            width: auto;
          }

          .ac-ai-user-time {
            font-size: 14px;
          }

          .ac-ai-input-area {
            padding: 14px 16px 20px;
          }

          .ac-ai-input-pill {
            height: 64px;
          }

          .ac-ai-input-pill input {
            font-size: 18px;
          }

          .ac-ai-floating-close,
          .ac-ai-launcher {
            right: 24px;
            bottom: 22px;
          }
        }
          /* SMALLER CHATBOT SIZE FIX */
.ac-ai-window {
  width: min(620px, calc(100vw - 32px)) !important;
  height: min(610px, calc(100vh - 96px)) !important;
  right: 42px !important;
  bottom: 84px !important;
  border-radius: 22px !important;
}

.ac-ai-header {
  height: 92px !important;
  flex-basis: 92px !important;
  padding: 18px 28px !important;
}

.ac-ai-brand {
  gap: 16px !important;
}

.ac-ai-header-logo {
  width: 58px !important;
  height: 58px !important;
}

.ac-ai-header-logo img {
  width: 58px !important;
  height: 58px !important;
}

.ac-ai-brand h3 {
  font-size: 24px !important;
  margin-bottom: 5px !important;
}

.ac-ai-brand p {
  font-size: 16px !important;
}

.ac-ai-actions {
  gap: 18px !important;
}

.ac-ai-actions button {
  width: 30px !important;
  height: 30px !important;
  font-size: 34px !important;
}

.ac-ai-actions button:first-child {
  font-size: 30px !important;
}

.ac-ai-messages {
  padding: 26px 28px 16px !important;
}

.ac-ai-row {
  gap: 14px !important;
  margin-bottom: 20px !important;
}

.ac-ai-row.user {
  margin-bottom: 18px !important;
}

.ac-ai-avatar {
  width: 44px !important;
  height: 44px !important;
}

.ac-ai-avatar img {
  width: 34px !important;
  height: 34px !important;
}

.ac-ai-message-stack {
  max-width: 380px !important;
}

.ac-ai-row.user .ac-ai-message-stack {
  max-width: 340px !important;
}

.ac-ai-bubble {
  padding: 14px 18px !important;
  border-radius: 17px !important;
  font-size: 17px !important;
  line-height: 1.38 !important;
}

.ac-ai-row.user .ac-ai-bubble {
  min-width: 260px !important;
  min-height: 54px !important;
  padding: 14px 18px 14px 22px !important;
  border-radius: 18px !important;
  gap: 18px !important;
}

.ac-ai-user-time {
  font-size: 13px !important;
}

.ac-ai-time {
  margin-top: 8px !important;
  font-size: 13px !important;
}

.ac-ai-input-area {
  padding: 12px 24px 20px !important;
}

.ac-ai-input-pill {
  height: 56px !important;
  padding: 0 12px 0 22px !important;
  gap: 12px !important;
}

.ac-ai-sparkle {
  font-size: 24px !important;
}

.ac-ai-input-pill input {
  font-size: 17px !important;
}

.ac-ai-input-pill button {
  width: 44px !important;
  height: 44px !important;
}

.ac-ai-input-pill button svg {
  width: 22px !important;
  height: 22px !important;
}

.ac-ai-floating-close,
.ac-ai-launcher {
  width: 58px !important;
  height: 58px !important;
  right: 32px !important;
  bottom: 24px !important;
}

.ac-ai-floating-close {
  font-size: 38px !important;
}

.ac-ai-launcher img {
  width: 38px !important;
  height: 38px !important;
}

@media (max-width: 700px) {
  .ac-ai-window {
    right: 14px !important;
    left: 14px !important;
    bottom: 84px !important;
    width: auto !important;
    height: min(560px, calc(100vh - 105px)) !important;
  }

  .ac-ai-header {
    height: 82px !important;
    flex-basis: 82px !important;
    padding: 16px 18px !important;
  }

  .ac-ai-header-logo,
  .ac-ai-header-logo img {
    width: 48px !important;
    height: 48px !important;
  }

  .ac-ai-brand h3 {
    font-size: 20px !important;
  }

  .ac-ai-brand p {
    font-size: 14px !important;
  }

  .ac-ai-messages {
    padding: 22px 16px 14px !important;
  }

  .ac-ai-bubble {
    font-size: 15px !important;
  }

  .ac-ai-row.user .ac-ai-bubble {
    min-width: 0 !important;
  }

  .ac-ai-input-area {
    padding: 10px 14px 16px !important;
  }

  .ac-ai-input-pill {
    height: 52px !important;
  }

  .ac-ai-input-pill input {
    font-size: 15px !important;
  }
}
  /* FIX: remove extra empty gaps around chatbot header/input */
.ac-ai-window {
  padding: 0 !important;
  overflow: hidden !important;
}

.ac-ai-header {
  margin: 0 !important;
  border-radius: 0 !important;
}

.ac-ai-messages {
  padding-top: 18px !important;
  padding-bottom: 8px !important;
}

.ac-ai-input-area {
  padding-top: 8px !important;
  padding-bottom: 10px !important;
}

.ac-ai-input-pill {
  margin: 0 !important;
}

/* If there is still too much blank height, make full chatbot shorter */
.ac-ai-window {
  height: min(540px, calc(100vh - 96px)) !important;
}

/* FINAL SIZE TWEAK: narrower + slightly taller */
.ac-ai-window {
  width: min(540px, calc(100vw - 32px)) !important;
  height: min(570px, calc(100vh - 96px)) !important;
  right: 42px !important;
  bottom: 84px !important;
}

/* keep messages fitting nicely in narrower box */
.ac-ai-message-stack {
  max-width: 330px !important;
}

.ac-ai-row.user .ac-ai-message-stack {
  max-width: 310px !important;
}

.ac-ai-row.user .ac-ai-bubble {
  min-width: 230px !important;
}

/* slightly reduce horizontal padding because width is smaller */
.ac-ai-header {
  padding-left: 24px !important;
  padding-right: 24px !important;
}

.ac-ai-messages {
  padding-left: 24px !important;
  padding-right: 24px !important;
}

.ac-ai-input-area {
  padding-left: 22px !important;
  padding-right: 22px !important;
}

/* MAKE CHATBOT EVEN NARROWER */
.ac-ai-window {
 width: min(420px, calc(100vw - 32px)) !important;
  height: min(570px, calc(100vh - 96px)) !important;
}

/* adjust bubbles for narrow width */
.ac-ai-message-stack {
  max-width: 285px !important;
}

.ac-ai-row.user .ac-ai-message-stack {
  max-width: 270px !important;
}

.ac-ai-row.user .ac-ai-bubble {
  min-width: 200px !important;
  gap: 14px !important;
}

/* reduce side padding */
.ac-ai-header {
  padding-left: 20px !important;
  padding-right: 20px !important;
}

.ac-ai-messages {
  padding-left: 20px !important;
  padding-right: 20px !important;
}

.ac-ai-input-area {
  padding-left: 18px !important;
  padding-right: 18px !important;
}

.ac-ai-input-pill {
  padding-left: 18px !important;
  padding-right: 10px !important;
}

/* COMPACT CHATBOT: smaller width, height, and font sizes */
.ac-ai-window {
  width: min(400px, calc(100vw - 28px)) !important;
  height: min(500px, calc(100vh - 90px)) !important;
  right: 36px !important;
  bottom: 76px !important;
  border-radius: 20px !important;
}

.ac-ai-header {
  height: 74px !important;
  flex-basis: 74px !important;
  padding: 14px 18px !important;
}

.ac-ai-brand {
  gap: 12px !important;
}

.ac-ai-header-logo,
.ac-ai-header-logo img {
  width: 44px !important;
  height: 44px !important;
}

.ac-ai-brand h3 {
  font-size: 19px !important;
  margin: 0 0 4px !important;
  font-weight: 700 !important;
}

.ac-ai-brand p {
  font-size: 13px !important;
  line-height: 1.15 !important;
}

.ac-ai-actions {
  gap: 10px !important;
}

.ac-ai-actions button {
  width: 26px !important;
  height: 26px !important;
  font-size: 28px !important;
}

.ac-ai-actions button:first-child {
  font-size: 25px !important;
  transform: translateY(-4px) !important;
}

.ac-ai-messages {
  padding: 18px 18px 8px !important;
}

.ac-ai-row {
  gap: 10px !important;
  margin-bottom: 14px !important;
}

.ac-ai-row.user {
  margin-bottom: 12px !important;
}

.ac-ai-avatar {
  width: 36px !important;
  height: 36px !important;
}

.ac-ai-avatar img {
  width: 28px !important;
  height: 28px !important;
}

.ac-ai-message-stack {
  max-width: 260px !important;
}

.ac-ai-row.user .ac-ai-message-stack {
  max-width: 245px !important;
}

.ac-ai-bubble {
  padding: 11px 14px !important;
  border-radius: 14px !important;
  font-size: 14px !important;
  line-height: 1.36 !important;
}

.ac-ai-row.user .ac-ai-bubble {
  min-width: 170px !important;
  min-height: 44px !important;
  padding: 11px 14px !important;
  border-radius: 15px !important;
  gap: 10px !important;
}

.ac-ai-user-time {
  font-size: 11px !important;
}

.ac-ai-time {
  margin-top: 6px !important;
  font-size: 11px !important;
}

.ac-ai-input-area {
  padding: 8px 14px 14px !important;
}

.ac-ai-input-pill {
  height: 46px !important;
  padding: 0 9px 0 15px !important;
  gap: 9px !important;
}

.ac-ai-sparkle {
  font-size: 20px !important;
}

.ac-ai-input-pill input {
  font-size: 14px !important;
}

.ac-ai-input-pill button {
  width: 36px !important;
  height: 36px !important;
}

.ac-ai-input-pill button svg {
  width: 18px !important;
  height: 18px !important;
}

.ac-ai-floating-close,
.ac-ai-launcher {
  width: 50px !important;
  height: 50px !important;
  right: 28px !important;
  bottom: 20px !important;
}

.ac-ai-floating-close {
  font-size: 32px !important;
}

.ac-ai-launcher img {
  width: 32px !important;
  height: 32px !important;
}

@media (max-width: 600px) {
  .ac-ai-window {
    right: 12px !important;
    left: 12px !important;
    bottom: 74px !important;
    width: auto !important;
    height: min(500px, calc(100vh - 95px)) !important;
  }
}
  /* CLOSED STATE PREVIEW like screenshot */
/* CLOSED STATE PREVIEW - smaller, lighter, cleaner */
.ac-ai-preview-wrap {
  position: fixed;
  right: 18px;
  bottom: 18px;
  z-index: 99999;
  display: flex;
  align-items: center;
  gap: 12px;
}

.ac-ai-preview-card {
  width: 430px;
  min-height: 64px;
  padding: 10px 44px 10px 14px;
  background: rgba(122, 0, 66, 0.045);
  border: 1px solid rgba(122, 0, 66, 0.08);
  border-radius: 4px;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
}

.ac-ai-preview-text {
  margin: 0;
  color: #1b1b1b;
  font-size: 13px;
  line-height: 1.4;
  font-weight: 400;
  max-width: 340px;
}

.ac-ai-preview-close {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  border: 0;
  background: transparent;
  color: #1a1a1a;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ac-ai-chatbot-icon {
  width: 60px;
  height: 60px;
  border-radius: 999px;
  border: 0;
  cursor: pointer;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, #9a004f 0%, #76003d 100%);
  box-shadow:
    0 10px 22px rgba(122, 0, 66, 0.22),
    inset 0 1px 0 rgba(255, 255, 255, 0.16);
  padding: 0;
}

.ac-ai-chatbot-icon img {
  width: 34px;
  height: 34px;
  object-fit: contain;
  filter: brightness(0) invert(1);
  display: block;
}

@media (max-width: 700px) {
  .ac-ai-preview-wrap {
    right: 12px;
    left: 12px;
    bottom: 14px;
    gap: 10px;
  }

  .ac-ai-preview-card {
    flex: 1;
    width: auto;
    min-height: 58px;
    padding: 8px 40px 8px 12px;
  }

  .ac-ai-preview-text {
    font-size: 12px;
    max-width: none;
  }

  .ac-ai-preview-close {
    width: 22px;
    height: 22px;
    font-size: 16px;
  }

  .ac-ai-chatbot-icon {
    width: 54px;
    height: 54px;
  }

  .ac-ai-chatbot-icon img {
    width: 30px;
    height: 30px;
  }
}

/* hide old launcher styling effect for closed state */
.ac-ai-launcher {
  display: none !important;
}

@media (max-width: 700px) {
  .ac-ai-preview-wrap {
    right: 12px;
    left: 12px;
    bottom: 16px;
    gap: 10px;
  }

  .ac-ai-preview-card {
    flex: 1;
    width: auto;
    min-height: 72px;
    padding: 12px 46px 12px 14px;
  }

  .ac-ai-preview-text {
    font-size: 15px;
    max-width: none;
  }

  .ac-ai-chatbot-icon {
    width: 56px;
    height: 56px;
  }

  .ac-ai-chatbot-icon svg {
    width: 36px;
    height: 36px;
  }
}

/* FINAL PREVIEW BOX: smaller + opaque light maroon */
.ac-ai-preview-card {
  width: 330px !important;
  min-height: 48px !important;
  padding: 8px 36px 8px 12px !important;

  background: #f8eef3 !important; /* opaque very light maroon */
  border: 1px solid rgba(122, 0, 66, 0.10) !important;
  border-radius: 6px !important;

  box-shadow: 0 8px 18px rgba(80, 0, 40, 0.08) !important;
}

.ac-ai-preview-text {
  font-size: 12px !important;
  line-height: 1.35 !important;
  max-width: 270px !important;
  color: #1a0a12 !important;
}

.ac-ai-preview-close {
  right: 10px !important;
  width: 20px !important;
  height: 20px !important;
  font-size: 16px !important;
}

.ac-ai-preview-wrap {
  gap: 10px !important;
}

/* slightly smaller maroon logo button too */
.ac-ai-chatbot-icon {
  width: 52px !important;
  height: 52px !important;
}

.ac-ai-chatbot-icon img {
  width: 29px !important;
  height: 29px !important;
}

/* reduce closed preview text box width */
.ac-ai-preview-card {
  width: 260px !important;
}

.ac-ai-preview-text {
  max-width: 205px !important;
  font-size: 12px !important;
}

/* FINAL CLOSED PREVIEW: white outer box + blue bot icon */
.ac-ai-preview-card {
  width: 250px !important;
  min-height: 54px !important;
  padding: 8px 34px 8px 8px !important;

  background: #ffffff !important;
  border: 1px solid rgba(0, 0, 0, 0.06) !important;
  border-radius: 2px !important;

  box-shadow:
    0 8px 20px rgba(0, 0, 0, 0.08),
    0 1px 0 rgba(255, 255, 255, 0.9) inset !important;
}

.ac-ai-preview-bubble {
  width: 100% !important;
  padding: 8px 12px !important;
  background: #f8eef3 !important;
  border-radius: 10px !important;
}

.ac-ai-preview-text {
  margin: 0 !important;
  max-width: 185px !important;
  color: #101010 !important;
  font-size: 11.5px !important;
  line-height: 1.35 !important;
  font-weight: 400 !important;
}

.ac-ai-preview-close {
  right: 9px !important;
  width: 18px !important;
  height: 18px !important;
  color: #191919 !important;
  font-size: 18px !important;
  font-weight: 500 !important;
}

/* cleaner maroon chatbot icon */
.ac-ai-chatbot-icon {
  width: 56px !important;
  height: 56px !important;
  border-radius: 999px !important;
  border: 0 !important;
  cursor: pointer !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 0 !important;

  background: linear-gradient(145deg, #9a004f 0%, #76003d 100%) !important;

  box-shadow:
    0 12px 24px rgba(122, 0, 66, 0.24),
    inset 0 1px 0 rgba(255, 255, 255, 0.16) !important;
}

.ac-ai-chatbot-icon svg {
  width: 36px !important;
  height: 36px !important;
  display: block !important;
}

.ac-ai-chatbot-icon img {
  display: none !important;
}

/* increase closed preview message length */
.ac-ai-preview-card {
  width: 360px !important;
}

.ac-ai-preview-bubble {
  padding: 9px 16px !important;
}

.ac-ai-preview-text {
  max-width: 285px !important;
}

      `}</style>
    </>
  );
}




export default function HomePage() {
  const [isClient, setIsClient] = useState(false);
  const scrollRef = useRef(null);
  const deliveryRef = useRef(null);
const [deliveryVisible, setDeliveryVisible] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      setDeliveryVisible(entry.isIntersecting);
    },
    { threshold: 0.35 }
  );

  if (deliveryRef.current) {
    observer.observe(deliveryRef.current);
  }

  return () => observer.disconnect();
}, []);

  const scroll = (direction) => {
  if (scrollRef.current) {
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -300 : 300,
      behavior: 'smooth',
    });
  }
};

 return (
  <>
    <AccescoHeader />
      <main>
        {/* ── Hero Section ── */}
        <Hero />
{/* Mobile Launch Poster */}
<section className="mobileLaunchPoster">
  <img
    src="/images/poster-newspaper.jpeg"
    alt="Launching Soon"
  />
</section>
        {/* ── Services Section ── */}
       <section
  id="services"
>

          <div className="intelligencePosterRow">

  {/* Intelligence Image */}
  <div className="intelligenceSection">
    
    <picture>
  <source
    media="(max-width: 768px)"
    srcSet="/images/YOUR-MOBILE-IMAGE.jpeg"
  />
    <Image
  src="/images/intelligence-layer.png"
  alt="Accesco Intelligence Layer"
  width={1600}
  height={900}
  className="intelligenceImage"
  sizes="100vw"
  quality={80}
/>
</picture>
  </div>

  {/* Poster */}
  <div className="postersSectionWrapper">
  
    <div
      className="postersTiltCard"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        e.currentTarget.style.transform =
          `perspective(800px) rotateY(${x * 18}deg) rotateX(${-y * 18}deg) scale(1.03)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform =
          'perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)';
      }}
    >
      <img
        src="/images/poster-newspaper.jpeg"
        alt="Accesco Living - Something exciting is coming"
        className="postersTiltImg"
      />
    </div>
  </div>

</div>
          <div className="servicesRadialOverlay" />

  <div
    ref={deliveryRef}
    className={`deliveryHeadingFrame ${deliveryVisible ? "is-visible" : ""}`}
  >
<div className="floatingHeroItems">
  <img src="/images/burger.png" className="popItem popBurger" alt="Burger" />
  <img src="/images/pizza.png" className="popItem popPizza" alt="Pizza" />
  <img src="/images/Grocery.png" className="popItem popGrocery" alt="Grocery Basket" />
  <img src="/images/hoodie.png" className="popItem popHoodie" alt="Hoodie" />
  <img src="/images/salad.png" className="popItem popSalad" alt="Salad" />
  <img src="/images/Jeans.png" className="popItem popJeans" alt="Jeans" />
</div>
              <h2 className="deliveryHeadingTitle">
                India solved delivery in 10 minutes.<br />
                <span className="deliveryHeadingSubtitle">
  Nobody solved the household in 10 years.
</span>

              </h2>
              <p className="deliveryHeadingDesc">
                Groceries, food and fashion at your doorstep in minutes — sourced straight from producers, built to circulate, and engineered so the value of everything you buy keeps working for your household—Intelligent Hyperlocal delivery app that fits your life. </p>
            </div>   {/* deliveryHeadingFrame */}
          

            <div className="services-container-wrapper">
              <div className="servicesWrap">
                <button
                  type="button"
                  className="servicesArrow servicesArrowLeft"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    scroll('left');
                  }}
                  aria-label="Previous"
                >
                  ‹
                </button>

                <div ref={scrollRef} id="services-scroll-container" className="services-grid">
                  {/* Card 1: Grokly */}
                  <div className="serviceCardLinkWrap">
                    <div className="service-premium-card grokly-card">
                      <div className="service-card-visual">
                        <Image src="/images/grokly-new2.png" alt="Grokly Groceries" fill className="serviceCardVisualImage" />
                      </div>
                      <div className="service-icon-circle">
                        <Image src="/images/grokly-icon.png" alt="Grokly" width={40} height={40} className="serviceIconCircleImage" />
                      </div>
                      <div className="service-card-body">
                        <h3 className="service-card-name">Grokly</h3>
                        <p className="service-card-desc">Fresh groceries & curated essentials at your doorstep</p>
                        <Link href="/services/grokly" className="service-card-cta grokly-btn">Shop Groceries</Link>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Swadishtt */}
                  <div className="serviceCardLinkWrap">
                    <div className="service-premium-card swadisht-card">
                      <div className="service-card-visual">
                        <Image src="/images/swadisht/swadisht_logo1.JPG" alt="Swadishtt Meals" fill className="serviceCardVisualImage" />
                      </div>
                      <div className="service-icon-circle">
                        <Image src="/images/swadisht/swadisht_logo.JPG" alt="Swadishtt" width={40} height={40} className="serviceIconCircleImage" />
                      </div>
                      <div className="service-card-body">
                        <h3 className="service-card-name">Swadishtt</h3>
                        <p className="service-card-desc">Meals made only for you!</p>
                        <Link href="/services/swadisht" className="service-card-cta swadishtt-btn">Order Food</Link>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: InstaStyle */}
                  <div className="serviceCardLinkWrap">
                    <div className="service-premium-card instastyle-card">
                      <div className="service-card-visual">
                        <Image src="/images/fashion-new2.png" alt="InstaStyle Fashion" fill className="serviceCardVisualImage" />
                      </div>
                      <div className="service-icon-circle">
                        <Image src="/images/instastyle-logo.png" alt="InstaStyle" width={40} height={40} className="serviceIconCircleImage" />
                      </div>
                      <div className="service-card-body">
                        <h3 className="service-card-name">InstaStyle</h3>
                        <p className="service-card-desc">Outfit ready, before you are!</p>
                        <Link href="/services/instastyle" className=" instastyle-btn">Explore Fashion</Link>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="servicesArrow servicesArrowRight"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    scroll('right');
                  }}
                  aria-label="Next"
                >
                  ›
                </button>
              </div>
         
      </div>
        </section>
        {/* ── Xpense Meter Section ── */}
        <XpenseIntro />
        {/* ── Waitlist / App Showcase ── */}
        <AppShowcase />

        {/* ── About Accesco Living (SEO copy) ── */}
 <section className="about-accesco-section">
  <picture>
    <source
      media="(max-width: 640px)"
      srcSet="/images/final-design-mobile.png"
    />
    <img
      src="/images/final-design.png"
      alt="Accesco Living"
      className="about-accesco-image"
    />
  </picture>
</section>
      </main>
      <Footer />

     {isClient && <AccescoInlineChatbot />}

      {/* ── Combined & Optimized Styles ── */}
            <style dangerouslySetInnerHTML={{ __html: `
 
    /* Scale down CTA cards for 125% display scaling */
  @media (min-width: 769px) and (resolution: 1.25dppx) {

   .servicesTrack{
    width: fit-content !important;
    margin-inline: auto !important;
  }

  .service-premium-card{
    transform: scale(0.85);
    transform-origin: center;
  }

    .service-card-visual{
      height: 190px !important;
    }

    .service-icon-circle{
      width: 72px !important;
      height: 72px !important;
    }

    .service-card-name{
      font-size: 1.5rem !important;
    }

    .service-card-desc{
      font-size: 0.95rem !important;
    }

    .service-card-cta{
      padding: 12px 22px !important;
      font-size: 0.92rem !important;
    }
  }
  
            
       r .services-container-wrapper {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
        }

        .servicesWrap {
          position: relative;
          width: 100%;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          width: 100%;
        }

        .servicesArrow {
          display: none;
        }

        /* ── Mobile: show all 3 cards simultaneously, no scroll ── */
        @media (max-width: 960px) {
          .services-container-wrapper {
            overflow: visible !important;
          }

          .services-grid {
            display: grid !important;
            grid-template-columns: repeat(3, 1f) !important;
            gap: 8px !important;
            width: 100% !important;
            overflow: visible !important;
            scroll-snap-type: none !important;
            padding-bottom: 0 !important;
            margin: 0 !important;
          }

          .services-grid::-webkit-scrollbar {
            display: none;
          }

          .services-grid > div {
            flex: 0 0 100%;
            min-width: 100%;
            max-width: 100%;
            scroll-snap-align: center;
            scroll-snap-stop: always;
            padding: 0;
            box-sizing: border-box;
          }

          .services-grid > div {
            width: 100% !important;
            min-width: 0 !important;
            max-width: none !important;
            flex-shrink: 0 !important;
          }

          .servicesArrow {
            display: none !important;
          }

          .service-card-visual {
            height: 120px !important;
          }

          .service-card-body {
            padding: 10px 10px 14px !important;
          }

          .service-card-name {
          font-family: 'Inter', sans-serif;
  font-weight: 700;
            font-size: 0.9rem !important;
            margin-bottom: 4px !important;
          }

          .service-card-desc {
            font-size: 0.7rem !important;
            line-height: 1.3 !important;
          }

          .service-card-cta {
            padding: 9px 6px !important;
            font-size: 0.65rem !important;
            border-radius: 8px !important;
          }

          .service-icon-circle {
            width: 40px !important;
            height: 40px !important;
            top: 100px !important;
            right: 8px !important;
            padding: 6px !important;
          }

          .xpense-box-container {
            grid-template-columns: 1fr !important;
            padding: 48px 20px !important;
            text-align: center !important;
            margin: 0 10px !important;
            width: calc(100% - 20px) !important;
          }

          .xpense-visual-wrap {
            height: auto !important;
            margin-top: 16px !important;
          }

          .xpense-visual-wrap > div:not(:nth-child(2)) {
            display: none !important;
          }

          .xpense-visual-wrap > div:nth-child(2) {
            position: relative !important;
            transform: none !important;
            margin: 0 auto !important;
            width: 100% !important;
            max-width: 280px !important;
          }
        }

        @media (max-width: 480px) {
          .services-grid {
            gap: 6px !important;
  display: grid !important;
  grid-template-columns: repeat(2, 1fr) !important;
            overflow: visible !important;
            scroll-snap-type: none !important;
            padding-bottom: 0 !important;
            margin: 0 !important;
          }
          .services-grid > div {
            width: 100% !important;
            min-width: 0 !important;
            max-width: none !important;
            flex-shrink: 0 !important;
          }
/* Grokly */
.services-grid > div:nth-child(1) {
  grid-column: 1;
  grid-row: 1;
}

/* Swadisht - full width */
.services-grid > div:nth-child(2) {
  grid-column: 1 / -1;
  grid-row: 2;
}

/* InstaStyle */
.services-grid > div:nth-child(3) {
  grid-column: 2;
  grid-row: 1;
}
  
       .service-card-visual {
  height: 120px !important;   /* was 85px */
}

.service-card-body {
  padding: 10px 10px 12px !important;   /* was 6px 6px 8px */
}
          .service-card-name {
          font-family: 'Inter', sans-serif;
  font-weight: 700;
            font-size: 0.72rem !important;
            margin-bottom: 2px !important;
          }
          .service-card-desc {
            display: none !important;
          }
          .service-card-cta {
            padding: 6px 2px !important;
            font-size: 0.55rem !important;
            border-radius: 6px !important;
          }
          .service-icon-circle {
            width: 26px !important;
            height: 26px !important;
            top: 72px !important;
            right: 4px !important;
            padding: 3px !important;
          }
        }

        .service-premium-card {
          position: relative;
          background: #fff;
          border-radius: 24px;
          border: 1px solid rgba(122,0,66,0.08);
          overflow: hidden;
          transition: transform 0.35s ease, box-shadow 0.35s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        /* hover interaction removed for premium cards per request */

        .service-card-visual {
          height: 200px;
          position: relative;
          overflow: hidden;
        }

        .service-card-body {
          padding: 20px 20px 24px;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .service-card-name {
          font-family: 'Inter', sans-serif;
  font-weight: 700;
          font-size: 1.35rem;
          color: #1A0A0F;
          margin: 0 0 8px;
        }

        .service-icon-circle {
          position: absolute;
          top: 170px;
          right: 20px;
          width: 60px;
          height: 60px;
          background: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 25px rgba(0,0,0,0.12);
          z-index: 2;
          padding: 10px;
        }

       .service-card-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px;
  border-radius: 8px;

  font-family: 'Inter', sans-serif;
  font-size: 0.98rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

        .grokly-btn {
          background: #2E7D32;
          color: #fff;
        }

        .swadishtt-btn {
          background: #E53935;                                                        ;
          color: #fff;
        }

        .instastyle-btn {
          background:  #8B5E3C;
          color: #fff;
        }

        .xpense-details {
          max-height: 0;
          opacity: 0;
          overflow: hidden;
          transition: all 0.4s ease;
        }

        .xpense-card-float {
          transition: all 0.4s ease;
        }

        /* xpense-card hover interactions removed */
      ` }} />
      </>
  );
}