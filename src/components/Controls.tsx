import { useStaccatoStore } from "../store";

export default function Controls() {
  const {
    toggleReading,
    restart,
    toggleSettings,
    setShowInput,
    setShowUpload,
  } = useStaccatoStore();

  const btn =
    "px-4 py-2 rounded-xl text-sm font-ui tracking-wide transition-all duration-200 cursor-pointer select-none";
  const primary = `${btn} bg-accent/10 text-accent hover:bg-accent/20 border border-accent/10`;
  const ghost = `${btn} text-secondary hover:text-primary hover:bg-secondary/10`;

  return (
    <div className="flex flex-wrap justify-center gap-3 z-40">
      <button onClick={toggleReading} className={primary}>
        ▶ Play
        <kbd className="ml-2 text-xs text-accent/50">Space</kbd>
      </button>
      <button onClick={restart} className={ghost}>
        ↺ Restart
        <kbd className="ml-2 text-xs text-secondary/50">R</kbd>
      </button>
      <button onClick={() => setShowUpload(true)} className={ghost}>
        ⬆ Upload
        <kbd className="ml-2 text-xs text-secondary/50">U</kbd>
      </button>
      <button onClick={() => setShowInput(true)} className={ghost}>
        ✎ Text
        <kbd className="ml-2 text-xs text-secondary/50">T</kbd>
      </button>
      <button onClick={toggleSettings} className={ghost}>
        ⚙ Settings
        <kbd className="ml-2 text-xs text-secondary/50">Esc</kbd>
      </button>
    </div>
  );
}
