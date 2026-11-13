import React, { useState, useRef, useCallback } from "react";
import html2canvas from "html2canvas";
import { ChevronLeft, ChevronRight, Download, Edit3, Check, X, Sparkles, Share2 } from "lucide-react";

// Ashoka Chakra SVG
const AshokaChakra = ({ size = 48, color = "#FFFFFF", opacity = 0.9 }) => (
  React.createElement("svg", {
    width: size, height: size, viewBox: "0 0 100 100", fill: "none",
    xmlns: "http://www.w3.org/2000/svg", style: { opacity }
  },
    React.createElement("circle", { cx: "50", cy: "50", r: "45", stroke: color, strokeWidth: "4", fill: "none" }),
    React.createElement("circle", { cx: "50", cy: "50", r: "6", fill: color }),
    Array.from({ length: 24 }).map((_, i) => {
      const angle = (i * 15 * Math.PI) / 180;
      return React.createElement("line", {
        key: i,
        x1: 50 + 6 * Math.cos(angle), y1: 50 + 6 * Math.sin(angle),
        x2: 50 + 44 * Math.cos(angle), y2: 50 + 44 * Math.sin(angle),
        stroke: color, strokeWidth: "2", strokeLinecap: "round"
      });
    })
  )
);

const BANNER_TEMPLATES = [
  {
    id: "ladki-bahin",
    schemeMr: "मुख्यमंत्री माझी\nलाडकी बहीण योजना",
    schemeEn: "Mukhyamantri Majhi\nLadki Bahin Yojana",
    tagline: "दर महिन्याला मिळवा · Receive Every Month",
    benefits: [
      { icon: "💰", label: "₹1,500/माह", sublabel: "Direct Bank Transfer" },
      { icon: "👩", label: "महिला योजना", sublabel: "Women 21–65 yrs" },
      { icon: "📋", label: "सोपी प्रक्रिया", sublabel: "Easy Application" },
    ],
    eligibility: ["महाराष्ट्र निवासी महिला", "वार्षिक उत्पन्न < ₹2.5 लाख", "बँक खाते आवश्यक"],
    badge: "🔥 महाराष्ट्र सरकार",
    deadline: "⏰  31 डिसेंबर 2026 पर्यंत अर्ज करा",
    gradient: "linear-gradient(135deg, #C2185B 0%, #E91E63 40%, #FF4081 70%, #FF7043 100%)",
    darkColor: "#880E4F",
  },
  {
    id: "pm-awas",
    schemeMr: "प्रधानमंत्री\nआवास योजना",
    schemeEn: "Pradhan Mantri\nAwas Yojana",
    tagline: "स्वतःचे घर मिळवा · Get Your Own Home",
    benefits: [
      { icon: "🏠", label: "₹2.5 लाख सबसिडी", sublabel: "Housing Subsidy" },
      { icon: "📐", label: "पक्के घर", sublabel: "Pucca House Grant" },
      { icon: "⚡", label: "वीज + शौचालय", sublabel: "Basic Amenities" },
    ],
    eligibility: ["BPL / EWS / LIG कुटुंब", "कच्च्या किंवा बेघर कुटुंब", "आधार लिंक बँक खाते"],
    badge: "🏛️ केंद्र सरकार",
    deadline: "⏰  संधी मर्यादित – आजच अर्ज करा",
    gradient: "linear-gradient(135deg, #1565C0 0%, #1E88E5 45%, #42A5F5 75%, #00B0FF 100%)",
    darkColor: "#0D47A1",
  },
  {
    id: "pm-kisan",
    schemeMr: "पीएम किसान\nसन्मान निधी",
    schemeEn: "PM Kisan\nSamman Nidhi",
    tagline: "शेतकऱ्यांसाठी खास · Exclusively for Farmers",
    benefits: [
      { icon: "🌾", label: "₹6,000/वर्ष", sublabel: "Annual Benefit" },
      { icon: "🔄", label: "3 हप्त्यांत", sublabel: "₹2,000 Per Installment" },
      { icon: "🏦", label: "थेट बँकेत", sublabel: "Direct Bank Credit" },
    ],
    eligibility: ["जमीनधारक शेतकरी", "आधार-पेमेंट सीड लिंक", "कोणतेही उत्पन्न मर्यादा नाही"],
    badge: "🌿 कृषि मंत्रालय",
    deadline: "⏰  पुढचा हप्ता: जानेवारी 2027",
    gradient: "linear-gradient(135deg, #2E7D32 0%, #388E3C 40%, #43A047 70%, #66BB6A 100%)",
    darkColor: "#1B5E20",
  },
  {
    id: "ayushman",
    schemeMr: "आयुष्मान भारत\nजन आरोग्य योजना",
    schemeEn: "Ayushman Bharat\nPM-JAY",
    tagline: "मोफत आरोग्य सेवा · Free Health Coverage",
    benefits: [
      { icon: "🏥", label: "₹5 लाख/वर्ष", sublabel: "Health Insurance" },
      { icon: "🩺", label: "1,500+ रुग्णालये", sublabel: "Empanelled Hospitals" },
      { icon: "💊", label: "मोफत उपचार", sublabel: "Cashless Treatment" },
    ],
    eligibility: ["SECC यादीत नाव असलेले", "BPL रेशन कार्डधारक", "आधार अनिवार्य"],
    badge: "❤️ आरोग्य मंत्रालय",
    deadline: "⏰  आजच Golden Card काढा",
    gradient: "linear-gradient(135deg, #6A1B9A 0%, #8E24AA 40%, #AB47BC 70%, #CE93D8 100%)",
    darkColor: "#4A148C",
  },
  {
    id: "crop-insurance",
    schemeMr: "प्रधानमंत्री फसल\nविमा योजना",
    schemeEn: "PM Fasal Bima\nYojana",
    tagline: "पीक नुकसानापासून संरक्षण · Protect Your Crops",
    benefits: [
      { icon: "🌧️", label: "हवामान विमा", sublabel: "Weather Coverage" },
      { icon: "📊", label: "कमी प्रीमियम", sublabel: "2% Rabi / 1.5% Kharif" },
      { icon: "⚡", label: "जलद दावे", sublabel: "Fast Claim Settlement" },
    ],
    eligibility: ["सर्व शेतकरी पात्र", "कर्जदार / बिगरकर्जदार", "खरीप / रब्बी दोन्ही"],
    badge: "☔ पीक संरक्षण",
    deadline: "⏰  खरीप नोंदणी: 31 जुलै 2027",
    gradient: "linear-gradient(135deg, #E65100 0%, #F4511E 40%, #FF7043 70%, #FFAB40 100%)",
    darkColor: "#BF360C",
  },
];

