'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

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

export default function AccescoInlineChatbot() {
 const [open, setOpen] = useState(false)
const [showPreview, setShowPreview] = useState(true)
const [input, setInput] = useState('')
const [typing, setTyping] = useState(false)
const [cardQty, setCardQty] = useState({})
  const endRef = useRef(null);

// Language detector: returns 'hi' (Hindi), 'te' (Telugu), 'kn' (Kannada), or 'la' (Latin/English)
  const detectLanguage = (text) => {
    // Check for Devanagari (Hindi)
    const devanagariRegex = /[\u0900-\u097F]/;
    if (devanagariRegex.test(text)) return 'hi';
    // Check for Telugu
    const teluguRegex = /[\u0C00-\u0C7F]/;
    if (teluguRegex.test(text)) return 'te';
    // Check for Kannada
    const kannadaRegex = /[\u0C80-\u0CFF]/;
    if (kannadaRegex.test(text)) return 'kn';
    // Fallback: check for common Hinglish keywords
    const hinglishHi = ['pyaar', 'dil', 'beta', 'behen', 'saanp'];
    const hinglishTe = ['ante', 'manasu', 'premikojana', 'rakkali'];
    const hinglishKn = ['prem', 'annayya', 'sneha', 'kurigalu'];
    const lower = text.toLowerCase();
    if (hinglishHi.some(w => lower.includes(w))) return 'hi';
    if (hinglishTe.some(w => lower.includes(w))) return 'te';
    if (hinglishKn.some(w => lower.includes(w))) return 'kn';
    // Default: Latin/English
    return 'la';
  };

  const addToCart = (card, quantity = 1) => {
    try {
      const svc = (card.service || '').toLowerCase();
      let storageKey = 'grokly_cart';
      
      if (svc.includes('instastyle')) storageKey = 'instastyle_cart';
      else if (svc.includes('swadisht')) storageKey = 'swadishtt-cart';

      const savedCart = localStorage.getItem(storageKey);
      let cart = savedCart ? JSON.parse(savedCart) : null;
      
      if (storageKey === 'grokly_cart') {
        if (!cart || typeof cart !== 'object' || Array.isArray(cart)) cart = {};
        cart[card.sku] = (cart[card.sku] || 0) + quantity;
      } else if (storageKey === 'swadishtt-cart') {
        if (!Array.isArray(cart)) cart = [];
        const existingIndex = cart.findIndex(i => i.id === card.sku);
        if (existingIndex > -1) {
          cart[existingIndex].quantity += quantity;
        } else {
          cart.push({
            id: card.sku,
            name: card.name,
            price: card.price ? parseInt(String(card.price).replace(/[^\d]/g, ''), 10) : 0,
            image: card.image,
            quantity,
            customizations: {}
          });
        }
      } else if (storageKey === 'instastyle_cart') {
        if (!Array.isArray(cart)) cart = [];
        const existingIndex = cart.findIndex(i => i.id === card.sku);
        if (existingIndex > -1) {
          cart[existingIndex].quantity += quantity;
        } else {
          cart.push({
            id: card.sku,
            name: card.name,
            brand: card.brand,
            price: card.price ? parseInt(String(card.price).replace(/[^\d]/g, ''), 10) : 0,
            discountedPrice: card.price ? parseInt(String(card.price).replace(/[^\d]/g, ''), 10) : 0,
            image: card.image,
            selectedSize: 'One Size',
            selectedColor: 'Default',
            quantity,
            slug: card.sku
          });
        }
      }

      localStorage.setItem(storageKey, JSON.stringify(cart));
      window.dispatchEvent(new Event('storage'));
      
      // Attempt to visually notify user
      const btn = document.activeElement;
      if (btn && btn.classList.contains('ac-ai-add-btn')) {
        const originalText = btn.innerText;
        btn.innerText = 'Added!';
        btn.style.background = '#4CAF50';
        btn.style.color = 'white';
        btn.style.borderColor = '#4CAF50';
        setTimeout(() => {
          btn.innerText = originalText;
          btn.style.background = '#ffe6f0';
          btn.style.color = '#b92b27';
          btn.style.borderColor = '#ffccde';
        }, 1500);
      }
    } catch (e) {
      console.error('Failed to add to cart:', e);
    }
  };

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

  const sendMessage = async (e, forcedValue) => {
    if (e && e.preventDefault) e.preventDefault();

    const value = (forcedValue ?? input).trim();
    if (!value) return;

    const lang = detectLanguage(value);

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: 'user',
        text: value,
        time: getChatTime(),
        language: lang,
      },
    ]);

    setInput('');
    setTyping(true);

    // TEMPORARY TEST: call FastAPI ML server; fall back to rule-based reply if server is down
    let botText;
    let botCards = null;
    let botActions = null;
    let botVariants = null;
    try {
      const res = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: value, top_k: 3, language: lang }),
      });
      if (!res.ok) throw new Error('server error');
      const data = await res.json();
      botText = data.reply;
      botCards = data.cards && data.cards.length ? data.cards : null;
      botActions = data.actions && data.actions.length ? data.actions : null;
      botVariants = data.variants && data.variants.length ? data.variants : null;
    } catch (err) {
      botText = getAccescoReply(value);
    }

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        role: 'bot',
        text: botText,
        time: getChatTime(),
        cards: botCards,
        actions: botActions,
        variants: botVariants,
      },
    ]);

    setTyping(false);
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
          ✕
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
                  <Image src={CHATBOT_LOGO} alt="Accesco AI" width={78} height={78} />
                </div>

                <div>
                  <h3>Accesco AI</h3>
                  <p>Your intelligent assistant</p>
                </div>
              </div>

              <div className="ac-ai-actions">
                <button type="button" onClick={() => setOpen(false)}>
                  ✕
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
                      <Image src={CHATBOT_LOGO} alt="Accesco" width={48} height={48} />
                    </div>
                  )}

                  <div className="ac-ai-message-stack">
                    <div className="ac-ai-bubble">
                      <span style={{ whiteSpace: 'pre-wrap' }}>
                        {msg.text.split('\n').map((line, i, arr) => (
                          <span key={i}>
                            {line}
                            {i < arr.length - 1 && <br />}
                          </span>
                        ))}
                      </span>

                      {msg.role === 'user' && (
                        <span className="ac-ai-user-time">
                          {msg.time} {msg.language}
                        </span>
                      )}
                    </div>

                    {msg.role === 'bot' && msg.variants && msg.variants.length > 0 && (
                      <div className="ac-ai-variant-row">
                        {msg.variants.map((v, vi) => (
                          <button
                            key={vi}
                            type="button"
                            className="ac-ai-variant-chip"
                            onClick={() => sendMessage(null, v.query || v.name)}
                          >
                            <span className="ac-ai-variant-name">{v.name}</span>
                            <span className="ac-ai-variant-meta">
                              {v.unit} · ₹{v.price}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    {msg.role === 'bot' && msg.cards && msg.cards.length > 0 && (
                      <div className="ac-ai-product-carousel">
                        {msg.cards.map((card, ci) => (
                          <a
                            key={ci}
                            className="ac-ai-product-card-hz"
                            href={card.url || '#'}
                            target="_self"
                          >
                            <div className="ac-ai-card-hz-thumb">
                              {card.image ? (
                                <img src={card.image} alt={card.name} />
                              ) : (
                                <span>
                                  {(card.brand || card.service || card.name || '?').charAt(0)}
                                </span>
                              )}
                            </div>
                            <div className="ac-ai-card-hz-body">
                              <p className="ac-ai-card-hz-name">{card.name}</p>
                              
                              <div className="ac-ai-card-hz-rating">
                                <span className="ac-ai-star">★</span> {card.rating || '4.5'} <span className="ac-ai-reviews">({card.reviews || '423'})</span>
                              </div>

                              <div className="ac-ai-card-hz-price-row">
                                <span className="ac-ai-card-hz-price">
                                  ₹{card.price || '68'}
                                </span>
                                <span className="ac-ai-card-hz-old-price">
                                  ₹{card.originalPrice || '95'}
                                </span>
                              </div>
                              <div className="ac-ai-card-hz-actions">
                                <div className="ac-ai-qty-stepper">
                                  <button
                                    type="button"
                                    className="ac-ai-qty-btn"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      const key = `${msg.id}-${ci}`;
                                      const qty = Math.max(1, (cardQty[key] || 1) - 1);
                                      setCardQty((prev) => ({ ...prev, [key]: qty }));
                                    }}
                                  >
                                    −
                                  </button>
                                  <span className="ac-ai-qty-count">
                                    {cardQty[`${msg.id}-${ci}`] || 1}
                                  </span>
                                  <button
                                    type="button"
                                    className="ac-ai-qty-btn"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      const key = `${msg.id}-${ci}`;
                                      const qty = Math.min(20, (cardQty[key] || 1) + 1);
                                      setCardQty((prev) => ({ ...prev, [key]: qty }));
                                    }}
                                  >
                                    +
                                  </button>
                                </div>
                                <button
                                  className="ac-ai-add-btn"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (card.sku) {
                                      const key = `${msg.id}-${ci}`;
                                      addToCart(card, cardQty[key] || 1);
                                    }
                                  }}
                                >
                                  + Add
                                </button>
                              </div>
                            </div>
                          </a>
                        ))}
                      </div>
                    )}

                    {msg.role === 'bot' && msg.actions && msg.actions.length > 0 && (
                      <div className="ac-ai-actions">
                        {msg.actions.map((action, ai) => {
                          const lbl = (action.label || '').toLowerCase();
                          const isOrder = lbl.includes('order') || lbl.includes('buy');
                          return (
                            <a
                              key={ai}
                              className={`ac-ai-action ${isOrder ? 'ac-ai-action-green' : 'ac-ai-action-maroon'}`}
                              href={action.url || '#'}
                              target="_self"
                            >
                              <span className="ac-ai-green-dot" />
                              <span className="ac-ai-action-label">{action.label}</span>
                              <span className="ac-ai-action-arrow">→</span>
                            </a>
                          );
                        })}
                      </div>
                    )}

                    {msg.role === 'bot' && (
                      <div className="ac-ai-time">{msg.time}</div>
                    )}
                  </div>
                </div>
              ))}

              {typing && (
                <div className="ac-ai-row bot">
                  <div className="ac-ai-avatar">
                    <Image src={CHATBOT_LOGO} alt="Accesco" width={48} height={48} />
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
            ✕
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

        .ac-ai-product-carousel {
          margin-top: 12px;
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding: 8px;
          margin-left: -8px;
          margin-right: -8px;
          -ms-overflow-style: none;
          scrollbar-width: none;
          width: calc(100% + 16px);
          max-width: calc(100% + 16px);
        }

        .ac-ai-product-carousel::-webkit-scrollbar {
          display: none;
        }

        .ac-ai-product-card-hz {
          display: flex;
          flex-direction: column;
          width: 175px;
          flex: 0 0 auto;
          border-radius: 14px;
          background: #fffdfa;
          border: 1px solid #f2ebe6;
          text-decoration: none;
          overflow: hidden;
          transition: transform 180ms ease, box-shadow 180ms ease;
          /* Fix for webkit border-radius leak */
          transform: translateZ(0); 
        }

        .ac-ai-product-card-hz:hover {
          transform: translateY(-2px) translateZ(0);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }

        .ac-ai-card-hz-thumb {
          width: 100%;
          height: 140px;
          padding: 10px 10px 0 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .ac-ai-card-hz-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 8px;
        }

        .ac-ai-card-hz-thumb span {
          font-size: 26px;
          font-weight: 700;
          color: #8a0048;
        }

        .ac-ai-card-hz-body {
          padding: 10px 14px 14px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .ac-ai-card-hz-name {
          margin: 0;
          font-size: 14px;
          font-weight: 500;
          color: #3d2b27;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .ac-ai-card-hz-rating {
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
          color: #e58d4a;
        }

        .ac-ai-card-hz-rating .ac-ai-star {
          font-size: 13px;
        }

        .ac-ai-card-hz-rating .ac-ai-reviews {
          color: #8c7e7b;
        }

        .ac-ai-card-hz-price-row {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-top: 4px;
        }

        .ac-ai-card-hz-price {
          font-size: 16px;
          font-weight: 600;
          color: #b92b27;
        }

        .ac-ai-card-hz-old-price {
          font-size: 12px;
          color: #9c928f;
          text-decoration: line-through;
        }

        .ac-ai-add-btn {
          margin-top: 10px;
          background: #ffe6f0;
          color: #b92b27;
          border: 1px solid #ffccde;
          border-radius: 6px;
          padding: 6px 12px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          width: 100%;
        }
        
        .ac-ai-add-btn:hover {
          background: #ffccde;
        }

        .ac-ai-card-hz-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 10px;
        }

        .ac-ai-card-hz-actions .ac-ai-add-btn {
          margin-top: 0;
          flex: 1;
          width: auto;
        }

        .ac-ai-qty-stepper {
          display: flex;
          align-items: center;
          border: 1px solid #ffccde;
          border-radius: 6px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .ac-ai-qty-btn {
          width: 26px;
          height: 30px;
          border: none;
          background: #fff5f9;
          color: #b92b27;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          line-height: 1;
        }

        .ac-ai-qty-btn:hover {
          background: #ffccde;
        }

        .ac-ai-qty-count {
          min-width: 24px;
          text-align: center;
          font-size: 13px;
          font-weight: 600;
          color: #5c4a47;
        }

        .ac-ai-variant-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }

        .ac-ai-variant-chip {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 2px;
          background: #ffffff;
          border: 1px solid #ffccde;
          border-radius: 10px;
          padding: 8px 12px;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
          max-width: 100%;
        }

        .ac-ai-variant-chip:hover {
          background: #ffe6f0;
          border-color: #f4a6c3;
        }

        .ac-ai-variant-name {
          font-size: 13px;
          font-weight: 600;
          color: #2b2220;
        }

        .ac-ai-variant-meta {
          font-size: 11px;
          color: #b92b27;
        }

        .ac-ai-actions {
          margin-top: 14px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
        }

        /* Base action button */
        .ac-ai-action {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 16px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          letter-spacing: -0.01em;
          cursor: pointer;
          white-space: nowrap;
          transition: transform 150ms ease, box-shadow 200ms ease, filter 200ms ease;
        }

        .ac-ai-action:active {
          transform: scale(0.96);
        }

        /* ORDER button — theme maroon, full-width rectangle, dot + arrow layout */
        .ac-ai-action-green {
          background: linear-gradient(135deg, #8a0048 0%, #5e0030 100%);
          color: #ffffff;
          border: none;
          border-radius: 10px;
          width: 100%;
          padding: 11px 14px 11px 14px;
          justify-content: flex-start;
          box-sizing: border-box;
          overflow: visible;
          box-shadow:
            0 3px 12px rgba(90, 0, 48, 0.4),
            inset 0 1px 0 rgba(255,255,255,0.12);
        }

        .ac-ai-action-green .ac-ai-green-dot {
          display: block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ff7eb3;
          flex: 0 0 8px;
          box-shadow: 0 0 0 2px rgba(255, 126, 179, 0.35);
          animation: acGreenPulse 2s infinite ease-in-out;
        }

        .ac-ai-action-green .ac-ai-action-label {
          flex: 1;
        }

        .ac-ai-action-green .ac-ai-action-arrow {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          min-width: 20px;
          background: rgba(255,255,255,0.15);
          border-radius: 50%;
          font-size: 11px;
          flex: 0 0 20px;
          transition: transform 200ms ease, background 200ms ease;
        }

        .ac-ai-action-green:hover {
          background: linear-gradient(135deg, #a3005a 0%, #780040 100%);
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(90, 0, 48, 0.5);
        }

        .ac-ai-action-green:hover .ac-ai-action-arrow {
          transform: translateX(3px);
          background: rgba(255,255,255,0.25);
        }

        /* BROWSE button — same as Order, theme maroon */
        .ac-ai-action-maroon {
          background: linear-gradient(135deg, #8a0048 0%, #5e0030 100%);
          color: #ffffff;
          border: none;
          border-radius: 10px;
          width: 100%;
          padding: 11px 14px 11px 14px;
          justify-content: flex-start;
          box-sizing: border-box;
          overflow: visible;
          box-shadow:
            0 3px 12px rgba(90, 0, 48, 0.4),
            inset 0 1px 0 rgba(255,255,255,0.12);
        }

        .ac-ai-action-maroon .ac-ai-green-dot {
          display: block;
        }

        .ac-ai-action-maroon .ac-ai-action-label {
          flex: 1;
        }

        .ac-ai-action-maroon .ac-ai-action-arrow {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          min-width: 20px;
          background: rgba(255,255,255,0.15);
          border-radius: 50%;
          font-size: 11px;
          flex: 0 0 20px;
          transition: transform 200ms ease, background 200ms ease;
        }

        .ac-ai-action-maroon:hover {
          background: linear-gradient(135deg, #a3005a 0%, #780040 100%);
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(90, 0, 48, 0.5);
        }

        .ac-ai-action-maroon:hover .ac-ai-action-arrow {
          transform: translateX(3px);
          background: rgba(255,255,255,0.25);
        }

        /* Green dot — shared pulse animation */
        .ac-ai-green-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #52d68a;
          flex: 0 0 8px;
          box-shadow: 0 0 0 2px rgba(82, 214, 138, 0.3);
          animation: acGreenPulse 2s infinite ease-in-out;
        }

        @keyframes acGreenPulse {
          0%, 100% { box-shadow: 0 0 0 2px rgba(82, 214, 138, 0.3); }
          50% { box-shadow: 0 0 0 5px rgba(82, 214, 138, 0.1); }
        }

        .ac-ai-action-label {
          position: relative;
          z-index: 1;
        }

        .ac-ai-action-arrow {
          position: relative;
          z-index: 1;
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
  width: min(520px, calc(100vw - 32px)) !important;
  height: min(480px, calc(100vh - 140px)) !important;
  right: 42px !important;
  bottom: 96px !important;
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
