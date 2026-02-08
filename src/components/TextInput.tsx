import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStaccatoStore } from "../store";

export default function TextInput() {
  const { showInput, setShowInput, setRawText, rawText } = useStaccatoStore();
  const [draft, setDraft] = useState(rawText);

  // Keep draft in sync when rawText changes externally (e.g. file upload)
  useEffect(() => {
    setDraft(rawText);
  }, [rawText]);

  const handleSubmit = () => {
    if (draft.trim()) {
      setRawText(draft.trim());
    }
    setShowInput(false);
  };

  return (
    <AnimatePresence>
      {showInput && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setShowInput(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-bg/80 backdrop-blur-md" />

          {/* Panel */}
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-2xl mx-4 sm:mx-auto p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-bg-elevated/90 backdrop-blur-xl"
          >
            <h2 className="font-heading text-2xl text-primary-full mb-2 tracking-tight">
              Paste Your Text
            </h2>
            <p className="text-xs text-secondary mb-6 font-ui tracking-widest uppercase">
              Any passage, article, or chapter
            </p>

            <textarea
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Paste or type text here..."
              className="w-full h-44 sm:h-56 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-bg-surface/60 text-primary text-sm font-ui
                leading-relaxed resize-none outline-none border border-secondary/10
                focus:border-accent/30 transition-colors placeholder:text-muted"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  handleSubmit();
                }
              }}
            />

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSubmit}
                className="flex-1 py-3 rounded-xl bg-accent/15 text-accent text-sm font-ui
                  hover:bg-accent/25 transition-colors cursor-pointer"
              >
                Load Text
                <kbd className="ml-2 text-xs text-accent/50">Ctrl+Enter</kbd>
              </button>
              <button
                onClick={() => setShowInput(false)}
                className="px-6 py-3 rounded-xl text-secondary text-sm font-ui
                  hover:text-primary hover:bg-secondary/10 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
