import React, { useState, useMemo, useEffect } from 'react';
import {
  Globe, Search, ExternalLink, Copy, Check, Zap, Sparkles, Filter,
  ArrowRight, Download, FileText, User, CreditCard, Building2, MapPin,
  Phone, Calendar, ShieldCheck, Bookmark, ChevronRight, RefreshCw,
  X, FileDown, Info, AlertCircle, ArrowUpRight, Lock, Laptop, CheckCircle2,
  AlertTriangle, CheckSquare, ChevronLeft, ChevronDown, Award, HelpCircle
} from 'lucide-react';

// =====================================================================
// 1. SCHEMES & PORTALS WITH RIGID ELIGIBILITY & DOCUMENT SPECS
// =====================================================================
const SCHEME_PORTALS = [
  {
    id: 'ladki-bahin',
    name: 'Mukhyamantri Majhi Ladki Bahin Yojana',
    marathiName: 'मुख्यमंत्री माझी लाडकी बहीण योजना',
    category: 'maharashtra',
    subCategory: 'dbt',
    url: 'https://ladkibahin.maharashtra.gov.in',
    status: 'Active (Daily Submission Window)',
    badge: 'Maharashtra DBT',
    benefit: '₹1,500 / Month Direct to Bank',
    description: 'Monthly direct financial assistance to underprivileged women in Maharashtra aged 21-65 years.',
    eligibilityRules: {
      minAge: 21,
      maxAge: 65,
      genderRequired: 'Female',
      maxIncome: 250000,
      mustBeMaharashtraResident: true,
      npciSeedingRequired: true,
      incomeCertificateRequired: false
    },
    docSpecs: [
      { name: 'Passport Photo', format: 'JPG', minSize: '10 KB', maxSize: '50 KB', readySize: '32 KB', status: 'pass' },
      { name: 'Aadhaar Card (Front & Back)', format: 'PDF', minSize: '50 KB', maxSize: '200 KB', readySize: '135 KB', status: 'pass' },
      { name: 'Orange / Yellow Ration Card', format: 'PDF', minSize: '50 KB', maxSize: '200 KB', readySize: '180 KB', status: 'pass' },
      { name: 'Bank Passbook (Single Account)', format: 'PDF', minSize: '30 KB', maxSize: '100 KB', readySize: '85 KB', status: 'pass' },
      { name: 'Domicile Certificate / Birth Cert', format: 'PDF', minSize: '50 KB', maxSize: '200 KB', readySize: '140 KB', status: 'pass' }
    ],
    fieldSequence: ['name', 'nameMarathi', 'fatherName', 'aadhaar', 'mobile', 'dob', 'bankAccount', 'ifsc', 'district', 'taluka', 'village', 'rationCard'],
    pitfalls: [
      'Account MUST be a Single account. Joint account with spouse/father is strictly rejected by PFMS.',
      'Aadhaar MUST be linked with NPCI mapper (active DBT seeding). Non-seeded accounts fail payout.',
      'If family has an Orange/Yellow ration card, separate Tehsildar income certificate is NOT required.',
      'Applicant must NOT be a taxpayer or have family member in government service.'
    ]
  },
  {
    id: 'pm-kisan',
    name: 'PM Kisan Samman Nidhi',
    marathiName: 'पंतप्रधान किसान सन्मान निधी',
    category: 'central',
    subCategory: 'agriculture',
    url: 'https://pmkisan.gov.in',
    status: 'Active (Installment Cycle Open)',
    badge: 'Central DBT',
    benefit: '₹6,000 / Year (₹2,000 x 3 Installments)',
    description: 'Direct income support to all landholding farmer families with cultivable land holdings.',
    eligibilityRules: {
      minAge: 18,
      maxAge: 100,
      genderRequired: 'Any',
      maxIncome: 1000000,
      mustBeMaharashtraResident: false,
      npciSeedingRequired: true,
      landRequired: true
    },
    docSpecs: [
      { name: 'Digitally Signed 7/12 (Saat Bara)', format: 'PDF', minSize: '50 KB', maxSize: '200 KB', readySize: '165 KB', status: 'pass' },
      { name: 'Aadhaar Card Copy', format: 'PDF', minSize: '30 KB', maxSize: '100 KB', readySize: '85 KB', status: 'pass' },
      { name: 'Bank Passbook / Cancelled Cheque', format: 'PDF', minSize: '30 KB', maxSize: '100 KB', readySize: '92 KB', status: 'pass' },
      { name: 'Self-Declaration Form', format: 'PDF', minSize: '20 KB', maxSize: '150 KB', readySize: '75 KB', status: 'pass' }
    ],
    fieldSequence: ['name', 'fatherName', 'aadhaar', 'mobile', 'dob', 'gender', 'bankAccount', 'ifsc', 'district', 'taluka', 'village', 'landHolding'],
    pitfalls: [
      'Land survey number and Khata number must match the 7/12 extract character-for-character.',
      'Landholding transfer after 01 Feb 2019 is ineligible unless inherited via succession/death.',
      'e-KYC via Aadhaar OTP or Biometric is mandatory before installment disbursement.',
      'Institutional landholders and serving/retired govt employees are excluded.'
    ]
  },
  {
    id: 'aaple-sarkar',
    name: 'Aaple Sarkar Citizen Services',
    marathiName: 'आपले सरकार - सेवा हक्क पोर्टल',
    category: 'maharashtra',
    subCategory: 'certificates',
    url: 'https://aaplesarkar.mahaonline.gov.in',
    status: 'Active (24x7 E-Services)',
    badge: 'Revenue & Magisterial',
    benefit: 'Official Legal Certificates (Income, Caste, Domicile)',
    description: 'Single window portal for Revenue Dept certificates: Income (1/3 yr), Caste, Domicile, Non-Creamy Layer.',
    eligibilityRules: {
      minAge: 18,
      maxAge: 100,
      genderRequired: 'Any',
      maxIncome: 800000,
      mustBeMaharashtraResident: true,
      npciSeedingRequired: false
    },
    docSpecs: [
      { name: 'Passport Photo (160x212 px)', format: 'JPG', minSize: '5 KB', maxSize: '20 KB', readySize: '18 KB', status: 'pass' },
      { name: 'Signature Scan (256x64 px)', format: 'JPG', minSize: '5 KB', maxSize: '20 KB', readySize: '15 KB', status: 'pass' },
      { name: 'Identity Proof (Aadhaar / Voter ID)', format: 'PDF', minSize: '75 KB', maxSize: '256 KB', readySize: '142 KB', status: 'pass' },
      { name: 'Address Proof (Ration Card / Light Bill)', format: 'PDF', minSize: '75 KB', maxSize: '256 KB', readySize: '180 KB', status: 'pass' },
      { name: 'Talathi Income Verification Report', format: 'PDF', minSize: '75 KB', maxSize: '256 KB', readySize: '120 KB', status: 'pass' }
    ],
    fieldSequence: ['name', 'nameMarathi', 'fatherName', 'aadhaar', 'mobile', 'dob', 'address', 'district', 'taluka', 'village', 'pincode', 'rationCard'],
    pitfalls: [
      'Photo strictly must be 160x212 pixels between 5KB and 20KB. The portal will reject 21KB.',
      'Signature must be on pure white background, cropped to 256x64 pixels.',
      'Marathi transliteration errors in applicant name will print wrongly on final certificate.',
      'Talathi report must have official round seal and signature of the concerned circle officer.'
    ]
  },
  {
    id: 'ayushman-bharat',
    name: 'Ayushman Bharat PM-JAY (Beneficiary Portal)',
    marathiName: 'आयुष्मान भारत प्रधानमंत्री जन आरोग्य',
    category: 'central',
    subCategory: 'social_security',
    url: 'https://beneficiary.nha.gov.in',
    status: 'Active (Instant Card Generation)',
    badge: 'Healthcare ₹5 Lakh',
    benefit: '₹5,00,000 Free Cashless Hospitalization per Family',
    description: 'Universal cashless health coverage for secondary and tertiary care hospital treatment across India.',
    eligibilityRules: {
      minAge: 0,
      maxAge: 100,
      genderRequired: 'Any',
      maxIncome: 500000,
      mustBeMaharashtraResident: false,
      npciSeedingRequired: false
    },
    docSpecs: [
      { name: 'Aadhaar Card with linked Mobile', format: 'E-KYC', minSize: 'OTP', maxSize: 'Instant', readySize: 'Live', status: 'pass' },
      { name: 'Priority Ration Card (NFSA)', format: 'PDF', minSize: '50 KB', maxSize: '200 KB', readySize: '180 KB', status: 'pass' }
    ],
    fieldSequence: ['name', 'aadhaar', 'mobile', 'dob', 'gender', 'rationCard', 'district', 'taluka', 'village'],
    pitfalls: [
      'Ensure family search is performed via Ration Card Number or Family Aadhaar.',
      'Live selfie capture must have white or neutral background with both ears visible.',
      'Golden Card generates instantly if e-KYC score matches 80%+ with Aadhaar database.'
    ]
  },
  {
    id: 'mahadbt',
    name: 'MahaDBT Farmer & Social Welfare',
    marathiName: 'महाडीबीटी शेतकरी व समाज कल्याण',
    category: 'maharashtra',
    subCategory: 'dbt',
    url: 'https://mahadbt.maharashtra.gov.in',
    status: 'Active (Lottery & Subsidies Open)',
    badge: 'Farmer & Student Subsidies',
    benefit: 'Up to 80% Subsidy on Farm Equipment & Drip',
    description: 'Direct Benefit Transfer platform for agriculture machinery, irrigation subsidies, and student post-matric scholarships.',
    eligibilityRules: {
      minAge: 18,
      maxAge: 75,
      genderRequired: 'Any',
      maxIncome: 800000,
      mustBeMaharashtraResident: true,
      npciSeedingRequired: true,
      landRequired: true
    },
    docSpecs: [
      { name: 'Digital 7/12 & 8-A Extract', format: 'PDF', minSize: '50 KB', maxSize: '250 KB', readySize: '165 KB', status: 'pass' },
      { name: 'Aadhaar Card Copy', format: 'PDF', minSize: '50 KB', maxSize: '200 KB', readySize: '135 KB', status: 'pass' },
      { name: 'Caste Certificate (for SC/ST subsidy)', format: 'PDF', minSize: '50 KB', maxSize: '250 KB', readySize: '150 KB', status: 'pass' },
      { name: 'Bank Passbook Photocopy', format: 'PDF', minSize: '30 KB', maxSize: '100 KB', readySize: '85 KB', status: 'pass' }
    ],
    fieldSequence: ['name', 'fatherName', 'aadhaar', 'mobile', 'caste', 'bankAccount', 'ifsc', 'district', 'taluka', 'village', 'landHolding'],
    pitfalls: [
      'Applicant cannot receive tractor/machinery subsidy twice within 10 years.',
      'Quotation must be from an authorized government-empanelled vendor with GSTIN.',
      'Aadhaar authentication with mobile OTP is required for final lottery submission.'
    ]
  },
  {
    id: 'pm-awas-gramin',
    name: 'Pradhan Mantri Awas Yojana (Gramin)',
    marathiName: 'प्रधानमंत्री आवास योजना (ग्रामीण)',
    category: 'central',
    subCategory: 'social_security',
    url: 'https://pmayg.nic.in',
    status: 'Active (Awas+ Survey)',
    badge: 'Pucca House Subsidy',
    benefit: '₹1.20 Lakh Subsidy + 90 Days MGNREGA Wage',
    description: 'Financial assistance for construction of pucca house with toilet facility to rural houseless families.',
    eligibilityRules: {
      minAge: 18,
      maxAge: 100,
      genderRequired: 'Any',
      maxIncome: 180000,
      mustBeMaharashtraResident: false,
      npciSeedingRequired: true
    },
    docSpecs: [
      { name: 'MGNREGA Job Card Copy', format: 'PDF', minSize: '30 KB', maxSize: '100 KB', readySize: '80 KB', status: 'pass' },
      { name: 'Bank Passbook Copy', format: 'PDF', minSize: '30 KB', maxSize: '100 KB', readySize: '85 KB', status: 'pass' },
      { name: 'Consent Letter of Co-owner', format: 'PDF', minSize: '50 KB', maxSize: '150 KB', readySize: '95 KB', status: 'pass' }
    ],
    fieldSequence: ['name', 'fatherName', 'aadhaar', 'mobile', 'bankAccount', 'ifsc', 'district', 'taluka', 'village'],
    pitfalls: [
      'House must be registered in the name of female head or jointly with husband.',
      'Geo-tagged photo of existing kutcha house before sanction is mandatory.',
      'Disbursement occurs in 4 stages linked to geo-tagged milestone completion.'
    ]
  }
];

