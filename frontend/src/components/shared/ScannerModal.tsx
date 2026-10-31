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
import { Html5Qrcode } from 'html5-qrcode';
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

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isScanningLockedRef = useRef(false);
  const scanIntervalRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stop camera tracks cleanly
  const stopCamera = useCallback(() => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const handleClose = () => {
    stopCamera();
    setDetectedCode(null);
    isScanningLockedRef.current = false;
    closeScanner();
  };

  // Handle Barcode Submission
  const handleBarcodeSubmit = useCallback(async (barcodeToLookup: string) => {
    if (!barcodeToLookup.trim()) return;
    try {
      const product = await scanService.lookupBarcode(barcodeToLookup.trim());
      setCurrentProduct(product);
      recordScan(product.id);
      handleClose();
      navigate(`/product/${product.id}`);
    } catch {
      alert(`Barcode "${barcodeToLookup}" not found in database. You can try a test sample or enter manually.`);
      setDetectedCode(null);
      isScanningLockedRef.current = false;
    }
  }, [handleClose, navigate, recordScan, setCurrentProduct]);

  // Check available video devices
  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        const videoDevices = devices.filter((d) => d.kind === 'videoinput');
        setHasMultipleCameras(videoDevices.length > 1);
      }).catch(() => {});
    }
  }, []);

  // Initialize Camera Stream when Barcode Mode is active
  useEffect(() => {
    let mounted = true;

    const startCamera = async () => {
      if (!isScannerOpen || activeMode !== 'barcode') {
        stopCamera();
        return;
      }

      setCameraState('initializing');
      setCameraErrorMsg('');
      setDetectedCode(null);
      isScanningLockedRef.current = false;

      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera API is not supported on this browser or environment.');
        }

        // Try primary constraints with facingMode
        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: { ideal: facingMode },
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
            audio: false,
          });
        } catch {
          // Fallback to basic video constraint if strict constraint fails (e.g. laptop webcam)
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
        }

        if (!mounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setCameraState('active');
      } catch (err: unknown) {
        if (!mounted) return;
        const msg =
          err instanceof Error
            ? err.message
            : 'Camera permission denied or camera device not found.';
        setCameraState('error');
        setCameraErrorMsg(msg);
      }
    };

    startCamera();

    return () => {
      mounted = false;
      stopCamera();
    };
  }, [isScannerOpen, activeMode, facingMode, stopCamera]);

  // Toggle Camera Front / Back
  const toggleCameraFacing = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Real-time Barcode Detection Loop
  useEffect(() => {
    if (cameraState !== 'active' || activeMode !== 'barcode' || !isScannerOpen) {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
        scanIntervalRef.current = null;
      }
      return;
    }

    // Check if browser has native BarcodeDetector API (Chrome, Edge, Android Chrome, Safari 17+)
    const hasNativeBarcodeDetector = 'BarcodeDetector' in window;

    let detector: unknown = null;
    if (hasNativeBarcodeDetector) {
      try {
        const BarcodeDetectorClass = (window as unknown as { BarcodeDetector: new (opts: { formats: string[] }) => unknown }).BarcodeDetector;
        detector = new BarcodeDetectorClass({
          formats: [
            'ean_13',
            'ean_8',
            'upc_a',
            'upc_e',
            'code_128',
            'code_39',
            'qr_code',
            'data_matrix',
            'itf',
          ],
        });
      } catch {
        detector = null;
      }
    }

    // Detection interval
    const interval = window.setInterval(async () => {
      if (isScanningLockedRef.current || !videoRef.current) return;
      const video = videoRef.current;
      if (video.readyState < 2) return;

      if (detector) {
        try {
          const barcodeDetectorInstance = detector as {
            detect: (target: HTMLVideoElement) => Promise<Array<{ rawValue: string }>>;
          };
          const barcodes = await barcodeDetectorInstance.detect(video);
          if (barcodes && barcodes.length > 0) {
            const code = barcodes[0].rawValue;
            if (code && !isScanningLockedRef.current) {
              isScanningLockedRef.current = true;
              setDetectedCode(code);
              playBeep();
              setTimeout(() => {
                handleBarcodeSubmit(code);
              }, 600);
            }
          }
        } catch {
          // Frame detection error, continue next frame
        }
      }
    }, 180);

    scanIntervalRef.current = interval;

    return () => {
      clearInterval(interval);
      scanIntervalRef.current = null;
    };
  }, [cameraState, activeMode, isScannerOpen, handleBarcodeSubmit]);

  // Handle Barcode Image File Scan (fallback or direct upload)
  const handleBarcodeFileScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const html5QrCode = new Html5Qrcode('barcode-file-decoder-temp');
      const result = await html5QrCode.scanFile(file, false);
      if (result) {
        setDetectedCode(result);
        playBeep();
        setTimeout(() => {
          handleBarcodeSubmit(result);
        }, 500);
      }
    } catch {
      alert('Could not detect barcode from image. Please try another image or use manual entry.');
    }
  };

  // Handle Torch / Flashlight control
  useEffect(() => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack && 'applyConstraints' in videoTrack) {
        try {
          const trackWithTorch = videoTrack as MediaStreamTrack & {
            applyConstraints: (c: unknown) => Promise<void>;
          };
          trackWithTorch.applyConstraints({
            advanced: [{ torch: torchOn }],
          }).catch(() => {});
        } catch {
          // Torch not supported by hardware/driver
        }
      }
    }
  }, [torchOn]);

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

      const result = await scanService.extractFromImage(file);
      setExtractedIngredients(result.extractedIngredients);
      setProductNameDraft(result.productNameCandidates[0] || 'Extracted Product');
      setIsExtracting(false);
      setOcrStep('verify');
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
              onClick={toggleTorch}
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
              className={`w-full aspect-[4/3] rounded-3xl border-2 relative overflow-hidden flex items-center justify-center bg-black/80 shadow-[0_0_50px_rgba(0,0,0,0.9)] transition-colors ${
                detectedCode ? 'border-[#C5F82A] ring-4 ring-[#C5F82A]/50' : 'border-white/40'
              }`}
            >
              {/* Actual HTML5 Video Element displaying live stream */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`absolute inset-0 w-full h-full object-cover ${
                  cameraState === 'active' ? 'opacity-100' : 'opacity-0'
                }`}
              />

              {/* Camera State Fallback Overlay */}
              {cameraState === 'initializing' && (
                <div className="text-center z-10 px-4">
                  <RefreshCw className="w-10 h-10 text-[#D7FF63] animate-spin mx-auto mb-3" />
                  <p className="text-sm font-bold text-white">
                    Requesting camera access...
                  </p>
                  <p className="text-xs text-white/70 mt-1 max-w-xs">
                    Please click "Allow" on your browser camera permission prompt.
                  </p>
                </div>
              )}

              {cameraState === 'error' && (
                <div className="text-center z-10 px-4">
                  <AlertCircle className="w-10 h-10 text-[#FF5E5E] mx-auto mb-3" />
                  <p className="text-sm font-bold text-white">
                    Camera access unavailable
                  </p>
                  <p className="text-xs text-white/70 mt-1 max-w-xs">
                    {cameraErrorMsg || 'Permission was denied or no camera device found.'}
                  </p>
                  <p className="text-xs text-[#D7FF63] mt-3 font-bold">
                    You can still use manual entry or test samples below!
                  </p>
                </div>
              )}

              {/* Detected Barcode Success Overlay */}
              {detectedCode && (
                <div className="absolute inset-0 bg-[#005128]/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center p-4 animate-fade-in">
                  <CheckCircle2 className="w-12 h-12 text-[#C5F82A] mb-2" />
                  <p className="text-sm font-black text-[#C5F82A] uppercase tracking-wider font-mono">
                    Barcode Scanned!
                  </p>
                  <p className="text-lg font-black text-white font-mono mt-1">
                    {detectedCode}
                  </p>
                  <p className="text-xs text-white/80 mt-1">
                    Retrieving product analysis...
                  </p>
                </div>
              )}

              {/* Reticle Corners */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-[#D7FF63] rounded-tl-xl z-10 pointer-events-none" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-[#D7FF63] rounded-tr-xl z-10 pointer-events-none" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-[#D7FF63] rounded-bl-xl z-10 pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-[#D7FF63] rounded-br-xl z-10 pointer-events-none" />

              {/* Animated Laser Scanning Line */}
              {cameraState === 'active' && !detectedCode && (
                <div className="absolute left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-[#D7FF63] to-transparent shadow-[0_0_15px_#D7FF63] animate-scanner-line z-10 pointer-events-none" />
              )}
            </div>

            {/* Instruction & Status */}
            <div className="flex items-center justify-between w-full mt-2.5 px-1">
              <p className="text-xs font-semibold text-white/80">
                {t('alignBarcode')}
              </p>
              {hasMultipleCameras && (
                <button
                  onClick={toggleCameraFacing}
                  className="text-xs font-bold text-[#D7FF63] flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <SwitchCamera className="w-3.5 h-3.5" />
                  <span>Switch Camera</span>
                </button>
              )}
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

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => handleQuickBarcodePick('8901234567')}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-left border border-white/15 transition-all text-xs cursor-pointer"
                >
                  <span className="font-bold block text-[#D7FF63] truncate">NutriBite Crisps</span>
                  <span className="text-[10px] text-white/60">Millets • Grade B</span>
                </button>
                <button
                  onClick={() => handleQuickBarcodePick('8906105820019')}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-left border border-white/15 transition-all text-xs cursor-pointer"
                >
                  <span className="font-bold block text-[#BCA5FF] truncate">PureSoft Pads</span>
                  <span className="text-[10px] text-white/60">Hygiene • Grade A</span>
                </button>
                <button
                  onClick={() => handleQuickBarcodePick('890600000001')}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-left border border-white/15 transition-all text-xs cursor-pointer"
                >
                  <span className="font-bold block text-[#D7FF63] truncate">Vedic Makhana</span>
                  <span className="text-[10px] text-white/60">Snack • Grade A</span>
                </button>
                <button
                  onClick={() => handleQuickBarcodePick('8901058852341')}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-left border border-white/15 transition-all text-xs cursor-pointer"
                >
                  <span className="font-bold block text-[#FF8A8A] truncate">Maggi Noodles</span>
                  <span className="text-[10px] text-white/60">Instant • Grade D</span>
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
