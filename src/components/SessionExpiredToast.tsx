"use client";
import { useEffect, useState } from "react";
import { listenForSessionExpired } from "@/lib/utils/sessionMessage";
import { toast } from "react-hot-toast";

export default function SessionExpiredToast() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const handleSessionExpired = () => {
      if (!shown) {
        toast.error("Session expired. Please log in again.", { duration: 6000 });
        setShown(true);
      }
    };
    listenForSessionExpired(handleSessionExpired);
    // Also check immediately in case sessionExpired was set before mount
    if (typeof window !== "undefined" && localStorage.getItem("sessionExpired")) {
      handleSessionExpired();
      // Optionally clear the flag so it doesn't repeat
      localStorage.removeItem("sessionExpired");
    }
    // Cleanup
    return () => {
      setShown(false);
    };
  }, [shown]);

  return null;
}