// =====================================================================
// 2. DETAILED CITIZEN PROFILES WITH DIAGNOSTIC DATA
// =====================================================================
const CITIZENS = [
  {
    id: 'CLI1001',
    name: 'Ramesh Balu Kumar',
    nameMarathi: 'रमेश बाळू कुमार',
    fatherName: 'Balu Shripati Kumar',
    gender: 'Male',
    dob: '15-06-1984',
    age: 42,
    mobile: '9876543210',
    email: 'ramesh.kumar@gmail.com',
    aadhaar: '4589 1234 5678',
    aadhaarRaw: '458912345678',
    isAadhaarChecksumValid: true,
    pan: 'ABCDE1234F',
    rationCard: 'RC-140293847',
    rationType: 'Orange (Priority Household)',
    caste: 'OBC (Kunbi)',
    annualIncome: 75000,
    annualIncomeFormatted: '₹75,000 / Year',
    bankName: 'Bank of Maharashtra',
    bankAccount: '60123456789',
    ifsc: 'MAHB0000123',
    branch: 'Shirwal, Satara',
    isNpciDbtSeeded: true,
    address: 'Gat No. 42, Post Shirwal',
    village: 'Shirwal',
    taluka: 'Khandala',
    district: 'Satara',
    state: 'Maharashtra',
    pincode: '412801',
    landHoldings: '1.45 Hectares (Gut 42)',
    hasLand: true,
    hasTaxReturn: false
  },
  {
    id: 'CLI1002',
    name: 'Sunita Dnyandev Devi',
    nameMarathi: 'सुनिता ज्ञानदेव देवी',
    fatherName: 'Dnyandev Mahadev Patil',
    gender: 'Female',
    dob: '12-08-1991',
    age: 35,
    mobile: '9123456789',
    email: 'sunita.devi@outlook.com',
    aadhaar: '7823 4567 8901',
    aadhaarRaw: '782345678901',
    isAadhaarChecksumValid: true,
    pan: 'XYZAB5678K',
    rationCard: 'RC-998822331',
    rationType: 'Yellow (Antyodaya BPL)',
    caste: 'Maratha / Open',
    annualIncome: 48000,
    annualIncomeFormatted: '₹48,000 / Year',
    bankName: 'State Bank of India',
    bankAccount: '30987654321',
    ifsc: 'SBIN0001425',
    branch: 'Manchar, Pune',
    isNpciDbtSeeded: true,
    address: 'House No. 104, Ward No. 3',
    village: 'Manchar',
    taluka: 'Ambegaon',
    district: 'Pune',
    state: 'Maharashtra',
    pincode: '410503',
    landHoldings: 'Nil (Landless Household)',
    hasLand: false,
    hasTaxReturn: false
  },
  {
    id: 'CLI1003',
    name: 'Amit Vikram Singh',
    nameMarathi: 'अमित विक्रम सिंग',
    fatherName: 'Vikram Ramavatar Singh',
    gender: 'Male',
    dob: '24-11-1998',
    age: 28,
    mobile: '9988776655',
    email: 'amit.singh98@gmail.com',
    aadhaar: '9012 3456 7890',
    aadhaarRaw: '901234567890',
    isAadhaarChecksumValid: true,
    pan: 'CDEFP9012M',
    rationCard: 'RC-556677889',
    rationType: 'White (Above Poverty Line)',
    caste: 'General',
    annualIncome: 140000,
    annualIncomeFormatted: '₹1,40,000 / Year',
    bankName: 'HDFC Bank',
    bankAccount: '50100234567890',
    ifsc: 'HDFC0000456',
    branch: 'Kalyan West, Thane',
    isNpciDbtSeeded: false,
    address: 'Flat 302, Sai Shraddha Apt, Rambaug',
    village: 'Kalyan',
    taluka: 'Kalyan',
    district: 'Thane',
    state: 'Maharashtra',
    pincode: '421301',
    landHoldings: 'Nil (Commercial Project)',
    hasLand: false,
    hasTaxReturn: true
  }
];

