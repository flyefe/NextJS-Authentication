import { useState, useEffect } from "react";
import axios from "axios";

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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.post("/api/users/me");
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
    fetchUser();
  }, []);

  return { user, loading, error };
}
