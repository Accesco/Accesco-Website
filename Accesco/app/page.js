/* eslint parser: "espree", parserOptions: { ecmaVersion: 2022, sourceType: "module", ecmaFeatures: { jsx: true } } */

import Image from 'next/image';
import dynamic from 'next/dynamic';
import './homepage.css';

import AccescoHeader from '../components/AccescoHeader';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import TiltCard from '../components/TiltCard';
import DeliveryHeading from '../components/DeliveryHeading';
import ServicesCarousel from '../components/ServicesCarousel';
import DeferredChatbot from '../components/DeferredChatbot';

// Lazy load below-the-fold heavy components without blocking main thread
const AppShowcase = dynamic(() => import('../components/AppShowcase'), { ssr: false });
const XpenseIntro = dynamic(() => import('@/components/XpenseIntro'), { ssr: false });
const AccescoInlineChatbot = dynamic(() => import('@/app/components/AccescoInlineChatbot'), {
  ssr: false,
});

export const metadata = {
  title: 'Accesco Living - Intelligent Circular Commerce Ecosystem',
  description: 'Groceries, food and fashion at your doorstep in minutes.',
};

export default function HomePage() {
  return (
    <>
      <AccescoHeader />
      <main>
        <Hero />

        <section id="services">
          <div className="intelligencePosterRow">
            <div className="intelligenceSection">
              <Image
                src="/images/intelligence-layer.png"
                alt="Accesco Intelligence Layer"
                width={1200}
                height={675}
                className="intelligenceImage"
                sizes="(max-width: 1200px) 100vw, 1200px"
                quality={75}
              />
            </div>

            <TiltCard />
          </div>

          <div className="servicesRadialOverlay" />

          <DeliveryHeading />

          <div className="services-container-wrapper">
            <ServicesCarousel />
          </div>
        </section>

        <XpenseIntro />
        <AppShowcase />

        <section className="about-accesco-section">
          <Image
            src="/images/final-design.png"
            alt="Accesco Living"
            className="about-accesco-image"
            width={1200}
            height={800}
            sizes="100vw"
            style={{ width: '100%', height: 'auto' }}
          />
        </section>
      </main>

      <Footer />

      <DeferredChatbot />

      <AccescoInlineChatbot />
    </>
  );
}