export default function GovtPortalBrowser() {
  const [activeTab, setActiveTab] = useState('fast_filler'); // 'fast_filler', 'diagnostics', 'portal_directory'
  const [selectedCitizenId, setSelectedCitizenId] = useState(CITIZENS[1].id); // Default to Sunita Devi
  const [selectedSchemeId, setSelectedSchemeId] = useState(SCHEME_PORTALS[0].id); // Default to Ladki Bahin
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [copiedKey, setCopiedKey] = useState(null);
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const selectedCitizen = useMemo(() => {
    return CITIZENS.find(c => c.id === selectedCitizenId) || CITIZENS[0];
  }, [selectedCitizenId]);

  const selectedScheme = useMemo(() => {
    return SCHEME_PORTALS.find(s => s.id === selectedSchemeId) || SCHEME_PORTALS[0];
  }, [selectedSchemeId]);

  const showToast = (msg, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 2500);
  };

  const copyField = (val, keyLabel) => {
    if (!val) return;
    navigator.clipboard.writeText(String(val));
    setCopiedKey(keyLabel);
    showToast(`Copied [${keyLabel}]: ${val}`);
    setTimeout(() => setCopiedKey(null), 1600);
  };

  // Eligibility Rule Evaluator (Calculated dynamically)
  const eligibilityEvaluation = useMemo(() => {
    const rules = selectedScheme.eligibilityRules;
    const c = selectedCitizen;
    const checks = [];

    // 1. Age check
    const isAgeOk = c.age >= rules.minAge && c.age <= rules.maxAge;
    checks.push({
      label: 'Age Eligibility',
      rule: `${rules.minAge} – ${rules.maxAge} Years`,
      actual: `${c.age} Years (${c.dob})`,
      pass: isAgeOk,
      failReason: `Applicant age (${c.age}) is outside required range (${rules.minAge}-${rules.maxAge} yrs).`
    });

    // 2. Gender check
    const isGenderOk = rules.genderRequired === 'Any' || c.gender.toLowerCase() === rules.genderRequired.toLowerCase();
    checks.push({
      label: 'Gender Criteria',
      rule: rules.genderRequired,
      actual: c.gender,
      pass: isGenderOk,
      failReason: `Scheme is strictly for ${rules.genderRequired} applicants. Citizen is ${c.gender}.`
    });

    // 3. Income check
    const isIncomeOk = c.annualIncome <= rules.maxIncome;
    checks.push({
      label: 'Annual Income Ceiling',
      rule: `≤ ₹${(rules.maxIncome / 100000).toFixed(1)} Lakh / yr`,
      actual: c.annualIncomeFormatted,
      pass: isIncomeOk,
      failReason: `Annual income (${c.annualIncomeFormatted}) exceeds ceiling of ₹${rules.maxIncome.toLocaleString('en-IN')}.`
    });

    // 4. Maharashtra Domicile check
    if (rules.mustBeMaharashtraResident) {
      const isMHOk = c.state.toLowerCase() === 'maharashtra';
      checks.push({
        label: 'State Resident / Domicile',
        rule: 'Maharashtra Domicile',
        actual: c.state,
        pass: isMHOk,
        failReason: 'Must be a bona fide resident of Maharashtra.'
      });
    }

    // 5. Landholding check (if required)
    if (rules.landRequired) {
      checks.push({
        label: 'Agricultural Land Record (7/12)',
        rule: 'Must possess cultivable land',
        actual: c.landHoldings,
        pass: c.hasLand,
        failReason: 'Landless citizen cannot apply for landholder scheme.'
      });
    }

    // 6. Bank NPCI DBT Seeding check
    if (rules.npciSeedingRequired) {
      checks.push({
        label: 'Aadhaar-Bank NPCI DBT Seeding',
        rule: 'Active Aadhaar Seeding in Bank',
        actual: c.isNpciDbtSeeded ? 'Active (Ready for DBT)' : 'INACTIVE / Not Seeded',
        pass: c.isNpciDbtSeeded,
        failReason: 'Bank account is NOT mapped to NPCI for Direct Benefit Transfer. Payout will fail.'
      });
    }

    const allPassed = checks.every(ch => ch.pass);
    return { checks, allPassed };
  }, [selectedCitizen, selectedScheme]);

  // Field dictionary for sequencing
  const fieldDict = {
    name: { label: 'Full Name (English)', value: selectedCitizen.name, code: 'name' },
    nameMarathi: { label: 'Name in Marathi', value: selectedCitizen.nameMarathi, code: 'name_mar' },
    fatherName: { label: 'Father / Husband Name', value: selectedCitizen.fatherName, code: 'fname' },
    aadhaar: { label: '12-Digit Aadhaar (Raw)', value: selectedCitizen.aadhaarRaw, code: 'aadhaar' },
    mobile: { label: 'Mobile Number', value: selectedCitizen.mobile, code: 'mobile' },
    dob: { label: 'Date of Birth (DD-MM-YYYY)', value: selectedCitizen.dob, code: 'dob' },
    gender: { label: 'Gender', value: selectedCitizen.gender, code: 'gender' },
    bankAccount: { label: 'Bank Account Number', value: selectedCitizen.bankAccount, code: 'account' },
    ifsc: { label: 'Bank IFSC Code', value: selectedCitizen.ifsc, code: 'ifsc' },
    district: { label: 'District', value: selectedCitizen.district, code: 'district' },
    taluka: { label: 'Taluka / Sub-district', value: selectedCitizen.taluka, code: 'taluka' },
    village: { label: 'Village / Town', value: selectedCitizen.village, code: 'village' },
    pincode: { label: 'Pincode', value: selectedCitizen.pincode, code: 'pin' },
    address: { label: 'Complete Address Line', value: selectedCitizen.address, code: 'address' },
    rationCard: { label: 'Ration Card Number', value: selectedCitizen.rationCard, code: 'ration' },
    caste: { label: 'Caste / Category', value: selectedCitizen.caste, code: 'caste' },
    landHolding: { label: 'Land Holding (7/12 Gut)', value: selectedCitizen.landHoldings, code: 'land' }
  };

  // Active sequence fields for the current scheme
  const sequenceKeys = selectedScheme.fieldSequence;
  const currentFieldKey = sequenceKeys[activeStepIndex] || sequenceKeys[0];
  const currentField = fieldDict[currentFieldKey] || { label: 'Name', value: selectedCitizen.name };

  const handleNextStep = () => {
    copyField(currentField.value, currentField.label);
    if (activeStepIndex < sequenceKeys.length - 1) {
      setActiveStepIndex(prev => prev + 1);
    } else {
      showToast('🎉 All scheme fields copied! Proceed to Document Uploads.');
    }
  };

  const handlePrevStep = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex(prev => prev - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && (e.key === 'n' || e.key === 'ArrowRight')) {
        e.preventDefault();
        handleNextStep();
      } else if (e.altKey && (e.key === 'p' || e.key === 'ArrowLeft')) {
        e.preventDefault();
        handlePrevStep();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-[100] flex items-center gap-2.5 px-5 py-3.5 rounded-2xl text-white font-bold text-sm shadow-2xl border animate-in fade-in slide-in-from-top-2 ${
            toast.isError ? 'bg-red-600 border-red-500' : 'bg-slate-900 border-slate-700'
          }`}
        >
          {toast.isError ? <AlertTriangle size={18} className="text-white" /> : <Check size={18} className="text-emerald-400" />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Top Header Command Bar */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] rounded-2xl p-6 text-white shadow-xl border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 font-extrabold text-xs tracking-wider uppercase border border-orange-500/30">
                Precision Problem-Solver
              </span>
              <span className="flex items-center gap-1 text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                <Zap size={13} fill="currentColor" /> Cuts Form-Filling to 2 Minutes
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Zero Typo Errors • Verified Specs • Rule Diagnostics
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
              Government Portals &amp; Fast-Filling Command Deck
            </h2>
            <p className="text-slate-300 text-sm max-w-2xl">
              Eliminates document size rejections, auto-evaluates eligibility rules, and copies fields sequentially so you fill government portals at lightning speed.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-slate-900/90 p-1.5 rounded-xl border border-slate-700 flex-wrap">
            <button
              onClick={() => setActiveTab('fast_filler')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'fast_filler'
                  ? 'bg-[#FF7A00] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Laptop size={14} /> Fast-Fill Deck
            </button>
            <button
              onClick={() => setActiveTab('diagnostics')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'diagnostics'
                  ? 'bg-[#FF7A00] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck size={14} /> Rule &amp; Doc Diagnostics
            </button>
            <button
              onClick={() => setActiveTab('portal_directory')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'portal_directory'
                  ? 'bg-[#FF7A00] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe size={14} /> All Portals ({SCHEME_PORTALS.length})
            </button>
          </div>
        </div>

        {/* Global Context Selector (Citizen & Scheme Synchronizer) */}
        <div className="mt-5 pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Citizen Picker */}
          <div className="flex items-center gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-700/80">
            <div className="w-10 h-10 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center flex-shrink-0">
              <User size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Active Client Profile
              </span>
              <select
                value={selectedCitizenId}
                onChange={(e) => {
                  setSelectedCitizenId(e.target.value);
                  setActiveStepIndex(0);
                }}
                className="w-full bg-transparent text-sm font-extrabold text-white focus:outline-none cursor-pointer"
              >
                {CITIZENS.map(c => (
                  <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                    {c.name} ({c.gender}, {c.age}y, {c.taluka})
                  </option>
                ))}
              </select>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              KYC Ready
            </span>
          </div>

          {/* Destination Scheme / Portal Picker */}
          <div className="flex items-center gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-700/80">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
              <Building2 size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Target Government Scheme &amp; Portal
              </span>
              <select
                value={selectedSchemeId}
                onChange={(e) => {
                  setSelectedSchemeId(e.target.value);
                  setActiveStepIndex(0);
                }}
                className="w-full bg-transparent text-sm font-extrabold text-white focus:outline-none cursor-pointer"
              >
                {SCHEME_PORTALS.map(s => (
                  <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                    {s.name} ({s.badge})
                  </option>
                ))}
              </select>
            </div>
            <a
              href={selectedScheme.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-[#FF7A00] hover:bg-[#e86d00] text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-transform hover:scale-105"
            >
              <span>Launch</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>

      {/* =====================================================================
          TAB 1: PRECISION FAST-FILL COMMAND DECK (HERO WORKSPACE)
      ===================================================================== */}
      {activeTab === 'fast_filler' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (5 Cols): Auto-Advance Sequencer & Document Tray */}
          <div className="lg:col-span-5 space-y-5">
            {/* 1. AUTO-ADVANCE SEQUENCER HUD */}
            <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-md p-5 space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Zap size={18} className="text-[#FF7A00]" fill="currentColor" />
                  <h3 className="font-black text-slate-900 text-sm">
                    Sequential Auto-Copier
                  </h3>
                </div>
                <span className="text-[11px] font-extrabold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                  Step {activeStepIndex + 1} of {sequenceKeys.length}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#FF7A00] to-[#FF1A4A] h-full transition-all duration-300"
                  style={{ width: `${((activeStepIndex + 1) / sequenceKeys.length) * 100}%` }}
                />
              </div>

              {/* ACTIVE FIELD DISPLAY CARD */}
              <div className="bg-slate-900 rounded-xl p-4 text-white space-y-2 relative shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">
                    Active Field to Paste
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Shortcut: Alt + N
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium">{currentField.label}</p>
                <div className="flex items-center justify-between gap-3 bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                  <span className="font-mono text-base font-black text-emerald-300 truncate">
                    {currentField.value || 'N/A'}
                  </span>
                  <button
                    onClick={() => copyField(currentField.value, currentField.label)}
                    className="px-3 py-1.5 rounded-lg bg-[#FF7A00] hover:bg-[#e86d00] text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-transform active:scale-95 flex-shrink-0"
                  >
                    {copiedKey === currentField.label ? <Check size={13} /> : <Copy size={13} />}
                    <span>{copiedKey === currentField.label ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Stepper Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevStep}
                  disabled={activeStepIndex === 0}
                  className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors flex items-center gap-1"
                >
                  <ChevronLeft size={16} /> Prev
                </button>
                <button
                  onClick={handleNextStep}
                  className="flex-1 py-2.5 rounded-xl text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-transform hover:scale-[1.02] active:scale-95"
                  style={{ background: 'linear-gradient(135deg,#FF7A00,#FF1A4A)' }}
                >
                  <Copy size={14} />
                  <span>Copy &amp; Next Field (Alt + N)</span>
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Field Sequence Pills Bar */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-thin">
                {sequenceKeys.map((key, idx) => {
                  const field = fieldDict[key];
                  const isCurrent = idx === activeStepIndex;
                  const isPast = idx < activeStepIndex;
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveStepIndex(idx)}
                      className={`px-2 py-1 rounded-md text-[10px] font-bold whitespace-nowrap transition-all ${
                        isCurrent
                          ? 'bg-[#FF7A00] text-white shadow-sm'
                          : isPast
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                      title={field?.label}
                    >
                      {isPast ? '✓ ' : ''}{idx + 1}. {field?.label.split(' ')[0]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. PRE-COMPLIANT DOCUMENTS TRAY */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                    <FileDown size={16} className="text-blue-600" />
                    Scheme Document Tray
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Pre-compressed to pass {selectedScheme.name.split(' ')[0]} upload limits
                  </p>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Zero Rejection Guarantee
                </span>
              </div>

              <div className="space-y-2">
                {selectedScheme.docSpecs.map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-orange-50/40 transition-colors flex items-center justify-between"
                  >
                    <div className="min-w-0 flex-1 mr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-800 truncate">{doc.name}</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                          {doc.format}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Limit: <strong className="text-slate-700">{doc.maxSize}</strong> • Ready: <strong className="text-emerald-600">{doc.readySize}</strong>
                      </p>
                    </div>
                    <button
                      onClick={() => showToast(`Ready to drag & drop: ${doc.name} (${doc.readySize})`)}
                      className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors flex-shrink-0"
                    >
                      <Download size={12} /> Pick
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (7 Cols): Official Portal Workstation & Common Pitfalls */}
          <div className="lg:col-span-7 space-y-5">
            {/* 1. PORTAL LAUNCHPAD & ADDRESS WORKSTATION */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
              {/* Browser Omnibar */}
              <div className="flex items-center gap-2 p-2 bg-slate-100 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5 text-slate-400 pl-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 bg-white rounded-lg px-3 py-1.5 border border-slate-200 flex items-center gap-2 shadow-inner">
                  <Lock size={12} className="text-emerald-600 flex-shrink-0" />
                  <span className="text-xs font-mono text-slate-800 font-semibold truncate">
                    {selectedScheme.url}
                  </span>
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded ml-auto flex-shrink-0">
                    Official .gov.in
                  </span>
                </div>
                <a
                  href={selectedScheme.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg font-extrabold text-xs text-white flex items-center gap-1.5 shadow-sm transition-transform hover:scale-105 active:scale-95 flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,#FF7A00,#FF1A4A)' }}
                >
                  <ExternalLink size={13} />
                  <span>Launch Portal</span>
                </a>
              </div>

              {/* Scheme Brief & Benefit Banner */}
              <div className="p-4 rounded-xl border border-orange-200 bg-orange-50/40 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800">
                      {selectedScheme.badge}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 size={11} /> {selectedScheme.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-1">{selectedScheme.name}</h3>
                  <p className="text-xs font-bold text-orange-700">{selectedScheme.marathiName}</p>
                </div>
                <div className="text-left md:text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Citizen Benefit
                  </span>
                  <span className="text-sm font-black text-emerald-700">{selectedScheme.benefit}</span>
                </div>
              </div>

              {/* COMMON FORM PITFALLS ACCORDION ("DON'T MAKE THESE MISTAKES") */}
              <div className="bg-amber-50/60 rounded-xl p-4 border border-amber-200 space-y-2.5">
                <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs">
                  <AlertTriangle size={15} className="text-amber-600" />
                  <span>CRITICAL COMMON REJECTION PITFALLS (READ BEFORE FILLING)</span>
                </div>
                <div className="space-y-1.5">
                  {selectedScheme.pitfalls.map((tip, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-amber-950 font-medium">
                      <span className="text-amber-600 font-black flex-shrink-0">⚠️</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* QUICK JUMP TO ALL CLIENT DOSSIER FIELDS */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-xs font-black text-slate-800 mb-2 block">
                  Quick Access – All {selectedCitizen.name.split(' ')[0]}'s Verified Fields
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { label: 'Aadhaar No.', val: selectedCitizen.aadhaarRaw },
                    { label: 'Mobile No.', val: selectedCitizen.mobile },
                    { label: 'Bank Account', val: selectedCitizen.bankAccount },
                    { label: 'Bank IFSC', val: selectedCitizen.ifsc },
                    { label: 'Taluka', val: selectedCitizen.taluka },
                    { label: 'District', val: selectedCitizen.district }
                  ].map((f, i) => (
                    <button
                      key={i}
                      onClick={() => copyField(f.val, f.label)}
                      className="p-2.5 rounded-lg border border-slate-200 hover:border-orange-300 hover:bg-orange-50 text-left transition-colors group"
                    >
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">{f.label}</span>
                      <span className="text-xs font-mono font-bold text-slate-800 truncate block group-hover:text-orange-600">
                        {f.val}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: RULE & DOCUMENT PRE-SUBMISSION DIAGNOSTICS
      ===================================================================== */}
      {activeTab === 'diagnostics' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600">
                Pre-Flight Health Audit
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-1">
                Eligibility Rules &amp; Document Compliance Matrix
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluates <strong>{selectedCitizen.name}</strong> against rules of <strong>{selectedScheme.name}</strong>
              </p>
            </div>
            <div
              className={`px-4 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 border shadow-sm ${
                eligibilityEvaluation.allPassed
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-red-50 text-red-800 border-red-200'
              }`}
            >
              {eligibilityEvaluation.allPassed ? (
                <>
                  <CheckCircle2 size={18} className="text-emerald-600" />
                  <span>100% ELIGIBLE TO APPLY</span>
                </>
              ) : (
                <>
                  <AlertCircle size={18} className="text-red-600" />
                  <span>DISQUALIFIED / CRITICAL WARNING</span>
                </>
              )}
            </div>
          </div>

          {/* Rule Diagnostic Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
              1. Statutory Eligibility Checks
            </h4>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {eligibilityEvaluation.checks.map((c, i) => (
                <div
                  key={i}
                  className={`p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs ${
                    c.pass ? 'bg-white' : 'bg-red-50/50'
                  }`}
                >
                  <div className="min-w-[200px]">
                    <span className="font-extrabold text-slate-900 block">{c.label}</span>
                    <span className="text-[11px] text-slate-400">Required: {c.rule}</span>
                  </div>
                  <div className="flex-1">
                    <span className="font-bold text-slate-700">Citizen: </span>
                    <span className={`font-mono font-bold ${c.pass ? 'text-slate-800' : 'text-red-700'}`}>
                      {c.actual}
                    </span>
                    {!c.pass && (
                      <p className="text-[11px] font-bold text-red-600 mt-0.5">
                        ⚠️ Reason: {c.failReason}
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold flex items-center gap-1 ${
                        c.pass
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {c.pass ? '✓ PASS' : '✕ FAIL'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Document Size & Format Audit */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
              2. Portal File Size &amp; Format Compliance Matrix
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {selectedScheme.docSpecs.map((doc, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-slate-900 truncate">{doc.name}</span>
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      ✓ Compliant
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Required Format:</span>
                      <strong className="text-slate-800">{doc.format}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Portal Limit:</span>
                      <strong className="text-slate-800">{doc.minSize} – {doc.maxSize}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Your File Size:</span>
                      <strong className="text-emerald-700">{doc.readySize}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: COMPLETE GOVERNMENT PORTALS DIRECTORY
      ===================================================================== */}
      {activeTab === 'portal_directory' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[280px]">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scheme name, portal URL, department..."
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-orange-400"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {['all', 'maharashtra', 'central', 'agriculture', 'dbt', 'certificates'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                    categoryFilter === cat
                      ? 'bg-[#0F172A] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SCHEME_PORTALS.filter(p => {
              const matchCat = categoryFilter === 'all' || p.category === categoryFilter || p.subCategory === categoryFilter;
              const q = searchQuery.toLowerCase();
              const matchSearch = !q || p.name.toLowerCase().includes(q) || p.url.toLowerCase().includes(q);
              return matchCat && matchSearch;
            }).map(portal => (
              <div
                key={portal.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {portal.badge}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold">✓ Verified .gov.in</span>
                  </div>
                  <h4 className="font-black text-slate-900 text-base">{portal.name}</h4>
                  <p className="text-xs font-bold text-orange-600 mt-0.5">{portal.marathiName}</p>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">{portal.description}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedSchemeId(portal.id);
                      setActiveTab('fast_filler');
                    }}
                    className="flex-1 py-2 rounded-xl text-xs font-bold bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors"
                  >
                    Open in Fast-Fill Deck
                  </button>
                  <a
                    href={portal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-xl text-xs font-bold text-white bg-[#0F172A] hover:bg-black transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <span>Launch</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
