'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import styles from './ai-tryon.module.css';
import { useSearchParams } from 'next/navigation';

function AiTryOnContent() {
  const searchParams = useSearchParams();
  const preloadedShirtUrl = searchParams.get('img') || '';

  const [personImage, setPersonImage]   = useState(null);
  const [shirtImage, setShirtImage]     = useState(null);       // File for upload; null when using URL
  const [personPreview, setPersonPreview] = useState('');
  const [shirtPreview, setShirtPreview]   = useState(preloadedShirtUrl); // pre-fill from ?img=
  const [resultImage, setResultImage]   = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError]               = useState('');

  const handleImageChange = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);

    if (type === 'person') {
      setPersonImage(file);
      setPersonPreview(previewUrl);
    } else {
      // User uploaded a local shirt file — overrides the URL param
      setShirtImage(file);
      setShirtPreview(previewUrl);
    }
  };

  const handleGenerate = async () => {
    if (!personImage) {
      setError('Please upload your photo.');
      return;
    }

    // Shirt must come from either a local upload or the preloaded URL
    const hasShirt = shirtImage || preloadedShirtUrl;
    if (!hasShirt) {
      setError('Please provide a shirt image.');
      return;
    }

    setIsGenerating(true);
    setError('');
    setResultImage('');

    try {
      const formData = new FormData();
      formData.append('person', personImage);

      if (shirtImage) {
        // Local file upload — send as File under the field name 'shirt'
        formData.append('shirt', shirtImage);
      } else {
        // No local upload — fetch the preloaded URL client-side and send as File
        const res  = await fetch(preloadedShirtUrl);
        const blob = await res.blob();
        formData.append('shirt', blob, 'shirt.jpg');
      }

      const response = await fetch('/services/instastyle/ai-tryon', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errMsg = 'Try-on generation failed.';
        try { const d = await response.json(); errMsg = d.error || d.message || errMsg; } catch {}
        throw new Error(errMsg);
      }

      const blob = await response.blob();
      setResultImage(URL.createObjectURL(blob));
    } catch (err) {
      setError(err.message || 'Could not generate try-on. Please check if the backend is running.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={styles.aiTryOnPage}>
      <div className={styles.header}>
        <Link href="/services/instastyle/virtual-tryon" className={styles.backButton}>
          ← Back to Style Preview
        </Link>
        <div>
          <h1>Virtual Try-On Studio</h1>
          <p>Upload your photo and a garment image to see how it fits on you.</p>
        </div>
      </div>

      <div className={styles.uploadGrid}>
        {/* Person photo */}
        <div className={styles.uploadCard}>
          <h2>Your Photo</h2>
          <label className={styles.uploadBox}>
            {personPreview
              ? <img src={personPreview} alt="Person preview" />
              : <span>Upload User Image</span>
            }
            <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'person')} />
          </label>
        </div>

        {/* Shirt image — pre-filled from catalog or uploadable */}
        <div className={styles.uploadCard}>
          <h2>Shirt Image</h2>
          <label className={styles.uploadBox}>
            {shirtPreview
              ? <img src={shirtPreview} alt="Shirt preview" />
              : <span>Upload Shirt Image</span>
            }
            <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'shirt')} />
          </label>
          {preloadedShirtUrl && !shirtImage && (
            <p style={{ fontSize: 12, color: '#888', marginTop: 6 }}>
              Pre-loaded from catalog. Upload a different one to override.
            </p>
          )}
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <button
        className={styles.generateBtn}
        onClick={handleGenerate}
        disabled={isGenerating || !personImage || (!shirtImage && !preloadedShirtUrl)}
      >
        {isGenerating ? 'Processing your look...' : 'Try On Now'}
      </button>

      {resultImage && (
        <div className={styles.resultSection}>
          <h2>Your Try-On Result</h2>
          <img src={resultImage} alt="Virtual try-on result" />
          <a href={resultImage} download="tryon-result.jpg" className={styles.downloadBtn}>
            Download Result
          </a>
        </div>
      )}
    </div>
  );
}

// useSearchParams requires Suspense in Next.js App Router
export default function AiTryOnPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem' }}>Loading...</div>}>
      <AiTryOnContent />
    </Suspense>
  );
}