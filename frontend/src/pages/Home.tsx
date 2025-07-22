import React, { useState } from 'react';
import ModelViewer from '../components/ModelViewer';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [modelUrl, setModelUrl] = useState('');

  const handleGenerate = async () => {
    const res = await fetch('http://localhost:8000/generate-model', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    if (res.ok) {
      setModelUrl('http://localhost:8000/render-model');
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Text-to-CAD Generator</h1>

      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your model..."
        className="p-2 border w-full"
      />
      <button
        onClick={handleGenerate}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Generate 3D Model
      </button>

      {modelUrl && <ModelViewer modelUrl={modelUrl} />}
    </div>
  );
}
