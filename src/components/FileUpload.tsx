import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Loader2 } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useStaccatoStore } from "../store";

type Mode = "extract" | "summarize";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

async function summarizeWithGemini(text: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key is not configured.");
  }
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  const prompt = `Summarize the following text for an RSVP speed-reading application. 
  Create a detailed but flowing summary that captures the information fully. 
  Output only the summarized text, avoiding lists or formatting. 
  
  Text to summarize:
  ${text}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

async function extractTextFromPdf(file: File): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");
  // Set worker source to a local path or a more reliable CDN version
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({
    data: arrayBuffer,
    useWorkerFetch: false,
    isEvalSupported: false,
  });

  const pdf = await loadingTask.promise;
  const pages: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map((item: any) => item.str || "").join(" ");
    pages.push(text);
  }

  return pages.join("\n\n");
}

async function extractTextFromDocx(file: File): Promise<string> {
  const mammoth = await import("mammoth");
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

export default function FileUpload() {
  const {
    showUpload,
    setShowUpload,
    setRawText,
    lastSummaryTime,
    setLastSummaryTime,
  } = useStaccatoStore();
  const [mode, setMode] = useState<Mode>("extract");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setFileName(file.name);

    if (mode === "summarize") {
      if (file.size > 10 * 1024 * 1024) {
        setError("Summarization is limited to files under 10MB.");
        return;
      }

      const now = Date.now();
      const secondsSinceLast = (now - lastSummaryTime) / 1000;
      if (secondsSinceLast < 30) {
        const remaining = Math.ceil(30 - secondsSinceLast);
        setError(`Please wait ${remaining}s before another summary.`);
        return;
      }
    }

    setLoading(true);
    setStatus("Extracting text...");

    try {
      let text = "";
      const ext = file.name.split(".").pop()?.toLowerCase();

      if (ext === "pdf") {
        text = await extractTextFromPdf(file);
      } else if (ext === "docx") {
        text = await extractTextFromDocx(file);
      } else if (ext === "txt" || ext === "md") {
        text = await file.text();
      } else {
        setError("Unsupported file type. Use PDF, DOCX, or TXT.");
        setLoading(false);
        return;
      }

      if (!text.trim()) {
        setError("No text could be extracted from this file.");
        setLoading(false);
        return;
      }

      // ONLY call Gemini if the user explicitly selected Summarize mode
      if (mode === "summarize") {
        setStatus("Summarizing with Gemini...");
        text = await summarizeWithGemini(text);
        setLastSummaryTime(Date.now()); // Record success time
      }

      setRawText(text);
      setShowUpload(false);
      setFileName(null);
    } catch (err: any) {
      console.error(err);
      if (
        mode === "summarize" &&
        (err.message?.includes("API key") ||
          err.message?.includes("configured"))
      ) {
        setError("Invalid or missing Gemini API key.");
      } else {
        setError("Failed to process file. Please try again.");
      }
    } finally {
      setLoading(false);
      setStatus("");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <AnimatePresence>
      {showUpload && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setShowUpload(false)}
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
            <h2 className="font-heading text-2xl text-primary-full mb-2 tracking-tight">
              Upload Document
            </h2>
            <p className="text-xs text-secondary mb-6 font-ui tracking-widest uppercase">
              PDF, DOCX, or TXT
            </p>

            {/* Mode toggle */}
            <div className="flex gap-2 mb-6">
              {(["extract", "summarize"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-ui transition-all cursor-pointer capitalize ${
                    mode === m
                      ? "bg-accent/20 text-accent border border-accent/20"
                      : "text-secondary hover:text-primary hover:bg-secondary/10"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted mb-6 font-ui">
              {mode === "extract"
                ? "Load the full text from the document for reading."
                : "Extract key sentences and load a condensed version. Uses Gemini."}
            </p>

            {/* Drop zone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-3 p-6 sm:p-10 rounded-2xl
                border-2 border-dashed border-secondary/20 hover:border-accent/30
                bg-bg-surface/40 hover:bg-bg-surface/60 transition-colors cursor-pointer"
            >
              <span className="text-3xl">
                {loading ? (
                  <Loader2 className="w-10 h-10 text-accent animate-spin" />
                ) : (
                  <FileText className="w-10 h-10 text-secondary" />
                )}
              </span>
              <p className="text-sm text-secondary font-ui">
                {loading
                  ? status
                  : fileName
                    ? fileName
                    : "Drop a file here or click to browse"}
              </p>
            </div>

            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.docx,.txt,.md"
              onChange={handleInputChange}
              className="hidden"
            />

            {error && (
              <p className="mt-4 text-sm text-accent font-ui">{error}</p>
            )}

            <button
              onClick={() => setShowUpload(false)}
              className="mt-6 w-full py-3 rounded-xl text-secondary text-sm font-ui
                hover:text-primary hover:bg-secondary/10 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
