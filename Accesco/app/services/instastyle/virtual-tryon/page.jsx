'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { products } from '@/lib/mockData';
import styles from './virtual-tryon.module.css';

export default function VirtualTryOnPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isStartingCamera, setIsStartingCamera] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [overlayPose, setOverlayPose] = useState({ x: 50, y: 58, scale: 1 });
  const [trackingAvailable, setTrackingAvailable] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const trackingFrameRef = useRef(null);
  const faceDetectorRef = useRef(null);
  const trackingLastTickRef = useRef(0);
  const [activeCategory, setActiveCategory] = useState('all');

  const tryOnProducts = products.slice(0, 20).map((product) => ({
    id: product.id,
    name: product.name,
    category: product.category,
    subcategory: product.subcategory,
    color: product.colors?.[0]?.hex || '#1a1a1a',
    image: product.images?.[0]?.url || '',
  }));

  const productCategories = ['all', ...new Set(tryOnProducts.map((product) => product.category))];
  const filteredProducts = activeCategory === 'all'
    ? tryOnProducts
    : tryOnProducts.filter((product) => product.category === activeCategory);

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
    const isVSCodeWebview = typeof navigator?.userAgent === 'string' && /vscode|electron/i.test(navigator.userAgent);

    if (errorName === 'NotAllowedError' || errorName === 'PermissionDeniedError') {
      if (!isSecureContext) {
        return 'Camera requires HTTPS or localhost. Open this page on localhost or HTTPS and try again.';
      }
      if (isEmbeddedBrowser || isVSCodeWebview) {
        return 'This in-app browser may block camera access. Open this page in Chrome/Edge directly and try again.';
      }
      return 'Camera permission is blocked. Allow camera access in browser settings and retry.';
    }
    if (errorName === 'NotFoundError' || errorName === 'DevicesNotFoundError') {
      return 'No camera detected. Connect a camera or switch to a device with a camera.';
    }
    if (errorName === 'NotReadableError' || errorName === 'TrackStartError') {
      return 'Camera is busy in another app. Close other apps using the camera and retry.';
    }
    if (errorName === 'SecurityError') {
      return 'Camera access requires a secure context. Open this page on localhost or HTTPS.';
    }
    if (errorName === 'AbortError') {
      return 'Camera startup was interrupted. Please click Start Camera again.';
    }
    return 'Camera could not start. Please try again in Chrome or Edge.';
  };

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const getGarmentConfig = (product) => {
    const text = `${product?.name || ''} ${product?.subcategory || ''} ${product?.category || ''}`.toLowerCase();

    const isBottomWear = /(jean|pant|trouser|short|skirt|lower|jogger|track)/.test(text);
    const isFullWear = /(dress|gown|kurta|jumpsuit|onesie|robe)/.test(text);
    const isAccessory = /(shoe|cap|hat|bag|watch|belt|wallet|sunglass|jewelry|necklace)/.test(text);

    if (isAccessory) {
      return {
        type: 'accessory',
        widthPct: 26,
        heightPct: 26,
        yOffset: 8,
        minY: 24,
        maxY: 58,
        scaleFactor: 2.1,
        scaleMin: 0.7,
        scaleMax: 1.25,
        defaultY: 36,
        cropTopRatio: 0.08,
        objectPosY: 58,
      };
    }

    if (isBottomWear) {
      return {
        type: 'bottom',
        widthPct: 34,
        heightPct: 58,
        yOffset: 74,
        minY: 56,
        maxY: 90,
        scaleFactor: 3.8,
        scaleMin: 0.72,
        scaleMax: 1.45,
        defaultY: 78,
        cropTopRatio: 0.44,
        objectPosY: 84,
      };
    }

    if (isFullWear) {
      return {
        type: 'full',
        widthPct: 46,
        heightPct: 78,
        yOffset: 52,
        minY: 46,
        maxY: 88,
        scaleFactor: 4.5,
        scaleMin: 0.76,
        scaleMax: 1.52,
        defaultY: 62,
        cropTopRatio: 0.2,
        objectPosY: 72,
      };
    }

    return {
      type: 'top',
      widthPct: 44,
      heightPct: 62,
      yOffset: 34,
      minY: 42,
      maxY: 82,
      scaleFactor: 4.6,
      scaleMin: 0.78,
      scaleMax: 1.5,
      defaultY: 58,
      cropTopRatio: 0.3,
      objectPosY: 80,
    };
  };

  const stopTracking = () => {
    if (trackingFrameRef.current) {
      cancelAnimationFrame(trackingFrameRef.current);
      trackingFrameRef.current = null;
    }
    trackingLastTickRef.current = 0;
  };

  const startTracking = () => {
    stopTracking();

    const hasFaceDetector = typeof window !== 'undefined' && 'FaceDetector' in window;
    setTrackingAvailable(hasFaceDetector);
    if (!hasFaceDetector) return;

    const trackLoop = async (timestamp) => {
      trackingFrameRef.current = requestAnimationFrame(trackLoop);

      const video = videoRef.current;
      if (!video || video.readyState < 2 || !selectedProduct || !isCameraActive) return;

      if (timestamp - trackingLastTickRef.current < 120) return;
      trackingLastTickRef.current = timestamp;

      try {
        const garment = getGarmentConfig(selectedProduct);

        if (!faceDetectorRef.current) {
          faceDetectorRef.current = new window.FaceDetector({
            fastMode: true,
            maxDetectedFaces: 1,
          });
        }

        const faces = await faceDetectorRef.current.detect(video);
        if (!faces?.length) return;

        const face = faces[0];
        const box = face.boundingBox;
        if (!box) return;

        const centerX = ((box.x + box.width / 2) / video.videoWidth) * 100;
        const centerY = ((box.y + box.height / 2) / video.videoHeight) * 100;

        const targetPose = {
          x: clamp(centerX, 24, 76),
          y: clamp(centerY + garment.yOffset, garment.minY, garment.maxY),
          scale: clamp(
            (box.width / video.videoWidth) * garment.scaleFactor,
            garment.scaleMin,
            garment.scaleMax,
          ),
        };

        setOverlayPose((prev) => ({
          x: prev.x + (targetPose.x - prev.x) * 0.22,
          y: prev.y + (targetPose.y - prev.y) * 0.22,
          scale: prev.scale + (targetPose.scale - prev.scale) * 0.2,
        }));
      } catch {
        // Ignore transient detector errors while preserving camera stream.
      }
    };

    trackingFrameRef.current = requestAnimationFrame(trackLoop);
  };

  useEffect(() => {
    const loadPreview = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1200));
      setIsLoading(false);
    };

    loadPreview();

    return () => {
      stopTracking();
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (isCameraActive && selectedProduct) {
      startTracking();
    } else {
      stopTracking();
    }

    return () => {
      stopTracking();
    };
  }, [isCameraActive, selectedProduct]);

  useEffect(() => {
    if (!selectedProduct) return;
    const garment = getGarmentConfig(selectedProduct);
    setOverlayPose((prev) => ({ ...prev, y: garment.defaultY }));
  }, [selectedProduct]);

  const startCamera = async () => {
    if (isStartingCamera) return;

    if (!navigator?.mediaDevices?.getUserMedia) {
      setError('Camera is unavailable in this browser. Use a modern browser on localhost or HTTPS.');
      return;
    }

    try {
      setIsStartingCamera(true);
      setError(null);
      setCapturedImage(null);
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
        // Fallback for devices that fail strict constraints.
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }

      streamRef.current = stream;
      setIsCameraActive(true);
      setOverlayPose({ x: 50, y: 58, scale: 1 });

      const videoEl = await waitForVideoElement();
      videoEl.srcObject = stream;
      videoEl.muted = true;
      videoEl.setAttribute('playsinline', 'true');

      // Attempt playback but do not fail hard if play() rejects in restricted environments.
      await videoEl.play().catch(() => {});
    } catch (err) {
      const baseMessage = getCameraErrorMessage(err);
      const detail = typeof err?.message === 'string' && err.message.trim()
        ? ` (${err.message.trim()})`
        : '';
      setError(`${baseMessage}${detail}`);
      console.error('Camera error:', err);
      stopCamera();
    } finally {
      setIsStartingCamera(false);
    }
  };

  const stopCamera = () => {
    stopTracking();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.onloadedmetadata = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = async () => {
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);

      // Apply selected product image as a visual try-on layer in the captured output.
      if (selectedProduct) {
        const garment = getGarmentConfig(selectedProduct);
        const targetW = canvas.width * (garment.widthPct / 100) * overlayPose.scale;
        const targetH = canvas.height * (garment.heightPct / 100) * overlayPose.scale;
        const targetX = clamp((canvas.width * overlayPose.x) / 100 - targetW / 2, 0, canvas.width - targetW);
        const targetY = clamp((canvas.height * overlayPose.y) / 100 - targetH / 2, 0, canvas.height - targetH);

        if (selectedProduct.image) {
          await new Promise((resolve) => {
            const productImg = new window.Image();
            productImg.crossOrigin = 'anonymous';
            productImg.onload = () => {
              const imageRatio = productImg.width / productImg.height;
              const targetRatio = targetW / targetH;

              let drawW = targetW;
              let drawH = targetH;
              if (imageRatio > targetRatio) {
                drawH = targetW / imageRatio;
              } else {
                drawW = targetH * imageRatio;
              }

              const drawX = targetX + (targetW - drawW) / 2;
              const drawY = targetY + (targetH - drawH) / 2;
              const srcY = Math.max(0, Math.floor(productImg.height * garment.cropTopRatio));
              const srcHeight = Math.max(1, productImg.height - srcY);

              ctx.globalAlpha = 0.62;
              ctx.drawImage(productImg, 0, srcY, productImg.width, srcHeight, drawX, drawY, drawW, drawH);
              ctx.globalAlpha = 1;
              resolve();
            };
            productImg.onerror = () => resolve();
            productImg.src = selectedProduct.image;
          });
        }

        ctx.fillStyle = selectedProduct.color + '80'; // Semi-transparent
        ctx.fillRect(
          targetX,
          targetY,
          targetW,
          targetH
        );
      }
      
      const imageData = canvas.toDataURL('image/png');
      setCapturedImage(imageData);
    }
  };

  const downloadImage = () => {
    if (capturedImage) {
      const link = document.createElement('a');
      link.download = 'instastyle-tryon.png';
      link.href = capturedImage;
      link.click();
    }
  };

  const selectProduct = (product) => {
    setSelectedProduct(product);
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <h2>Preparing Style Preview...</h2>
        <p>Setting up the fitting-room view and camera</p>
      </div>
    );
  }

  return (
    <div className={styles.virtualTryOnPage}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/services/instastyle/catalog" className={styles.backButton}>
          ← Catalog
        </Link>
        <div className={styles.headerTitleGroup}>
          <h1 className={styles.title}>Style Preview</h1>
          <span className={styles.liveIndicator}>
            <span className={styles.liveDot}></span>
            Live Fitting Room
          </span>
        </div>
        <div className={styles.headerActions}>
          {isCameraActive && (
            <button onClick={capturePhoto} className={styles.captureBtn}>
              Capture Look
            </button>
          )}
        </div>
      </div>

      <div className={styles.mainContent}>
        {/* Camera/Preview Section */}
        <div className={styles.cameraSection}>
          <div className={styles.cameraContainer}>
            {!isCameraActive && !capturedImage && (
              <div className={styles.cameraPlaceholder}>
                <div className={styles.placeholderIcon}>CAM</div>
                <h2>Ready for a style preview?</h2>
                <p>Start your camera to compare looks before you buy</p>
                <button onClick={startCamera} className={styles.startCameraBtn} disabled={isStartingCamera}>
                  {isStartingCamera ? 'Starting Camera...' : 'Start Camera'}
                </button>
                {error && <p className={styles.errorMessage}>{error}</p>}
              </div>
            )}

            {isCameraActive && !capturedImage && (
              <div className={styles.videoWrapper}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={styles.video}
                />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                
                {/* Overlay UI */}
                <div className={styles.videoOverlay}>
                  {selectedProduct && (
                    <div className={styles.selectedProductOverlay}>
                      <div className={styles.productPreview}>
                        <div 
                          className={styles.productColorSwatch}
                          style={{ background: selectedProduct.color }}
                        />
                        <span>{selectedProduct.name}</span>
                      </div>
                    </div>
                  )}
                </div>

                {selectedProduct && (
                  <div className={styles.tryOnLayer} aria-hidden="true">
                    {(() => {
                      const garment = getGarmentConfig(selectedProduct);
                      return (
                    <div
                      className={`${styles.tryOnGarment} ${styles[`garment${garment.type[0].toUpperCase()}${garment.type.slice(1)}`]}`}
                      style={{
                        left: `${overlayPose.x}%`,
                        top: `${overlayPose.y}%`,
                        width: `${garment.widthPct}%`,
                        height: `${garment.heightPct}%`,
                        transform: `translate(-50%, -50%) scale(${overlayPose.scale})`,
                      }}
                    >
                      {selectedProduct.image ? (
                        <img
                          src={selectedProduct.image}
                          alt={selectedProduct.name}
                          className={styles.tryOnGarmentImage}
                          style={{ objectPosition: `50% ${garment.objectPosY}%` }}
                        />
                      ) : (
                        <div
                          className={styles.tryOnGarmentFallback}
                          style={{ background: selectedProduct.color }}
                        />
                      )}
                      <div
                        className={styles.tryOnTint}
                        style={{ backgroundColor: selectedProduct.color }}
                      />
                    </div>
                      );
                    })()}
                    <div className={styles.trackingBadge}>
                      {trackingAvailable ? 'Auto Tracking On' : 'Auto Tracking Off'}
                    </div>
                  </div>
                )}

                {/* Camera Controls */}
                <div className={styles.cameraControls}>
                  <button onClick={stopCamera} className={styles.controlBtn}>
                    Stop Camera
                  </button>
                  <button 
                    onClick={capturePhoto} 
                    className={styles.captureButton}
                    disabled={!selectedProduct}
                  >
                    <span className={styles.captureCircle}></span>
                  </button>
                  <button 
                    onClick={() => setSelectedProduct(null)} 
                    className={styles.controlBtn}
                    disabled={!selectedProduct}
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}

            {capturedImage && (
              <div className={styles.capturedImageWrapper}>
                <img src={capturedImage} alt="Captured" className={styles.capturedImage} />
                <div className={styles.capturedControls}>
                  <button onClick={() => setCapturedImage(null)} className={styles.retakeBtn}>
                    Retake
                  </button>
                  <button onClick={downloadImage} className={styles.downloadBtn}>
                    Download
                  </button>
                  <button 
                    onClick={() => {
                      setCapturedImage(null);
                      startCamera();
                    }} 
                    className={styles.tryAnotherBtn}
                  >
                    Try Another
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className={styles.instructions}>
            <h3>How to Use</h3>
            <ol>
              <li>Allow camera access when prompted</li>
              <li>Position yourself in the frame</li>
              <li>Select a product from the list</li>
              <li>Preview the look on screen</li>
              <li>Capture and save your look</li>
            </ol>
          </div>
        </div>

        {/* Product Selection Sidebar */}
        <div className={styles.productSidebar}>
          <h2 className={styles.sidebarTitle}>Select Product to Try</h2>
          
          <div className={styles.categoryTabs}>
            {productCategories.map((category) => (
              <button
                key={category}
                className={`${styles.categoryTab} ${activeCategory === category ? styles.active : ''}`}
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
                className={`${styles.productItem} ${
                  selectedProduct?.id === product.id ? styles.selected : ''
                }`}
                onClick={() => selectProduct(product)}
              >
                <div className={styles.productThumbnail}>
                  {product.image ? (
                    <img src={product.image} alt={product.name} className={styles.productThumbImage} />
                  ) : (
                    <div className={styles.productThumbFallback} style={{ background: product.color }} />
                  )}
                </div>
                <div className={styles.productInfo}>
                  <h4>{product.name}</h4>
                  <p className={styles.productCategory}>{product.subcategory} • {product.category}</p>
                </div>
                {selectedProduct?.id === product.id && (
                  <span className={styles.selectedBadge}>✓</span>
                )}
              </div>
            ))}
          </div>

          <div className={styles.sidebarFooter}>
            <Link href="/services/instastyle/catalog" className={styles.browseMoreBtn}>
              Browse More Products
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className={styles.featuresSection}>
        <h2>Why Use Style Preview?</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>01</div>
            <h3>Perfect Fit</h3>
            <p>See how clothes fit your body before ordering</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>02</div>
            <h3>Shop Smarter</h3>
            <p>Choose with more confidence before you add to cart</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>03</div>
            <h3>Instant Preview</h3>
            <p>Compare multiple outfits in seconds without changing</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>04</div>
            <h3>Shop Confidently</h3>
            <p>Make clearer decisions with a simple fitting-room flow</p>
          </div>
        </div>
      </div>
    </div>
  );
}
