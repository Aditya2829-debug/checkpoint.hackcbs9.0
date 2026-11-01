import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Zap,
  ZapOff,
  ScanBarcode,
  FileText,
  Upload,
  CheckCircle2,
  Trash2,
  ArrowRight,
  Camera,
  AlertCircle,
  RefreshCw,
  SwitchCamera,
  ImageIcon,
  Check,
  Loader2,
  RotateCcw,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode, Html5QrcodeSupportedFormats, type Html5QrcodeCameraScanConfig } from 'html5-qrcode';
import { useScanStore } from '../../store/useScanStore';
import { useProductStore } from '../../store/useProductStore';
import { useLanguageStore } from '../../store/useLanguageStore';
import { scanService } from '../../services/api/scanService';
import { validateScannedBarcode } from '../../utils/barcodeValidator';
import { Button } from '../ui/Button';

// Play a pleasant supermarket scanner beep via Web Audio API
const playBeep = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch {
    // Ignore audio errors on unsupported environments
  }
};

export const ScannerModal: React.FC = () => {
  const {
    isScannerOpen,
    closeScanner,
    activeMode,
    setActiveMode,
    torchOn,
    toggleTorch,
    manualBarcodeInput,
    setManualBarcodeInput,
    setCapturedImage,
    extractedIngredients,
    setExtractedIngredients,
    removeExtractedIngredient,
    productNameDraft,
    setProductNameDraft,
    categoryDraft,
    setCategoryDraft,
    isExtracting,
    setIsExtracting,
    recordScan,
    recordProductActivity,
  } = useScanStore();

  const { setCurrentProduct } = useProductStore();
  const { language, t } = useLanguageStore();
  const navigate = useNavigate();

  const [ocrStep, setOcrStep] = useState<'capture' | 'verify'>('capture');
  const [selectedOcrImage, setSelectedOcrImage] = useState<string | null>(null);
  const [newIngredientInput, setNewIngredientInput] = useState('');
  const [cameraState, setCameraState] = useState<'initializing' | 'active' | 'error'>('initializing');
  const [cameraErrorMsg, setCameraErrorMsg] = useState<string>('');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [detectedCode, setDetectedCode] = useState<string | null>(null);
  const [isCapturingFrame, setIsCapturingFrame] = useState(false);
  const [isSwitchingCamera, setIsSwitchingCamera] = useState(false);

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const isScanningLockedRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Anti-mismatch frame consistency buffer
  const candidateRef = useRef<{ code: string; count: number; lastTime: number }>({
    code: '',
    count: 0,
    lastTime: 0,
  });

  const onScanSuccessRef = useRef<(decodedText: string) => void>(() => {});
  const onScanErrorRef = useRef<() => void>(() => {});

  // Stop camera tracks and decoder cleanly
  const stopCamera = useCallback(async () => {
    if (html5QrCodeRef.current) {
      const instance = html5QrCodeRef.current;
      html5QrCodeRef.current = null;
      try {
        if (instance.isScanning) {
          await instance.stop();
        }
        instance.clear();
      } catch {
        // Ignore cleanup error if already cleared
      }
    }
  }, []);

  const handleClose = useCallback(() => {
    stopCamera();
    setDetectedCode(null);
    setSelectedOcrImage(null);
    isScanningLockedRef.current = false;
    candidateRef.current = { code: '', count: 0, lastTime: 0 };
    closeScanner();
  }, [stopCamera, closeScanner]);

  // Handle Barcode Submission
  const handleBarcodeSubmit = useCallback(async (barcodeToLookup: string) => {
    const clean = barcodeToLookup.trim();
    if (!clean) return;
    try {
      // Backend automatically checks MongoDB -> scan_cache -> Gemini API (sub-second lookup)
      const product = await scanService.lookupBarcode(clean);
      setCurrentProduct(product);
      recordScan(product.id);
      recordProductActivity(product, 'barcode');
      handleClose();
      navigate(`/product/${product.id}`);
    } catch (err: any) {
      if (err?.needsLabelPhoto) {
        // If unlisted, smoothly switch to label photo mode without confirmation dialog
        setManualBarcodeInput(clean);
        setActiveMode('ocr');
      } else {
        alert(err?.message || (language === 'hi' ? `बारकोड "${clean}" नहीं मिल सका।` : `Barcode "${clean}" could not be processed.`));
      }
      setDetectedCode(null);
      isScanningLockedRef.current = false;
      candidateRef.current = { code: '', count: 0, lastTime: 0 };
    }
  }, [handleClose, navigate, recordScan, setCurrentProduct, setActiveMode, setManualBarcodeInput, language]);

  // Set up scan callback refs with Checksum & Anti-Mismatch Logic
  useEffect(() => {
    onScanSuccessRef.current = (decodedText: string) => {
      if (isScanningLockedRef.current) return;

      // 1. Validate barcode mathematically (EAN-13, UPC-A, EAN-8)
      const validation = validateScannedBarcode(decodedText);
      if (!validation.isValid) {
        // Drop noisy/partial lines from motion blur
        return;
      }

      const clean = validation.cleanCode;
      const now = Date.now();
      const c = candidateRef.current;

      // 2. Anti-Mismatch Verification:
      // If code passes standard GS1 modulo-10 checksum (e.g. real EAN-13 / UPC-A / EAN-8) -> 100% verified!
      // If check digit is unverified, require 2 consecutive frames reading identical digits within 600ms.
      const isGs1Verified = !validation.warning;

      if (isGs1Verified || (c.code === clean && now - c.lastTime < 600)) {
        isScanningLockedRef.current = true;
        setDetectedCode(clean);
        playBeep();

        if (html5QrCodeRef.current?.isScanning) {
          html5QrCodeRef.current.stop().then(() => html5QrCodeRef.current?.clear()).catch(() => {});
        }

        setTimeout(() => {
          handleBarcodeSubmit(clean);
        }, 450);
      } else {
        // Store first frame candidate and wait for immediate second-frame confirmation
        candidateRef.current = { code: clean, count: 1, lastTime: now };
      }
    };

    onScanErrorRef.current = () => {
      // Searching viewfinder
    };
  }, [handleBarcodeSubmit]);

  // Attempt continuous hardware autofocus on the video stream track
  const applyAutofocusConstraints = useCallback(() => {
    try {
      const container = document.getElementById('interactive-barcode-scanner');
      const video = container?.querySelector('video') as HTMLVideoElement | null;
      if (video && video.srcObject) {
        const stream = video.srcObject as MediaStream;
        const track = stream.getVideoTracks()[0];
        if (track && track.applyConstraints) {
          track.applyConstraints({
            advanced: [
              { focusMode: 'continuous' } as any,
              { exposureMode: 'continuous' } as any,
            ],
          }).catch(() => {});
        }
      }
    } catch {
      // Ignore if browser does not expose advanced focusMode
    }
  }, []);

  // Initialize and run HTML5 Camera Barcode Scanner
  useEffect(() => {
    if (!isScannerOpen || activeMode !== 'barcode') {
      stopCamera();
      return;
    }

    let isCancelled = false;

    const startScanner = async () => {
      await new Promise((resolve) => setTimeout(resolve, 80));
      if (isCancelled) return;

      const container = document.getElementById('interactive-barcode-scanner');
      if (!container) return;

      setCameraState('initializing');
      setCameraErrorMsg('');
      setDetectedCode(null);
      isScanningLockedRef.current = false;
      candidateRef.current = { code: '', count: 0, lastTime: 0 };

      try {
        // Construct Html5Qrcode with hardware BarcodeDetector and clean retail formats
        const qrcode = new Html5Qrcode('interactive-barcode-scanner', {
          formatsToSupport: [
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.UPC_E,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.QR_CODE,
          ],
          useBarCodeDetectorIfSupported: true, // Native Android / Chrome Google Play Services MLKit
          verbose: false,
        });

        html5QrCodeRef.current = qrcode;

        // High Definition configuration with reticle bounding box
        const scanConfig: Html5QrcodeCameraScanConfig = {
          fps: 20,
          disableFlip: false,
          qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
            const width = Math.min(Math.floor(viewfinderWidth * 0.88), 340);
            const height = Math.min(Math.floor(width * 0.65), 220);
            return { width, height };
          },
          videoConstraints: {
            facingMode: { ideal: facingMode },
            width: { min: 1280, ideal: 1920, max: 2560 },
            height: { min: 720, ideal: 1080, max: 1440 },
          },
        };

        // Query available camera devices
        const devices = await Html5Qrcode.getCameras().catch(() => []);
        let targetCamera: string | MediaTrackConstraints = {
          facingMode: { ideal: facingMode },
          width: { min: 1280, ideal: 1920 },
          height: { min: 720, ideal: 1080 },
        };

        if (devices && devices.length > 0) {
          if (facingMode === 'environment') {
            const backCam = devices.find((d) => /back|rear|environment|main|0/i.test(d.label));
            if (backCam) {
              targetCamera = backCam.id;
            }
          } else {
            const frontCam = devices.find((d) => /front|user|selfie|integrated|1/i.test(d.label));
            if (frontCam) {
              targetCamera = frontCam.id;
            }
          }
        }

        try {
          await qrcode.start(
            targetCamera,
            scanConfig,
            (decodedText) => onScanSuccessRef.current(decodedText),
            () => onScanErrorRef.current(),
          );
        } catch (initialErr) {
          console.warn('Initial camera target failed, trying direct facingMode constraint...', initialErr);
          await qrcode.start(
            { facingMode: { ideal: facingMode } },
            scanConfig,
            (decodedText) => onScanSuccessRef.current(decodedText),
            () => onScanErrorRef.current(),
          );
        }

        if (isCancelled) {
          if (qrcode.isScanning) {
            await qrcode.stop().catch(() => {});
          }
          qrcode.clear();
          return;
        }

        setCameraState('active');
        applyAutofocusConstraints();
      } catch (err: unknown) {
        if (isCancelled) return;
        const msg =
          err instanceof Error
            ? err.message
            : 'Camera could not be accessed. Please ensure camera permissions are granted.';
        setCameraState('error');
        setCameraErrorMsg(msg);
      }
    };

    startScanner();

    return () => {
      isCancelled = true;
      stopCamera();
    };
  }, [isScannerOpen, activeMode, facingMode, stopCamera, applyAutofocusConstraints]);

  // Toggle Camera Front / Back
  const handleSwitchCamera = useCallback(async () => {
    if (isSwitchingCamera) return;
    setIsSwitchingCamera(true);

    try {
      await stopCamera();
      const nextFacing: 'environment' | 'user' = facingMode === 'environment' ? 'user' : 'environment';
      setFacingMode(nextFacing);
      setCameraState('initializing');
    } catch (err: any) {
      console.error('Camera switch error:', err);
    } finally {
      setIsSwitchingCamera(false);
    }
  }, [facingMode, isSwitchingCamera, stopCamera]);

  // Instant Snapshot & High-Precision Barcode Capture
  const handleCaptureFrame = async () => {
    const container = document.getElementById('interactive-barcode-scanner');
    const video = container?.querySelector('video') as HTMLVideoElement | null;
    if (!video || video.readyState < 2) {
      alert(language === 'hi' ? 'कैमरा स्ट्रीम शुरू हो रहा है। कृपया प्रतीक्षा करें।' : 'Camera stream is still starting. Please wait a moment.');
      return;
    }

    setIsCapturingFrame(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1920;
      canvas.height = video.videoHeight || 1080;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw high resolution frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), 'image/png')
      );
      if (!blob) return;

      const file = new File([blob], 'snapshot.png', { type: 'image/png' });

      const decoder = new Html5Qrcode('barcode-file-decoder-temp', {
        formatsToSupport: [
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.QR_CODE,
        ],
        useBarCodeDetectorIfSupported: true,
        verbose: false,
      });

      const decoded = await decoder.scanFile(file, false);
      decoder.clear();

      if (decoded && decoded.trim()) {
        const clean = decoded.trim();
        setDetectedCode(clean);
        playBeep();
        setTimeout(() => {
          handleBarcodeSubmit(clean);
        }, 450);
      }
    } catch {
      alert(
        language === 'hi'
          ? 'कैप्चर किए गए फ्रेम से बारकोड नहीं मिला।\n\nसुझाव:\n• बारकोड को कैमरे के 25-35 सेमी पास रखें ताकि वह स्पष्ट और फोकस में रहे।\n• चकाचौंध या तेज रोशनी से बचें।'
          : 'Could not detect barcode from the captured frame.\n\nTips:\n• Hold the barcode steady ~25–35 cm from camera where it is in focus.\n• Avoid reflective glare from overhead lights.'
      );
    } finally {
      setIsCapturingFrame(false);
    }
  };

  // Handle Barcode Image File Scan (direct upload from gallery)
  const handleBarcodeFileScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const qrcode = new Html5Qrcode('barcode-file-decoder-temp', {
        formatsToSupport: [
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.QR_CODE,
        ],
        useBarCodeDetectorIfSupported: true,
        verbose: false,
      });

      const decoded = await qrcode.scanFile(file, false);
      qrcode.clear();

      if (decoded && decoded.trim()) {
        const clean = decoded.trim();
        setDetectedCode(clean);
        playBeep();
        setTimeout(() => {
          handleBarcodeSubmit(clean);
        }, 450);
      }
    } catch {
      alert(language === 'hi' ? 'फोटो से स्पष्ट बारकोड नहीं मिल सका। कृपया बारकोड नंबर मैन्युअल दर्ज करें।' : 'Could not detect a clear barcode from the photo. Please enter digits manually.');
    } finally {
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  // Toggle Flashlight / Torch
  const handleToggleTorch = async () => {
    const nextState = !torchOn;
    toggleTorch();
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        await html5QrCodeRef.current.applyVideoConstraints({
          advanced: [{ torch: nextState } as any],
        });
      } catch {
        // Torch not supported on current device
      }
    }
  };

  const handleQuickBarcodePick = (code: string) => {
    setManualBarcodeInput(code);
    handleBarcodeSubmit(code);
  };

  // Safely compress smartphone photos to max 1280px with error & timeout handling
  const compressImage = async (file: File): Promise<{ base64: string; mimeType: string }> => {
    return new Promise((resolve) => {
      const fallbackTimeout = setTimeout(() => {
        resolve({ base64: '', mimeType: 'image/jpeg' });
      }, 8000);

      const reader = new FileReader();
      reader.onerror = () => {
        clearTimeout(fallbackTimeout);
        resolve({ base64: '', mimeType: 'image/jpeg' });
      };
      reader.onload = (ev) => {
        const rawResult = ev.target?.result as string;
        if (!rawResult) {
          clearTimeout(fallbackTimeout);
          resolve({ base64: '', mimeType: 'image/jpeg' });
          return;
        }

        const img = new Image();
        img.onerror = () => {
          clearTimeout(fallbackTimeout);
          resolve({ base64: rawResult, mimeType: file.type || 'image/jpeg' });
        };
        img.onload = () => {
          clearTimeout(fallbackTimeout);
          try {
            const maxDim = 1280;
            let { width, height } = img;
            if (width > maxDim || height > maxDim) {
              if (width > height) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              } else {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              resolve({
                base64: canvas.toDataURL('image/jpeg', 0.85),
                mimeType: 'image/jpeg',
              });
              return;
            }
          } catch {
            // fallback if canvas fails
          }
          resolve({
            base64: rawResult,
            mimeType: file.type || 'image/jpeg',
          });
        };
        img.src = rawResult;
      };
      reader.readAsDataURL(file);
    });
  };

  // User selects an image either from Camera or Phone Gallery
  const handleImageSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { base64 } = await compressImage(file);
      if (base64) {
        setSelectedOcrImage(base64);
        setCapturedImage(base64);
      }
    } catch (err) {
      console.error('Failed to load image:', err);
    } finally {
      // Clear input so re-selecting triggers onChange every time
      e.target.value = '';
    }
  };

  // User taps the Tick (✓) button to send image to Gemini AI
  const handleSendToGemini = async () => {
    if (!selectedOcrImage || isExtracting) return;
    setIsExtracting(true);

    try {
      // Clean barcode or timestamp
      const barcodeToUse = manualBarcodeInput.trim() || `${Date.now()}`;
      const product = await scanService.scanLabel({
        barcode: barcodeToUse,
        imageBase64: selectedOcrImage,
        mimeType: 'image/jpeg',
        categoryHint: categoryDraft === 'women-hygiene' ? 'period' : 'food',
      });
      setCurrentProduct(product);
      recordScan(product.id);
      recordProductActivity(product, 'ocr');
      setIsExtracting(false);
      handleClose();
      navigate(`/product/${product.id}`);
    } catch (err: any) {
      console.warn('Backend label analysis notice:', err?.message);
      setIsExtracting(false);
      const msg =
        err?.response?.data?.reason ||
        err?.response?.data?.message ||
        err?.message ||
        (language === 'hi'
          ? 'फोटो का विश्लेषण करने में असमर्थ। कृपया लेबल पर केंद्रित स्पष्ट फोटो लें।'
          : 'Unable to analyze image. Please take a clearer photo centering on the ingredients/nutrition label.');
      alert(msg);
    }
  };

  const handleOcrVerificationSubmit = async () => {
    setIsExtracting(true);
    const product = await scanService.analyzeVerifiedOcr({
      productName: productNameDraft,
      category: categoryDraft,
      ingredients: extractedIngredients,
    });
    setCurrentProduct(product);
    recordScan(product.id);
    recordProductActivity(product, 'ocr');
    setIsExtracting(false);
    handleClose();
    navigate(`/product/${product.id}`);
  };

  if (!isScannerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between animate-fade-in text-white safe-top safe-bottom">
      {/* Hidden helper for file decoding */}
      <div id="barcode-file-decoder-temp" className="hidden" />

      {/* Top Controls Header */}
      <div className="max-w-4xl mx-auto w-full px-5 py-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="bg-white/10 p-1 rounded-2xl flex items-center border border-white/20">
            <button
              onClick={() => {
                setActiveMode('barcode');
                setOcrStep('capture');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeMode === 'barcode'
                  ? 'bg-[#D7FF63] text-[#0F3822] shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <ScanBarcode className="w-4 h-4" />
              <span>{language === 'hi' ? 'बारकोड' : 'Barcode'}</span>
            </button>
            <button
              onClick={() => {
                stopCamera();
                setActiveMode('ocr');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeMode === 'ocr'
                  ? 'bg-[#D7FF63] text-[#0F3822] shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{language === 'hi' ? 'फोटो स्कैन' : 'Photo Scan'}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Camera Switch / Flip */}
          {activeMode === 'barcode' && (
            <button
              type="button"
              onClick={handleSwitchCamera}
              disabled={isSwitchingCamera}
              className="p-2.5 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all cursor-pointer disabled:opacity-50"
              title={facingMode === 'environment' ? 'Switch to Front Camera' : 'Switch to Back Camera'}
            >
              <SwitchCamera className={`w-5 h-5 ${isSwitchingCamera ? 'animate-spin' : ''}`} />
            </button>
          )}

          {/* Torch toggle */}
          {activeMode === 'barcode' && (
            <button
              onClick={handleToggleTorch}
              className={`p-2.5 rounded-xl border border-white/20 transition-all cursor-pointer ${
                torchOn ? 'bg-[#D7FF63] text-[#0F3822]' : 'bg-white/10 text-white'
              }`}
              title={t('flashLight')}
            >
              {torchOn ? <Zap className="w-5 h-5 fill-current" /> : <ZapOff className="w-5 h-5" />}
            </button>
          )}

          {/* Close Scanner */}
          <button
            onClick={handleClose}
            className="p-2.5 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Viewport Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-y-auto z-10">
        {activeMode === 'barcode' ? (
          /* ================= BARCODE SCANNER VIEWPORT ================= */
          <div className="w-full max-w-lg md:max-w-xl flex flex-col items-center">
            {/* Live Camera Viewfinder Box */}
            <div
              className={`w-full aspect-[4/3] rounded-3xl border-2 relative overflow-hidden flex items-center justify-center bg-black shadow-[0_0_50px_rgba(0,0,0,0.9)] transition-colors ${
                detectedCode ? 'border-[#C5F82A] ring-4 ring-[#C5F82A]/50' : 'border-white/40'
              }`}
            >
              {/* Actual HTML5-QRCode Mount Container */}
              <div
                id="interactive-barcode-scanner"
                className="w-full h-full relative"
              />

              {/* Camera State Fallback Overlay */}
              {cameraState === 'initializing' && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/85 text-center px-4">
                  <RefreshCw className="w-10 h-10 text-[#D7FF63] animate-spin mx-auto mb-3" />
                  <p className="text-sm font-bold text-white">
                    {language === 'hi' ? 'उच्च गुणवत्ता वाला स्कैनर लोड हो रहा है...' : 'Initializing Barcode Scanner...'}
                  </p>
                  <p className="text-xs text-white/70 mt-1 max-w-xs">
                    {language === 'hi' ? 'कैमरा अनुमति दें।' : 'High-definition autofocus enabled.'}
                  </p>
                </div>
              )}

              {cameraState === 'error' && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 text-center px-4">
                  <AlertCircle className="w-10 h-10 text-[#FF5E5E] mx-auto mb-3" />
                  <p className="text-sm font-bold text-white">
                    {language === 'hi' ? 'कैमरा उपलब्ध नहीं है' : 'Camera access unavailable'}
                  </p>
                  <p className="text-xs text-white/70 mt-1 max-w-xs">
                    {cameraErrorMsg || 'Permission was denied or no camera device found.'}
                  </p>
                  <p className="text-xs text-[#D7FF63] mt-3 font-bold">
                    {language === 'hi' ? 'आप फोटो अपलोड कर सकते हैं या नीचे दिए गए नमूने इस्तेमाल करें!' : 'You can upload a barcode photo or use sample buttons below!'}
                  </p>
                </div>
              )}

              {/* Detected Barcode Success Overlay */}
              {detectedCode && (
                <div className="absolute inset-0 bg-[#005128]/85 backdrop-blur-sm z-30 flex flex-col items-center justify-center text-center p-4 animate-fade-in">
                  <CheckCircle2 className="w-12 h-12 text-[#C5F82A] mb-2 animate-bounce" />
                  <p className="text-sm font-black text-[#C5F82A] uppercase tracking-wider font-mono">
                    {language === 'hi' ? 'सत्यापित बारकोड स्कैन हुआ!' : 'Barcode Verified & Scanned!'}
                  </p>
                  <p className="text-xl font-black text-white font-mono mt-1">
                    {detectedCode}
                  </p>
                  <p className="text-xs text-white/80 mt-1">
                    {language === 'hi' ? 'सामग्री और पोषण का विश्लेषण जारी...' : 'Analyzing ingredients & nutrition...'}
                  </p>
                  <p className="text-[10px] text-[#D7FF63] mt-1 animate-pulse">
                    ⚡ {language === 'hi' ? 'जांच जारी है...' : 'Checking product...'}
                  </p>
                </div>
              )}

              {/* Reticle Corners */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-[#D7FF63] rounded-tl-xl z-20 pointer-events-none" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-[#D7FF63] rounded-tr-xl z-20 pointer-events-none" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-[#D7FF63] rounded-bl-xl z-20 pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-[#D7FF63] rounded-br-xl z-20 pointer-events-none" />

              {/* Animated Laser Scanning Line */}
              {cameraState === 'active' && !detectedCode && (
                <div className="absolute left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-[#D7FF63] to-transparent shadow-[0_0_15px_#D7FF63] animate-scanner-line z-20 pointer-events-none" />
              )}
            </div>

            {/* Viewfinder Controls & Instant Frame Capture Button */}
            <div className="w-full mt-3 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleCaptureFrame}
                disabled={cameraState !== 'active' || isCapturingFrame}
                className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  cameraState === 'active'
                    ? 'bg-[#D7FF63] text-[#0F3822] border-[#C5F82A] shadow-sm hover:brightness-105 active:scale-95'
                    : 'bg-white/10 text-white/40 border-white/10 cursor-not-allowed'
                }`}
                title="Capture still snapshot and decode"
              >
                <Camera className="w-4 h-4" />
                <span>
                  {isCapturingFrame
                    ? (language === 'hi' ? 'विश्लेषण हो रहा है...' : 'Analyzing Frame...')
                    : (language === 'hi' ? '📸 फोटो खींचें और स्कैन करें' : '📸 Capture & Scan Frame')}
                </span>
              </button>

              <button
                type="button"
                onClick={handleSwitchCamera}
                disabled={isSwitchingCamera}
                className="py-2 px-3 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
                title={facingMode === 'environment' ? 'Switch to Front Camera' : 'Switch to Back Camera'}
              >
                <SwitchCamera className={`w-4 h-4 text-[#D7FF63] ${isSwitchingCamera ? 'animate-spin' : ''}`} />
                <span>
                  {facingMode === 'environment'
                    ? (language === 'hi' ? 'सामने का कैमरा' : 'To Front Cam')
                    : (language === 'hi' ? 'पिछला कैमरा' : 'To Back Cam')}
                </span>
              </button>
            </div>

            {/* Instruction & Status */}
            <div className="w-full mt-2.5 px-1 flex flex-col gap-1 text-center">
              <p className="text-xs font-medium text-white/90">
                {t('alignBarcode')}
              </p>
              <p className="text-[10px] text-[#D7FF63]/90 font-medium">
                {language === 'hi'
                  ? '💡 बारकोड को 20–30 सेमी की दूरी पर रखें ताकि वह साफ और फोकस में रहे।'
                  : '💡 Hold barcode ~25–35 cm away where it is in focus. Avoid glare!'}
              </p>
            </div>

            {/* Quick Demo Barcode Buttons */}
            <div className="mt-4 w-full">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-bold text-white/60 uppercase tracking-wider font-mono">
                  {t('quickSamples')}
                </p>
                {/* Upload barcode image fallback */}
                <label className="text-[11px] font-bold text-[#D7FF63] flex items-center gap-1 cursor-pointer hover:underline">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'गैलरी से फोटो चुनें' : 'Upload Barcode Photo'}</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleBarcodeFileScan}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => handleQuickBarcodePick('8901719114251')}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-left border border-white/15 transition-all text-xs cursor-pointer"
                >
                  <span className="font-bold block text-[#D7FF63] truncate">Hide & Seek®</span>
                  <span className="text-[10px] text-white/60">{language === 'hi' ? 'पाम ऑयल • ग्रेड E' : 'Palm Oil • Grade E'}</span>
                </button>
                <button
                  onClick={() => handleQuickBarcodePick('8901063012128')}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-left border border-white/15 transition-all text-xs cursor-pointer"
                >
                  <span className="font-bold block text-[#D7FF63] truncate">Nutrichoice</span>
                  <span className="text-[10px] text-white/60">{language === 'hi' ? 'संतृप्त वसा • ग्रेड E' : 'Sat Fat • Grade E'}</span>
                </button>
                <button
                  onClick={() => handleQuickBarcodePick('8901725181223')}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-left border border-white/15 transition-all text-xs cursor-pointer"
                >
                  <span className="font-bold block text-[#D7FF63] truncate">Dark Fantasy</span>
                  <span className="text-[10px] text-white/60">{language === 'hi' ? '5 एडिटिव्स • ग्रेड E' : '5 Additives • Grade E'}</span>
                </button>
                <button
                  onClick={() => handleQuickBarcodePick('8901030383748')}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-left border border-white/15 transition-all text-xs cursor-pointer"
                >
                  <span className="font-bold block text-[#BCA5FF] truncate">Stayfree Secure</span>
                  <span className="text-[10px] text-white/60">{language === 'hi' ? 'स्वच्छता • ग्रेड D' : 'Hygiene • Grade D'}</span>
                </button>
                <button
                  onClick={() => handleQuickBarcodePick('8901234567890')}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-left border border-white/15 transition-all text-xs cursor-pointer"
                >
                  <span className="font-bold block text-[#D7FF63] truncate">Test Biscuit</span>
                  <span className="text-[10px] text-white/60">{language === 'hi' ? 'डेटाबेस • ग्रेड E' : 'Database • Grade E'}</span>
                </button>
                <button
                  onClick={() => handleQuickBarcodePick('8886467100017')}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-left border border-white/15 transition-all text-xs cursor-pointer"
                >
                  <span className="font-bold block text-[#FF8A8A] truncate">Pringles Original</span>
                  <span className="text-[10px] text-white/60">{language === 'hi' ? 'आलू चिप्स • ग्रेड E' : 'Potato Chips • Grade E'}</span>
                </button>
              </div>
            </div>

            {/* Manual Barcode Input */}
            <div className="mt-4 w-full">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleBarcodeSubmit(manualBarcodeInput);
                }}
                className="flex items-center gap-2 bg-white/10 p-1.5 rounded-2xl border border-white/20"
              >
                <input
                  type="text"
                  placeholder={t('enterManual')}
                  value={manualBarcodeInput}
                  onChange={(e) => setManualBarcodeInput(e.target.value)}
                  className="flex-1 bg-transparent px-3 text-xs sm:text-sm font-semibold text-white placeholder-white/50 focus:outline-none"
                />
                <Button type="submit" size="sm" variant="secondary">
                  {language === 'hi' ? 'खोजें' : 'Look Up'}
                </Button>
              </form>
            </div>
          </div>
        ) : (
          /* ================= OCR LABEL SCANNER VIEWPORT ================= */
          <div className="w-full max-w-md md:max-w-lg flex flex-col items-center">
            {ocrStep === 'capture' ? (
              <div className="w-full flex flex-col items-center text-center">
                {!selectedOcrImage ? (
                  /* State 1: Choose Camera or Phone Gallery */
                  <div className="w-full rounded-3xl border-2 border-dashed border-white/30 bg-white/5 flex flex-col items-center justify-center p-6 relative">
                    <Camera className="w-14 h-14 text-[#D7FF63] mb-2" />
                    <h3 className="font-bold text-base sm:text-lg mb-1 font-['Space_Grotesk'] text-white">
                      {language === 'hi' ? 'सामग्री या पोषण लेबल की फोटो' : 'Ingredient / Nutrition Label Photo'}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/70 max-w-sm mb-6">
                      {language === 'hi'
                        ? 'कैमरा से फोटो लें या गैलरी से चुनें। सामग्री और स्वास्थ्य रेटिंग तुरंत जांची जाएगी।'
                        : 'Take a live photo or choose from your phone to check ingredients and health safety.'}
                    </p>

                    {/* Two action cards: Live Camera & Phone Gallery */}
                    <div className="w-full grid grid-cols-2 gap-3">
                      {/* 1. Camera Option */}
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={handleImageSelected}
                          className="hidden"
                        />
                        <div className="h-full p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 flex flex-col items-center justify-center gap-2 transition-all active:scale-95 text-center shadow-md">
                          <div className="w-11 h-11 rounded-full bg-[#D7FF63]/20 flex items-center justify-center text-[#D7FF63]">
                            <Camera className="w-6 h-6" />
                          </div>
                          <span className="font-bold text-xs sm:text-sm text-white">
                            {language === 'hi' ? 'कैमरा फोटो' : 'Camera Photo'}
                          </span>
                          <span className="text-[10px] text-white/60">
                            {language === 'hi' ? 'लाइव फोटो लें' : 'Snap packaging'}
                          </span>
                        </div>
                      </label>

                      {/* 2. Phone Gallery Option */}
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelected}
                          className="hidden"
                        />
                        <div className="h-full p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 flex flex-col items-center justify-center gap-2 transition-all active:scale-95 text-center shadow-md">
                          <div className="w-11 h-11 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                            <ImageIcon className="w-6 h-6" />
                          </div>
                          <span className="font-bold text-xs sm:text-sm text-white">
                            {language === 'hi' ? 'फ़ोन गैलरी' : 'Phone Gallery'}
                          </span>
                          <span className="text-[10px] text-white/60">
                            {language === 'hi' ? 'फ़ोन से इमेज चुनें' : 'Upload from phone'}
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>
                ) : (
                  /* State 2: Preview Selected Image + Prominent TICK (✓) Button to Send to Gemini */
                  <div className="w-full bg-[#191820] rounded-3xl p-4 sm:p-5 border border-[#2D2B38] flex flex-col gap-3 shadow-2xl">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <span className="text-xs font-bold text-white/80 uppercase tracking-wider">
                        {language === 'hi' ? 'चुनी गई फोटो' : 'Selected Photo'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedOcrImage(null)}
                        disabled={isExtracting}
                        className="text-xs text-white/60 hover:text-white flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{language === 'hi' ? 'दूसरी फोटो चुनें' : 'Change'}</span>
                      </button>
                    </div>

                    {/* Image Preview with Loading Overlay */}
                    <div className="relative w-full max-h-60 sm:max-h-72 rounded-2xl overflow-hidden bg-black/60 border border-white/15 flex items-center justify-center">
                      <img
                        src={selectedOcrImage}
                        alt="Product preview"
                        className="max-h-60 sm:max-h-72 w-full object-contain"
                      />
                      {isExtracting && (
                        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center z-10">
                          <Loader2 className="w-10 h-10 text-[#D7FF63] animate-spin mb-3" />
                          <p className="font-bold text-sm sm:text-base text-white">
                            {language === 'hi'
                              ? 'सामग्री और पोषण की जांच हो रही है...'
                              : 'Checking ingredients & nutrition...'}
                          </p>
                          <p className="text-xs text-white/60 mt-1">
                            {language === 'hi'
                              ? 'कृपया प्रतीक्षा करें...'
                              : 'Please wait a moment...'}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Category Selector */}
                    <div>
                      <label className="text-[11px] font-bold text-white/70 block mb-1">
                        {language === 'hi' ? 'उत्पाद श्रेणी चुनें' : 'Select Category'}
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setCategoryDraft('food')}
                          className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            categoryDraft === 'food'
                              ? 'bg-[#0F3822] text-[#D7FF63] border-[#D7FF63]'
                              : 'bg-white/5 border-white/15 text-white/70'
                          }`}
                        >
                          {language === 'hi' ? 'खाद्य एवं पेय' : 'Food & Beverages'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setCategoryDraft('women-hygiene')}
                          className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            categoryDraft === 'women-hygiene'
                              ? 'bg-[#431A60] text-[#BCA5FF] border-[#BCA5FF]'
                              : 'bg-white/5 border-white/15 text-white/70'
                          }`}
                        >
                          {language === 'hi' ? 'महिला स्वच्छता' : "Women's Hygiene"}
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons: Retake and Prominent Tick Button */}
                    <div className="pt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedOcrImage(null)}
                        disabled={isExtracting}
                        className="py-3 px-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>{language === 'hi' ? 'पुनः' : 'Retake'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleSendToGemini}
                        disabled={isExtracting}
                        className="flex-1 py-3 px-4 rounded-2xl bg-[#D7FF63] hover:bg-[#c4ec4d] text-[#0F3822] font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#D7FF63]/25 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                      >
                        {isExtracting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>{language === 'hi' ? 'विश्लेषण जारी है...' : 'Analyzing...'}</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-5 h-5 stroke-[3]" />
                            <span>{language === 'hi' ? '✓ भेजें' : '✓ Send'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Verification Step */
              <div className="w-full bg-[#191820] rounded-3xl p-5 border border-[#2D2B38] max-h-[75vh] flex flex-col">
                <div className="flex items-center justify-between pb-3 border-b border-[#2D2B38]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#D7FF63]" />
                    <span className="font-bold text-sm sm:text-base">
                      {language === 'hi' ? 'निकाले गए लेबल की पुष्टि करें' : 'Verify Extracted Label'}
                    </span>
                  </div>
                  <button
                    onClick={() => setOcrStep('capture')}
                    className="text-xs text-white/60 hover:text-white cursor-pointer"
                  >
                    {language === 'hi' ? 'पुनः प्रयास' : 'Retake'}
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto py-3 space-y-3">
                  {/* Category selector */}
                  <div>
                    <label className="text-xs font-bold text-white/70 block mb-1.5">
                      {language === 'hi' ? 'उत्पाद श्रेणी' : 'Product Category'}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setCategoryDraft('food')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          categoryDraft === 'food'
                            ? 'bg-[#0F3822] text-[#D7FF63] border-[#D7FF63]'
                            : 'bg-white/5 border-white/15 text-white/70'
                        }`}
                      >
                        {language === 'hi' ? 'खाद्य एवं पेय' : 'Food & Beverages'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setCategoryDraft('women-hygiene')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          categoryDraft === 'women-hygiene'
                            ? 'bg-[#431A60] text-[#BCA5FF] border-[#BCA5FF]'
                            : 'bg-white/5 border-white/15 text-white/70'
                        }`}
                      >
                        {language === 'hi' ? 'महिला स्वच्छता' : "Women's Hygiene"}
                      </button>
                    </div>
                  </div>

                  {/* Product Name Candidate */}
                  <div>
                    <label className="text-xs font-bold text-white/70 block mb-1.5">
                      {language === 'hi' ? 'उत्पाद का नाम' : 'Product Name'}
                    </label>
                    <input
                      type="text"
                      value={productNameDraft}
                      onChange={(e) => setProductNameDraft(e.target.value)}
                      className="w-full bg-black/40 border border-white/20 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-white focus:outline-none focus:border-[#D7FF63]"
                    />
                  </div>

                  {/* Extracted Ingredients Chips */}
                  <div>
                    <label className="text-xs font-bold text-white/70 block mb-1.5">
                      {language === 'hi' ? `पहचानी गई सामग्रियां (${extractedIngredients.length})` : `Extracted Ingredients (${extractedIngredients.length})`}
                    </label>
                    <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                      {extractedIngredients.map((ing, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-black/30 px-3 py-2 rounded-xl border border-white/10 text-xs"
                        >
                          <span className="truncate mr-2">{ing}</span>
                          <button
                            onClick={() => removeExtractedIngredient(idx)}
                            className="text-red-400 hover:text-red-300 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="mt-2.5 flex gap-2">
                      <input
                        type="text"
                        placeholder={language === 'hi' ? 'छूटी हुई सामग्री जोड़ें...' : 'Add missed ingredient...'}
                        value={newIngredientInput}
                        onChange={(e) => setNewIngredientInput(e.target.value)}
                        className="flex-1 bg-black/40 border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newIngredientInput.trim()) {
                            setExtractedIngredients([
                              ...extractedIngredients,
                              newIngredientInput.trim(),
                            ]);
                            setNewIngredientInput('');
                          }
                        }}
                        className="px-3 py-1.5 bg-white/10 rounded-xl text-xs font-semibold hover:bg-white/20 cursor-pointer"
                      >
                        {language === 'hi' ? 'जोड़ें' : 'Add'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#2D2B38]">
                  <Button
                    onClick={handleOcrVerificationSubmit}
                    variant="secondary"
                    className="w-full py-2.5"
                    isLoading={isExtracting}
                  >
                    <span>{language === 'hi' ? 'स्वास्थ्य एवं सुरक्षा जांचें' : 'Check Health & Safety'}</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="px-6 py-4 text-center text-xs text-white/60 z-10">
        {language === 'hi'
          ? 'सभी रेटिंग FSSAI और BIS सुरक्षा मानकों के आधार पर जांची जाती हैं।'
          : 'All ratings are verified based on regulatory FSSAI & BIS safety standards.'}
      </div>
    </div>
  );
};
