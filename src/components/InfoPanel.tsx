import { motion, AnimatePresence } from "framer-motion";
import { useStaccatoStore } from "../store";

export default function InfoPanel() {
  const { showInfo, setShowInfo } = useStaccatoStore();

  return (
    <AnimatePresence>
      {showInfo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setShowInfo(false)}
        >
          <div className="absolute inset-0 bg-bg/80 backdrop-blur-md" />

          <motion.div
            initial={{ scale: 0.95, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 16 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-lg mx-4 sm:mx-auto p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-bg-elevated/90 backdrop-blur-xl"
          >
            <h2 className="font-heading text-2xl text-primary-full mb-4 tracking-tight">
              What is RSVP?
            </h2>

            <div className="space-y-4 text-sm text-primary leading-relaxed font-ui">
              <p>
                <span className="text-accent font-medium">RSVP</span> stands for{" "}
                <span className="text-primary-full">
                  Rapid Serial Visual Presentation
                </span>
                . It displays one word at a time at a fixed point on screen, so
                your eyes never need to move.
              </p>
              <p>
                Traditional reading requires your eyes to jump across lines of
                text (called{" "}
                <span className="text-secondary italic">saccades</span>). RSVP
                eliminates this entirely, letting your brain focus purely on
                comprehension.
              </p>
              <p>
                The highlighted letter in each word is the{" "}
                <span className="text-accent font-medium">
                  Optimal Recognition Point
                </span>
                — the character your eye naturally fixates on. Aligning it to
                the center of the display speeds up word recognition.
              </p>
              <p className="text-secondary text-xs pt-2">
                Speeds of 300–600+ wpm are comfortably achievable with practice.
              </p>
            </div>

            <button
              onClick={() => setShowInfo(false)}
              className="mt-8 w-full py-3 rounded-xl bg-accent/10 text-accent text-sm font-ui
                hover:bg-accent/20 transition-colors cursor-pointer"
            >
              Got it
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
