import React, { useState, useRef } from 'react';
import { 
  ScanText, ImageIcon, Download, Loader2, CheckCircle2, AlertCircle, X, 
  Edit3, Eye, EyeOff, FileText, Check, Sparkles 
} from 'lucide-react';
import Tesseract from 'tesseract.js';

// ─── Convert file to base64 ───────────────────────────────────────────────────
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─── Real OCR Text Parser for Aadhaar & Identity Cards ────────────────────────
function parseAadhaarText(rawText) {
  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  // 1. Aadhaar Number (12 digits, often formatted as 4 4 4)
  let aadhaarNumber = '';
  let maskedId = '';
  const aadhaarRegex = /\b(\d{4})[\s-]?(\d{4})[\s-]?(\d{4})\b/;
  const aadhaarMatch = rawText.match(aadhaarRegex);
  if (aadhaarMatch) {
    const rawDigits = aadhaarMatch[1] + aadhaarMatch[2] + aadhaarMatch[3];
    aadhaarNumber = `${aadhaarMatch[1]} ${aadhaarMatch[2]} ${aadhaarMatch[3]}`;
    maskedId = `XXXX XXXX ${rawDigits.slice(-4)}`;
  } else {
    const digits12 = rawText.match(/\b\d{12}\b/);
    if (digits12) {
      const rawDigits = digits12[0];
      aadhaarNumber = `${rawDigits.slice(0, 4)} ${rawDigits.slice(4, 8)} ${rawDigits.slice(8, 12)}`;
      maskedId = `XXXX XXXX ${rawDigits.slice(-4)}`;
    }
  }

  // 2. Date of Birth (DD/MM/YYYY or Year of Birth)
  let dob = '';
  const dobRegex = /\b(0?[1-9]|[12][0-9]|3[01])[\/\-\.\s](0?[1-9]|1[012])[\/\-\.\s](19\d\d|20\d\d)\b/;
  const dobMatch = rawText.match(dobRegex);
  if (dobMatch) {
    dob = `${dobMatch[1].padStart(2, '0')}/${dobMatch[2].padStart(2, '0')}/${dobMatch[3]}`;
  } else {
    const yobMatch = rawText.match(/(?:Year of Birth|जन्म\s*वर्ष|YOB|DOB)[:\s]*(\d{4})/i) || rawText.match(/\b(19\d\d|20\d\d)\b/);
    if (yobMatch) {
      dob = `01/01/${yobMatch[1]}`;
    }
  }

  // 3. Gender
  let gender = '';
  if (/female|महिला|स्त्री|\bF\b/i.test(rawText)) {
    gender = 'Female';
  } else if (/male|पुरुष|\bM\b/i.test(rawText)) {
    gender = 'Male';
  } else if (/transgender/i.test(rawText)) {
    gender = 'Transgender';
  }

  // 4. Extract Full Name
  let name = '';
  const ignoreKeywords = /government|india|bharat|sarkar|unique|identification|authority|enrollment|aadhaar|help|uidai|father|husband|mother|birth|dob|gender|male|female|yob|address|pincode|date|card|republic/i;

  // Strategy A: Line right before DOB
  let dobLineIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/dob|birth|जन्म|d\.o\.b/i.test(lines[i])) {
      dobLineIdx = i;
      break;
    }
  }

  if (dobLineIdx > 0) {
    for (let j = dobLineIdx - 1; j >= 0; j--) {
      const candidate = lines[j].replace(/[^a-zA-Z\s]/g, '').trim();
      const words = candidate.split(/\s+/).filter((w) => w.length > 1);
      if (words.length >= 2 && words.length <= 4 && !ignoreKeywords.test(candidate)) {
        name = words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
        break;
      }
    }
  }

  // Strategy B: First prominent 2-4 word alphabetic line
  if (!name) {
    for (const line of lines) {
      const candidate = line.replace(/[^a-zA-Z\s]/g, '').trim();
      const words = candidate.split(/\s+/).filter((w) => w.length > 1);
      if (words.length >= 2 && words.length <= 4 && !ignoreKeywords.test(candidate)) {
        name = words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
        break;
      }
    }
  }

  // 5. Extract Pincode & Address
  let pincode = '';
  const pinMatch = rawText.match(/\b([1-9]\d{5})\b/);
  if (pinMatch) pincode = pinMatch[1];

  let address = '';
  for (const line of lines) {
    if (line.includes('41') || (pincode && line.includes(pincode)) || /pune|mumbai|nagpur|nashik|thane|solapur|kolhapur|satara|aurangabad|chhatrapati|nanded|amravati|jalgaon|akola|latur|dhule|ahmednagar|chandrapur|parbhani|beed|gondia|wardha|osmanabad|dharashiv|yavatmal|gadchiroli|bhandara|hingoli|jalna|buldhana|ratnagiri|sindhudurg|raigad|palghar/i.test(line)) {
      address = line.replace(/[^a-zA-Z0-9\s,-]/g, '').trim();
      break;
    }
  }

  return {
    name,
    dob,
    gender,
    aadhaar_number: aadhaarNumber,
    masked_id: maskedId,
    address: address || (pincode ? `Maharashtra - ${pincode}` : ''),
    pincode,
    raw_text: rawText,
  };
}

