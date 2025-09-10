import { useState, useEffect } from "react";
import { getCurrentUser } from "../api/auth.api";
import { useAuthContext } from "@/providers/AuthProvider";

export const useAuth = () => {
  const { token } = useAuthContext();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await getCurrentUser();
        setUser(userData);
        setError(null);
      } catch (err) {
        setError("Failed to fetch user data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  return { user, error, loading };
};
