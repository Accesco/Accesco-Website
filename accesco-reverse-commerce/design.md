# Accesco Reverse Commerce — Design

## Color & Theme
- **Primary:** #7A0042 (maroon — Accesco brand)
- **Accept / Reuse:** #0C831F (green — matches chatbot purchase buttons)
- **Grade A:** #0C831F (green)
- **Grade B:** #E6A700 (amber)
- **Grade C:** #D97A00 (orange)
- **Reject / Recycle:** #D32F2F (red)
- **Review queue:** #6B7280 (neutral gray, "needs human")
- **Background:** #F5F5F5 (grader/rider screens)
- **Cards:** #FFFFFF with #7A0042 borders
- **Text:** #1A1A1A (body), #FFFFFF (on primary)

## Fonts
- **System font stack** (matching the existing Accesco site and chatbot):
  `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- No custom font imports — inherit from the Next.js app

## Typography
- Screen header: 16px, 700 weight, #7A0042
- Item name: 14px, 600 weight
- Grade badge: 12px, 700 weight, white text on grade color
- Body/capture hints: 14px, 400 weight
- Decision chips (Reuse / Resell / Recycle / Review): 12px, 600 weight,
  pill-shaped, 8px radius
- Timestamps: 11px, #999

## Grader / Rider UI Patterns
- Full-screen photo capture with retake; auto-upload to Firebase Storage
- Result screen: photo + grade badge + decision chip + confidence bar
  (confidence < 0.7 shows "Sent for review" instead of a decision)
- "Wrong grade? Tap to correct" → opens `/feedback`, nothing destructive
- Swadisht sanitization status shown as a mandatory toggle before "Reuse"
  is ever selectable — the gate is visible, not hidden