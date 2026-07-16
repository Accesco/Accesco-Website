'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Camera, Shield, ArrowRight, Upload, Sparkles, RefreshCw, Download, Check, AlertCircle, X, ChevronRight } from 'lucide-react';
import { products } from '@/lib/mockData';
import styles from './virtual-tryon.module.css';

export default function VirtualTryOnPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isStartingCamera, setIsStartingCamera] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedPreview, setUploadedPreview] = useState('');
  
  // ML Pipeline States
  const [isGeneratingMl, setIsGeneratingMl] = useState(false);
  const [mlResultImage, setMlResultImage] = useState('');
  const [mlError, setMlError] = useState('');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState('all');

  // Load products for preview
  const tryOnProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    category: product.category,
    subcategory: product.subcategory,
    brand: product.brand || 'InstaStyle',
    color: product.colors?.[0]?.hex || '#1a1a1a',
    image: product.images?.[0]?.url || '',
  }));

  const productCategories = ['all', 'men', 'women', 'kids', 'accessories'];
  const filteredProducts = activeCategory === 'all'
    ? tryOnProducts
    : tryOnProducts.filter((product) => product.category.toLowerCase() === activeCategory.toLowerCase());

  const waitForVideoElement = () => new Promise((resolve, reject) => {
    let attempts = 0;
    const maxAttempts = 20;

    const check = () => {
      if (videoRef.current) {
        resolve(videoRef.current);
        return;
      }

      attempts += 1;
      if (attempts >= maxAttempts) {
        reject(new Error('Video element is not ready.'));
        return;
      }

      requestAnimationFrame(check);
    };

    check();
  });

  const getCameraErrorMessage = (err) => {
    const errorName = err?.name || '';
    const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
    const isSecureContext = window.isSecureContext || isLocalhost;
    const isEmbeddedBrowser = window.top !== window.self;

    if (errorName === 'NotAllowedError' || errorName === 'PermissionDeniedError') {
      if (!isSecureContext) {
        return 'Camera requires HTTPS or localhost. Open this page on localhost or HTTPS and try again.';
      }
      if (isEmbeddedBrowser) {
        return 'This in-app browser may block camera access. Open this page in Chrome/Edge directly.';
      }
      return 'Camera permission was denied. Please allow camera access in your browser settings.';
    }
    if (errorName === 'NotFoundError' || errorName === 'DevicesNotFoundError') {
      return 'No camera detected. Connect a camera or switch to a device with a camera.';
    }
    if (errorName === 'NotReadableError' || errorName === 'TrackStartError') {
      return 'Camera is busy in another app. Close other apps using the camera and retry.';
    }
    return 'Camera could not start. Please try uploading a photo instead.';
  };

  useEffect(() => {
    const loadPreview = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));
      setIsLoading(false);
    };

    loadPreview();

    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    if (isStartingCamera) return;

    if (!navigator?.mediaDevices?.getUserMedia) {
      setError('Camera is unavailable in this browser. Please upload a photo instead.');
      return;
    }

    try {
      setIsStartingCamera(true);
      setError(null);
      setCapturedImage(null);
      setUploadedImage(null);
      setUploadedPreview('');
      setMlResultImage('');
      stopCamera();
      let stream;

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user'
          },
          audio: false
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }

      streamRef.current = stream;
      setIsCameraActive(true);

      const videoEl = await waitForVideoElement();
      videoEl.srcObject = stream;
      videoEl.muted = true;
      videoEl.setAttribute('playsinline', 'true');
      await videoEl.play().catch(() => {});
    } catch (err) {
      setError(getCameraErrorMessage(err));
      stopCamera();
    } finally {
      setIsStartingCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      const imageData = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageData);
      stopCamera();
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedImage(file);
    setUploadedPreview(URL.createObjectURL(file));
    setCapturedImage(null);
    setMlResultImage('');
    stopCamera();
  };

  const handleGenerateMlTryOn = async () => {
    const personSrc = capturedImage || uploadedPreview;
    if (!personSrc) {
      setMlError('Please provide a photo (either capture from camera or upload an image).');
      return;
    }
    if (!selectedProduct || !selectedProduct.image) {
      setMlError('Please select a product to try on.');
      return;
    }

    setIsGeneratingMl(true);
    setMlError('');
    setMlResultImage('');

    try {
      const formData = new FormData();

      // Convert captured snapshot or uploaded preview URL to blob
      const resPerson = await fetch(personSrc);
      const blobPerson = await resPerson.blob();
      formData.append('person', blobPerson, 'person.jpg');

      // Fetch the product image and attach it
      const resShirt = await fetch(selectedProduct.image);
      const blobShirt = await resShirt.blob();
      formData.append('shirt', blobShirt, 'shirt.jpg');

      const response = await fetch('/services/instastyle/ai-tryon', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errMsg = 'ML pipeline try-on generation failed.';
        try {
          const errData = await response.json();
          errMsg = errData.error || errData.message || errMsg;
        } catch {}
        throw new Error(errMsg);
      }

      const blobResult = await response.blob();
      setMlResultImage(URL.createObjectURL(blobResult));
    } catch (err) {
      setMlError(err.message || 'Generation failed. Make sure the IDM-VTON model space is responding.');
    } finally {
      setIsGeneratingMl(false);
    }
  };

  const downloadImage = () => {
    const linkSrc = mlResultImage || capturedImage || uploadedPreview;
    if (linkSrc) {
      const link = document.createElement('a');
      link.download = mlResultImage ? 'ml-tryon-result.jpg' : 'captured-preview.jpg';
      link.href = linkSrc;
      link.click();
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setUploadedImage(null);
    setUploadedPreview('');
    setMlResultImage('');
    startCamera();
  };

  const selectProduct = (product) => {
    setSelectedProduct(product);
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <h2>Preparing Fitting Room...</h2>
        <p>Loading ML templates and virtual assets</p>
      </div>
    );
  }

  return (
    <div className={styles.virtualTryOnPage}>
      <div className={styles.vtoContainer}>
        
        {/* LEFT PANEL - TITLE & FEATURES */}
        <div className={styles.leftPanel}>
          <span className={styles.subtitle}>Virtual Try-On</span>
          <h1 className={styles.heading}>Try Before You Buy</h1>
          <p className={styles.description}>
            See how it looks on you with our ML-powered virtual try-on.
          </p>

          <div className={styles.statusCards}>
            <div className={styles.statusCard}>
              <div className={styles.statusIcon}>
                <Camera size={20} className={styles.goldIcon} />
              </div>
              <div className={styles.statusText}>
                <strong>Camera Ready</strong>
                <span>We can see you clearly</span>
              </div>
            </div>

            <div className={styles.statusCard}>
              <div className={styles.statusIcon}>
                <Shield size={20} className={styles.goldIcon} />
              </div>
              <div className={styles.statusText}>
                <strong>Secure & Private</strong>
                <span>Your data is safe with us</span>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER PANEL - VIEWPORT */}
        <div className={styles.centerPanel}>
          <div className={styles.viewportWrapper}>
            {/* Viewport Frame corners */}
            <div className={`${styles.cornerMarker} ${styles.topLeft}`}></div>
            <div className={`${styles.cornerMarker} ${styles.topRight}`}></div>
            <div className={`${styles.cornerMarker} ${styles.bottomLeft}`}></div>
            <div className={`${styles.cornerMarker} ${styles.bottomRight}`}></div>

            {/* ERROR DISPLAY */}
            {error && !isCameraActive && (
              <div className={styles.errorAlert}>
                <AlertCircle size={24} />
                <p>{error}</p>
                <button onClick={() => setError(null)} className={styles.closeAlertBtn}><X size={16} /></button>
              </div>
            )}

            {/* ML ERROR DISPLAY */}
            {mlError && (
              <div className={styles.errorAlert}>
                <AlertCircle size={24} />
                <p>{mlError}</p>
                <button onClick={() => setMlError('')} className={styles.closeAlertBtn}><X size={16} /></button>
              </div>
            )}

            {/* VIEWPORT LOADER */}
            {isGeneratingMl && (
              <div className={styles.viewportLoader}>
                <h3>Running Virtual Try-On</h3>
                <p>Fitting garment to your look using our visual fitting engine...</p>
              </div>
            )}

            {/* 1. STATE: INITIAL PLACEHOLDER (NO CAMERA, NO PHOTO) */}
            {!isCameraActive && !capturedImage && !uploadedPreview && !mlResultImage && !isGeneratingMl && (
              <div className={styles.viewportPlaceholder}>
                <div className={styles.placeholderIconWrap}>
                  <Camera size={36} />
                </div>
                <h2>Camera feed will appear here</h2>
                <p>Allow camera permissions or upload a high-quality selfie</p>
                
                <div className={styles.placeholderActions}>
                  <button onClick={startCamera} className={styles.startCameraBtn} disabled={isStartingCamera}>
                    <Camera size={18} />
                    {isStartingCamera ? 'Starting...' : 'Start Camera'}
                  </button>

                  <button 
                    onClick={() => fileInputRef.current?.click()} 
                    className={styles.uploadPhotoBtn}
                  >
                    <Upload size={18} />
                    Upload Photo
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                  />
                </div>
              </div>
            )}

            {/* 2. STATE: LIVE CAMERA FEED ACTIVE */}
            {isCameraActive && !capturedImage && !uploadedPreview && !mlResultImage && !isGeneratingMl && (
              <div className={styles.videoWrapper}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={styles.video}
                />
                <canvas ref={canvasRef} style={{ display: 'none' }} />

                {/* Live Feed Header Details */}
                <div className={styles.videoHeaderDetails}>
                  {selectedProduct && (
                    <div className={styles.selectedProductBanner}>
                      <div className={styles.colorDot} style={{ background: selectedProduct.color }}></div>
                      <span>Selected: {selectedProduct.name}</span>
                    </div>
                  )}
                </div>

                {/* Live Camera Bottom Actions */}
                <div className={styles.cameraActionControls}>
                  <button onClick={stopCamera} className={styles.controlPillBtn}>
                    Cancel
                  </button>
                  <button 
                    onClick={capturePhoto} 
                    className={styles.snapBtn}
                    disabled={!selectedProduct}
                    title={selectedProduct ? "Take snapshot" : "Select a product first"}
                  >
                    <div className={styles.snapInner}></div>
                  </button>
                  <button onClick={() => setSelectedProduct(null)} className={styles.controlPillBtn} disabled={!selectedProduct}>
                    Clear Product
                  </button>
                </div>
              </div>
            )}

            {/* 3. STATE: PHOTO CAPTURED OR UPLOADED (READY FOR ML GENERATION) */}
            {(capturedImage || uploadedPreview) && !mlResultImage && !isGeneratingMl && (
              <div className={styles.previewImageWrapper}>
                <img 
                  src={capturedImage || uploadedPreview} 
                  alt="User Preview" 
                  className={styles.previewImage} 
                />

                {/* Selected product banner */}
                {selectedProduct && (
                  <div className={styles.previewProductOverlay}>
                    <Sparkles size={16} className={styles.sparkleIcon} />
                    <span>Selected: {selectedProduct.name}</span>
                  </div>
                )}

                {/* Preview controls */}
                <div className={styles.previewControls}>
                  <button onClick={handleRetake} className={styles.actionBtnSecondary}>
                    <RefreshCw size={16} />
                    Retake / Change Photo
                  </button>

                  <button 
                    onClick={handleGenerateMlTryOn} 
                    className={styles.actionBtnPrimary}
                    disabled={!selectedProduct}
                  >
                    <Sparkles size={16} />
                    Generate Try-On
                  </button>
                </div>
              </div>
            )}

            {/* 4. STATE: ML TRY-ON GENERATED OUTPUT */}
            {mlResultImage && !isGeneratingMl && (
              <div className={styles.aiResultWrapper}>
                <img 
                  src={mlResultImage} 
                  alt="ML Try-On Result" 
                  className={styles.resultImage} 
                />
                
                <div className={styles.successBadge}>
                  <Check size={14} />
                  <span>Try-On Ready</span>
                </div>

                <div className={styles.resultControls}>
                  <button onClick={handleRetake} className={styles.actionBtnSecondary}>
                    <RefreshCw size={16} />
                    Try Another
                  </button>
                  
                  <button onClick={downloadImage} className={styles.actionBtnDownload}>
                    <Download size={16} />
                    Save Look
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL - PRODUCT SELECTION */}
        <div className={styles.rightPanel}>
          <h2 className={styles.sidebarTitle}>Select Product to Try</h2>
          
          <div className={styles.categoryFilters}>
            {productCategories.map((category) => (
              <button
                key={category}
                className={`${styles.filterTab} ${activeCategory === category ? styles.activeFilter : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category === 'all' ? 'All' : category[0].toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          <div className={styles.productList}>
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className={`${styles.productCardItem} ${
                  selectedProduct?.id === product.id ? styles.selectedCard : ''
                }`}
                onClick={() => selectProduct(product)}
              >
                <div className={styles.productThumb}>
                  {product.image ? (
                    <img src={product.image} alt={product.name} />
                  ) : (
                    <div className={styles.thumbFallback} style={{ background: product.color }} />
                  )}
                </div>
                <div className={styles.productDetails}>
                  <h4>{product.name}</h4>
                  <span>{product.subcategory} • {product.brand}</span>
                </div>
                <ChevronRight size={16} className={styles.itemChevron} />
              </div>
            ))}
          </div>

          <Link href="/services/instastyle/catalog" className={styles.browseCatalogBtn}>
            <span>Browse More Products</span>
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>

      {/* HOW TO USE HORIZONTAL STEPS */}
      <div className={styles.howToUseSection}>
        <div className={styles.howToUseContainer}>
          <h2>How to Use</h2>
          <div className={styles.stepsGrid}>
            <div className={styles.stepItem}>
              <div className={styles.stepNum}>1</div>
              <div className={styles.stepContent}>
                <h3>Allow Camera</h3>
                <p>Enable camera access when prompted</p>
              </div>
            </div>

            <div className={styles.stepItem}>
              <div className={styles.stepNum}>2</div>
              <div className={styles.stepContent}>
                <h3>Position Yourself</h3>
                <p>Stand in a well-lit area and face the camera</p>
              </div>
            </div>

            <div className={styles.stepItem}>
              <div className={styles.stepNum}>3</div>
              <div className={styles.stepContent}>
                <h3>Select Product</h3>
                <p>Choose an item from the list</p>
              </div>
            </div>

            <div className={styles.stepItem}>
              <div className={styles.stepNum}>4</div>
              <div className={styles.stepContent}>
                <h3>Preview Look</h3>
                <p>See how it looks on you instantly</p>
              </div>
            </div>

            <div className={styles.stepItem}>
              <div className={styles.stepNum}>5</div>
              <div className={styles.stepContent}>
                <h3>Capture & Save</h3>
                <p>Capture your look and save or share</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}