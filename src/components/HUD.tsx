import { motion } from "framer-motion";
import { useStaccatoStore } from "../store";

export default function HUD() {
  const { wpm, currentIndex, words, isReading, progress } = useStaccatoStore();

  return (
    <motion.div
      animate={{ opacity: isReading ? 0 : 1 }}
      transition={{ duration: 0.3 }}
      className="fixed top-10 left-0 right-0 flex justify-center gap-8 sm:gap-12 px-4 font-ui text-sm sm:text-sm tracking-widest text-secondary select-none z-30"
      style={{ pointerEvents: isReading ? "none" : "auto" }}
    >
      <span>
        <span className="text-primary-full font-medium">{wpm}</span> wpm
      </span>
      <span>
        <span className="text-primary-full font-medium">
          {currentIndex + 1}
        </span>
        <span className="text-muted"> / {words.length}</span>
      </span>
      <span>
        <span className="text-primary-full font-medium">
          {Math.round(progress)}
        </span>
        %
      </span>
    </motion.div>
  );
}
