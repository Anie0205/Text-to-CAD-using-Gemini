import React, { useState } from "react";
// import { generateScript } from "../api";

const Chatbot: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [script, setScript] = useState("");

  const handleGenerate = async () => {
    // Replace with your backend call that accepts only prompt
    // Example:
    // const data = await generateScript(prompt);
    // setScript(data.script || "Failed to generate");
    setScript("[Mock] Generation not implemented");
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Text to CAD Chatbot</h2>
      <label className="block font-semibold mb-1">Prompt</label>
      <textarea
        className="border p-2 mb-3 w-full rounded resize-y min-h-[60px]"
        placeholder="Describe your 3D model..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={3}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        onClick={handleGenerate}
      >
        Generate CATIA Script
      </button>
      {script && (
        <pre className="mt-4 bg-gray-100 p-2 text-sm whitespace-pre-wrap rounded">
          {script}
        </pre>
      )}
    </div>
  );
};

export default Chatbot;
