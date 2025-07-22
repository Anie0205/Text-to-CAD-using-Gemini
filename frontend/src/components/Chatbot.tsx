import React, { useState } from "react";
import { generateScript } from "../api";

const Chatbot: React.FC = () => {
  const [size, setSize] = useState("30");
  const [fillet, setFillet] = useState("5");
  const [script, setScript] = useState("");

  const handleGenerate = async () => {
    const data = await generateScript(size, fillet);
    setScript(data.script || "Failed to generate");
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-2">Text to CAD Chatbot</h2>
      <input
        className="border p-2 mb-2 w-full"
        placeholder="Size in mm"
        value={size}
        onChange={(e) => setSize(e.target.value)}
      />
      <input
        className="border p-2 mb-2 w-full"
        placeholder="Fillet in mm"
        value={fillet}
        onChange={(e) => setFillet(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleGenerate}
      >
        Generate CATIA Script
      </button>

      {script && (
        <pre className="mt-4 bg-gray-100 p-2 text-sm whitespace-pre-wrap">
          {script}
        </pre>
      )}
    </div>
  );
};

export default Chatbot;
