/**
 * Swaraj Saathi — API base URL helper
 *
 * - LOCAL DEV  : VITE_API_URL is empty → Vite proxy handles /api → localhost:8000
 * - PRODUCTION : VITE_API_URL = https://swaraj-saathi-backend.onrender.com
 *                (set in Vercel → Project → Environment Variables)
 */
export const API_BASE = import.meta.env.VITE_API_URL || '';

/** Convenience wrapper — always returns a full URL */
export const apiUrl = (path) => `${API_BASE}${path}`;
