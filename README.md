# Text-to-CAD using Gemini

A lightweight full-stack system that takes natural language input and generates corresponding 3D CAD models using Large Language Models (LLMs). The goal is to bridge the gap between human language and industrial design tools, making rapid prototyping easier and more accessible.

>Built as a 2-month internship project to explore AI-augmented CAD workflows.

---

## Live Demo

👉 [Try the app here](https://text-to-cad-using-gemini.vercel.app/)

(No signup required — works directly in browser.)

---

## 📌 What It Does

- Accepts **natural language prompts** like:
  > "Create a hollow cube with 1mm thick walls and a circular hole on one side."

- Uses **Google Gemini Pro** to generate CAD scripts (OpenSCAD or CATScript).

- Renders **real-time 3D model previews** using Three.js in the browser.

- Optionally converts the output to `.STL` format for 3D printing and simulation.

---

---

## Tech Stack

| Layer        | Technology         |
|--------------|--------------------|
| Frontend     | React, Tailwind CSS, Three.js |
| Backend      | FastAPI, Python |
| AI Model     | Google Gemini Pro (via API) |
| CAD Engines  | OpenSCAD (local), CATIA-ready architecture |
| 3D Format    | `.stl` (currently) |
| Deployment   | Vercel (frontend), Render (backend) |

---

## Features

-  Text-to-CAD with real-world shape logic
-  STL conversion for previewing in browser
-  Easily replaceable CAD engine (OpenSCAD ↔ CATIA)
-  Clean and responsive UI

---

## 🛠️ How It Works

1. User enters a prompt → backend sends it to Gemini Pro
2. Gemini returns valid CAD code (e.g., OpenSCAD/CATScript)
3. Backend saves this as a `.scad` file → converts to `.stl`
4. Frontend loads `.stl` → renders using Three.js

---

## ⚙️ Local Setup

```bash
# Clone the repo
git clone https://github.com/Anie0205/Text-to-CAD-using-Gemini
cd Text-to-CAD-using-Gemini

# Install frontend dependencies
cd frontend
npm install
npm start

# In another terminal, start the backend
cd backend
pip install -r requirements.txt (preferably do it in a virtula env)
$env:GEMINI_API_KEY="your_api_key_here" (if running locally on powershell)
uvicorn main:app --reload
```
## Why OpenSCAD?

Since CATIA isn't installed locally, **OpenSCAD** was used for easier `.stl` generation and browser rendering. However, the backend is modular, and if CATIA becomes available, it can be directly integrated.

- CATScript generation is already built-in  
- The system can be extended to export `.CATPart` using CATIA APIs  
- Enables full-circle: prompt → CATIA model → industrial use

📈 Future Enhancements
----------------------

* Add support for parameter tuning via UI sliders or input boxes  
* Integrate CATIA for industrial-grade `.CATPart` generation  
* Enable download and cloud save of project files  
* Support multiple views (e.g., orthographic, exploded) in the viewer  

---

🙋‍♀️ FAQ
---------

**Q: Isn't this just an API call + viewer?**  
**A:** While it may appear simple, the architecture is designed with modularity in mind. This app connects a **natural language interface → code generation → 3D rendering** flow. It lays a scalable foundation for **LLM + CAD automation**, which can be powerful in early-stage prototyping and product design workflows.

**Q: Can I use this for actual 3D printing?**  
**A:** Yes — the `.stl` output can be used directly in slicer software like Cura or PrusaSlicer. Just ensure the model is watertight and printer-ready.

**Q: What if I install CATIA later?**  
**A:** The backend is structured to plug in CATIA easily. Once installed, you can:

* Replace OpenSCAD output with `.CATPart`  
* Use CATIA's API to create parametric, editable models  
* Continue using the same frontend to interact via text

Author's Note: You can always connect with me via my mail: [Ananya Verma Email](ananya.verma0205@gmail.com)

---

🤝 Acknowledgements
-------------------

* Thanks to [Google AI](https://ai.google) for providing the Gemini LLM used in this project  
* Appreciation to the open-source communities behind FastAPI, OpenSCAD, and Three.js  
* Guided by industry mentorship during a 2-month internship project   

---

🧑‍💻 Author
------------

👋 Hi, I’m [Ananya Verma](https://github.com/Anie0205). I’m passionate about the intersection of **AI, design, and engineering**.  
If you're working on CAD, GenAI, or UX for prototyping tools, I'd love to connect!

---

⭐️ Give it a Star
-----------------

If this project inspired you, consider giving it a ⭐ — it really motivates and helps visibility!


