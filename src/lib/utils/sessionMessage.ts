// Utility to show a session-expired message globally
export function showSessionExpiredMessage() {
  if (typeof window !== "undefined") {
    // Use localStorage to trigger a message across tabs
    localStorage.setItem("sessionExpired", Date.now().toString());
  }
}

export function listenForSessionExpired(callback: () => void) {
  if (typeof window !== "undefined") {
    window.addEventListener("storage", (event) => {
      if (event.key === "sessionExpired") {
        callback();
      }
    });
  }
}
