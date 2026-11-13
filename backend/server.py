import io
import re
import base64
from typing import Optional, Dict, Any, List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
import uvicorn

app = FastAPI(title="Swaraj Saathi Agent Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginRequest(BaseModel):
    username: str
    password: str

class OCRRequest(BaseModel):
    image_base64: Optional[str] = None
    raw_text: Optional[str] = None

class OCRResponse(BaseModel):
    document_type: str = "Aadhaar Card"
    name: str
    dob: str
    gender: str
    aadhaar_number: str
    address: Optional[str] = None
    masked_id: str
    confidence_score: float = 0.95
    is_valid: bool = True

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[Dict[str, str]]] = None

class ResizeRequest(BaseModel):
    image_base64: str
    target_kb: int = 50

@app.get("/")
def read_root():
    return {"status": "Agent Backend is running", "platform": "Swaraj Saathi Kendra Engine"}

@app.get("/api/v1/health")
def health_check():
    return {"status": "healthy", "service": "Swaraj Kendra API"}

@app.post("/api/auth/login")
def login(req: LoginRequest):
    if req.username == "agent" and req.password == "secure123":
        return {"token": "mock-jwt-token-789", "name": "Agent Sarthak"}
    return {"error": "Invalid credentials"}

@app.get("/api/dashboard/stats")
@app.get("/api/v1/kendra/stats")
def get_stats():
    return {
        "activeTickets": 142,
        "resolvedToday": 28,
        "pendingApprovals": 15,
        "fraudAlerts": 3,
        "totalApplications": 109,
        "totalDossiers": 109,
        "revenue": 5450.0,
        "recentActivity": [
            {"id": 1, "action": "Approved Scheme #241 (Majhi Ladki Bahin)", "time": "10 mins ago"},
            {"id": 2, "action": "Verified Aadhaar & 7/12 Extract", "time": "45 mins ago"},
            {"id": 3, "action": "Processed 50 PM-Kisan applications", "time": "3 hours ago"}
        ]
    }

# ─── Robust Aadhaar Smart OCR Endpoint ───────────────────────────────────────
@app.post("/api/v1/kendra/ocr", response_model=OCRResponse)
@app.post("/api/ocr", response_model=OCRResponse)
def process_ocr(payload: OCRRequest):
    text_content = payload.raw_text or ""
    
    # If base64 image provided, verify dimensions safely
    img_size = (0, 0)
    if payload.image_base64:
        try:
            b64_clean = re.sub(r"^data:image\/[a-zA-Z]+;base64,", "", payload.image_base64.strip())
            img_bytes = base64.b64decode(b64_clean)
            with Image.open(io.BytesIO(img_bytes)) as img:
                img_size = img.size
        except Exception:
            pass

    # Extract or infer Name from actual text
    name = ""
    name_match = re.search(r"(?:Name|नाव)[:\s]+([A-Za-z\s]+?)(?=\s+(?:DOB|Date|Gender|लिंग|जन्म|Aadhaar|\d)|$)", text_content, re.IGNORECASE)
    if name_match:
        name = name_match.group(1).strip()
    elif text_content:
        # Check first clean non-header alphabetic line
        lines = [l.strip() for l in text_content.splitlines() if l.strip()]
        for line in lines:
            clean = re.sub(r"[^a-zA-Z\s]", "", line).strip()
            words = clean.split()
            if 2 <= len(words) <= 4 and not re.search(r"(government|india|unique|identification|authority|aadhaar)", clean, re.IGNORECASE):
                name = clean.title()
                break

    # Extract DOB from actual text
    dob = ""
    dob_match = re.search(r"\b(0[1-9]|[12][0-9]|3[01])[\/\-\.\s](0[1-9]|1[012])[\/\-\.\s](19\d\d|20\d\d)\b", text_content)
    if dob_match:
        dob = f"{dob_match.group(1)}/{dob_match.group(2)}/{dob_match.group(3)}"
    else:
        y_match = re.search(r"\b(19\d\d|20\d\d)\b", text_content)
        if y_match:
            dob = f"01/01/{y_match.group(1)}"

    # Extract Gender from actual text
    text_lower = text_content.lower()
    gender = ""
    if re.search(r"\b(female|महिला|स्त्री)\b", text_lower) or re.search(r"\b(gender|sex|लिंग)[:\s]*f\b", text_lower):
        gender = "Female"
    elif re.search(r"\b(male|पुरुष)\b", text_lower) or re.search(r"\b(gender|sex|लिंग)[:\s]*m\b", text_lower):
        gender = "Male"

    # Extract Aadhaar Number from actual text
    masked_id = ""
    aadhaar_match = re.search(r"\b(\d{4})[\s-]?(\d{4})[\s-]?(\d{4})\b", text_content)
    if aadhaar_match:
        raw_aadhaar = "".join(aadhaar_match.groups())
        masked_id = f"XXXX XXXX {raw_aadhaar[-4:]}"
    else:
        d12 = re.search(r"\b\d{12}\b", text_content)
        if d12:
            masked_id = f"XXXX XXXX {d12.group(0)[-4:]}"

    # Extract Pincode
    address = ""
    pin_match = re.search(r"\b([1-9]\d{5})\b", text_content)
    if pin_match:
        address = f"Maharashtra - {pin_match.group(1)}"

    return OCRResponse(
        document_type="Aadhaar Card",
        name=name,
        dob=dob,
        gender=gender,
        aadhaar_number=masked_id,
        masked_id=masked_id,
        address=address,
        confidence_score=0.96 if name and masked_id else 0.75,
        is_valid=bool(name or masked_id)
    )

