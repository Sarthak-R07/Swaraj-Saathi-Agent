import React, { useState, useCallback } from "react";
import {
  ArrowUpRight, ArrowDownLeft, TrendingUp, FileText,
  Plus, Download, Search, X, Check, AlertCircle, Smartphone,
  Building2, QrCode, ChevronDown, RefreshCw, Star,
  Eye, EyeOff, BarChart2, Award, Zap, CreditCard
} from "lucide-react";

// ── Helpers ──────────────────────────────────────────
const fmt = (n) =>
  Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtInt = (n) => Number(n).toLocaleString("en-IN");
const nowStr = () => {
  const d = new Date();
  return (
    d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) +
    ", " +
    d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
  );
};
const randTxn = () => "TXN" + (Math.floor(Math.random() * 90000) + 10000);

// ── Static data ──────────────────────────────────────
const SCHEME_COMMISSIONS = [
  { scheme: "Mukhyamantri Ladki Bahin", commission: 150, color: "#E91E63" },
  { scheme: "PM Awas Yojana",           commission: 250, color: "#1E88E5" },
  { scheme: "PM Kisan Samman",          commission: 100, color: "#43A047" },
  { scheme: "Ayushman Bharat",          commission: 200, color: "#8E24AA" },
  { scheme: "PM Fasal Bima",            commission: 175, color: "#F4511E" },
  { scheme: "CMEGP Loan",               commission: 350, color: "#FF7A00" },
];

const INITIAL_LEDGER = [
  { id: 1, type: "commission", txn: "Ladki Bahin Commission",    txnId: "TXN8910", date: "09 Nov 2026, 03:45 PM", citizen: "Sita Devi",    scheme: "Ladki Bahin", amount:  150, status: "settled" },
  { id: 2, type: "debit",      txn: "PM-KISAN Application Fee",  txnId: "TXN8912", date: "09 Nov 2026, 10:45 AM", citizen: "Ramesh Kumar", scheme: "PM Kisan",    amount:  -50, status: "settled" },
  { id: 3, type: "credit",     txn: "Wallet Recharge - UPI",     txnId: "TXN8911", date: "09 Nov 2026, 09:00 AM", citizen: "---",          scheme: "---",         amount: 1000, status: "settled" },
  { id: 4, type: "commission", txn: "PM Awas Commission",        txnId: "TXN8909", date: "08 Nov 2026, 02:12 PM", citizen: "Amit Patil",   scheme: "PM Awas",     amount:  250, status: "settled" },
  { id: 5, type: "debit",      txn: "CMEGP Application Fee",     txnId: "TXN8908", date: "08 Nov 2026, 11:00 AM", citizen: "Amit Singh",   scheme: "CMEGP",       amount: -200, status: "settled" },
  { id: 6, type: "commission", txn: "Ayushman Bharat Commission",txnId: "TXN8907", date: "07 Nov 2026, 04:30 PM", citizen: "Priya Jadhav", scheme: "Ayushman",    amount:  200, status: "settled" },
  { id: 7, type: "credit",     txn: "Wallet Recharge - NEFT",    txnId: "TXN8906", date: "07 Nov 2026, 09:15 AM", citizen: "---",          scheme: "---",         amount: 2000, status: "settled" },
  { id: 8, type: "commission", txn: "Fasal Bima Commission",     txnId: "TXN8905", date: "06 Nov 2026, 05:00 PM", citizen: "Raju Shinde",  scheme: "Fasal Bima",  amount:  175, status: "settled" },
];

const WEEKLY = [
  { day: "Mon", credit: 1150, debit:  50 },
  { day: "Tue", credit:  200, debit: 200 },
  { day: "Wed", credit: 2175, debit:   0 },
  { day: "Thu", credit:    0, debit: 100 },
  { day: "Fri", credit:  300, debit:  50 },
  { day: "Sat", credit:  150, debit: 150 },
  { day: "Sun", credit:    0, debit:   0 },
];

