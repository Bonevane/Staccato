import { useStaccatoStore } from "../store";

export default function SettingsPanel() {
  const { wpm, setWpm } = useStaccatoStore();

  return (
    <section className="w-full max-w-2xl mx-auto px-5 sm:px-6 py-12 sm:py-20">
      <h2 className="font-heading text-3xl sm:text-5xl text-primary-full mb-6 sm:mb-10 tracking-tight">
        Settings
      </h2>

      {/* WPM Slider */}
      <div className="space-y-4">
        <label className="flex items-center justify-between text-sm text-secondary">
          <span>Reading Speed</span>
          <span className="text-accent font-medium text-lg">{wpm} wpm</span>
        </label>

        <input
          type="range"
          min={50}
          max={1200}
          step={25}
          value={wpm}
          onChange={(e) => setWpm(Number(e.target.value))}
          className="w-full h-1 bg-secondary/30 rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-accent
            [&::-webkit-slider-thumb]:shadow-lg
          "
        />

        <div className="flex justify-between text-xs text-muted font-ui">
          <span>50</span>
          <span>300</span>
          <span>600</span>
          <span>900</span>
          <span>1200</span>
        </div>
      </div>

      {/* WPM presets */}
      <div className="grid grid-cols-3 sm:flex gap-2 mt-6">
        {[150, 250, 300, 450, 600, 900].map((v) => (
          <button
            key={v}
            onClick={() => setWpm(v)}
            className={`sm:flex-1 py-2 rounded-xl text-xs font-ui transition-all cursor-pointer ${
              wpm === v
                ? "bg-accent/20 text-accent border border-accent/20"
                : "text-secondary hover:text-primary hover:bg-secondary/10"
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Shortcuts reference */}
      <div className="mt-8 sm:mt-10 pt-6 border-t border-secondary/15 hidden sm:block">
        <p className="text-xs text-secondary mb-3 uppercase tracking-widest">
          Keyboard
        </p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            ["Space", "Play / Pause"],
            ["R", "Restart"],
            ["U", "Upload File"],
            ["T", "Paste Text"],
            ["I", "What is RSVP?"],
            ["Esc", "Settings"],
            ["← →", "±50 wpm"],
          ].map(([key, desc]) => (
            <div key={key} className="flex items-center gap-2">
              <kbd className="px-2 py-0.5 rounded-md bg-bg text-accent/70 text-xs font-mono">
                {key}
              </kbd>
              <span className="text-secondary text-xs">{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
