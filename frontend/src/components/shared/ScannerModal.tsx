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
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { useScanStore } from '../../store/useScanStore';
import { useProductStore } from '../../store/useProductStore';
import { useLanguageStore } from '../../store/useLanguageStore';
import { scanService } from '../../services/api/scanService';
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
    // Ignore audio errors on unsupported browsers
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
  } = useScanStore();

  const { setCurrentProduct } = useProductStore();
  const { t } = useLanguageStore();
  const navigate = useNavigate();

  const [ocrStep, setOcrStep] = useState<'capture' | 'verify'>('capture');
  const [newIngredientInput, setNewIngredientInput] = useState('');
  const [cameraState, setCameraState] = useState<'initializing' | 'active' | 'error'>('initializing');
  const [cameraErrorMsg, setCameraErrorMsg] = useState<string>('');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [detectedCode, setDetectedCode] = useState<string | null>(null);
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [availableCameras, setAvailableCameras] = useState<Array<{ id: string; label: string }>>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [isCapturingFrame, setIsCapturingFrame] = useState(false);

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const isScanningLockedRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    isScanningLockedRef.current = false;
    closeScanner();
  }, [stopCamera, closeScanner]);

  // Handle Barcode Submission
  const handleBarcodeSubmit = useCallback(async (barcodeToLookup: string) => {
    const clean = barcodeToLookup.trim();
    if (!clean) return;
    try {
      // Backend automatically checks MongoDB -> scan_cache -> Gemini API (zero friction, no prompt)
      const product = await scanService.lookupBarcode(clean);
      setCurrentProduct(product);
      recordScan(product.id);
      handleClose();
      navigate(`/product/${product.id}`);
    } catch (err: any) {
      if (err?.needsLabelPhoto) {
        // If neither DB nor Gemini identified by barcode number alone, switch smoothly to label photo mode without confirmation dialog
        setManualBarcodeInput(clean);
        setActiveMode('ocr');
      } else {
        alert(err?.message || `Barcode "${clean}" could not be processed.`);
      }
      setDetectedCode(null);
      isScanningLockedRef.current = false;
    }
  }, [handleClose, navigate, recordScan, setCurrentProduct, setActiveMode, setManualBarcodeInput]);

  // Check available camera devices using Html5Qrcode
  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length > 0) {
          setAvailableCameras(devices);
          setHasMultipleCameras(devices.length > 1);
          // Auto-select back camera if on phone, or first available camera if on laptop
          const backCam = devices.find((d) => /back|rear|environment/i.test(d.label));
          const chosen = backCam ? backCam.id : devices[0].id;
          setSelectedCameraId(chosen);
        }
      })
      .catch(() => {});
  }, []);

  // Initialize and run HTML5 Camera Barcode Scanner
  useEffect(() => {
    if (!isScannerOpen || activeMode !== 'barcode') {
      stopCamera();
      return;
    }

    let isCancelled = false;

    const startScanner = async () => {
      // Short delay to allow React to mount the #interactive-barcode-scanner DOM element
      await new Promise((resolve) => setTimeout(resolve, 80));
      if (isCancelled) return;

      const container = document.getElementById('interactive-barcode-scanner');
      if (!container) return;

      setCameraState('initializing');
      setCameraErrorMsg('');
      setDetectedCode(null);
      isScanningLockedRef.current = false;

      try {
        const qrcode = new Html5Qrcode('interactive-barcode-scanner', {
          formatsToSupport: [
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.CODE_39,
            Html5QrcodeSupportedFormats.CODE_93,
            Html5QrcodeSupportedFormats.CODABAR,
            Html5QrcodeSupportedFormats.ITF,
            Html5QrcodeSupportedFormats.QR_CODE,
          ],
          verbose: false,
        });

        html5QrCodeRef.current = qrcode;

        // Query available devices if not yet populated
        const devices = await Html5Qrcode.getCameras().catch(() => []);
        if (devices && devices.length > 0) {
          setAvailableCameras(devices);
          setHasMultipleCameras(devices.length > 1);
        }

        // Determine camera target (laptop webcams fail on 'environment', so pass deviceId or fallback to 'user')
        let targetCamera: string | MediaTrackConstraints = selectedCameraId;
        if (!targetCamera && devices.length > 0) {
          if (facingMode === 'environment') {
            const backCam = devices.find((d) => /back|rear|environment/i.test(d.label));
            targetCamera = backCam ? backCam.id : devices[0].id;
          } else {
            const frontCam = devices.find((d) => /front|user|integrated|webcam/i.test(d.label));
            targetCamera = frontCam ? frontCam.id : devices[0].id;
          }
        }
        if (!targetCamera) {
          targetCamera = { facingMode };
        }

        const scanConfig = {
          fps: 15,
          disableFlip: false, // Inverts frame automatically to scan mirrored laptop webcam video
          videoConstraints: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        };

        const onScanSuccess = (decodedText: string) => {
          if (isScanningLockedRef.current || !decodedText.trim()) return;
          isScanningLockedRef.current = true;
          const clean = decodedText.trim();
          setDetectedCode(clean);
          playBeep();

          if (qrcode.isScanning) {
            qrcode.stop().then(() => qrcode.clear()).catch(() => {});
          }

          setTimeout(() => {
            handleBarcodeSubmit(clean);
          }, 500);
        };

        const onScanError = () => {
          // Frame search without barcode - keep scanning
        };

        // Try selected/preferred camera target, with automatic fallback for laptop single webcams
        try {
          await qrcode.start(targetCamera, scanConfig, onScanSuccess, onScanError);
        } catch (initialErr) {
          console.warn('Initial camera target failed, trying fallback...', initialErr);
          if (devices.length > 0) {
            await qrcode.start(devices[0].id, scanConfig, onScanSuccess, onScanError);
          } else {
            await qrcode.start({ facingMode: 'user' }, scanConfig, onScanSuccess, onScanError);
          }
        }

        if (isCancelled) {
          if (qrcode.isScanning) {
            await qrcode.stop().catch(() => {});
          }
          qrcode.clear();
          return;
        }

        setCameraState('active');
      } catch (err: unknown) {
        if (isCancelled) return;
        const msg =
          err instanceof Error
            ? err.message
            : 'Camera could not be accessed. Please ensure permissions are granted.';
        setCameraState('error');
        setCameraErrorMsg(msg);
      }
    };

    startScanner();

    return () => {
      isCancelled = true;
      stopCamera();
    };
  }, [isScannerOpen, activeMode, facingMode, selectedCameraId, handleBarcodeSubmit, stopCamera]);

  // Toggle Camera Front / Back
  const toggleCameraFacing = () => {
    if (availableCameras.length > 1) {
      const currentIndex = availableCameras.findIndex((c) => c.id === selectedCameraId);
      const nextIndex = (currentIndex + 1) % availableCameras.length;
      setSelectedCameraId(availableCameras[nextIndex].id);
    } else {
      setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
    }
  };

  // Instant Snapshot & High-Precision Barcode Capture (for laptop webcams without autofocus)
  const handleCaptureFrame = async () => {
    const container = document.getElementById('interactive-barcode-scanner');
    const video = container?.querySelector('video') as HTMLVideoElement | null;
    if (!video || video.readyState < 2) {
      alert('Camera stream is still starting. Please wait a moment.');
      return;
    }

    setIsCapturingFrame(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw exact frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), 'image/png')
      );
      if (!blob) return;

      const file = new File([blob], 'snapshot.png', { type: 'image/png' });

      const decoder = new Html5Qrcode('barcode-file-decoder-temp', {
        formatsToSupport: [
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.CODE_93,
          Html5QrcodeSupportedFormats.CODABAR,
          Html5QrcodeSupportedFormats.ITF,
          Html5QrcodeSupportedFormats.QR_CODE,
        ],
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
        }, 500);
      }
    } catch {
      alert(
        'Could not detect barcode from the captured frame.\n\nTips for laptop webcams:\n• Hold the barcode steady ~25–35 cm from camera (where it is sharp and in focus).\n• Avoid reflective plastic glare from room lights.\n• Or tap "Upload Barcode Photo" or a sample button below.'
      );
    } finally {
      setIsCapturingFrame(false);
    }
  };

  // Handle Barcode Image File Scan (direct upload from gallery/desktop)
  const handleBarcodeFileScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const qrcode = new Html5Qrcode('barcode-file-decoder-temp', {
        formatsToSupport: [
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.CODE_93,
          Html5QrcodeSupportedFormats.CODABAR,
          Html5QrcodeSupportedFormats.ITF,
          Html5QrcodeSupportedFormats.QR_CODE,
          Html5QrcodeSupportedFormats.DATA_MATRIX,
        ],
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
        }, 500);
      }
    } catch {
      alert('Could not detect a clear barcode from the photo. Please ensure it is well-lit or enter the digits manually.');
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

  // Handle Image Upload / Capture for OCR
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setCapturedImage(base64);
      setIsExtracting(true);

      try {
        const barcodeToUse = manualBarcodeInput.trim() || '8901030383748';
        const product = await scanService.scanLabel({
          barcode: barcodeToUse,
          imageBase64: base64,
          mimeType: file.type || 'image/jpeg',
          categoryHint: categoryDraft === 'women-hygiene' ? 'period' : 'food',
        });
        setCurrentProduct(product);
        recordScan(product.id);
        setIsExtracting(false);
        handleClose();
        navigate(`/product/${product.id}`);
        return;
      } catch (err: any) {
        // Fallback to local ingredient review flow if backend label scan reports issue
        console.warn('Backend label analysis notice:', err?.message);
        const result = await scanService.extractFromImage(file);
        setExtractedIngredients(result.extractedIngredients);
        setProductNameDraft(result.productNameCandidates[0] || 'Extracted Product');
        setIsExtracting(false);
        setOcrStep('verify');
      }
    };
    reader.readAsDataURL(file);
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
              <span>Barcode</span>
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
              <span>OCR Label</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Camera Switch / Flip (for phones with front/back or laptops with webcams) */}
          {activeMode === 'barcode' && (
            <button
              onClick={toggleCameraFacing}
              className="p-2.5 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all cursor-pointer"
              title={facingMode === 'environment' ? 'Switch to Front/User Camera' : 'Switch to Back Camera'}
            >
              <SwitchCamera className="w-5 h-5" />
            </button>
          )}

          {/* Torch toggle */}
          {activeMode === 'barcode' && (
            <button
              onClick={handleToggleTorch}
              className={`p-2.5 rounded-xl border border-white/20 transition-all cursor-pointer ${
                torchOn ? 'bg-[#D7FF63] text-[#0F3822]' : 'bg-white/10 text-white'
              }`}
              title="Toggle Flashlight"
            >
              {torchOn ? <Zap className="w-5 h-5 fill-current" /> : <ZapOff className="w-5 h-5" />}
            </button>
          )}

          {/* Close Scanner */}
          <button
            onClick={handleClose}
            className="p-2.5 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all cursor-pointer"
            title="Close Scanner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Viewport Content (Responsive on desktop: max-w-xl md:max-w-2xl) */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-y-auto z-10">
        {activeMode === 'barcode' ? (
          /* ================= BARCODE SCANNER VIEWPORT WITH LIVE REAL-TIME CAMERA ================= */
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
                    Initializing Barcode Scanner...
                  </p>
                  <p className="text-xs text-white/70 mt-1 max-w-xs">
                    Please click "Allow" on your browser camera permission prompt.
                  </p>
                </div>
              )}

              {cameraState === 'error' && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 text-center px-4">
                  <AlertCircle className="w-10 h-10 text-[#FF5E5E] mx-auto mb-3" />
                  <p className="text-sm font-bold text-white">
                    Camera access unavailable
                  </p>
                  <p className="text-xs text-white/70 mt-1 max-w-xs">
                    {cameraErrorMsg || 'Permission was denied or no camera device found.'}
                  </p>
                  <p className="text-xs text-[#D7FF63] mt-3 font-bold">
                    You can still upload a barcode photo or use sample buttons below!
                  </p>
                </div>
              )}

              {/* Detected Barcode Success Overlay */}
              {detectedCode && (
                <div className="absolute inset-0 bg-[#005128]/85 backdrop-blur-sm z-30 flex flex-col items-center justify-center text-center p-4 animate-fade-in">
                  <CheckCircle2 className="w-12 h-12 text-[#C5F82A] mb-2 animate-bounce" />
                  <p className="text-sm font-black text-[#C5F82A] uppercase tracking-wider font-mono">
                    Barcode Scanned!
                  </p>
                  <p className="text-xl font-black text-white font-mono mt-1">
                    {detectedCode}
                  </p>
                  <p className="text-xs text-white/80 mt-1">
                    Retrieving product analysis from database...
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
                title="Capture still snapshot and decode immediately"
              >
                <Camera className="w-4 h-4" />
                <span>{isCapturingFrame ? 'Analyzing Frame...' : '📸 Capture & Scan Frame'}</span>
              </button>

              {hasMultipleCameras && (
                <button
                  type="button"
                  onClick={toggleCameraFacing}
                  className="py-2 px-3 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer transition-all"
                  title="Switch to next camera"
                >
                  <SwitchCamera className="w-4 h-4 text-[#D7FF63]" />
                  <span>Switch</span>
                </button>
              )}
            </div>

            {/* Instruction & Status */}
            <div className="w-full mt-2.5 px-1 flex flex-col gap-1 text-center">
              <p className="text-xs font-medium text-white/90">
                {t('alignBarcode')}
              </p>
              <p className="text-[10px] text-[#D7FF63]/90 font-medium">
                💡 Laptop tip: Hold barcode ~25–35 cm away where it is in focus. Avoid glare!
              </p>
            </div>

            {/* Quick Demo Barcode Buttons with Real Database Products */}
            <div className="mt-4 w-full">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-bold text-white/60 uppercase tracking-wider font-mono">
                  {t('quickSamples')} (Database Matches)
                </p>
                {/* Upload barcode image fallback */}
                <label className="text-[11px] font-bold text-[#D7FF63] flex items-center gap-1 cursor-pointer hover:underline">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Upload Barcode Photo</span>
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
                  <span className="text-[10px] text-white/60">Palm Oil • Grade E</span>
                </button>
                <button
                  onClick={() => handleQuickBarcodePick('8901063012128')}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-left border border-white/15 transition-all text-xs cursor-pointer"
                >
                  <span className="font-bold block text-[#D7FF63] truncate">Nutrichoice</span>
                  <span className="text-[10px] text-white/60">Sat Fat • Grade E</span>
                </button>
                <button
                  onClick={() => handleQuickBarcodePick('8901725181223')}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-left border border-white/15 transition-all text-xs cursor-pointer"
                >
                  <span className="font-bold block text-[#D7FF63] truncate">Dark Fantasy</span>
                  <span className="text-[10px] text-white/60">5 Additives • Grade E</span>
                </button>
                <button
                  onClick={() => handleQuickBarcodePick('8901030383748')}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-left border border-white/15 transition-all text-xs cursor-pointer"
                >
                  <span className="font-bold block text-[#BCA5FF] truncate">Stayfree Secure</span>
                  <span className="text-[10px] text-white/60">Hygiene • Grade D</span>
                </button>
                <button
                  onClick={() => handleQuickBarcodePick('8901234567890')}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-left border border-white/15 transition-all text-xs cursor-pointer"
                >
                  <span className="font-bold block text-[#D7FF63] truncate">Test Biscuit</span>
                  <span className="text-[10px] text-white/60">Database • Grade E</span>
                </button>
                <button
                  onClick={() => handleQuickBarcodePick('8886467100017')}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-left border border-white/15 transition-all text-xs cursor-pointer"
                >
                  <span className="font-bold block text-[#FF8A8A] truncate">Pringles Original</span>
                  <span className="text-[10px] text-white/60">Potato Chips • Grade E</span>
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
                  Look Up
                </Button>
              </form>
            </div>
          </div>
        ) : (
          /* ================= OCR LABEL SCANNER VIEWPORT ================= */
          <div className="w-full max-w-md md:max-w-lg flex flex-col items-center">
            {ocrStep === 'capture' ? (
              <div className="w-full flex flex-col items-center text-center">
                <div className="w-full aspect-[4/3] rounded-3xl border-2 border-dashed border-white/40 bg-white/5 flex flex-col items-center justify-center p-6 relative">
                  <Camera className="w-14 h-14 text-[#D7FF63] mb-3" />
                  <h3 className="font-bold text-base sm:text-lg mb-1 font-['Space_Grotesk']">
                    Capture Ingredient Label
                  </h3>
                  <p className="text-xs sm:text-sm text-white/70 max-w-sm mb-5">
                    Photograph the ingredients or nutrition table on packaging for instant AI text extraction.
                  </p>

                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div className="px-6 py-3 rounded-2xl bg-[#D7FF63] text-[#0F3822] font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg hover:bg-[#c2ed4a] transition-all">
                      <Upload className="w-4 h-4" />
                      <span>Take Photo / Upload Image</span>
                    </div>
                  </label>
                </div>
              </div>
            ) : (
              /* Verification Step */
              <div className="w-full bg-[#191820] rounded-3xl p-5 border border-[#2D2B38] max-h-[75vh] flex flex-col">
                <div className="flex items-center justify-between pb-3 border-b border-[#2D2B38]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#D7FF63]" />
                    <span className="font-bold text-sm sm:text-base">Verify Extracted Label</span>
                  </div>
                  <button
                    onClick={() => setOcrStep('capture')}
                    className="text-xs text-white/60 hover:text-white cursor-pointer"
                  >
                    Retake
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto py-3 space-y-3">
                  {/* Category selector */}
                  <div>
                    <label className="text-xs font-bold text-white/70 block mb-1.5">
                      Product Category
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
                        Food & Beverages
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
                        Women's Hygiene
                      </button>
                    </div>
                  </div>

                  {/* Product Name Candidate */}
                  <div>
                    <label className="text-xs font-bold text-white/70 block mb-1.5">
                      Product Name
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
                      Extracted Ingredients ({extractedIngredients.length})
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
                        placeholder="Add missed ingredient..."
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
                        Add
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
                    <span>Submit for Official Grading</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="px-6 py-4 text-center text-xs text-white/60 z-10">
        All product grades are evaluated through regulatory FSSAI & BIS safety algorithms.
      </div>
    </div>
  );
};