// ── Mini Bar Chart ───────────────────────────────────
function MiniBarChart({ data }) {
  const max = Math.max(...data.map((d) => d.credit + d.debit), 1);
  return (
    <div className="flex items-end gap-1.5 h-24 mt-2">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
          <div className="w-full flex flex-col-reverse gap-px" style={{ height: 72 }}>
            {d.debit > 0 && (
              <div
                style={{
                  height: `${(d.debit / max) * 100}%`,
                  background: "linear-gradient(to top, #EF4444, #F87171)",
                  minHeight: 4,
                  borderRadius: "3px 3px 0 0",
                }}
              />
            )}
            <div
              style={{
                height: `${(d.credit / max) * 100}%`,
                background: "linear-gradient(to top, #10B981, #34D399)",
                minHeight: d.credit > 0 ? 4 : 0,
                borderRadius: "3px 3px 0 0",
                transition: "height 0.6s ease",
              }}
            />
          </div>
          <span className="text-[9px] text-slate-400 font-bold">{d.day}</span>
        </div>
      ))}
    </div>
  );
}

// ── Recharge Modal ───────────────────────────────────
function RechargeModal({ onClose, onSuccess }) {
  const [step, setStep]       = useState(1);
  const [method, setMethod]   = useState(null);
  const [amount, setAmount]   = useState("");
  const [upiId, setUpiId]     = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const methodLabel = { upi: "UPI Transfer", neft: "NEFT / Bank Transfer", qr: "QR Code Scan" };
  const quickAmounts = [500, 1000, 2000, 5000];

  const handlePay = () => {
    setError("");
    if (!amount || isNaN(amount) || Number(amount) < 100) {
      setError("Minimum recharge amount is ₹100"); return;
    }
    if (method === "upi" && !upiId.includes("@")) {
      setError("Enter a valid UPI ID (e.g. name@upi)"); return;
    }
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(3); }, 1800);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0F172A] to-[#1e293b] px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Recharge Wallet</p>
            <h3 className="text-white font-black text-lg">Add Money</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-6">
          {/* Step 1 – Select Method */}
          {step === 1 && (
            <div className="space-y-3">
              <p className="text-sm font-bold text-slate-600 mb-4">Select Payment Method</p>
              {[
                { id: "upi",  label: "UPI Transfer",        sub: "GPay, PhonePe, Paytm, BHIM", color: "#10B981", icon: <Smartphone size={20} /> },
                { id: "neft", label: "NEFT / Bank Transfer", sub: "Direct bank to bank",         color: "#3B82F6", icon: <Building2   size={20} /> },
                { id: "qr",   label: "Scan QR Code",         sub: "Any UPI app",                 color: "#8B5CF6", icon: <QrCode      size={20} /> },
              ].map((m) => (
                <button key={m.id} onClick={() => { setMethod(m.id); setStep(2); }}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-slate-100 hover:shadow-md transition-all text-left group">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ background: m.color }}>{m.icon}</div>
                  <div>
                    <p className="font-bold text-slate-800">{m.label}</p>
                    <p className="text-xs text-slate-400">{m.sub}</p>
                  </div>
                  <ArrowUpRight size={16} className="ml-auto text-slate-300" />
                </button>
              ))}
            </div>
          )}

          {/* Step 2 – Enter Details */}
          {step === 2 && (
            <div className="space-y-5">
              <button onClick={() => setStep(1)} className="text-slate-400 hover:text-slate-600 text-sm flex items-center gap-1 font-medium">
                ← {methodLabel[method]}
              </button>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Amount (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <input type="number" min="100" value={amount} onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl text-slate-800 font-bold text-lg focus:border-orange-400 focus:outline-none" />
                </div>
                <div className="flex gap-2 mt-2">
                  {quickAmounts.map((a) => (
                    <button key={a} onClick={() => setAmount(String(a))}
                      className="flex-1 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 transition-colors">
                      ₹{a}
                    </button>
                  ))}
                </div>
              </div>

              {method === "upi" && (
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Your UPI ID</label>
                  <input type="text" value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="e.g. agent@okicici"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-800 focus:border-orange-400 focus:outline-none" />
                </div>
              )}

              {method === "qr" && (
                <div className="flex flex-col items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <div className="w-32 h-32 bg-white border-4 border-slate-200 rounded-xl flex items-center justify-center">
                    <QrCode size={72} className="text-slate-700" />
                  </div>
                  <p className="text-xs text-slate-500 text-center">Scan this QR with any UPI app. Enter amount first.</p>
                </div>
              )}

              {method === "neft" && (
                <div className="bg-blue-50 rounded-xl p-4 space-y-2 text-sm">
                  <p className="font-bold text-blue-800 text-xs uppercase tracking-wide mb-1">Bank Transfer Details</p>
                  {[["Account Name","Swaraj Saathi Pvt Ltd"],["Account No.","1234 5678 9012"],["IFSC","SWARAJ0001"],["Bank","Central Bank of India"]].map(([k,v])=>(
                    <div key={k} className="flex justify-between">
                      <span className="text-blue-600 font-medium">{k}</span>
                      <span className="font-bold text-blue-800">{v}</span>
                    </div>
                  ))}
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">
                  <AlertCircle size={15} /> {error}
                </div>
              )}

              <button onClick={handlePay} disabled={loading}
                className="w-full py-3.5 rounded-xl font-black text-white hover:scale-[1.02] active:scale-95 shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 transition-all"
                style={{ background: "linear-gradient(135deg,#FF7A00,#FF1A4A)" }}>
                {loading
                  ? <><RefreshCw size={16} className="animate-spin" /> Processing…</>
                  : <><Zap size={16} /> Pay ₹{amount || 0} Now</>}
              </button>
            </div>
          )}

          {/* Step 3 – Success */}
          {step === 3 && (
            <div className="text-center py-4 space-y-5">
              <div className="w-20 h-20 rounded-full bg-green-50 border-4 border-green-100 flex items-center justify-center mx-auto">
                <Check size={36} className="text-green-500" strokeWidth={3} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800">₹{fmt(Number(amount))} Added!</h3>
                <p className="text-slate-500 text-sm mt-1">Wallet recharged successfully.</p>
                <p className="text-xs text-slate-400 mt-1">TXN ID: {randTxn()}</p>
              </div>
              <button onClick={() => { onSuccess(Number(amount), method); onClose(); }}
                className="w-full py-3 rounded-xl font-black text-white bg-[#0F172A] hover:bg-black transition-colors">
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Withdraw Modal ───────────────────────────────────
function WithdrawModal({ balance, onClose, onSuccess }) {
  const [amount,    setAmount]    = useState("");
  const [bankName,  setBankName]  = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [loading,   setLoading]   = useState(false);
  const [step,      setStep]      = useState(1);
  const [error,     setError]     = useState("");

  const handleWithdraw = () => {
    setError("");
    const a = Number(amount);
    if (!a || a < 100)        return setError("Minimum withdrawal is ₹100");
    if (a > balance)          return setError(`Insufficient balance (₹${fmt(balance)} available)`);
    if (!bankName.trim())     return setError("Please enter bank name");
    if (!accountNo.trim() || accountNo.length < 9) return setError("Enter a valid account number");
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(2); }, 1800);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-emerald-200 text-xs font-bold uppercase tracking-wider">Payout</p>
            <h3 className="text-white font-black text-lg">Withdraw to Bank</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
            <X size={16} />
          </button>
        </div>

        <div className="p-6">
          {step === 1 ? (
            <div className="space-y-5">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
                <span className="text-emerald-700 text-sm font-bold">Available Balance</span>
                <span className="text-emerald-800 font-black text-xl">₹{fmt(balance)}</span>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Amount (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <input type="number" min="100" max={balance} value={amount} onChange={(e)=>setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl text-slate-800 font-bold text-lg focus:border-emerald-500 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Bank Name</label>
                <input type="text" value={bankName} onChange={(e)=>setBankName(e.target.value)} placeholder="e.g. SBI, HDFC, Canara"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-800 focus:border-emerald-500 focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Account Number</label>
                <input type="text" value={accountNo} onChange={(e)=>setAccountNo(e.target.value)} placeholder="Enter bank account number"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-800 focus:border-emerald-500 focus:outline-none" />
              </div>
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">
                  <AlertCircle size={15} /> {error}
                </div>
              )}
              <button onClick={handleWithdraw} disabled={loading}
                className="w-full py-3.5 rounded-xl font-black text-white bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.02] active:scale-95 shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 transition-all">
                {loading
                  ? <><RefreshCw size={16} className="animate-spin" /> Processing…</>
                  : <><ArrowDownLeft size={16} /> Withdraw ₹{amount || 0}</>}
              </button>
            </div>
          ) : (
            <div className="text-center py-4 space-y-5">
              <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center mx-auto">
                <Check size={36} className="text-emerald-500" strokeWidth={3} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800">Withdrawal Initiated!</h3>
                <p className="text-slate-500 text-sm mt-1">₹{fmt(Number(amount))} will reach {bankName || "your bank"} in 1–2 working days.</p>
                <p className="text-xs text-slate-400 mt-1">REF: WD{Math.floor(Math.random()*90000)+10000}</p>
              </div>
              <button onClick={() => { onSuccess(Number(amount)); onClose(); }}
                className="w-full py-3 rounded-xl font-black text-white bg-emerald-600 hover:bg-emerald-700 transition-colors">
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────
export default function RevenueWallet() {
  const [walletBalance, setWalletBalance] = useState(4250.00);
  const [commission]                      = useState(12450);
  const [lifetimeEarnings]                = useState(68420);
  const [appsProcessed]                   = useState(84);
  const [ledger,       setLedger]         = useState(INITIAL_LEDGER);
  const [filter,       setFilter]         = useState("all");
  const [search,       setSearch]         = useState("");
  const [showRecharge, setShowRecharge]   = useState(false);
  const [showWithdraw, setShowWithdraw]   = useState(false);
  const [balanceHidden,setBalanceHidden]  = useState(false);
  const [showSchemes,  setShowSchemes]    = useState(false);
  const [toast,        setToast]          = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleRechargeSuccess = (amount, method) => {
    const labels = { upi: "UPI Transfer", neft: "NEFT / Bank Transfer", qr: "QR Scan" };
    setWalletBalance((b) => b + amount);
    setLedger((prev) => [{
      id: Date.now(), type: "credit",
      txn: `Wallet Recharge - ${labels[method] || "Payment"}`,
      txnId: randTxn(), date: nowStr(), citizen: "---", scheme: "---",
      amount, status: "settled",
    }, ...prev]);
    showToast(`₹${fmtInt(amount)} added to wallet!`);
  };

  const handleWithdrawSuccess = (amount) => {
    setWalletBalance((b) => b - amount);
    setLedger((prev) => [{
      id: Date.now(), type: "debit", txn: "Withdrawal to Bank",
      txnId: `WD${Math.floor(Math.random()*90000)+10000}`,
      date: nowStr(), citizen: "---", scheme: "---",
      amount: -amount, status: "pending",
    }, ...prev]);
    showToast(`₹${fmtInt(amount)} withdrawal initiated!`, "info");
  };

  const handleDownloadCSV = useCallback(() => {
    const headers = ["TXN ID","Type","Description","Date","Citizen","Scheme","Amount","Status"];
    const rows = ledger.map((r) => [r.txnId,r.type,r.txn,r.date,r.citizen,r.scheme,r.amount,r.status]);
    const csv = [headers, ...rows].map((row) => row.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `swaraj-statement-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
    showToast("Statement downloaded!");
  }, [ledger]);

  // Derived values
  const filtered = ledger.filter((r) => {
    const mf = filter === "all" || r.type === filter;
    const ms = !search ||
      r.txn.toLowerCase().includes(search.toLowerCase()) ||
      r.citizen.toLowerCase().includes(search.toLowerCase()) ||
      r.txnId.toLowerCase().includes(search.toLowerCase());
    return mf && ms;
  });

  const totalCredit    = ledger.filter((r) => r.amount > 0).reduce((s,r) => s + r.amount, 0);
  const totalDebit     = ledger.filter((r) => r.amount < 0).reduce((s,r) => s + Math.abs(r.amount), 0);
  const totalCommEarned= ledger.filter((r) => r.type === "commission").reduce((s,r) => s + r.amount, 0);

  const typeIcon = (type) => {
    if (type === "credit")     return <div className="w-8 h-8 rounded-full bg-blue-50    flex items-center justify-center"><ArrowDownLeft size={14} className="text-blue-500"   /></div>;
    if (type === "debit")      return <div className="w-8 h-8 rounded-full bg-red-50     flex items-center justify-center"><ArrowUpRight  size={14} className="text-red-500"    /></div>;
    /* commission */           return <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center"><Star          size={14} className="text-emerald-500"/></div>;
  };

  return (
    <div className="space-y-6">

      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-white font-bold text-sm ${toast.type === "success" ? "bg-emerald-500" : "bg-blue-500"}`}>
          <Check size={16} /> {toast.msg}
        </div>
      )}

      {/* ── 4 Stat Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

        {/* Wallet Balance */}
        <div className="rounded-2xl p-5 relative overflow-hidden text-white shadow-xl" style={{ background: "linear-gradient(135deg,#FF7A00,#FF1A4A)" }}>
          <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }} />
          <div className="absolute -right-2 -bottom-6 w-20 h-20 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }} />
          <div className="relative z-10 flex flex-col h-full gap-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)" }}><CreditCard size={22} /></div>
              <button onClick={() => setBalanceHidden((h) => !h)} className="text-white/60 hover:text-white/90 transition-colors" title={balanceHidden ? "Show balance" : "Hide balance"}>
                {balanceHidden ? <Eye size={15} /> : <EyeOff size={15} />}
              </button>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "rgba(255,255,255,0.7)" }}>Prepaid Wallet Balance</p>
              <p className="text-3xl font-black">{balanceHidden ? "₹ ●●●●●" : `₹${fmt(walletBalance)}`}</p>
            </div>
            <span className="text-xs font-semibold mt-auto" style={{ color: "rgba(255,255,255,0.75)" }}>Available for applications</span>
          </div>
        </div>

        {/* Monthly Commission */}
        <div className="rounded-2xl p-5 bg-white border border-slate-100 shadow-sm flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#10B98118", color: "#10B981" }}><TrendingUp size={22} /></div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Monthly Commission</p>
            <p className="text-3xl font-black text-[#0F172A]">₹{fmtInt(commission)}</p>
          </div>
          <span className="text-xs font-semibold text-emerald-600 mt-auto">+14% vs last month ↑</span>
        </div>

        {/* Lifetime Earnings */}
        <div className="rounded-2xl p-5 bg-white border border-slate-100 shadow-sm flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#6366F118", color: "#6366F1" }}><Award size={22} /></div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Lifetime Earnings</p>
            <p className="text-3xl font-black text-[#0F172A]">₹{fmtInt(lifetimeEarnings)}</p>
          </div>
          <span className="text-xs font-semibold text-indigo-500 mt-auto">Since Jan 2025</span>
        </div>

        {/* Apps Processed */}
        <div className="rounded-2xl p-5 bg-white border border-slate-100 shadow-sm flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#F59E0B18", color: "#F59E0B" }}><FileText size={22} /></div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Apps Processed</p>
            <p className="text-3xl font-black text-[#0F172A]">{fmtInt(appsProcessed)}</p>
          </div>
          <span className="text-xs font-semibold text-amber-500 mt-auto">4 pending govt approval</span>
        </div>
      </div>

      {/* ── 3-col row: Actions | Chart | Summary ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Actions</p>
          <button id="btn-recharge-wallet" onClick={() => setShowRecharge(true)}
            className="w-full py-3 rounded-xl font-black text-white flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 shadow-md transition-all"
            style={{ background: "linear-gradient(135deg,#FF7A00,#FF1A4A)" }}>
            <Plus size={18} /> Recharge Wallet
          </button>
          <button id="btn-withdraw-bank" onClick={() => setShowWithdraw(true)}
            className="w-full py-3 rounded-xl font-black text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all">
            <ArrowDownLeft size={18} /> Withdraw to Bank
          </button>
          <button id="btn-download-statement" onClick={handleDownloadCSV}
            className="w-full py-3 rounded-xl font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center gap-2 transition-all">
            <Download size={16} /> Download Statement (CSV)
          </button>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">This Week – Activity</p>
            <BarChart2 size={16} className="text-slate-300" />
          </div>
          <MiniBarChart data={WEEKLY} />
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-emerald-400" /><span className="text-[10px] text-slate-400 font-medium">Credits</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-red-400"     /><span className="text-[10px] text-slate-400 font-medium">Debits</span></div>
          </div>
        </div>

        {/* Transaction Summary */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Transaction Summary</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-blue-50">
              <span className="text-sm font-semibold text-slate-600">Total Credits</span>
              <span className="font-black text-sm text-blue-600">+₹{fmt(totalCredit)}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-red-50">
              <span className="text-sm font-semibold text-slate-600">Total Debits</span>
              <span className="font-black text-sm text-red-500">-₹{fmt(totalDebit)}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-emerald-50">
              <span className="text-sm font-semibold text-slate-600">Commissions Earned</span>
              <span className="font-black text-sm text-emerald-600">+₹{fmt(totalCommEarned)}</span>
            </div>
          </div>
          <button onClick={() => setShowSchemes((s) => !s)}
            className="mt-4 w-full text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 py-2 rounded-xl flex items-center justify-center gap-1 transition-colors">
            <ChevronDown size={13} className={`transition-transform duration-200 ${showSchemes ? "rotate-180" : ""}`} />
            {showSchemes ? "Hide" : "View"} Commission Rates by Scheme
          </button>
        </div>
      </div>

      {/* ── Scheme Commission Breakdown (togglable) ── */}
      {showSchemes && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-sm font-black text-slate-800 mb-4">Commission Rate per Scheme</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {SCHEME_COMMISSIONS.map((s, i) => (
              <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 hover:shadow-sm transition-shadow">
                <div className="w-3 h-10 rounded-full flex-shrink-0" style={{ background: s.color }} />
                <div>
                  <p className="text-xs font-bold text-slate-500 leading-tight">{s.scheme}</p>
                  <p className="text-lg font-black text-slate-800">₹{s.commission}</p>
                  <p className="text-[10px] text-slate-400">per application</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Ledger Table ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        {/* Ledger Header */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
              <FileText size={18} className="text-slate-500" />
              Wallet Ledger &amp; Commission Log
              <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2 py-0.5 rounded-full">{filtered.length} entries</span>
            </h3>
            <button onClick={handleDownloadCSV} className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
              <Download size={13} /> Export CSV
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-48">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input id="ledger-search" type="text" placeholder="Search transactions, citizens, TXN IDs…"
                value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-8 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-slate-400" />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X size={12} />
                </button>
              )}
            </div>
            <div className="flex gap-1">
              {["all","credit","debit","commission"].map((f) => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${filter === f ? "bg-[#0F172A] text-white shadow" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table Column Headers */}
        <div className="px-6 py-3 grid grid-cols-12 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
          <div className="col-span-1"></div>
          <div className="col-span-4">Transaction</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-2">Citizen</div>
          <div className="col-span-2">Scheme</div>
          <div className="col-span-1 text-right">Amount</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-50">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <Search size={36} className="mb-3 opacity-30" />
              <p className="font-bold">No transactions found</p>
              <p className="text-xs mt-1">Try adjusting your search or filter</p>
            </div>
          ) : (
            filtered.map((item) => (
              <div key={item.id} className="px-6 py-3.5 grid grid-cols-12 items-center hover:bg-slate-50/70 transition-colors">
                <div className="col-span-1">{typeIcon(item.type)}</div>
                <div className="col-span-4">
                  <p className="font-bold text-slate-800 text-sm leading-tight">{item.txn}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-slate-400 font-mono">{item.txnId}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${item.status === "settled" ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
                <div className="col-span-2 text-xs text-slate-500 leading-tight">{item.date}</div>
                <div className="col-span-2 text-sm text-slate-600 font-medium">{item.citizen}</div>
                <div className="col-span-2 text-sm text-slate-500">{item.scheme}</div>
                <div className="col-span-1 text-right">
                  <span className={`font-black text-sm ${item.amount > 0 ? "text-emerald-600" : "text-red-500"}`}>
                    {item.amount > 0 ? `+₹${fmtInt(item.amount)}` : `-₹${fmtInt(Math.abs(item.amount))}`}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {filtered.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 rounded-b-2xl">
            <span className="text-xs text-slate-400 font-medium">Showing {filtered.length} of {ledger.length} transactions</span>
            <span className="text-xs font-black text-emerald-600">
              Net: {(() => {
                const n = filtered.reduce((s,r)=>s+r.amount,0);
                return (n>=0?"+":"") + "₹" + fmt(Math.abs(n));
              })()}
            </span>
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {showRecharge && <RechargeModal onClose={() => setShowRecharge(false)} onSuccess={handleRechargeSuccess} />}
      {showWithdraw && <WithdrawModal balance={walletBalance} onClose={() => setShowWithdraw(false)} onSuccess={handleWithdrawSuccess} />}
    </div>
  );
}
