// src/api.ts
import axios from "axios";

export const API = axios.create({
  baseURL: "https://text-to-cad-using-gemini.onrender.com",
});

export const generateScript = async (prompt: string) => {
  const res = await API.post("/generate-models", { prompt });
  return res.data;
};

export const pingBackend = async () => {
  const res = await API.get("/ping");
  return res.data;
};
