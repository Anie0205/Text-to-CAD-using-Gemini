import React, { useEffect } from "react";
import Home from "./pages/Home";

const App: React.FC = () => {
  useEffect(() => {
    fetch('http://localhost:8000/ping')
      .then(res => res.json())
      .then(data => console.log(data));
  }, []);
  return (
    <div className="min-h-screen bg-white text-black">
      <Home />
    </div>
  );
};

export default App;
