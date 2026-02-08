import { motion } from "framer-motion";
import { useStaccatoStore } from "../store";

export default function ProgressBar() {
  const progress = useStaccatoStore((s) => s.progress);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-1 bg-bg-elevated z-50">
      <motion.div
        className="h-full bg-accent/60 rounded-r-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.15, ease: "linear" }}
      />
    </div>
  );
}
