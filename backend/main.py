import os
import uuid
import subprocess
from fastapi import FastAPI, Request
from fastapi.responses import FileResponse
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import google.generativeai as genai

# ─── Setup ─────────────────────────────────────────────────────────────────────

load_dotenv()  # loads GEMINI_API_KEY from .env
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
# use a valid Gemini model name
model = genai.GenerativeModel(model_name="gemini-1.5-flash")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ensure output directory exists
os.makedirs("output", exist_ok=True)


# ─── Helpers ───────────────────────────────────────────────────────────────────

async def generate_scripts(prompt: str):
    """
    Ask Gemini to produce both OpenSCAD and CATIA VBScript code.
    Expects response in the form:

    SCAD:
    <openSCAD code>
    CATScript:
    <VBScript code>
    """
    system = (
        "You are a CAD assistant. Given a user request, generate:\n"
        "1) An OpenSCAD script implementing the geometry.\n"
        "2) A CATIA VBScript (CATScript) macro for the same geometry.\n"
        "Respond exactly in this form:\n\n"
        "SCAD:\n<your scad code>\n\n"
        "CATScript:\n<your VBScript code>"
    )
    resp = model.generate_content([system, prompt])
    text = resp.text
    # split at the markers
    try:
        scad_part = text.split("SCAD:")[1].split("CATScript:")[0].strip()
        catscript_part = text.split("CATScript:")[1].strip()
    except Exception:
        raise ValueError("Could not parse Gemini response")
    return scad_part, catscript_part


def save_file(path: str, content: str):
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)


def clean_code_block(code: str) -> str:
    lines = code.strip().splitlines()
    if lines and lines[0].startswith("```"):
        lines = lines[1:]
    if lines and lines[-1].startswith("```"):
        lines = lines[:-1]
    return "\n".join(lines)


def scad_to_stl(scad_path: str, stl_path: str):
    subprocess.run(["openscad", "-o", stl_path, scad_path], check=True)


# ─── Routes ────────────────────────────────────────────────────────────────────

@app.get("/")
def read_root():
    return {"message": "Text-to-CAD backend running!"}

@app.post("/convert")
async def convert_scad(request: Request):
    data = await request.json()
    scad_code = data.get("code", "")
    
    if not scad_code.strip():
        return JSONResponse({"error": "No SCAD code provided"}, 400)
    
    scad_filename = f"temp_{uuid.uuid4()}.scad"
    stl_filename = scad_filename.replace(".scad", ".stl")
    
    try:
        # Write SCAD file
        with open(scad_filename, "w") as f:
            f.write(scad_code)

        # Convert to STL
        subprocess.run(["openscad", "-o", stl_filename, scad_filename], check=True)
        
        # Return the STL file
        return FileResponse(
            stl_filename, 
            media_type="model/stl", 
            filename=stl_filename
        )
        
    except subprocess.CalledProcessError as e:
        # Clean up files on error
        for filename in [scad_filename, stl_filename]:
            if os.path.exists(filename):
                os.remove(filename)
        return JSONResponse({"error": f"OpenSCAD conversion failed: {str(e)}"}, 500)
    except Exception as e:
        # Clean up files on error
        for filename in [scad_filename, stl_filename]:
            if os.path.exists(filename):
                os.remove(filename)
        return JSONResponse({"error": f"Conversion failed: {str(e)}"}, 500)

@app.get("/ping")
def ping():
    return {"status": "ok"}


@app.post("/generate-models")
async def generate_models(req: Request):
    data = await req.json()
    prompt = data.get("prompt")
    if not prompt:
        return JSONResponse({"error": "Prompt required"}, 400)

    # 1) ask Gemini for both scripts
    try:
        scad_code, catscript_code = await generate_scripts(prompt)
    except Exception as e:
        return JSONResponse({"error": "LLM parsing failed", "details": str(e)}, 500)

    # 2) save them
    scad_path      = "output/model.scad"
    stl_path      = "output/model.stl"
    catscript_path = "output/model.CATScript"

    save_file(scad_path, clean_code_block(scad_code))
    save_file(catscript_path, clean_code_block(catscript_code))

    # 3) convert SCAD → STL
    try:
        scad_to_stl(scad_path, stl_path)
    except subprocess.CalledProcessError as e:
        return JSONResponse({"error": "OpenSCAD failed", "details": str(e)}, 500)

    # 4) respond with paths
    return {
        "scad_path":      scad_path,
        "stl_path":       stl_path,
        "catscript_path": catscript_path
    }


@app.get("/render-model")
def render_model():
    try:
        f = open("output/model.stl", "rb")
    except FileNotFoundError:
        return JSONResponse({"error": "STL not found"}, 404)
    return StreamingResponse(f, media_type="model/stl")