# ─── Photo & Document Compression Endpoint ───────────────────────────────────
@app.post("/api/v1/kendra/documents/resize")
@app.post("/api/documents/resize")
def resize_document(req: ResizeRequest):
    try:
        b64_clean = re.sub(r"^data:image\/[a-zA-Z]+;base64,", "", req.image_base64.strip())
        img_bytes = base64.b64decode(b64_clean)
        with Image.open(io.BytesIO(img_bytes)) as img:
            img = img.convert("RGB")
            quality = 85
            out_buf = io.BytesIO()
            img.save(out_buf, format="JPEG", quality=quality, optimize=True)
            
            target_bytes = req.target_kb * 1024
            while out_buf.tell() > target_bytes and quality > 15:
                quality -= 10
                out_buf = io.BytesIO()
                img.save(out_buf, format="JPEG", quality=quality, optimize=True)

            out_b64 = base64.b64encode(out_buf.getvalue()).decode("utf-8")
            return {
                "resized_base64": f"data:image/jpeg;base64,{out_b64}",
                "final_size_kb": round(out_buf.tell() / 1024, 2),
                "is_compliant": out_buf.tell() <= target_bytes
            }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ─── Agent AI Assistant Endpoint (Zero OpenAI Credits Required) ─────────────
@app.post("/api/chat")
def chat_assistant(req: ChatRequest):
    q = req.message.lower()
    if any(k in q for k in ["farmer", "शेती", "शेतकरी", "land", "acre"]):
        reply = (
            "🌾 **Recommended Schemes for Farmers:**\n\n"
            "1. **PM-Kisan Samman Nidhi**: ₹6,000/year direct DBT assistance.\n"
            "2. **Namo Shetkari Mahasanman Nidhi**: Additional ₹6,000/year from Maharashtra State.\n"
            "3. **PM Fasal Bima Yojana (₹1 Crop Insurance)**: Comprehensive crop insurance.\n\n"
            "💼 **Agent Commission**: ₹150 - ₹200 per verified registration dossier."
        )
    elif any(k in q for k in ["woman", "women", "ladki", "bahin", "मुलगी", "महिला"]):
        reply = (
            "🌸 **Recommended Scheme for Women:**\n\n"
            "**Mukhyamantri Majhi Ladki Bahin Yojana**\n"
            "• Benefit: ₹1,500/month directly deposited to Aadhaar-linked bank account.\n"
            "• Eligibility: Age 21-65 years, annual family income < ₹2.5 Lakhs, Maharashtra resident.\n"
            "• Required Docs: Aadhaar Card, Ration Card, Domicile Certificate, Bank Passbook.\n\n"
            "💼 **Agent Commission**: ₹100 per verified application."
        )
    elif any(k in q for k in ["house", "home", "awas", "घरकुल"]):
        reply = (
            "🏠 **Recommended Housing Schemes:**\n\n"
            "1. **PM Awas Yojana (PMAY-G / PMAY-U)**: Up to ₹2.5 Lakhs subsidy for pucca house.\n"
            "2. **Ramai Awas Yojana**: Dedicated subsidy for SC/Neo-Buddhist families.\n"
            "3. **Shabari Awas Yojana**: Dedicated subsidy for ST beneficiaries.\n\n"
            "💼 **Agent Commission**: ₹250 per completed building clearance dossier."
        )
    else:
        reply = (
            "✅ **Swaraj Kendra Assistant Active!**\n\n"
            f"Regarding your query: *\"{req.message}\"*.\n"
            "• You can verify applicant eligibility using the citizen CRM.\n"
            "• Use **Aadhaar Smart OCR** to auto-fill details with zero cloud costs.\n"
            "• Use **Photo Resizer** to fit MahaDBT & Aaple Sarkar <100KB limits."
        )
    return {"reply": reply}

if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
