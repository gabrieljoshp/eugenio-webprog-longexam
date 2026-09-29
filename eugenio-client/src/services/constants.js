// API base URL - point to your deployed server
// Dev: http://localhost:8000 (local server)
// Prod: https://your-server.vercel.app (deployed server)
const HOST = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export default {
  HOST,
};
