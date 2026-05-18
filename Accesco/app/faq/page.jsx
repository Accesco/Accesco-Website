'use client';

import { useState } from 'react';
import AccescoHeader from '../../components/AccescoHeader';
import Footer from '../../components/Footer';
import './faq.css';

const faqData = [
  {
    category: "Brand & Concept Understanding",
    questions: [
      {
        q: "What is Accesco Living?",
        a: "Accesco Living is an intelligent commerce ecosystem built for urban Indian households. It combines grocery, food, fashion, healthcare, and dining into one unified super-app powered by AI-driven budget intelligence and a circular logistics model."
      },
      {
        q: "How is Accesco Living different from Zepto or Blinkit?",
        a: "Unlike single-category quick commerce apps, Accesco Living offers a multi-vertical super-app experience — spanning Grokly (grocery), Swadisht (food), Instastyle (fashion), LocalMeds (pharmacy), and DineX (dining) — all connected through Xpense Meter, a salary-linked budget intelligence layer."
      },
      {
        q: "What problem does Accesco Living solve?",
        a: "Accesco Living eliminates app fatigue by consolidating household commerce needs into one intelligent platform, while helping users make smarter spending decisions through real-time budget tracking and personalised recommendations."
      },
      {
        q: "What is 'Intelligent Commerce' in the Indian context?",
        a: "Intelligent Commerce refers to a commerce experience powered by AI that learns your household patterns, anticipates your needs, tracks your budget against salary cycles, and surfaces the right product or service at the right time — all contextualised for the Indian urban consumer."
      },
      {
        q: "Is Accesco Living a super app?",
        a: "Yes. Accesco Living is being built as India's household super-app, combining quick commerce, food delivery, instant fashion, pharmacy, dining reservations, and budget analytics under a single, seamlessly integrated platform."
      },
      {
        q: "Who should use Accesco Living?",
        a: "Accesco Living is designed for salaried urban professionals in Tier 1 and Tier 2 Indian cities who manage multi-category household spending and want a smarter, more unified commerce experience."
      },
      {
        q: "What is the vision of Accesco Living?",
        a: "Accesco Living envisions a future where every household's daily consumption — from dal to dresses — is managed intelligently by one platform that respects the wallet, the environment, and the time of the Indian family."
      },
      {
        q: "Can Accesco Living replace multiple apps?",
        a: "Yes. By integrating grocery, medicine, food delivery, fashion, and dining into one app with a shared cart, loyalty layer, and budget tracker, Accesco Living is designed to replace the fragmented multi-app experience most Indian households rely on today."
      },
      {
        q: "What makes Accesco Living unique in India?",
        a: "The combination of Xpense Meter (salary-linked budgeting), reverse commerce (circular logistics), direct-to-producer sourcing, and a multi-vertical super-app structure makes Accesco Living a first-of-its-kind intelligent commerce platform in India."
      },
      {
        q: "How does Accesco Living improve decision-making for households?",
        a: "By layering real-time budget tracking, historical spending insights, and AI-driven personalisation across all commerce categories, Accesco Living helps households make confident, informed purchase decisions without financial stress."
      }
    ]
  },
  {
    category: "Grokly — Grocery & Essentials",
    questions: [
      {
        q: "What is Grokly by Accesco Living?",
        a: "Grokly is Accesco Living's smart grocery and essentials arm, offering fast delivery of daily household staples, fresh produce, and packaged goods — personalised to your family's consumption patterns."
      },
      {
        q: "Does Grokly offer 10-minute delivery in India?",
        a: "Grokly is built on a quick commerce infrastructure designed to deliver grocery essentials within minutes through strategically located micro dark stores in urban clusters."
      },
      {
        q: "How does Grokly predict my household consumption patterns?",
        a: "Grokly uses AI to analyse your order history, seasonal trends, and household profile to proactively suggest replenishments before you run out — reducing last-minute stress and over-ordering."
      },
      {
        q: "Can I set up a subscription for daily essentials like milk and eggs?",
        a: "Yes. Grokly supports subscription-based grocery planning for recurring items, so your daily staples are delivered automatically without you placing a fresh order each time."
      },
      {
        q: "Are the prices on Grokly competitive with local kirana stores?",
        a: "Grokly leverages direct-to-producer sourcing to minimise intermediary costs, enabling competitive pricing that matches or beats local kirana stores, with the added benefit of doorstep delivery."
      },
      {
        q: "How does Grokly source its fresh vegetables and fruits?",
        a: "Grokly works with local farmers and producer networks to source fresh produce directly, cutting middlemen and ensuring fresher quality at better price points for the consumer."
      },
      {
        q: "How does Grokly prevent overbuying or food waste?",
        a: "By tracking your consumption history and flagging surplus purchases, Grokly's smart planning layer actively nudges users to buy only what they need — reducing household food waste."
      },
      {
        q: "Can multiple family members use Grokly together?",
        a: "Yes. Grokly supports shared household carts and multi-member account access, so the whole family can contribute to and manage a single grocery list collaboratively."
      },
      {
        q: "What products are available on Grokly?",
        a: "Grokly stocks a comprehensive range of household essentials — from fresh produce, dairy, and packaged foods to cleaning supplies, personal care products, and home basics."
      },
      {
        q: "How does Grokly handle out-of-stock items?",
        a: "Grokly's inventory intelligence layer flags low-stock or out-of-stock items in real-time and proactively suggests comparable alternatives or notifies users when items are back in supply."
      }
    ]
  },
  {
    category: "LocalMeds — Healthcare Layer",
    questions: [
      {
        q: "What is LocalMeds in Accesco Living?",
        a: "LocalMeds is Accesco Living's pharmacy and healthcare vertical, enabling fast delivery of prescription medicines, OTC drugs, wellness products, and health essentials from verified local pharmacies."
      },
      {
        q: "Is LocalMeds available 24/7 for medicine delivery?",
        a: "LocalMeds is designed to support urgent healthcare needs with extended delivery hours, ensuring access to essential medicines when you need them most."
      },
      {
        q: "Do I need a prescription to order from LocalMeds?",
        a: "Prescription medicines require a valid prescription upload at checkout. Over-the-counter (OTC) products and wellness items can be ordered without one, in compliance with Indian pharmaceutical regulations."
      },
      {
        q: "How does LocalMeds ensure medicine authenticity?",
        a: "LocalMeds partners only with licensed, verified pharmacies, ensuring every medicine delivered meets quality and regulatory standards as mandated by Indian pharmacy law."
      },
      {
        q: "What wellness products are available on LocalMeds?",
        a: "Beyond prescription drugs, LocalMeds offers a curated range of vitamins, supplements, personal care, diagnostics kits, and preventive health products."
      },
      {
        q: "Can users set medication reminders through LocalMeds?",
        a: "Yes. LocalMeds includes a health management layer that allows users to set medicine reminders and schedule recurring orders for ongoing treatments or supplements."
      },
      {
        q: "How does LocalMeds support family health management?",
        a: "LocalMeds lets you manage multiple family member health profiles within one account, track prescriptions, and order medicines for the whole household from a single interface."
      },
      {
        q: "How fast is medicine delivery on LocalMeds?",
        a: "LocalMeds leverages Accesco Living's quick commerce infrastructure to deliver medicines swiftly from the nearest partner pharmacy, prioritising urgent orders."
      },
      {
        q: "How does LocalMeds improve healthcare accessibility?",
        a: "By aggregating local pharmacies and bringing them online with fast delivery, LocalMeds bridges the gap between the neighbourhood chemist and digital convenience — making healthcare more accessible for urban households."
      },
      {
        q: "Does LocalMeds offer online doctor consultations?",
        a: "This feature is part of Accesco Living's broader healthcare roadmap, aimed at integrating teleconsultation within the same platform for a complete health management experience."
      }
    ]
  },
  {
    category: "Swadisht & DineX — Food & Dining",
    questions: [
      {
        q: "What is Swadisht by Accesco Living?",
        a: "Swadisht is Accesco Living's food vertical, combining curated food delivery with a network of Swadisht Cafés — offering freshly prepared, quality meals aligned with your lifestyle and taste preferences."
      },
      {
        q: "How is Swadisht different from Zomato or Swiggy?",
        a: "Swadisht goes beyond delivery aggregation by curating restaurants around lifestyle alignment, offering integrated meal planning, and connecting food choices with the user's Xpense Meter budget — making it a contextually smarter food companion."
      },
      {
        q: "What is a Swadisht Café?",
        a: "Swadisht Café is Accesco Living's own-brand cloud and dine-in café format that serves freshly prepared, curated meals — combining the consistency of a brand with the warmth of home-style cooking."
      },
      {
        q: "What is DineX in Accesco Living?",
        a: "DineX is Accesco Living's dining discovery and reservation vertical that helps users find, book, and experience curated restaurant outings — with exclusive member perks and social dining experiences."
      },
      {
        q: "Can I book a restaurant table through DineX?",
        a: "Yes. DineX allows users to discover and book tables at partner restaurants, with special member-only offers and curated dining experiences for occasions and everyday dining alike."
      },
      {
        q: "How does Swadisht personalise food recommendations?",
        a: "Swadisht uses your taste profile, dietary preferences, order history, and even time-of-day context to recommend meals that are relevant, healthy, and within your current budget."
      },
      {
        q: "Does Swadisht offer curated meal plans?",
        a: "Yes. Swadisht supports lifestyle-based meal planning — from weight-management to high-protein or regional cuisine preferences — allowing users to schedule meals aligned with their health goals."
      },
      {
        q: "Can I order food and groceries together in a single checkout?",
        a: "Yes. Accesco Living's unified cart experience allows users to combine grocery (Grokly) and food delivery (Swadisht) orders into a single, streamlined checkout — saving time and reducing delivery trips."
      },
      {
        q: "How does Swadisht reduce food decision fatigue?",
        a: "By learning your preferences, dietary goals, and time constraints, Swadisht proactively surfaces meal suggestions rather than leaving you to scroll endlessly — making 'what to eat' a solved problem."
      },
      {
        q: "How does Swadisht support local restaurants?",
        a: "Swadisht prioritises onboarding quality local and regional restaurants into its network, giving them digital discovery, order management tools, and access to Accesco's urban household user base."
      }
    ]
  },
  {
    category: "Instastyle — Fashion & Lifestyle",
    questions: [
      {
        q: "What is Instastyle by Accesco Living?",
        a: "Instastyle is Accesco Living's instant fashion vertical, enabling quick delivery of curated clothing, accessories, and wardrobe essentials — bringing the speed of quick commerce to fashion for the first time."
      },
      {
        q: "How fast is Instastyle delivery?",
        a: "Instastyle is built on Accesco Living's quick commerce infrastructure, targeting rapid fashion delivery within the same day or hours — designed for planned occasions and spontaneous needs alike."
      },
      {
        q: "How does Instastyle curate outfits?",
        a: "Instastyle uses your style profile, body preferences, occasion context, and past purchase behaviour to surface curated outfit recommendations that feel personal and occasion-appropriate."
      },
      {
        q: "Can I get a curated outfit for a party in under an hour?",
        a: "That is the core promise of Instastyle — instant fashion for unplanned moments. By stocking curated inventory at micro-fulfilment hubs, Instastyle enables near-immediate delivery for urban users."
      },
      {
        q: "Does Instastyle have a return or exchange policy?",
        a: "Yes. Instastyle supports hassle-free returns and exchanges, integrated into Accesco Living's reverse logistics infrastructure, making the post-purchase experience as smooth as the ordering experience."
      },
      {
        q: "How does Instastyle personalise fashion choices?",
        a: "Instastyle builds a dynamic style profile for each user — factoring in size, colour preferences, occasion types, and spending range — and continuously refines recommendations based on interaction signals."
      },
      {
        q: "Is Instastyle focused on fast fashion or sustainable brands?",
        a: "Instastyle aims to strike a balance — curating quality, on-trend styles while progressively incorporating sustainable and ethical brands aligned with Accesco Living's broader circular commerce philosophy."
      },
      {
        q: "What types of clothing are available on Instastyle?",
        a: "Instastyle covers everyday casuals, workwear, occasion wear, and seasonal collections — built to serve the full wardrobe spectrum of urban Indian professionals and families."
      },
      {
        q: "Does Instastyle offer styling advice through the app?",
        a: "Instastyle includes AI-powered outfit suggestions and styling tips, helping users build cohesive looks beyond single-item purchases and maximise their existing wardrobe."
      },
      {
        q: "How does Instastyle compare to Myntra for quick fashion?",
        a: "While Myntra focuses on browse-and-wait e-commerce, Instastyle differentiates through near-instant delivery, salary-aware budget integration via Xpense Meter, and a curated — rather than overwhelming — product selection."
      }
    ]
  },
  {
    category: "Reverse Commerce & Sustainability",
    questions: [
      {
        q: "What is reverse commerce in Accesco Living?",
        a: "Reverse commerce is Accesco Living's circular logistics model where delivery partners bring back used packaging, containers, and recyclable materials from users' homes — closing the loop on waste at the point of delivery."
      },
      {
        q: "How does Accesco Living reduce plastic waste in delivery?",
        a: "Accesco Living uses eco-conscious packaging and its reverse logistics system to collect and channel packaging waste back into recycling streams, minimising single-use plastic generation with every order."
      },
      {
        q: "Can I return my grocery packaging to the delivery partner?",
        a: "Yes. Accesco Living's reverse commerce system allows users to hand back used packaging — cartons, bottles, containers — to the delivery partner at the time of the next delivery."
      },
      {
        q: "How do I get rewarded for returning recyclable materials?",
        a: "Users earn reward points or credits within the Accesco ecosystem for every return of recyclable packaging, creating a tangible incentive for sustainable participation."
      },
      {
        q: "How does reverse commerce benefit gig workers?",
        a: "Delivery partners earn additional income by collecting and returning recyclables to fulfillment hubs, creating supplementary earning opportunities beyond standard delivery fees."
      },
      {
        q: "What happens to materials returned to fulfillment hubs?",
        a: "Returned materials are sorted and channelled to recycling partners or reintegrated into the supply chain, ensuring maximum resource recovery and minimal landfill contribution."
      },
      {
        q: "How does Accesco Living promote sustainable commerce?",
        a: "Through reverse logistics, direct-to-producer sourcing, eco-packaging, and user incentives for sustainability actions, Accesco Living embeds environmental responsibility into every commerce touchpoint."
      },
      {
        q: "What is a circular logistics system?",
        a: "A circular logistics system ensures that the flow of goods is not linear (produce → consume → discard) but circular — where packaging and materials re-enter the supply chain after use, reducing waste and resource consumption."
      },
      {
        q: "Can users track their environmental impact on Accesco?",
        a: "Accesco Living's roadmap includes a personal sustainability dashboard where users can track CO2 savings, waste returned, and their overall green contribution through the platform."
      },
      {
        q: "How does Accesco Living reduce its carbon footprint?",
        a: "By consolidating multi-category deliveries into single trips, optimising delivery routes, supporting reverse logistics, and working with local suppliers, Accesco Living significantly reduces per-order carbon emissions."
      }
    ]
  },
  {
    category: "Supply Chain & Pricing",
    questions: [
      {
        q: "What is direct sourcing in Accesco Living?",
        a: "Direct sourcing means Accesco Living procures products — especially fresh produce and groceries — directly from farmers and producers, bypassing traditional intermediary layers to ensure fresher goods at lower prices."
      },
      {
        q: "How does Accesco Living eliminate middleman costs?",
        a: "By building direct partnerships with producers, farmers, and manufacturers, Accesco Living removes multiple layers of distribution markup — passing the savings directly to the consumer."
      },
      {
        q: "Are products cheaper on Accesco Living?",
        a: "Direct sourcing, combined with Accesco Living's asset-light dark store model and operational efficiency, enables the platform to offer competitive pricing across grocery, medicine, and daily essentials."
      },
      {
        q: "How does Accesco Living maintain price stability?",
        a: "Long-term producer partnerships and localised sourcing networks allow Accesco Living to buffer against market price volatility, offering users more predictable and consistent pricing."
      },
      {
        q: "Does Accesco Living work directly with Indian farmers?",
        a: "Yes. Through its FarmChain initiative, Accesco Living builds direct relationships with Indian farmers to source fresh produce ethically and ensure fair pricing across the supply chain."
      },
      {
        q: "How does Accesco Living manage inventory efficiently?",
        a: "AI-driven demand forecasting, linked with consumption data from Grokly users, allows Accesco Living's dark stores to maintain leaner, smarter inventory with lower waste and higher availability."
      },
      {
        q: "Does Accesco offer a premium membership or loyalty program?",
        a: "A loyalty and membership framework — integrated with Xpense Meter and the reverse commerce reward system — is part of Accesco Living's product roadmap for the beta phase and beyond."
      },
      {
        q: "How does Accesco Living support local suppliers?",
        a: "Accesco Living actively partners with local kirana stores, regional producers, and small-scale suppliers — especially in Tier 2 markets — to build a hyperlocal sourcing backbone that benefits community commerce."
      },
      {
        q: "Can I track my delivery partner in real-time?",
        a: "Yes. Accesco Living's app provides real-time delivery tracking, estimated arrival updates, and communication options so users always know where their order is."
      },
      {
        q: "How does Accesco ensure supply reliability during peak demand?",
        a: "Redundant supplier partnerships, predictive inventory stocking, and a distributed dark store network collectively ensure Accesco Living maintains supply consistency even during high-demand periods."
      }
    ]
  },
  {
    category: "User Experience, Personalisation & Smart Commerce",
    questions: [
      {
        q: "How does Accesco use AI to personalise my shopping?",
        a: "Accesco Living's AI layer analyses purchase history, browsing patterns, household composition, and budget cycles to deliver hyper-personalised recommendations across every vertical — grocery, food, fashion, and medicine."
      },
      {
        q: "What is Xpense Meter?",
        a: "Xpense Meter is Accesco Living's proprietary budget intelligence feature that links your salary cycle with household spending, helping you track real-time expenditure, set category budgets, and receive smart alerts before you overspend."
      },
      {
        q: "How does the app help me make 'decisions with clarity'?",
        a: "By combining spending history, budget limits, and real-time product data, Accesco Living surfaces choices that are contextually appropriate — eliminating the cognitive load of everyday purchase decisions."
      },
      {
        q: "Is my data safe with Accesco Living?",
        a: "Accesco Living is committed to data privacy and security, with user data governed by Indian IT laws and handled through encrypted, access-controlled infrastructure."
      },
      {
        q: "Can I share my household cart with family members?",
        a: "Yes. Accesco Living supports shared household accounts with role-based access, enabling families to collaborate on shopping lists, carts, and budgets across all verticals."
      },
      {
        q: "Does the app remind me when I'm running out of essentials?",
        a: "Yes. Accesco Living's consumption intelligence layer sends proactive replenishment alerts for frequently purchased items before they run out — so you never face last-minute shortages."
      },
      {
        q: "How does Accesco Living reduce decision fatigue?",
        a: "By learning your preferences and proactively curating relevant options — rather than showing you thousands of choices — Accesco Living makes every commerce moment faster and less stressful."
      },
      {
        q: "How do I contact Accesco Living customer support?",
        a: "Accesco Living offers in-app support via chat and call-back options, with dedicated resolution flows for order issues, returns, refunds, and account queries."
      },
      {
        q: "What is the refund policy for cancelled orders?",
        a: "Accesco Living offers a straightforward refund policy with order-level cancellation supported up to a defined cut-off time, with refunds processed directly to the original payment method."
      },
      {
        q: "How can Accesco Living become a daily habit for households?",
        a: "By intelligently managing grocery replenishments, meal planning, medicine reminders, and budget tracking in one place — Accesco Living is designed to embed itself as the operating system for Indian household commerce."
      }
    ]
  }
];

