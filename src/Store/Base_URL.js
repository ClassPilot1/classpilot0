/**
 * Base URL Configuration / Qaybta Qaabeynta URL-ka Aasaasiga ah
 * API base URL - uses production URL for Netlify deployment
 * URL-ka aasaasiga ah ee API - wuxuu adeegsanayaa URL-ka production-ka Netlify deployment-ka
 */
export const BASE_URL = import.meta.env.PROD 
  ? "https://classpilot-chi.vercel.app/api"
  : "/api";