// ─── Compress image to target KB using Canvas ─────────────────────────────────
async function compressImage(file, targetKB = 48) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;

      // Scale down if too large (max 600px wide for passport photos)
      const maxDim = 600;
      if (width > maxDim || height > maxDim) {
        const ratio = Math.min(maxDim / width, maxDim / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      // Binary search for the right quality to hit target size
      let lo = 0.01, hi = 0.99, bestBlob = null;
      const attempt = (quality) =>
        new Promise((res) => canvas.toBlob(res, 'image/jpeg', quality));

      const iterate = async () => {
        for (let i = 0; i < 10; i++) {
          const mid = (lo + hi) / 2;
          const blob = await attempt(mid);
          bestBlob = blob;
          if (blob.size / 1024 > targetKB) {
            hi = mid;
          } else {
            lo = mid;
          }
        }
        resolve({
          blob: bestBlob,
          sizeKB: Math.round(bestBlob.size / 1024),
          width,
          height,
        });
      };
      iterate();
    };
    img.src = url;
  });
}

// ════════════════════════════════════════════════════════════════════════════════
// Aadhaar Smart OCR Component (100% Client-Side Real OCR via Tesseract.js)
// ════════════════════════════════════════════════════════════════════════════════
export function AadhaarOCR() {
  const [state, setState] = useState('idle'); // idle | loading | success | error
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [rawText, setRawText] = useState('');
  const [showRaw, setShowRaw] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showMasked, setShowMasked] = useState(true);
  const inputRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, WEBP).');
      setState('error');
      return;
    }

    setPreview(URL.createObjectURL(file));
    setState('loading');
    setProgress(10);
    setResult(null);
    setError('');
    setRawText('');
    setIsEditing(false);

    try {
      // Step 1: Run real Tesseract OCR on the actual image pixels
      const { data } = await Tesseract.recognize(
        file,
        'eng',
        {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setProgress(Math.min(95, Math.round(m.progress * 100)));
            }
          },
        }
      );

      const recognized = data?.text || '';
      setRawText(recognized);
      setProgress(100);

      if (!recognized.trim() || recognized.trim().length < 5) {
        throw new Error('No readable text found on this image. Please ensure the Aadhaar card photo is sharp, right-side up, and well-lit.');
      }

      // Step 2: Parse real extracted text
      const parsed = parseAadhaarText(recognized);

      // Fallback: If no name was picked up by pattern, pick the first clean line
      if (!parsed.name) {
        const candidateLines = recognized.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 2 && !/government|india|unique/i.test(l));
        if (candidateLines.length > 0) {
          parsed.name = candidateLines[0].replace(/[^a-zA-Z\s]/g, '').trim();
        }
      }

      setResult(parsed);
      setState('success');
    } catch (err) {
      console.error('OCR Error:', err);
      setError(err.message || 'Error scanning document. Please ensure the card text is clear.');
      setState('error');
    }
  };

  const handleFieldChange = (field, val) => {
    setResult((prev) => ({
      ...prev,
      [field]: val,
    }));
  };

  const reset = () => {
    setState('idle');
    setPreview(null);
    setResult(null);
    setError('');
    setProgress(0);
    setRawText('');
    setShowRaw(false);
    setIsEditing(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm">
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 bg-orange-50 text-orange-600 rounded-lg shrink-0">
          <ScanText size={24} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h5 className="font-bold text-slate-800">Aadhaar Smart OCR</h5>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
              Live Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Reads real text directly from your card image — zero cloud credits required.
          </p>
        </div>
      </div>

      {/* Upload zone */}
      {state === 'idle' && (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-orange-200 rounded-xl bg-orange-50/40 cursor-pointer hover:bg-orange-50 transition-colors group">
          <ScanText size={28} className="text-orange-400 mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-orange-600">Click to upload Aadhaar card</span>
          <span className="text-[10px] text-slate-400 mt-1">JPG, PNG, WEBP (front or back side)</span>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </label>
      )}

      {/* Loading with real percentage */}
      {state === 'loading' && (
        <div className="flex flex-col items-center justify-center gap-3 py-6">
          {preview && (
            <img src={preview} alt="aadhaar" className="h-20 rounded-lg object-contain border border-slate-200 shadow" />
          )}
          <div className="flex flex-col items-center gap-1.5 text-orange-600 w-full max-w-xs">
            <div className="flex items-center gap-2">
              <Loader2 size={18} className="animate-spin" />
              <span className="text-xs font-bold">Scanning document with OCR... {progress}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
              <div
                className="bg-orange-500 h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="text-[10px] text-slate-400">Reading text directly from your card pixels...</span>
          </div>
        </div>
      )}

      {/* Success */}
      {state === 'success' && result && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-600">
              <CheckCircle2 size={18} />
              <span className="text-sm font-bold">Scan Complete!</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1 ${
                  isEditing 
                    ? 'bg-orange-50 text-orange-600 border-orange-200' 
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {isEditing ? <Check size={12} /> : <Edit3 size={12} />}
                {isEditing ? 'Done Editing' : 'Edit Details'}
              </button>
              {rawText && (
                <button
                  type="button"
                  onClick={() => setShowRaw(!showRaw)}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-1"
                >
                  <FileText size={12} />
                  {showRaw ? 'Hide OCR Text' : 'View OCR Text'}
                </button>
              )}
            </div>
          </div>

          {preview && (
            <img
              src={preview}
              alt="aadhaar"
              className="w-full max-h-32 rounded-lg object-contain border border-slate-100 bg-slate-50"
            />
          )}

          {/* Raw OCR text view for full transparency */}
          {showRaw && rawText && (
            <div className="bg-slate-900 text-slate-100 p-3 rounded-lg text-[11px] font-mono whitespace-pre-wrap max-h-36 overflow-y-auto border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-sans font-bold">
                Actual Text Recognized From Image:
              </div>
              {rawText}
            </div>
          )}

          {/* Extracted Form Fields */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-2.5 border border-slate-200/80">
            {/* Full Name */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 text-sm">
              <span className="font-bold text-slate-500 min-w-[120px] shrink-0 text-xs uppercase tracking-wide">
                Full Name:
              </span>
              {isEditing ? (
                <input
                  type="text"
                  value={result.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  placeholder="Enter full name"
                  className="flex-1 bg-white border border-slate-300 rounded px-2 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              ) : (
                <span className="text-slate-800 font-bold text-sm">
                  {result.name || <span className="text-slate-400 font-normal italic">Not clearly visible on card</span>}
                </span>
              )}
            </div>

            {/* Date of Birth */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 text-sm">
              <span className="font-bold text-slate-500 min-w-[120px] shrink-0 text-xs uppercase tracking-wide">
                Date of Birth:
              </span>
              {isEditing ? (
                <input
                  type="text"
                  value={result.dob}
                  onChange={(e) => handleFieldChange('dob', e.target.value)}
                  placeholder="DD/MM/YYYY"
                  className="flex-1 bg-white border border-slate-300 rounded px-2 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              ) : (
                <span className="text-slate-800 font-semibold text-sm">
                  {result.dob || <span className="text-slate-400 font-normal italic">Not detected</span>}
                </span>
              )}
            </div>

            {/* Gender */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 text-sm">
              <span className="font-bold text-slate-500 min-w-[120px] shrink-0 text-xs uppercase tracking-wide">
                Gender:
              </span>
              {isEditing ? (
                <select
                  value={result.gender}
                  onChange={(e) => handleFieldChange('gender', e.target.value)}
                  className="bg-white border border-slate-300 rounded px-2 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Transgender">Transgender</option>
                </select>
              ) : (
                <span className="text-slate-800 font-semibold text-sm">
                  {result.gender || <span className="text-slate-400 font-normal italic">Not detected</span>}
                </span>
              )}
            </div>

            {/* Aadhaar Number */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 text-sm">
              <span className="font-bold text-slate-500 min-w-[120px] shrink-0 text-xs uppercase tracking-wide">
                Aadhaar Number:
              </span>
              {isEditing ? (
                <input
                  type="text"
                  value={result.aadhaar_number}
                  onChange={(e) => handleFieldChange('aadhaar_number', e.target.value)}
                  placeholder="12-digit Aadhaar number"
                  className="flex-1 bg-white border border-slate-300 rounded px-2 py-1 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-slate-800 font-mono font-bold text-sm tracking-wider">
                    {result.aadhaar_number ? (
                      showMasked && result.masked_id ? result.masked_id : result.aadhaar_number
                    ) : (
                      <span className="text-slate-400 font-normal italic">Not detected</span>
                    )}
                  </span>
                  {result.aadhaar_number && (
                    <button
                      type="button"
                      onClick={() => setShowMasked(!showMasked)}
                      className="text-slate-400 hover:text-slate-600 p-0.5"
                      title={showMasked ? 'Show full number' : 'Mask number'}
                    >
                      {showMasked ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Address / Pincode */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-1 text-sm">
              <span className="font-bold text-slate-500 min-w-[120px] shrink-0 text-xs uppercase tracking-wide">
                Address / Region:
              </span>
              {isEditing ? (
                <input
                  type="text"
                  value={result.address}
                  onChange={(e) => handleFieldChange('address', e.target.value)}
                  placeholder="Address or Pincode"
                  className="flex-1 bg-white border border-slate-300 rounded px-2 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              ) : (
                <span className="text-slate-800 font-medium text-xs">
                  {result.address || <span className="text-slate-400 font-normal italic">Address on back side of card</span>}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={reset}
            className="w-full mt-2 text-xs font-bold text-slate-500 hover:text-slate-700 flex items-center justify-center gap-1 py-2 rounded-lg hover:bg-slate-50 transition-colors border border-dashed border-slate-200"
          >
            <X size={14} /> Clear & Scan Another Card
          </button>
        </div>
      )}

      {/* Error */}
      {state === 'error' && (
        <div className="space-y-3">
          <div className="flex items-start gap-2 text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold">Scan Incomplete</p>
              <p className="text-slate-600 mt-0.5">{error}</p>
            </div>
          </div>
          <button
            onClick={reset}
            className="w-full text-xs font-bold text-orange-600 bg-orange-50 px-3 py-2 rounded-lg hover:bg-orange-100 transition-colors"
          >
            Try Again With Clearer Image
          </button>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// Auto Photo Resizer Component
// ════════════════════════════════════════════════════════════════════════════════
export function PhotoResizer() {
  const [state, setState] = useState('idle'); // idle | loading | success | error
  const [originalInfo, setOriginalInfo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.');
      setState('error');
      return;
    }

    setPreview(URL.createObjectURL(file));
    setOriginalInfo({ name: file.name, sizeKB: Math.round(file.size / 1024) });
    setState('loading');
    setResult(null);
    setDownloadUrl(null);

    try {
      const { blob, sizeKB, width, height } = await compressImage(file, 48);
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setResult({ sizeKB, width, height });
      setState('success');
    } catch (err) {
      setError(`Compression failed: ${err.message}`);
      setState('error');
    }
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = 'photo_resized_govt.jpg';
    a.click();
  };

  const reset = () => {
    setState('idle');
    setPreview(null);
    setOriginalInfo(null);
    setResult(null);
    setDownloadUrl(null);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm">
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg shrink-0">
          <ImageIcon size={24} />
        </div>
        <div>
          <h5 className="font-bold text-slate-800 mb-1">Auto Photo Resizer</h5>
          <p className="text-xs text-slate-500">
            Upload any photo — we compress it to under 50KB as required by government portals.
          </p>
        </div>
      </div>

      {state === 'idle' && (
        <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-blue-200 rounded-xl bg-blue-50/40 cursor-pointer hover:bg-blue-50 transition-colors group">
          <ImageIcon size={28} className="text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-blue-600">Click to upload passport photo</span>
          <span className="text-[10px] text-slate-400 mt-1">Any size accepted — output will be &lt; 50KB</span>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </label>
      )}

      {state === 'loading' && (
        <div className="flex flex-col items-center justify-center gap-3 py-6">
          {preview && (
            <img src={preview} alt="original" className="h-20 rounded-lg object-contain border border-slate-200 shadow" />
          )}
          <div className="flex items-center gap-2 text-blue-600">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm font-semibold">Compressing your photo...</span>
          </div>
        </div>
      )}

      {state === 'success' && result && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 mb-2">
            <CheckCircle2 size={18} />
            <span className="text-sm font-bold">Photo compressed successfully!</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-center">
              <p className="text-[10px] font-bold text-red-500 uppercase mb-1">Original</p>
              {preview && <img src={preview} alt="original" className="w-full h-20 object-contain rounded mb-2" />}
              <p className="text-lg font-black text-red-600">{originalInfo?.sizeKB} KB</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center">
              <p className="text-[10px] font-bold text-emerald-500 uppercase mb-1">Compressed</p>
              {downloadUrl && <img src={downloadUrl} alt="compressed" className="w-full h-20 object-contain rounded mb-2" />}
              <p className="text-lg font-black text-emerald-600">{result.sizeKB} KB</p>
            </div>
          </div>

          <div className="text-xs text-slate-500 text-center">
            Output: {result.width} x {result.height}px • JPEG • Ready for govt portals
          </div>

          <button
            onClick={handleDownload}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md"
          >
            <Download size={16} /> Download Resized Photo
          </button>
          <button
            onClick={reset}
            className="w-full text-xs font-bold text-slate-500 hover:text-slate-700 flex items-center justify-center gap-1 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <X size={13} /> Resize Another Photo
          </button>
        </div>
      )}

      {state === 'error' && (
        <div className="space-y-3">
          <div className="flex items-start gap-2 text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span className="text-xs font-medium">{error}</span>
          </div>
          <button
            onClick={reset}
            className="w-full text-xs font-bold text-blue-600 bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
