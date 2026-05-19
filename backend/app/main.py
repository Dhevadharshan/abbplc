import os
import json
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, UploadFile, File, HTTPException, Body, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from dotenv import load_dotenv
from openai import AsyncOpenAI

from app.parsers.st_parser import STParser
from app.parsers.l5x_parser import L5XParser

load_dotenv()

app = FastAPI(title="PLCInsight AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

openai_client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
model_name = os.getenv("OPENAI_MODEL", "gpt-4o")

@app.get("/")
async def root():
    return {"message": "Welcome to PLCInsight AI API", "status": "online"}

# --- Models ---

class AIAnalysisRequest(BaseModel):
    plc_content: str
    filename: str
    format: str

class SafetyAuditRequest(BaseModel):
    tags: List[Dict[str, Any]]
    logic: List[Dict[str, Any]]
    raw_content: str = ""

class RootCauseRequest(BaseModel):
    fault_description: str
    plc_content: str

class MigrateRequest(BaseModel):
    source_vendor: str
    target_vendor: str
    content: str

class GenerateDocsRequest(BaseModel):
    analysis: Dict[str, Any]
    template: str = "Standard ISO 9001"

# --- Endpoints ---

@app.post("/api/upload-plc")
async def upload_plc(request: Request):
    """Handles both file uploads and sample JSON payloads."""
    content_type = request.headers.get("content-type", "")
    
    filename = ""
    text_content = ""
    
    if "application/json" in content_type:
        try:
            data = await request.json()
        except:
            raise HTTPException(status_code=400, detail="Invalid JSON")
        if data.get("sample"):
            filename = data.get("filename", "sample_logic.st")
            sample_path = os.path.join(os.getcwd(), "..", filename)
            if not os.path.exists(sample_path):
                sample_path = os.path.join(os.getcwd(), filename)
            if os.path.exists(sample_path):
                with open(sample_path, 'r') as f:
                    text_content = f.read()
            else:
                text_content = "VAR\n  Sample_Tag : BOOL;\nEND_VAR\nSample_Tag := TRUE;"
        else:
            raise HTTPException(status_code=400, detail="Missing sample flag in JSON payload")
    elif "multipart/form-data" in content_type:
        form = await request.form()
        file = form.get("file")
        if not file:
            raise HTTPException(status_code=400, detail="No file provided")
        content = await file.read()
        text_content = content.decode('utf-8', errors='ignore')
        filename = file.filename
    else:
        raise HTTPException(status_code=400, detail="Unsupported Content-Type")

    filename_lower = filename.lower()
    
    if filename_lower.endswith('.st'):
        parser = STParser(text_content)
        result = parser.parse()
    elif filename_lower.endswith('.l5x') or filename_lower.endswith('.xml'):
        parser = L5XParser(text_content)
        result = parser.parse()
    else:
        # Default to ST parser if format unknown
        parser = STParser(text_content)
        result = parser.parse()
    
    return {
        "filename": filename,
        "format": filename.split('.')[-1] if '.' in filename else 'unknown',
        "analysis": result,
        "raw_content": text_content
    }

@app.post("/api/ai-analysis")
async def ai_analysis(req: AIAnalysisRequest):
    prompt = f"""
    You are an expert industrial automation engineer. Analyze the following PLC logic ({req.format} format) from file {req.filename}.
    Provide a JSON response with:
    1. "sequence_of_operation": A list of strings describing the step-by-step logic flow. Keep them concise.
    2. "maintenance_notes": A list of strings with maintenance recommendations based on the logic.
    
    PLC Code:
    {req.plc_content[:4000]}
    """
    try:
        response = await openai_client.chat.completions.create(
            model=model_name,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"Error in ai-analysis: {e}")
        return {
            "sequence_of_operation": ["Failed to analyze logic via AI.", str(e)],
            "maintenance_notes": ["Verify AI configuration."]
        }

@app.post("/api/safety-audit")
async def safety_audit(req: SafetyAuditRequest):
    prompt = f"""
    You are a functional safety engineer (IEC 61508 / 62061). Review this PLC logic.
    Identify any critical safety issues (e.g. missing E-Stops, unsafe loops) or warnings (e.g. bypasses).
    Return a JSON object:
    {{
        "score": <integer between 0 and 100>,
        "critical_issues": [{{"title": "...", "description": "..."}}],
        "warnings": [{{"title": "...", "description": "..."}}]
    }}
    
    Logic Content:
    {req.raw_content[:4000]}
    """
    try:
        response = await openai_client.chat.completions.create(
            model=model_name,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"Error in safety-audit: {e}")
        return {
            "score": 0,
            "critical_issues": [{"title": "AI Audit Failed", "description": str(e)}],
            "warnings": []
        }

@app.post("/api/root-cause")
async def root_cause(req: RootCauseRequest):
    prompt = f"""
    You are a troubleshooting AI for industrial control systems.
    Fault reported: {req.fault_description}
    Analyze the logic to determine the root cause. Return a JSON object:
    {{
        "fault_tree": [
            {{"id": 1, "label": "...", "status": "FAULT", "time": "T-0"}},
            {{"id": 2, "label": "...", "status": "CAUSE", "time": "T-1s"}},
            {{"id": 3, "label": "...", "status": "ROOT", "time": "T-2s"}}
        ],
        "recommendation": "What should the engineer do to fix it?",
        "signals": [
            {{"label": "TAG_NAME", "val": "value", "status": "HIGH", "status": "TRIP", "status": "OK", "status": "SHUT"}}
        ]
    }}
    
    Logic Content:
    {req.plc_content[:4000]}
    """
    try:
        response = await openai_client.chat.completions.create(
            model=model_name,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"Error in root-cause: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/migrate")
async def migrate_logic(req: MigrateRequest):
    prompt = f"""
    You are a PLC migration specialist. Convert the following logic from {req.source_vendor} to {req.target_vendor}.
    Return a JSON object:
    {{
        "source_code": "The original relevant logic snippet",
        "target_code": "The converted logic snippet",
        "warnings": [
            {{"title": "...", "description": "..."}}
        ],
        "tag_mapping": [
            {{"src": "...", "dst": "...", "type": "BOOL/REAL/INT", "status": "MAPPED" or "MANUAL_REQ"}}
        ],
        "score": <integer 0-100>,
        "ai_note": "A brief message about the conversion process."
    }}
    
    Logic:
    {req.content[:4000]}
    """
    try:
        response = await openai_client.chat.completions.create(
            model=model_name,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"Error in migrate: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-docs")
async def generate_docs(req: GenerateDocsRequest):
    # Dummy endpoint for generating documents, in reality might generate a PDF
    return {
        "status": "success",
        "message": f"Documentation generated using {req.template} template."
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