const HEX_COLORS = ["#C2185B","#1565C0","#2E7D32","#6A1B9A","#E65100"];

export default function WhatsAppBannerGenerator({ agentName = "Isevak Agent Kendra", agentPhone = "9876543210" }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [kendraName, setKendraName] = useState(agentName);
  const [kendraPhone, setKendraPhone] = useState(agentPhone);
  const [editingKendra, setEditingKendra] = useState(false);
  const [tempName, setTempName] = useState(agentName);
  const [tempPhone, setTempPhone] = useState(agentPhone);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const bannerRef = useRef(null);
  const template = BANNER_TEMPLATES[currentIndex];
  const accentColor = HEX_COLORS[currentIndex];

  const prev = () => setCurrentIndex(i => (i - 1 + BANNER_TEMPLATES.length) % BANNER_TEMPLATES.length);
  const next = () => setCurrentIndex(i => (i + 1) % BANNER_TEMPLATES.length);

  const saveKendra = () => {
    setKendraName(tempName || agentName);
    setKendraPhone(tempPhone || agentPhone);
    setEditingKendra(false);
  };

  const handleDownload = useCallback(async () => {
    if (!bannerRef.current || isDownloading) return;
    setIsDownloading(true);
    setDownloadSuccess(false);
    try {
      const canvas = await html2canvas(bannerRef.current, { scale: 3, useCORS: true, backgroundColor: null, logging: false });
      const link = document.createElement("a");
      link.download = `swaraj-${template.id}-banner.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error("Banner download error:", err);
      alert("Could not generate banner. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  }, [isDownloading, template.id]);

  // Inline styles for the banner card (html2canvas friendly)
  const bannerStyle = {
    width: 420,
    minHeight: 560,
    background: template.gradient,
    borderRadius: 20,
    overflow: "hidden",
    fontFamily: "Arial, sans-serif",
    position: "relative",
    color: "#fff",
    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
      {/* HEADER */}
      <div className="px-6 pt-5 pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-black text-slate-800 text-base flex items-center gap-2 flex-wrap">
              <span className="text-2xl">📲</span>
              WhatsApp Banner Generator
              <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                {BANNER_TEMPLATES.length} Templates
              </span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Professional bilingual (मराठी + English) government scheme posters branded with your Kendra details
            </p>
          </div>
          {!editingKendra ? (
            <button
              onClick={() => { setTempName(kendraName); setTempPhone(kendraPhone); setEditingKendra(true); }}
              className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ml-3"
            >
              <Edit3 size={13} /> Kendra Info
            </button>
          ) : (
            <div className="flex items-center gap-1 ml-3">
              <button onClick={saveKendra} className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"><Check size={13} /></button>
              <button onClick={() => setEditingKendra(false)} className="p-1.5 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300 transition-colors"><X size={13} /></button>
            </div>
          )}
        </div>
        {editingKendra && (
          <div className="mt-3 flex gap-2">
            <input value={tempName} onChange={e => setTempName(e.target.value)} placeholder="Kendra Name" className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-400" />
            <input value={tempPhone} onChange={e => setTempPhone(e.target.value)} placeholder="Phone Number" className="w-36 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-400" />
          </div>
        )}
      </div>

      {/* BODY */}
      <div className="p-5 flex flex-col items-center gap-4 flex-1">
        {/* Scheme Tabs */}
        <div className="flex gap-1.5 flex-wrap justify-center w-full">
          {BANNER_TEMPLATES.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setCurrentIndex(i)}
              className="text-[10px] font-bold px-2.5 py-1 rounded-full transition-all border"
              style={i === currentIndex
                ? { background: t.gradient, color: "#fff", border: "none", transform: "scale(1.05)", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }
                : { background: "#f8fafc", color: "#64748b", borderColor: "#e2e8f0" }
              }
            >
              {t.badge}
            </button>
          ))}
        </div>

        {/* Banner Preview */}
        <div className="relative w-full flex items-center justify-center">
          <button onClick={prev} className="absolute left-0 z-10 w-8 h-8 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all hover:scale-110" style={{ top: "50%", transform: "translateY(-50%)" }}>
            <ChevronLeft size={16} />
          </button>

          {/* The banner div – exactly what html2canvas will capture */}
          <div style={{ transform: "scale(0.70)", transformOrigin: "top center", marginBottom: -112 }}>
            <div ref={bannerRef} style={bannerStyle}>
              {/* Hexagon overlay pattern */}
              <svg style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", opacity:0.07, pointerEvents:"none" }} xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id={`hp-${currentIndex}`} x="0" y="0" width="40" height="46" patternUnits="userSpaceOnUse">
                    <polygon points="20,2 38,12 38,34 20,44 2,34 2,12" fill="none" stroke="#ffffff" strokeWidth="1.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#hp-${currentIndex})`} />
              </svg>
              {/* India silhouette decoration */}
              <svg viewBox="0 0 200 240" fill="#ffffff" style={{ opacity:0.06, position:"absolute", right:-20, bottom:-20, width:200, height:240, pointerEvents:"none" }}>
                <path d="M100,10 L130,30 L150,20 L160,50 L190,60 L185,90 L165,100 L170,130 L155,150 L145,180 L130,200 L110,220 L100,230 L90,220 L70,200 L55,180 L45,150 L30,130 L35,100 L15,90 L10,60 L40,50 L50,20 L70,30 Z" />
              </svg>

              {/* HEADER STRIP */}
              <div style={{ background:"rgba(0,0,0,0.25)", backdropFilter:"blur(8px)", padding:"10px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:"1px solid rgba(255,255,255,0.15)" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <svg width="34" height="34" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="45" stroke="#FFD700" strokeWidth="4" fill="none"/>
                    <circle cx="50" cy="50" r="6" fill="#FFD700"/>
                    {Array.from({length:24}).map((_,i)=>{const a=(i*15*Math.PI)/180;return <line key={i} x1={50+6*Math.cos(a)} y1={50+6*Math.sin(a)} x2={50+44*Math.cos(a)} y2={50+44*Math.sin(a)} stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>})}
                  </svg>
                  <div>
                    <div style={{ fontSize:10, fontWeight:800, letterSpacing:"0.08em", color:"#FFD700", textTransform:"uppercase" }}>भारत सरकार / India Govt.</div>
                    <div style={{ fontSize:9, color:"rgba(255,255,255,0.7)" }}>सरकारी योजना माहिती</div>
                  </div>
                </div>
                <div style={{ background:"rgba(255,215,0,0.2)", border:"1px solid rgba(255,215,0,0.5)", borderRadius:20, padding:"3px 10px", fontSize:10, fontWeight:700, color:"#FFD700" }}>
                  {template.badge}
                </div>
              </div>

              {/* MAIN BODY */}
              <div style={{ padding:"22px 24px 18px" }}>
                {/* Tagline + Scheme Name */}
                <div style={{ marginBottom:6 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.7)", letterSpacing:"0.09em", textTransform:"uppercase", marginBottom:4 }}>{template.tagline}</div>
                  <h2 style={{ fontSize:26, fontWeight:900, lineHeight:1.2, margin:0, whiteSpace:"pre-line", textShadow:"0 2px 12px rgba(0,0,0,0.3)", color:"#fff" }}>{template.schemeMr}</h2>
                  <div style={{ fontSize:13, fontWeight:600, color:"rgba(255,255,255,0.75)", marginTop:2, whiteSpace:"pre-line" }}>{template.schemeEn}</div>
                </div>

                {/* DIVIDER */}
                <div style={{ height:1, background:"rgba(255,255,255,0.2)", margin:"14px 0", borderRadius:2 }} />

                {/* BENEFITS GRID */}
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:14 }}>
                  {template.benefits.map((b,i)=>(
                    <div key={i} style={{ background:"rgba(255,255,255,0.15)", backdropFilter:"blur(6px)", borderRadius:12, padding:"10px 6px", textAlign:"center", border:"1px solid rgba(255,255,255,0.2)" }}>
                      <div style={{ fontSize:20, marginBottom:4 }}>{b.icon}</div>
                      <div style={{ fontSize:12, fontWeight:800, color:"#fff", lineHeight:1.2 }}>{b.label}</div>
                      <div style={{ fontSize:9.5, color:"rgba(255,255,255,0.75)", marginTop:2 }}>{b.sublabel}</div>
                    </div>
                  ))}
                </div>

                {/* ELIGIBILITY */}
                <div style={{ background:"rgba(0,0,0,0.2)", borderRadius:12, padding:"10px 14px", marginBottom:14, border:"1px solid rgba(255,255,255,0.1)" }}>
                  <div style={{ fontSize:10, fontWeight:800, color:"rgba(255,255,255,0.65)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:7 }}>✅ पात्रता / Eligibility</div>
                  {template.eligibility.map((e,i)=>(
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:7, marginBottom:4 }}>
                      <div style={{ width:5, height:5, borderRadius:"50%", background:"#FFD700", flexShrink:0 }} />
                      <span style={{ fontSize:11.5, color:"rgba(255,255,255,0.9)", fontWeight:600 }}>{e}</span>
                    </div>
                  ))}
                </div>

                {/* DEADLINE */}
                <div style={{ background:"rgba(255,215,0,0.15)", border:"1px solid rgba(255,215,0,0.4)", borderRadius:10, padding:"8px 14px", marginBottom:16 }}>
                  <span style={{ fontSize:12, fontWeight:700, color:"#FFD700" }}>{template.deadline}</span>
                </div>
              </div>

              {/* KENDRA FOOTER */}
              <div style={{ background:"#fff", margin:"0 16px 16px", borderRadius:14, padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:"0 4px 20px rgba(0,0,0,0.15)" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:template.gradient, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:900, color:"#fff", boxShadow:"0 2px 8px rgba(0,0,0,0.2)", flexShrink:0 }}>
                    {kendraName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize:9, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.07em" }}>येथे अर्ज करा / Apply At</div>
                    <div style={{ fontSize:13.5, fontWeight:900, color:"#0F172A", lineHeight:1.2 }}>{kendraName}</div>
                  </div>
                </div>
                <div style={{ background:template.darkColor, color:"#fff", borderRadius:10, padding:"6px 14px", fontWeight:900, fontSize:14, boxShadow:"0 2px 8px rgba(0,0,0,0.2)" }}>
                  📞 {kendraPhone}
                </div>
              </div>

              {/* BOTTOM STRIPE */}
              <div style={{ background:"rgba(0,0,0,0.3)", padding:"7px 20px", display:"flex", alignItems:"center", justifyContent:"center", gap:6, borderTop:"1px solid rgba(255,255,255,0.1)" }}>
                <span style={{ fontSize:9.5, color:"rgba(255,255,255,0.6)", letterSpacing:"0.08em", textTransform:"uppercase" }}>
                  Swaraj Saathi E-Seva Kendra · सरकारी मदत केंद्र
                </span>
              </div>
            </div>
          </div>

          <button onClick={next} className="absolute right-0 z-10 w-8 h-8 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all hover:scale-110" style={{ top:"50%", transform:"translateY(-50%)" }}>
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Dots */}
        <div className="flex gap-1.5">
          {BANNER_TEMPLATES.map((_, i) => (
            <button key={i} onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? "w-5" : "w-1.5 bg-slate-300"}`}
              style={i === currentIndex ? { background: accentColor } : {}}
            />
          ))}
        </div>

        {/* Scheme label */}
        <div className="text-center -mt-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{template.schemeEn.replace("\n"," ")}</p>
          <p className="text-sm font-black text-slate-800">{template.schemeMr.replace("\n"," ")}</p>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-full py-3.5 rounded-xl font-black text-sm transition-all shadow-lg flex items-center justify-center gap-2 text-white hover:scale-[1.02] active:scale-95 disabled:opacity-70"
          style={{ background: downloadSuccess ? "#22c55e" : template.gradient }}
        >
          {isDownloading ? (
            <><Sparkles size={16} className="animate-spin" /> Generating High-Res…</>
          ) : downloadSuccess ? (
            <><Check size={16} /> Banner Downloaded! Share on WhatsApp ✅</>
          ) : (
            <><Download size={16} /> Download High-Res Poster (3×)</>
          )}
        </button>

        <p className="text-[10px] text-slate-400 text-center leading-relaxed">
          <Share2 size={9} className="inline mr-1" />
          Download &amp; share directly to <strong>WhatsApp Status</strong> or forward to contacts for maximum outreach. Renders at 1260px wide (3× scale).
        </p>
      </div>
    </div>
  );
}
