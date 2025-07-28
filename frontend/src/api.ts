import axios from "axios";

// Base API setup (adjust if you're deploying)
export const API = axios.create({
  baseURL: "https://text-to-cad-using-gemini.onrender.com", // or http://localhost:8000 for local dev
});

// Hit /generate-models endpoint with a prompt
export const generateScript = async (prompt: string) => {
  const res = await API.post("/generate-models", { prompt });
  return res.data;
};

// Ping endpoint to check server status
export const pingBackend = async () => {
  const res = await API.get("/ping");
  return res.data;
};
