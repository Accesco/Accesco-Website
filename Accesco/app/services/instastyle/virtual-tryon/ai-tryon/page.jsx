'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './ai-tryon.module.css';

export default function AiTryOnPage() {
  const [personImage, setPersonImage] = useState(null);
  const [shirtImage, setShirtImage] = useState(null);
  const [personPreview, setPersonPreview] = useState('');
  const [shirtPreview, setShirtPreview] = useState('');
  const [resultImage, setResultImage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    if (type === 'person') {
      setPersonImage(file);
      setPersonPreview(previewUrl);
    } else {
      setShirtImage(file);
      setShirtPreview(previewUrl);
    }
  };

  const handleGenerate = async () => {
    if (!personImage || !shirtImage) {
      setError('Please upload both your photo and shirt image.');
      return;
    }

    setIsGenerating(true);
    setError('');
    setResultImage('');

    try {
      const formData = new FormData();
      formData.append('person', personImage);
      formData.append('shirt', shirtImage);

     const response = await fetch('/api/instastyle/ai-tryon', {
        method: 'POST',
        body: formData,
      });
if (!response.ok) {
  const data = await response.json();
  throw new Error(data.message || 'Try-on generation failed.');
}

const blob = await response.blob();
const imageUrl = URL.createObjectURL(blob);
setResultImage(imageUrl);
    } catch (err) {
      setError('Could not generate try-on. Please check if backend is running.');
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
          <h1>AI Upload Try-On</h1>
          <p>Upload your photo and a shirt image to generate a realistic try-on.</p>
        </div>
      </div>

      <div className={styles.uploadGrid}>
        <div className={styles.uploadCard}>
          <h2>Your Photo</h2>
          <label className={styles.uploadBox}>
            {personPreview ? (
              <img src={personPreview} alt="Person preview" />
            ) : (
              <span>Upload User Image</span>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, 'person')}
            />
          </label>
        </div>

        <div className={styles.uploadCard}>
          <h2>Shirt Image</h2>
          <label className={styles.uploadBox}>
            {shirtPreview ? (
              <img src={shirtPreview} alt="Shirt preview" />
            ) : (
              <span>Upload Shirt Image</span>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, 'shirt')}
            />
          </label>
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <button
        className={styles.generateBtn}
        onClick={handleGenerate}
        disabled={isGenerating}
      >
        {isGenerating ? 'Generating Try-On...' : 'Generate Try-On'}
      </button>

      {resultImage && (
        <div className={styles.resultSection}>
          <h2>Your Try-On Result</h2>
          <img src={resultImage} alt="AI try-on result" />
        </div>
      )}
    </div>
  );
}