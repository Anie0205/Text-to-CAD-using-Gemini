// src/api.ts
import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const generateScript = async (size: string, fillet: string) => {
  const res = await API.post("/generate", { size, fillet });
  return res.data;
};
