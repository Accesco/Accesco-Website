'use client';

import React from 'react';
import Image from 'next/image';

export default function DownloadSection() {
  return (
    <section className="download-section">
      <div className="download-card">
        <div className="download-text">
          <h2>
            One App. <span className="highlight-gold">Infinite</span>{' '}
            <span className="highlight">Possibilities.</span>
          </h2>
          <p>
            From 10-minute{' '}
            <b>
              <span className="highlight-gold">Grokly</span>
            </b>{' '}
            deliveries to{' '}
            <b>
              <span className="highlight-gold">InstaStyle</span>
            </b>{' '}
            fashion rentals. Download AccesCo today.
          </p>

          <div className="download-buttons">
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
              className="store-btn"
              alt="Get it on Google Play"
              width={150}
              height={50}
              loading="lazy"
            />
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
              className="store-btn"
              alt="Download on the App Store"
              width={150}
              height={50}
              loading="lazy"
            />
          </div>
        </div>

        <div className="dl-visual">
          <div className="mobile-frame">
            <div className="qr-box">
              <Image
                src="/images/QR.png"
                alt="Scan QR Code to Download"
                width={140}
                height={140}
                loading="lazy"
              />
              <span>Scan to Download</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
