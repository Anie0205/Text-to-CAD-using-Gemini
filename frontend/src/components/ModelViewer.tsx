import React from "react";

type ModelViewerProps = {
  modelUrl: string;
};

const ModelViewer: React.FC<ModelViewerProps> = ({ modelUrl }) => {
  return (
    <div className="w-full h-96 border mt-4">
      <iframe
        src={modelUrl}
        title="3D Model Viewer"
        className="w-full h-full"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default ModelViewer;
