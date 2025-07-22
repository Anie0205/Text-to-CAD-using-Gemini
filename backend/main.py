import os
import io
import subprocess
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables from .env
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel(model_name="gemini-1.5-flash")

app = FastAPI()

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Text-to-CAD backend running!"}


@app.post("/generate")
async def generate_catia_script(request: Request):
    try:
        body = await request.json()
        size = str(body.get("size", "20")).strip()
        fillet = str(body.get("fillet", "5")).strip()

        prompt = f"""
Generate a CATScript (VBScript used in CATIA) that:
- Creates a 3D cube of size {size} mm
- Applies a {fillet} mm fillet to its edges
- Ensure the script runs fully in CATIA's VBA editor
- Output only the code (no markdown, no explanations)
- Keep code clean, no extra comments
"""

        gemini_response = model.generate_content(prompt)
        raw_script = gemini_response.text.strip()

        # Remove markdown wrappers if present
        if raw_script.startswith("```"):
            raw_script = raw_script.split("```")[-2].strip()

        # Save script to file
        script_path = "output.CATScript"
        with open(script_path, "w", encoding="utf-8") as f:
            f.write(raw_script)

        # Optional: Convert to STL using OpenSCAD (requires .scad input)
        # convert_to_stl("model.scad", "output.stl")

        return JSONResponse(content={"script": raw_script})

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


@app.get("/render-model")
def render_model():
    try:
        with open("output.stl", "rb") as f:
            return StreamingResponse(io.BytesIO(f.read()), media_type="model/stl")
    except FileNotFoundError:
        return JSONResponse(content={"error": "STL file not found"}, status_code=404)


# Optional helper if using OpenSCAD instead of CATIA
def convert_to_stl(scad_path: str, stl_path: str):
    command = f"openscad -o {stl_path} {scad_path}"
    subprocess.run(command, shell=True, check=True)
