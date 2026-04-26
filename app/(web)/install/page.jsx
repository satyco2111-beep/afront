"use client";

import { useEffect, useState } from "react";

export default function InstallPage() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Capture install prompt
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Detect if already installed
    window.addEventListener("appinstalled", () => {
      setInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === "accepted") {
      console.log("User accepted install");
    } else {
      console.log("User dismissed install");
    }

    setDeferredPrompt(null);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Install App in mobile</h1>

      {installed ? (
        <p style={styles.text}>✅ App already installed</p>
      ) : deferredPrompt ? (
        <button style={styles.button} onClick={handleInstall}>
          Install App
        </button>
      ) : (
        <p style={styles.text}>
          Install option not available (already installed or unsupported browser or you in computer browser)
        </p>
      )}
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
  },
  button: {
    padding: "12px 24px",
    fontSize: "16px",
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  text: {
    fontSize: "16px",
    color: "#555",
  },
};