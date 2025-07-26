import React, { useState } from "react";

const Chatbot: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [script, setScript] = useState("");

  const handleGenerate = async () => {
    setScript("[Mock] Generation not implemented");
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-[#1A1A1A] text-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Text to CAD Chatbot</h2>
      <label className="block font-semibold mb-1">Prompt</label>
      <textarea
        className="bg-[#111111] border border-[#333] text-white p-2 mb-3 w-full rounded resize-y min-h-[60px] focus:outline-none focus:ring-2 focus:ring-[#A259FF]"
        placeholder="Describe your 3D model..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={3}
      />
      <button
        className="bg-[#A259FF] text-white px-4 py-2 rounded w-full hover:opacity-90 transition"
        onClick={handleGenerate}
      >
        Generate CATIA Script
      </button>
      {script && (
        <pre className="mt-4 bg-[#111111] border border-[#333] p-3 text-sm whitespace-pre-wrap rounded">
          {script}
        </pre>
      )}
    </div>
  );
};

export default Chatbot;
