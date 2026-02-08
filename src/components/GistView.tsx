import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStaccatoStore } from "../store";
import { extractSummary } from "../utils";

export default function GistView() {
  const { showSummary, toggleSummary, rawText } = useStaccatoStore();
  const bullets = useMemo(() => extractSummary(rawText), [rawText]);

  return (
    <AnimatePresence>
      {showSummary && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={toggleSummary}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-bg/80 backdrop-blur-md" />

          {/* Card stack */}
          <motion.div
            initial={{ scale: 0.92, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 30 }}
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-2xl max-h-[80vh] p-8 rounded-3xl bg-bg-elevated/90
              backdrop-blur-xl overflow-y-auto"
          >
            <h2 className="font-heading text-3xl text-primary-full mb-2 tracking-tight">
              Gist View
            </h2>
            <p className="text-xs text-secondary mb-8 font-ui tracking-widest uppercase">
              Key Takeaways
            </p>

            <div className="space-y-4">
              {bullets.map((bullet, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20, y: 10 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.3 }}
                  className="flex gap-4 p-4 rounded-2xl bg-bg-surface/60 hover:bg-bg-surface/80 transition-colors"
                >
                  <span
                    className="flex-shrink-0 w-7 h-7 rounded-full bg-accent/15 text-accent
                    text-xs font-ui flex items-center justify-center mt-0.5"
                  >
                    {i + 1}
                  </span>
                  <p className="text-primary text-sm leading-relaxed font-ui">
                    {bullet}
                  </p>
                </motion.div>
              ))}
            </div>

            <button
              onClick={toggleSummary}
              className="mt-8 w-full py-3 rounded-xl bg-accent/10 text-accent text-sm font-ui
                hover:bg-accent/20 transition-colors cursor-pointer"
            >
              Close
              <kbd className="ml-2 text-xs text-accent/50">S</kbd>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
