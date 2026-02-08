import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import WordDisplay from "./components/WordDisplay";
import ProgressBar from "./components/ProgressBar";
import HUD from "./components/HUD";
import Controls from "./components/Controls";
import SettingsPanel from "./components/SettingsPanel";
import InfoPanel from "./components/InfoPanel";
import FileUpload from "./components/FileUpload";
import TextInput from "./components/TextInput";
import useKeyboard from "./hooks/useKeyboard";
import useLenis from "./hooks/useLenis";
import { useStaccatoStore } from "./store";

export default function App() {
  useKeyboard();
  useLenis();
  const isReading = useStaccatoStore((s) => s.isReading);
  const showSettings = useStaccatoStore((s) => s.showSettings);
  const setShowInfo = useStaccatoStore((s) => s.setShowInfo);
  const settingsRef = useRef<HTMLDivElement>(null);
  const [headerOpacity, setHeaderOpacity] = useState(1);

  // Fade header based on scroll position
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHeaderOpacity(Math.max(0, 1 - y / 200));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll to settings when toggled open, scroll back to top when closed
  useEffect(() => {
    if (showSettings) {
      settingsRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [showSettings]);

  return (
    <div className="relative bg-bg select-none">
      {/* ── First viewport: the reading room ── */}
      <div className="relative h-dvh">
        {/* Logo */}
        <motion.header
          animate={{ opacity: isReading ? 0 : headerOpacity }}
          transition={{ duration: 0.3 }}
          className="fixed top-8 left-8 z-40"
          style={{ pointerEvents: isReading ? "none" : "auto" }}
        >
          <h1 className="font-heading text-xl tracking-tight text-primary-full/60">
            staccato
          </h1>
        </motion.header>

        {/* Info button (ⓘ) — top right */}
        <motion.button
          animate={{ opacity: isReading ? 0 : headerOpacity }}
          transition={{ duration: 0.3 }}
          onClick={() => setShowInfo(true)}
          className="fixed top-8 right-8 z-40 w-10 h-10 rounded-full
            flex items-center justify-center
            text-secondary hover:text-accent hover:bg-accent/10
            transition-colors cursor-pointer text-sm font-ui font-medium"
          style={{ pointerEvents: isReading ? "none" : "auto" }}
        >
          i
        </motion.button>

        {/* HUD */}
        <HUD />

        {/* Word display: dead-center */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <WordDisplay />
        </div>

        {/* Controls & hint */}
        <motion.div
          animate={{ opacity: isReading ? 0 : 1 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-x-0 top-[calc(50%+6rem)] flex flex-col items-center z-20"
          style={{ pointerEvents: isReading ? "none" : "auto" }}
        >
          <Controls />
          <p className="mt-6 text-xs text-muted font-ui tracking-widest">
            press <kbd className="text-secondary">space</kbd> to begin
          </p>
        </motion.div>

        {/* Progress Bar */}
        <ProgressBar />
      </div>

      {/* ── Second section: settings (scroll to reveal) ── */}
      <div
        ref={settingsRef}
        className="bg-bg-elevated/40 border-t border-secondary/10"
      >
        <SettingsPanel />
      </div>

      {/* ── Overlays (modals) ── */}
      <InfoPanel />
      <FileUpload />
      <TextInput />
    </div>
  );
}
