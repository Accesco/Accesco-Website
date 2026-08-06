// lib/notifyChatbot.js
// Fire-and-forget notify hook: tells the ML chatbot to refresh its live
// catalog after a product write. Never blocks or fails the caller — if the
// chatbot is down, writes still succeed and the chatbot's 10-min polling
// backup covers the missed push.

const CHATBOT_URL = process.env.CHATBOT_URL || 'http://localhost:8000';

export function notifyChatbotRefresh() {
  fetch(`${CHATBOT_URL}/refresh-products`, { method: 'POST' }).catch(() => {});
}
