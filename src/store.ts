import { create } from "zustand";

/* ── Sample text ── */
const SAMPLE_TEXT = `The art of reading is in danger of being lost. In a world saturated with information, our attention fractures into a thousand glittering shards. We skim, we scroll, we scan—but rarely do we read. RSVP, or Rapid Serial Visual Presentation, offers a radical alternative. By displaying one word at a time at a fixed focal point, it eliminates saccadic eye movements and forces the mind into a singular stream of comprehension. The technique was first developed in cognitive psychology laboratories in the 1970s. Researchers discovered that the human visual system could process words far faster when they appeared sequentially at a single point than when the eye had to traverse lines of text. The implications were profound. Reading speeds of 500, 700, even 1000 words per minute became achievable without significant loss of comprehension. The key insight was the "Optimal Recognition Point"—a specific letter within each word where the eye naturally fixates. By aligning this anchor letter to the center of the display, recognition time drops dramatically. Punctuation and long words require slightly more processing time, so intelligent pacing systems add brief pauses after sentence boundaries and complex vocabulary. Modern implementations combine this scientific foundation with beautiful typography and smooth animations to create a meditative, almost musical reading experience. Each word arrives like a note in a composition—precise, deliberate, staccato.`;

export interface StaccatoState {
  /* ── Text ── */
  rawText: string;
  words: string[];
  setRawText: (text: string) => void;

  /* ── Playback ── */
  isReading: boolean;
  currentIndex: number;
  wpm: number;
  progress: number;
  setIsReading: (v: boolean) => void;
  toggleReading: () => void;
  setCurrentIndex: (i: number) => void;
  advanceWord: () => void;
  restart: () => void;
  setWpm: (wpm: number) => void;

  /* ── Views ── */
  showSummary: boolean;
  showSettings: boolean;
  showInput: boolean;
  showUpload: boolean;
  showInfo: boolean;
  toggleSummary: () => void;
  toggleSettings: () => void;
  setShowInput: (v: boolean) => void;
  setShowUpload: (v: boolean) => void;
  setShowInfo: (v: boolean) => void;

  /* ── AI ── */
  lastSummaryTime: number;
  setLastSummaryTime: (time: number) => void;

  /* ── Helpers ── */
  getDelayMs: () => number;
  getWordDelay: (word: string) => number;
}

export const useStaccatoStore = create<StaccatoState>((set, get) => ({
  /* ── Text ── */
  rawText: SAMPLE_TEXT,
  words: SAMPLE_TEXT.split(/\s+/).filter(Boolean),
  setRawText: (text: string) => {
    const words = text.split(/\s+/).filter(Boolean);
    set({
      rawText: text,
      words,
      currentIndex: 0,
      isReading: false,
      progress: 0,
    });
  },

  /* ── Playback ── */
  isReading: false,
  currentIndex: 0,
  wpm: 300,
  progress: 0,
  setIsReading: (v) => set({ isReading: v }),
  toggleReading: () => {
    const { isReading, words, currentIndex } = get();
    if (!isReading && currentIndex >= words.length) {
      // reset if at end
      set({ currentIndex: 0, progress: 0 });
    }
    set({ isReading: !isReading });
  },
  setCurrentIndex: (i) => {
    const { words } = get();
    set({
      currentIndex: i,
      progress: words.length > 0 ? (i / words.length) * 100 : 0,
    });
  },
  advanceWord: () => {
    const { currentIndex, words } = get();
    const next = currentIndex + 1;
    if (next >= words.length) {
      set({ isReading: false, currentIndex: words.length - 1, progress: 100 });
      return;
    }
    set({ currentIndex: next, progress: (next / words.length) * 100 });
  },
  restart: () => set({ currentIndex: 0, progress: 0, isReading: false }),
  setWpm: (wpm) => set({ wpm: Math.max(50, Math.min(1500, wpm)) }),

  /* ── Views ── */
  showSummary: false,
  showSettings: false,
  showInput: false,
  showUpload: false,
  showInfo: false,
  toggleSummary: () =>
    set((s) => ({ showSummary: !s.showSummary, showSettings: false })),
  toggleSettings: () =>
    set((s) => ({ showSettings: !s.showSettings, showSummary: false })),
  setShowInput: (v) => set({ showInput: v, isReading: false }),
  setShowUpload: (v) => set({ showUpload: v, isReading: false }),
  setShowInfo: (v) => set({ showInfo: v }),

  /* ── AI ── */
  lastSummaryTime: 0,
  setLastSummaryTime: (time) => set({ lastSummaryTime: time }),

  /* ── Helpers ── */
  getDelayMs: () => {
    const { wpm } = get();
    return (60 / wpm) * 1000;
  },
  getWordDelay: (word: string) => {
    const base = get().getDelayMs();
    const lastChar = word.slice(-1);
    if (/[.!?;]/.test(lastChar)) return base * 1.5;
    if (word.length > 8) return base * 1.2;
    return base;
  },
}));
