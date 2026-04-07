'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './virtual-tryon.module.css';

export default function VirtualTryOnPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [poseDetected, setPoseDetected] = useState(false);
  const [error, setError] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Mock products for try-on
  const tryOnProducts = [
    { id: 1, name: 'Classic White T-Shirt', category: 'tops', color: '#ffffff' },
    { id: 2, name: 'Black Leather Jacket', category: 'jackets', color: '#1a1a1a' },
    { id: 3, name: 'Blue Denim Shirt', category: 'tops', color: '#4a90e2' },
    { id: 4, name: 'Red Hoodie', category: 'hoodies', color: '#e74c3c' },
    { id: 5, name: 'Green Bomber Jacket', category: 'jackets', color: '#27ae60' },
    { id: 6, name: 'Yellow Summer Dress', category: 'dresses', color: '#f39c12' },
  ];

  useEffect(() => {
    // Simulate model loading
    const loadModel = async () => {
      setIsLoading(true);
      // Simulate TensorFlow.js model loading
      await new Promise(resolve => setTimeout(resolve, 2000));
      setModelLoaded(true);
      setIsLoading(false);
    };

    loadModel();

    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
        
        // Start pose detection simulation
        setTimeout(() => setPoseDetected(true), 1500);
      }
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions to use Virtual Try-On.');
      console.error('Camera error:', err);
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
    setPoseDetected(false);
  };

  const capturePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      // Apply product overlay (simplified)
      if (selectedProduct) {
        ctx.fillStyle = selectedProduct.color + '80'; // Semi-transparent
        ctx.fillRect(
          canvas.width * 0.25,
          canvas.height * 0.2,
          canvas.width * 0.5,
          canvas.height * 0.4
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
        <h2>Loading Virtual Try-On...</h2>
        <p>Initializing AI models and camera</p>
      </div>
    );
  }

  return (
    <div className={styles.virtualTryOnPage}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/services/instastyle/catalog" className={styles.backButton}>
          ← Back to Catalog
        </Link>
        <h1 className={styles.title}>Virtual Try-On</h1>
        <div className={styles.headerActions}>
          {isCameraActive && (
            <button onClick={capturePhoto} className={styles.captureBtn}>
              📸 Capture
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
                <div className={styles.placeholderIcon}>📷</div>
                <h2>Ready to Try On?</h2>
                <p>Start your camera to see how clothes look on you</p>
                <button onClick={startCamera} className={styles.startCameraBtn}>
                  Start Camera
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
                  {poseDetected && (
                    <div className={styles.poseIndicator}>
                      <span className={styles.poseIcon}>✓</span>
                      <span>Pose Detected</span>
                    </div>
                  )}
                  
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
              <li>See the virtual overlay on your body</li>
              <li>Capture and save your look</li>
            </ol>
          </div>
        </div>

        {/* Product Selection Sidebar */}
        <div className={styles.productSidebar}>
          <h2 className={styles.sidebarTitle}>Select Product to Try</h2>
          
          <div className={styles.categoryTabs}>
            <button className={styles.categoryTab + ' ' + styles.active}>All</button>
            <button className={styles.categoryTab}>Tops</button>
            <button className={styles.categoryTab}>Jackets</button>
            <button className={styles.categoryTab}>Dresses</button>
          </div>

          <div className={styles.productList}>
            {tryOnProducts.map((product) => (
              <div
                key={product.id}
                className={`${styles.productItem} ${
                  selectedProduct?.id === product.id ? styles.selected : ''
                }`}
                onClick={() => selectProduct(product)}
              >
                <div 
                  className={styles.productThumbnail}
                  style={{ background: product.color }}
                >
                  <span className={styles.thumbnailIcon}>👕</span>
                </div>
                <div className={styles.productInfo}>
                  <h4>{product.name}</h4>
                  <p className={styles.productCategory}>{product.category}</p>
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
        <h2>Why Use Virtual Try-On?</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🎯</div>
            <h3>Perfect Fit</h3>
            <p>See how clothes fit your body before ordering</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>💰</div>
            <h3>Save Money</h3>
            <p>Reduce returns by choosing the right size first time</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⚡</div>
            <h3>Instant Preview</h3>
            <p>Try multiple outfits in seconds without changing</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🌍</div>
            <h3>Shop Confidently</h3>
            <p>Make informed decisions with AR technology</p>
          </div>
        </div>
      </div>
    </div>
  );
}
