// Utility to extract userId from JWT token in localStorage
import { jwtDecode } from "jwt-decode";

export function getUserIdFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.sub || decoded.user_id || decoded.id || null;
  } catch {
    return null;
  }
}
