import { useState, useEffect } from "react";
import axiosInstance from "@/lib/utils/axiosInstance";

export interface User {
  _id?: string;
  username?: string;
  email?: string;
  isVerified?: boolean;
  isAdmin?: boolean;
  profile?: {
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
  };
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/api/users/me");
      if (response.data && response.data.status && response.data.data) {
        setUser(response.data.data);
      } else {
        setUser(null);
      }
    } catch (err: any) {
      setUser(null);
      setError(err.message || "Failed to fetch user");
    } finally {
      setLoading(false);
    }
  };

  // Listen for login/logout events via localStorage
  useEffect(() => {
    fetchUser();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "userChanged") {
        fetchUser();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return { user, loading, error };
}

