import React, { useState, useEffect } from "react";
import { generateScript, pingBackend, convertScadToStl } from "../api";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Suspense } from "react";
import { STLLoader } from "three-stdlib";

const STLModel: React.FC<{ url: string }> = ({ url }) => {
  const geometry = useLoader(STLLoader, url);
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color="orange" metalness={0.3} roughness={0.4} />
    </mesh>
  );
};

const ModelViewer: React.FC<{ modelUrl: string }> = ({ modelUrl }) => {
  return (
    <div className="w-full h-[500px] border border-[#333] mt-4 rounded-xl shadow-md bg-[#111111]">
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <PerspectiveCamera makeDefault position={[0, 0, 100]} />
        <OrbitControls />
        <Suspense fallback={null}>
          <STLModel url={modelUrl} />
        </Suspense>
      </Canvas>
    </div>
  );
};

const Home: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [scadCode, setScadCode] = useState("");
  const [stlUrl, setStlUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"prompt" | "scad">("prompt");

  // Test backend connection on component mount
  useEffect(() => {
    const testBackend = async () => {
      try {
        console.log("Testing backend connection...");
        const result = await pingBackend();
        console.log("Backend is accessible:", result);
      } catch (err) {
        console.error("Backend connection test failed:", err);
      }
    };
    testBackend();
  }, []);

  const generateModel = async () => {
    if (mode === "prompt" && !prompt) return;
    if (mode === "scad" && !scadCode) return;

    setLoading(true);
    setError("");
    setStlUrl("");

    try {
      console.log("Sending request to backend...");
      
      if (mode === "prompt") {
        await generateScript(prompt);
        // For prompt mode, use the existing render-model endpoint
        setStlUrl("https://text-to-cad-using-gemini.onrender.com/render-model");
      } else {
        // For SCAD mode, get the blob URL directly
        const blobUrl = await convertScadToStl(scadCode);
        setStlUrl(blobUrl);
      }
      
      console.log("Backend request successful, setting STL URL...");
    } catch (err: any) {
      console.error("Backend error:", err);
      if (err.code === 'ERR_NETWORK') {
        setError("Network error: Cannot reach the backend server. Please check if the backend is running.");
      } else if (err.response?.status === 500) {
        setError("Server error: Backend processing failed. Please try a simpler prompt or check your SCAD code.");
      } else if (err.response?.status === 404) {
        setError("Not found: The backend endpoint is not available.");
      } else if (err.response?.status === 403) {
        setError("Access denied: CORS issue. Please check backend configuration.");
      } else {
        setError(`Error: ${err.message || "Something went wrong. Please try again."}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-r from-zinc-950 via-zinc-900 to-black font-sans">
  
      {/* === Left Panel: Input Box === */}
      <div className="w-1/2 flex flex-col justify-center items-center px-12">
        <div className="w-full max-w-xl bg-zinc-900 p-8 rounded-xl shadow-xl border border-zinc-800">
          <h1 className="text-4xl font-extrabold mb-6 text-transparent bg-clip-text 
             bg-gradient-to-r from-purple-400 via-fuchsia-500 to-pink-500 
             tracking-tight drop-shadow-md animate-fade-in">
              Text-to-CAD Generator
            </h1>

          <textarea
            className="flex-1 w-full bg-[#1A1A1A] text-white placeholder-gray-400 
                      border border-[#333] rounded-xl px-4 py-3 
                      focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent 
                      transition-all duration-300 shadow-inner resize-y min-h-[100px]"
            placeholder="Describe your 3D model in natural language..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
          />

          {error && (
            <p className="text-red-400 text-sm mt-4 bg-red-900/20 p-3 rounded-lg border border-red-500/30">
              {error}
            </p>
          )}

          <button
            onClick={generateModel}
            disabled={loading}
            className="mt-6 w-full py-3 px-6 text-white font-semibold rounded-full 
                      bg-gradient-to-r from-purple-600 to-fuchsia-600 
                      hover:from-fuchsia-600 hover:to-purple-600 
                      transition-all duration-300 shadow-md hover:shadow-xl 
                      focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2
                      disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Generating..." : "Generate 3D Model"}
          </button>

        </div>
      </div>
  
      {/* === Right Panel: 3D Viewer === */}
      <div className="w-1/2 flex items-center justify-center">
        <div className="w-[85%] h-[85%] bg-zinc-900 rounded-2xl border border-zinc-800 shadow-inner flex items-center justify-center">
          {stlUrl ? (
            <div className="w-full h-full">
              <Canvas>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <PerspectiveCamera makeDefault position={[0, 0, 100]} />
                <OrbitControls />
                <Suspense fallback={null}>
                  <STLModel url={stlUrl} />
                </Suspense>
              </Canvas>
            </div>
          ) : (
            <div className="text-center text-zinc-400">
              <div className="text-6xl mb-4">🎯</div>
              <p className="text-xl font-medium">3D Model Preview</p>
              <p className="text-sm mt-2">Generate a model to see it here</p>
            </div>
          )}
        </div>
      </div>
  
    </div>
  );
  
};

export default Home;
