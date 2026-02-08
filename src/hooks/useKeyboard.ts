import { useEffect } from "react";
import { useStaccatoStore } from "../store";

export default function useKeyboard() {
  const {
    toggleReading,
    restart,
    toggleSettings,
    setShowInput,
    setShowUpload,
    setShowInfo,
    setWpm,
    wpm,
    showInput,
    showUpload,
    showInfo,
    showSettings,
    isReading,
    setIsReading,
  } = useStaccatoStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const isTyping =
        tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";

      // Escape always works — closes overlays or opens settings
      if (e.key === "Escape") {
        e.preventDefault();
        if (showInput) {
          useStaccatoStore.getState().setShowInput(false);
          return;
        }
        if (showUpload) {
          useStaccatoStore.getState().setShowUpload(false);
          return;
        }
        if (showInfo) {
          useStaccatoStore.getState().setShowInfo(false);
          return;
        }
        toggleSettings();
        return;
      }

      // Don't capture when typing in inputs
      if (isTyping) return;

      const anyOverlay = showSettings || showInput || showUpload || showInfo;

      switch (e.key) {
        case " ":
          e.preventDefault();
          if (anyOverlay) return;
          toggleReading();
          break;
        case "r":
        case "R":
          e.preventDefault();
          if (anyOverlay) return;
          restart();
          break;
        case "u":
        case "U":
          e.preventDefault();
          if (isReading) setIsReading(false);
          setShowUpload(true);
          break;
        case "t":
        case "T":
          e.preventDefault();
          if (isReading) setIsReading(false);
          setShowInput(true);
          break;
        case "i":
        case "I":
          e.preventDefault();
          setShowInfo(true);
          break;
        case "ArrowLeft":
          e.preventDefault();
          setWpm(wpm - 50);
          break;
        case "ArrowRight":
          e.preventDefault();
          setWpm(wpm + 50);
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [
    toggleReading,
    restart,
    toggleSettings,
    setShowInput,
    setShowUpload,
    setShowInfo,
    setWpm,
    wpm,
    showInput,
    showUpload,
    showInfo,
    showSettings,
    isReading,
    setIsReading,
  ]);
}
