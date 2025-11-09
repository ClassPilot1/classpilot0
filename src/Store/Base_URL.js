export const BASE_URL = import.meta.env.PROD 
  ? "https://classpilot-chi.vercel.app/api"   // your backend
  : "http://localhost:5000/api";              // local dev
