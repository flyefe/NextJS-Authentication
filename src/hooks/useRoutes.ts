import { useEffect, useState } from "react";
import axios from "axios";

export interface Route {
  _id?: string;
  routeName?: string;
  scope?: "local" | "international";
  routeType?: "intra-city" | "inter-city" | null;
  category?: "import" | "export";
  originCountry?: string | { _id: string; name: string };
  destinationCountry?: string | { _id: string; name: string };
  originCity?: string;
  destinationCity?: string;
  originAddress?: string;
  destinationAddress?: string;
  shippingOptionConfig?: {
    availableOptions?: {
      expressRate?: any;
      fastTrackRate?: any;
      consoleRate?: any;
      seaRate?: any;
    };
  };
  exchangeRate?: number; // <--- Added this line
  currency?: string;
  active?: boolean;
  createdBy?: any;
  updatedBy?: any;
  updatedAt?: string;
  goodsCategory?: string[]; // <--- Added this line to fix the error
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
