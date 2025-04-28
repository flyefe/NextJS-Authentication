import { useEffect, useState } from "react";
import axiosInstance from "@/lib/utils/axiosInstance";

export interface Country {
  _id: string;
  name: string;
  code?: string;
  createdAt?: string;
  updatedAt?: string;
}

export function useCountries() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    setError("");
    axiosInstance
      .get("/api/admin/countries", { withCredentials: true })
      .then((res: { data: { countries?: Country[] } }) => {
        setCountries(res.data.countries || []);
      })
      .catch((err: any) => {
        setError(
          err.response?.data?.error || err.message || "Failed to fetch countries"
        );
        setCountries([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return { countries, loading, error };
}
