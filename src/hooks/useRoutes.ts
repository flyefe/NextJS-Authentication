import { useEffect, useState } from "react";
import axios from "axios";

export interface Route {
  _id?: string;
  routeName?: string;
  scope?: string;
  routeType?: string | null;
  category?: string;
  originCountry?: string | { _id: string; name: string };
  originCity?: string;
  destinationCountry?: string | { _id: string; name: string };
  destinationCity?: string;
  shippingOptionConfig?: any;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: any;
  updatedBy?: any;
}

export function useRoutes() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    setError("");
    axios
      .get("/api/admin/routes", { withCredentials: true })
      .then((res) => {
        setRoutes(res.data.routes || []);
      })
      .catch((err) => {
        setError(
          err.response?.data?.error || err.message || "Failed to fetch routes"
        );
        setRoutes([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return { routes, loading, error };
}
