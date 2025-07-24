import React, { useState } from "react";
import axios from "axios";
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
    <div className="w-full h-[500px] border mt-4 rounded shadow">
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
  const [stlUrl, setStlUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("http://localhost:8000/generate-models", {
        prompt,
      });

      // The backend always serves STL at /render-model
      setStlUrl("http://localhost:8000/render-model");
    } catch (err) {
      console.error("Generation failed", err);
      setError("Failed to generate model. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Text-to-CAD Generator</h1>
      <div className="flex gap-4 mb-4">
        <textarea
          className="flex-1 border p-2 rounded resize-y min-h-[60px]"
          placeholder="Describe your 3D model..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
        />
        <button
          onClick={handleGenerate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {stlUrl && <ModelViewer modelUrl={stlUrl} />}
    </div>
  );
};

export default Home;
