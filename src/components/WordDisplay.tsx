import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStaccatoStore } from "../store";
import { getAnchorIndex } from "../utils";

export default function WordDisplay() {
  const { words, currentIndex, isReading, advanceWord, getWordDelay } =
    useStaccatoStore();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const word = words[currentIndex] ?? "";
  const anchor = getAnchorIndex(word);

  /* ── RSVP tick ── */
  useEffect(() => {
    if (!isReading) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const delay = getWordDelay(word);
    timerRef.current = setTimeout(() => {
      advanceWord();
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isReading, currentIndex, word, advanceWord, getWordDelay]);

  const before = word.slice(0, anchor);
  const anchorChar = word[anchor] ?? "";
  const after = word.slice(anchor + 1);

  return (
    <div
      className="relative flex items-center justify-center w-full"
      style={{ minHeight: "12rem" }}
    >
      {/* Anchor guide line */}
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-secondary/20" />

      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentIndex}
          initial={{ y: 24, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -24, opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.05, ease: "easeOut" }}
          className="font-reader text-7xl sm:text-8xl lg:text-9xl tracking-tight select-none whitespace-nowrap
            grid items-center"
          style={{ gridTemplateColumns: "1fr auto 1fr" }}
        >
          <span className="text-primary text-right">{before}</span>
          <span className="text-accent font-bold">{anchorChar}</span>
          <span className="text-primary text-left">{after}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
