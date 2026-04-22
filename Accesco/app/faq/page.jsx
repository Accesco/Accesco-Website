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

  return (
    <>
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
