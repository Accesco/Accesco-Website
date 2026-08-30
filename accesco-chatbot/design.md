# Accesco Chatbot — Design

## Color & Theme
- **Primary:** #7A0042 (maroon — matches existing Accesco brand)
- **Secondary:** #0C831F (green — for purchase/buy buttons)
- **Background (chat):** #F5F5F5
- **Bot message bubble:** #FFFFFF with #7A0042 border
- **User message bubble:** #7A0042 with white text
- **Text:** #1A1A1A (body), #FFFFFF (on primary)

## Fonts
- **System font stack** (matching Accesco site): `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- No custom font imports — inherit from the existing Next.js app

## Typography
- Bot name header: 16px, 700 weight, #7A0042
- Message text: 14px, 400 weight
- Timestamps: 11px, #999
- Buy button: 13px, 600 weight, white on #0C831F, rounded 8px

## Chat Window
- Width: 360px
- Max height: 500px
- Border-radius: 12px
- Box shadow: 0 4px 20px rgba(0,0,0,0.12)
- Position: bottom-right, 24px from edges