export default function FAQPage() {
  const [openCategory, setOpenCategory] = useState(null);
  const [openQuestion, setOpenQuestion] = useState(null);

  const toggleCategory = (index) => {
    if (openCategory === index) {
      setOpenCategory(null);
      setOpenQuestion(null);
    } else {
      setOpenCategory(index);
      setOpenQuestion(null);
    }
  };

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenQuestion(openQuestion === key ? null : key);
  };

  // FAQ Schema for SEO
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Accesco Living?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Accesco Living is an all-in-one smart app that combines groceries, food delivery, and fashion into a single platform for Indian households."
      }
    },
    {
      "@type": "Question",
      "name": "How is Accesco Living different from other apps?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Unlike multiple apps, Accesco Living integrates daily needs in one place, uses AI to predict requirements, and focuses on sustainability."
      }
    },
    {
      "@type": "Question",
      "name": "What services does Accesco Living offer?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Accesco Living offers grocery delivery, home-style food services, and curated fashion products through one unified platform."
      }
    },
    {
      "@type": "Question",
      "name": "Does Accesco Living support local farmers?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Accesco Living sources products directly from farmers, helping them earn better while offering fresh produce to users."
      }
    },
    {
      "@type": "Question",
      "name": "How does Accesco Living reduce waste?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Accesco Living collects used packaging from customers and promotes a zero-waste, eco-friendly delivery system."
      }
    },
    {
      "@type": "Question",
      "name": "Is Accesco Living available in my city?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Accesco Living is currently in its early stage and expanding to multiple cities across India."
      }
    },
    {
      "@type": "Question",
      "name": "Is Accesco Living affordable?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, by cutting middlemen and optimizing delivery, Accesco Living aims to provide competitive and fair pricing."
      }
    },
    {
      "@type": "Question",
      "name": "How does the AI prediction feature work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The app analyzes your usage patterns and suggests what you might need before you run out of essentials."
      }
    },
    {
      "@type": "Question",
      "name": "Can I order groceries, food, and fashion together?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Accesco Living allows you to shop across categories in one app with a seamless checkout experience."
      }
    },
    {
      "@type": "Question",
      "name": "Is Accesco Living eco-friendly?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, sustainability is a core focus, from sourcing to packaging and delivery operations."
      }
    },
    {
      "@type": "Question",
      "name": "Is Accesco Living a safe and reliable delivery app?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Accesco Living ensures a secure and reliable shopping experience with trusted sellers, quality-checked products, and safe payment methods, including online and cash-on-delivery options."
      }
    },
    {
      "@type": "Question",
      "name": "What is Accesco Living and how does it work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Accesco Living is an online delivery platform that allows users to order groceries, daily essentials, and lifestyle products through a mobile app or website. Customers simply browse products, place an order, and get it delivered to their doorstep quickly."
      }
    },
    {
      "@type": "Question",
      "name": "What kind of products are available on Accesco Living?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Accesco Living offers a wide range of items such as groceries, fresh produce, household essentials, personal care products, and other daily-use goods, making it a one-stop solution for everyday needs."
      }
    },
    {
      "@type": "Question",
      "name": "How fast is delivery on Accesco Living?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Delivery speed on Accesco Living depends on your location, but the platform focuses on quick deliveries, often within a few hours, ensuring convenience for urgent needs."
      }
    },
    {
      "@type": "Question",
      "name": "Does Accesco Living offer discounts or free delivery?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Accesco Living regularly provides discounts, promo codes, and special deals. Free delivery may also be available on selected orders or when a minimum cart value is met."
      }
    }
    ,
{
  "@type": "Question",
  "name": "What is Accesco Living?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "Accesco Living is an integrated lifestyle platform that combines grocery delivery, food ordering, and sustainable fashion into a single app, powered by a circular economy model."
  }
},
{
  "@type": "Question",
  "name": "How does Accesco Living support the circular economy?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "We minimize waste by sourcing groceries directly from farms, reducing transit steps, and curating a fashion marketplace focused on durability and ethical production."
  }
},
{
  "@type": "Question",
  "name": "Does Accesco Living provide farm-fresh groceries?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "Yes. Our direct-from-farm sourcing model ensures that produce is fresher, lasts longer, and provides better value by cutting out multiple layers of middlemen."
  }
},
{
  "@type": "Question",
  "name": "Is sustainable fashion affordable on Accesco Living?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "By integrating fashion logistics with our grocery and food delivery network, we reduce overhead costs, making ethical and sustainable fashion more accessible to the everyday consumer."
  }
},
{
  "@type": "Question",
  "name": "Can I order food and shop for clothes in the same app?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "Absolutely. Accesco Living is designed to be a unified ecosystem where you can manage your daily essentials—from organic vegetables to sustainable wardrobe pieces—in one place."
  }
}
,
{
  "@type": "Question",
  "name": "What makes Accesco Living different from other quick commerce apps?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "Accesco Living focuses on “Intelligent Commerce” — combining AI-driven convenience, affordability, and a circular ecosystem to create a smarter shopping experience beyond just fast delivery."
  }
},
{
  "@type": "Question",
  "name": "What services does Accesco Living provide?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "Accesco Living currently provides grocery, food, and fashion delivery through one integrated platform designed for convenience and cost efficiency."
  }
},
{
  "@type": "Question",
  "name": "Why is Accesco Living called an Intelligent Commerce platform?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "Because we aim to use AI and data-driven systems to improve product recommendations, pricing efficiency, delivery optimization, and customer experience."
  }
},
{
  "@type": "Question",
  "name": "Is Accesco Living only a delivery platform?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "No. We are building a complete ecosystem — from sourcing products directly from manufacturers and farms to sustainable recycling initiatives and smart consumer engagement."
  }
},
{
  "@type": "Question",
  "name": "How does Accesco Living offer products at lower prices?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "We work on optimized sourcing models, direct supply chains, and reduced middlemen involvement to make products more affordable."
  }
},
{
  "@type": "Question",
  "name": "Are there hidden charges on orders?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "No, Accesco Living believes in transparent pricing without unnecessary hidden costs."
  }
},
{
  "@type": "Question",
  "name": "What is Accesco Living’s circular ecosystem?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "Our circular ecosystem focuses on reducing waste by creating systems for reusable packaging, responsible sourcing, and recycling initiatives."
  }
},
{
  "@type": "Question",
  "name": "How does AI help customers on Accesco Living?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "AI can help personalize recommendations, improve delivery efficiency, reduce delays, and create a smarter shopping experience."
  }
},
{
  "@type": "Question",
  "name": "Will Accesco Living introduce smart shopping features in the future?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "Yes, Accesco Living aims to continuously innovate with AI-powered commerce tools and intelligent customer experiences."
  }
},
{
  "@type": "Question",
  "name": "How reliable are Accesco Living deliveries?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "Accesco Living focuses on reliable order fulfillment with live tracking and optimized logistics support."
  }
}
,
{
  "@type": "Question",
  "name": "Why are early users excited about Accesco Living?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "Because they are getting early access to a platform that aims to redefine commerce beyond traditional delivery apps."
  }
},
{
  "@type": "Question",
  "name": "What does joining the beta phase of Accesco Living mean?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "Beta users become part of the early community helping shape the future of the platform through feedback and real usage."
  }
},
{
  "@type": "Question",
  "name": "Why is the Accesco Living beta launch limited?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "A limited beta helps us ensure quality, gather focused feedback, and improve the experience before scaling."
  }
},
{
  "@type": "Question",
  "name": "What is the ultimate vision of Accesco Living?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "To create a smarter, more affordable, sustainable, and integrated commerce ecosystem that improves everyday life."
  }
},
{
  "@type": "Question",
  "name": "What would shopping look like in the future with intelligent commerce?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "Shopping could become more predictive, personalized, affordable, sustainable, and deeply integrated into daily life."
  }
},
{
  "@type": "Question",
  "name": "Is Accesco Living building the super app model for India?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "Our vision is to create an integrated ecosystem where multiple essential services work together seamlessly in one platform."
  }
},
{
  "@type": "Question",
  "name": "Does Accesco Living collaborate with UGC creators and influencers?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "Yes. We work with creators and communities to build authentic and relatable brand engagement."
  }
},
{
  "@type": "Question",
  "name": "How does Accesco Living support local businesses and farmers?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "By building direct sourcing networks and partnerships, we aim to create opportunities for local suppliers and producers."
  }
},
{
  "@type": "Question",
  "name": "How does Accesco Living maintain delivery speed without compromising quality?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "We focus on operational efficiency, smart logistics, and technology-driven management systems."
  }
},
{
  "@type": "Question",
  "name": "What happens if an order gets delayed or cancelled?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "Our support system aims to keep users informed with updates and provide quick resolutions whenever issues occur."
  }
},
{
  "@type": "Question",
  "name": "What Is Accesco Living and Why Is It Different?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "Accesco Living is an AI-powered smart living platform that brings groceries, food, fashion, and household management into one seamless experience, eliminating the need for multiple apps."
  }
},
{
  "@type": "Question",
  "name": "How Does Accesco Living Make Daily Life Easier?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "From smart grocery delivery to AI expense tracking, Accesco Living simplifies everyday tasks through intelligent automation, personalized recommendations, and hyperlocal convenience."
  }
},
{
  "@type": "Question",
  "name": "Why Is Accesco Living Called an Intelligent Commerce Platform?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "Accesco Living uses AI-powered technology to predict household needs, improve shopping experiences, and create a smarter, faster, and more connected lifestyle ecosystem."
  }
},
{
  "@type": "Question",
  "name": "Can Accesco Living Help Users Save Time and Money?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "Yes. With predictive grocery shopping, smart budgeting tools, and AI-driven household management, Accesco Living helps families reduce unnecessary spending and manage daily life more efficiently."
  }
},
{
  "@type": "Question",
  "name": "What is the future of Accesco Living?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "We aim to be the first Zero-Waste Lifestyle OS. From the food you eat to the clothes you wear and the way you track your money, Accesco is building a unified, circular future for the modern Indian city."
  }
},
{
  "@type": "Question",
  "name": "What is the core philosophy behind Accesco Living?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "Our philosophy is Integrated Urban Wellness. We believe convenience shouldn't be fragmented or wasteful. By combining Grokly, Swadishtt, and InstaStyle, we create a single point of contact for a resident's essential needs, governed by a circular economy model."
  }
},
{
  "@type": "Question",
  "name": "How does the Direct-from-Farm model impact the Bangalore supply chain?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "It eliminates the middleman. By sourcing directly for our Grokly service, we reduce the carbon footprint and ensure farmers get a fairer share. Delivering in 22 minutes ensures the produce is live and hasn't wilted in a suburban warehouse."
  }
},
{
  "@type": "Question",
  "name": "Can a delivery app really improve financial health?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "Yes, through transparency. Our Xpense Meter provides a granular breakdown of consumption. When you see exactly how much is spent on perishables versus fashion, you become a more conscious consumer."
  }
},
{
  "@type": "Question",
  "name": "How does Swadishtt tackle the plastic waste problem?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "We’ve replaced single-use plastic with Reusable Asset Containers. These are food-grade, high-durability containers that we pick up during your next delivery. It’s a zero-waste loop that keeps Bangalore’s streets cleaner."
  }
},
{
  "@type": "Question",
  "name": "What makes InstaStyle different from typical e-commerce?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "Logistics. Because our riders are already in your neighborhood for groceries and food, fashion returns or rotations become zero-cost movements. It makes sustainable fashion as convenient as fast fashion."
  }
}
,
{
  "@type": "Question",
  "name": "How does Accesco Living make everyday shopping easier?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "Accesco Living combines groceries, food, fashion, and essentials into one smart platform, helping users save time and manage household shopping more efficiently."
  }
},
{
  "@type": "Question",
  "name": "Why are users choosing Accesco Living over regular shopping apps?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "Users prefer Accesco Living because it offers a personalized and connected shopping experience instead of managing multiple apps separately."
  }
},
{
  "@type": "Question",
  "name": "Can Accesco Living help families control monthly expenses?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "Yes, Accesco Living helps users organize purchases smarter, making it easier to track spending and avoid unnecessary expenses."
  }
},
{
  "@type": "Question",
  "name": "How does Accesco Living personalize the customer experience?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "The platform recommends products based on shopping habits and preferences, creating a faster and more convenient user experience."
  }
},
{
  "@type": "Question",
  "name": "Why is Accesco Living popular among modern urban families?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "Urban families prefer Accesco Living for its convenience, smart shopping features, and ability to simplify daily lifestyle management."
  }
},
{
  "@type": "Question",
  "name": "What is Accesco Living's intelligence app and how does it work?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "Accesco Living is India's first intelligence app combining groceries, food, fashion, and finance under one platform."
  }
},
{
  "@type": "Question",
  "name": "How does Accesco work as an expense tracker for groceries?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "Accesco doubles as an expense tracker for groceries by auto-categorizing purchases and tracking monthly spending patterns."
  }
},
{
  "@type": "Question",
  "name": "What makes Accesco a circular commerce platform?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "Accesco uses direct sourcing, reverse logistics, and waste reduction systems to create a circular commerce ecosystem."
  }
},
{
  "@type": "Question",
  "name": "Is there one app for groceries, food, and fashion in India?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "Yes. Accesco Living combines groceries, food, fashion, dining, and medicines into one unified platform."
  }
},
{
  "@type": "Question",
  "name": "What is the best AI budget tracker for quick commerce shoppers?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "Accesco's Xpense Meter helps users track household spending and make smarter budget decisions."
  }
},
{
  "@type": "Question",
  "name": "Can I order groceries and fashion together on Accesco Living?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "Yes. Accesco Living allows users to combine grocery and fashion shopping in one app experience."
  }
},
{
  "@type": "Question",
  "name": "Which areas in Bengaluru are currently covered under Accesco Living's delivery network?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "Accesco Living is expanding delivery coverage across key Bengaluru neighbourhoods during its beta launch."
  }
},
{
  "@type": "Question",
  "name": "Is InstaStyle a rental service or does Accesco Living sell fashion outright?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "InstaStyle supports both fashion rentals and direct purchases."
  }
},
{
  "@type": "Question",
  "name": "How does Accesco Living keep prices lower than other quick commerce apps?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "Accesco Living reduces middlemen costs through direct sourcing and optimized logistics."
  }
},
{
  "@type": "Question",
  "name": "Can I use Accesco Living's Xpense Meter if I only use Swadisht?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "Yes. Xpense Meter works even if you use only one Accesco vertical like Swadisht."
  }
},
{
  "@type": "Question",
  "name": "How Is Accesco Living Redefining Smart Living in India?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "By combining quick commerce, AI-powered services, hyperlocal delivery, and intelligent lifestyle management, Accesco Living is shaping the future of connected living for modern Indian households."
  }
},
{
    "@type": "Question",
    "name": "Where is Accesco Living currently available?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Accesco Living has launched in Bengaluru for its beta phase. We’re starting in select neighborhoods and expanding coverage rapidly. Enter your pincode in the app to check live serviceability in your area."
    }
  },{
    "@type": "Question",
    "name": "What is FarmChain and how does it benefit me?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "FarmChain is Accesco Living’s direct farm-to-home supply chain. Instead of produce passing through 4–5 intermediaries (and markups at each step), FarmChain sources directly from Karnataka-based FPOs. This means a tomato that costs ₹40 in a regular supply chain reaches you at a significantly lower price — without compromising quality."
    }
  },{
    "@type": "Question",
    "name": "What is Xpense Meter?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Xpense Meter is Accesco Living’s AI budget intelligence layer — the feature that truly sets us apart. It tracks your spending across all four verticals in real time, compares it against your monthly income and fixed expenses, and tells you where your money is going, what you’re saving, and how to spend smarter going forward."
    }
  },{
    "@type": "Question",
    "name": "Is Xpense Meter like a regular expense tracker?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "No — it’s much more. A regular expense tracker just logs what you’ve spent. Xpense Meter actively analyzes your spending patterns using AI, accounts for Indian seasonal spending habits (festivals, salary cycles), and gives you forward-looking budget guidance — not just a report of the past. Think of it as a financial co-pilot built into your shopping app."
    }
  },{
    "@type": "Question",
    "name": "Do I need to manually enter my expenses in Xpense Meter?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "No manual entry needed for purchases made within the Accesco Living ecosystem. Every transaction across Grokly, Swadisht, DineX, and InstaStyle is automatically captured and analyzed by Xpense Meter."
    }
  },{
    "@type": "Question",
    "name": "Is my financial data safe with Xpense Meter?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Your data privacy is a core commitment at Accesco Living. Xpense Meter processes your spending data to deliver personalized insights — we do not sell your personal or financial data to third parties. Detailed data privacy policies are available in the app."
    }
  },{
    "@type": "Question",
    "name": "Is Accesco Living free to use?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Yes — downloading and using the Accesco Living app is free. You pay only for the products and services you order. There are no subscription fees during the beta phase."
    }
  },{
    "@type": "Question",
    "name": "Who is Accesco Living built for?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Accesco Living is built for the modern urban Indian — the salaried professional, the young family, the budget-conscious millennial who wants quality without overspending. If you’ve ever felt that your salary disappears before the month ends, Accesco Living was built for you."
    }
  },
  {
    "@type": "Question",
    "name": "What if I receive a wrong or damaged item?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Customer satisfaction is our priority. Report any issue directly through the app within the order window, and our support team will resolve it — through a replacement, refund, or credit."
}
  }
  ]
};

  return (
    <>
      {/* FAQ Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <AccescoHeader />
      <main className="faq-page">
        <section className="faq-section">
          <div className="faq-container"> 
            <div className="faq-header">
              <div className="faq-pretitle">FREQUENTLY ASKED QUESTIONS</div>
              <h1 className="faq-title">Everything You Need to Know</h1>
              <p className="faq-subtitle">
                Find answers to common questions about Accesco Living's services, features, and how we're revolutionizing household commerce in India.
              </p>
            </div>

            <div className="faq-accordion">
              {faqData.map((category, categoryIndex) => (
                <div key={categoryIndex} className="faq-category">
                  <button
                    className={`faq-category-header ${openCategory === categoryIndex ? 'active' : ''}`}
                    onClick={() => toggleCategory(categoryIndex)}
                  >
                    <span className="faq-category-title">{category.category}</span>
                    <svg
                      className="faq-category-icon"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>

                  <div className={`faq-category-content ${openCategory === categoryIndex ? 'open' : ''}`}>
                    {category.questions.map((item, questionIndex) => (
                      <div key={questionIndex} className="faq-item">
                        <button
                          className={`faq-question ${openQuestion === `${categoryIndex}-${questionIndex}` ? 'active' : ''}`}
                          onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                        >
                          <span>{item.q}</span>
                          <svg
                            className="faq-question-icon"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="10" y1="5" x2="10" y2="15"></line>
                            <line x1="5" y1="10" x2="15" y2="10"></line>
                          </svg>
                        </button>
                        <div className={`faq-answer ${openQuestion === `${categoryIndex}-${questionIndex}` ? 'open' : ''}`}>
                          <p>{item.a}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
