# Accesco Chatbot — Project Requirement Document

## What to Build
An AI-powered chatbot for the Accesco Living website that answers user questions about products, orders, and services, and redirects users directly to purchase pages when buy intent is detected.

## Targeted Users
- Urban Indian shoppers browsing Accesco's grocery (Grokly), food (Swadisht), fashion (InstaStyle), and pharmacy (LocalMeds) verticals
- Visitors needing quick answers about pricing, stock, delivery, returns, and support

## Core Features
- Intent classification (buy, pricing, stock, FAQ, support, greeting)
- Buy-redirect button with direct SKU purchase link
- FAQ retrieval for non-purchase queries
- Chat UI integrated into the existing AccescoInlineChatbot component

## Non-Goals
- Multi-turn conversations (keep single-turn Q&A initially)
- User authentication within the chatbot
- Voice or image input

## Data Sources
- Accesco QC SKU Master Inventory.xlsx (product catalog)
- Accesco Circular Commerce SKU Recovery Framework.pdf (recovery/substitution rules)
- FAQ data (arriving)

## Success Metrics
- Intent classification accuracy >90% on test set
- Buy-redirect click-through rate
- Reduced support tickets for common questions
