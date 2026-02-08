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
    "px-3 py-2 sm:px-4 rounded-xl text-xs sm:text-sm font-ui tracking-wide transition-all duration-200 cursor-pointer select-none";
  const primary = `${btn} bg-accent/10 text-accent hover:bg-accent/20 border border-accent/10`;
  const ghost = `${btn} text-secondary hover:text-primary hover:bg-secondary/10`;

  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 px-4 z-40">
      <button onClick={toggleReading} className={primary}>
        ▶ Play
        <kbd className="ml-2 text-xs text-accent/50 hidden sm:inline">
          Space
        </kbd>
      </button>
      <button onClick={restart} className={ghost}>
        ↺ Restart
        <kbd className="ml-2 text-xs text-secondary/50 hidden sm:inline">R</kbd>
      </button>
      <button onClick={() => setShowUpload(true)} className={ghost}>
        ⬆ Upload
        <kbd className="ml-2 text-xs text-secondary/50 hidden sm:inline">U</kbd>
      </button>
      <button onClick={() => setShowInput(true)} className={ghost}>
        ✎ Text
        <kbd className="ml-2 text-xs text-secondary/50 hidden sm:inline">T</kbd>
      </button>
      <button onClick={toggleSettings} className={ghost}>
        ⚙ Settings
        <kbd className="ml-2 text-xs text-secondary/50 hidden sm:inline">
          Esc
        </kbd>
      </button>
    </div>
  );
}
