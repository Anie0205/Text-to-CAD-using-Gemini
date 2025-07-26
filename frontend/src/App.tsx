import React, { useEffect } from "react";
import Home from "./pages/Home";
import { pingBackend } from "./api";

const App: React.FC = () => {
  useEffect(() => {
    pingBackend()
      .then((data: any) => console.log('Backend connected:', data))
      .catch((err: any) => console.error('Backend connection failed:', err));
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#181820] to-black text-white">
      <Home />
    </div>
  );
};

export default App;
