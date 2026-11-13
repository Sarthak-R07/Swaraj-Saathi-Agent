# 🇮🇳 Swaraj Saathi — E-Seva Agent Platform & Command Center

> **Empowering Village & Town E-Seva Kendra Entrepreneurs**  
> Fast-track citizen welfare scheme applications, intelligent Aadhaar OCR, instant photo & signature compression, sequential portal form-filling automation, vernacular marketing banner generation, and real-time revenue & prepaid wallet tracking.

---

## 🌟 Key Features

1. **⚡ Fast-Fill Portal Workstation & Browser Deck**
   - Direct navigation & verified `.gov.in` launchers for 12+ major portals (Ladki Bahin, PM-Kisan, MahaDBT, Aaple Sarkar, Ayushman Bharat, PMAY).
   - **Sequential Auto-Advance Copier (`Alt + N`)**: Copies citizen parameters in exact portal form order.
   - **Pre-flight Rule & Document Diagnostics**: Automatic eligibility checking (Age, Income, Domicile, Landholding, Bank-Aadhaar DBT seeding) to prevent rejections.

2. **💰 Revenue & Prepaid Wallet Command Center**
   - Real-time Prepaid Wallet balance management with privacy masking.
   - 4 Financial KPI Stat Cards (Prepaid Balance, Monthly Commission, Lifetime Earnings, Applications Processed).
   - Instant UPI / QR / NEFT Wallet Recharge modal & Bank Account Withdrawal payout flow.
   - Scheme-specific tiered commission breakdown (₹100–₹250 per completed dossier).
   - Exportable filtered transaction ledger (CSV export).

3. **📄 Document Toolkit & Smart OCR**
   - Client-side & backend Aadhaar OCR extraction with Zero Cloud API cost.
   - Smart Document Resizer: Compresses photos (<50 KB) and identity proofs (<100/200 KB) for strict MahaDBT & Aaple Sarkar upload limits.

4. **🎨 High-Impact WhatsApp Banner & Poster Studio**
   - Generates customized regional scheme marketing posters in Marathi and English with the Agent Kendra's name and phone number.
   - 1-click high-res canvas rendering and PNG export.

5. **🤖 Vernacular E-Seva AI Copilot**
   - Marathi & English bilingual scheme advisor for instant farmer, woman, student, and housing assistance criteria.

---

## 🏗️ Architecture & Tech Stack

```
   ┌─────────────────────────────────────────────────────────┐
   │               Frontend (React 19 + Vite)                │
   │   Tailwind CSS • Lucide Icons • HTML2Canvas • Tesseract │
   │                Hosted on Vercel (Free)                  │
   └──────────────────────────┬──────────────────────────────┘
                              │ API Calls (/api/*)
                              ▼
   ┌─────────────────────────────────────────────────────────┐
   │                 Backend (Python FastAPI)                │
   │               Uvicorn • Pillow • Pydantic               │
   │              Hosted on Render.com (Free)                │
   └─────────────────────────────────────────────────────────┘
```

---

## 🚀 Free Web Deployment Guide

### 1. Backend on Render.com (Free)
1. Go to [Render.com](https://render.com) and sign in with GitHub.
2. Click **New** → **Web Service** (or **Blueprint** using `render.yaml`).
3. Connect your repository: `Sarthak-R07/Swaraj-Saathi-Agent`.
4. Configure settings:
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn server:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: `Free`
5. Copy your live backend URL (e.g., `https://swaraj-saathi-agent.onrender.com`).

### 2. Frontend on Vercel (Free)
1. Go to [Vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New** → **Project** → Import `Sarthak-R07/Swaraj-Saathi-Agent`.
3. Configure settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. In **Environment Variables**, add:
   - `VITE_API_URL` = `https://swaraj-saathi-agent.onrender.com`
5. Click **Deploy**. Your app is live with zero hosting fees!

---

## 💻 Local Development Setup

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### Quick Start (Windows)
Double-click `Start_Swaraj_Saathi.bat` in the root folder, or launch manually:

```bash
# 1. Run Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn server:app --reload --port 8000

# 2. Run Frontend (in a new terminal)
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to access the Kendra Agent Dashboard.

---

## 🔒 Security & Privacy
- Zero citizen Aadhaar numbers or biometric data are stored in third-party cloud services.
- Aadhaar numbers are automatically masked (UIDAI compliant format: `XXXX XXXX 1234`).
- Document resizing and canvas generation run directly in the client browser memory.
