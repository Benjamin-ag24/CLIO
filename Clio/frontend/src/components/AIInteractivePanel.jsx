import { forwardRef, useState } from "react";
import Button from "../common/Button";
import { analysisCopy } from "../constants/analysisConstants";

const AIInteractivePanel = forwardRef(
  ({ content, onChange, onClear, onAnalyze, characterCount }, ref) => {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const maxLength = 5000;

    const handleAnalyze = async () => {
      if (!content.trim()) {
        setError(analysisCopy.inputPanel.validation.empty);
        return;
      }

      if (content.trim().length < 10) {
        setError(analysisCopy.inputPanel.validation.short);
        return;
      }

      setError("");
      setIsLoading(true);

      try {
        await onAnalyze();
      } finally {
        setIsLoading(false);
      }
    };

    const handleClear = () => {
      setError("");
      onClear();

      if (ref?.current) {
        ref.current.focus();
      }
    };

    return (
      <div className="rounded-3xl bg-white p-6 shadow-[0_8px_30px_-12px_rgba(91,55,35,0.15)]">
        <div className="space-y-4">
          <div>
            <p className="mt-1 text-sm text-[#7b5f49]">
              {analysisCopy.inputPanel.helperText}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5b3f2d] mb-1">
              {analysisCopy.inputPanel.title}
            </label>

            <textarea
              ref={ref}
              value={content}
              onChange={(e) => {
                onChange(e.target.value);
                if (error) setError("");
              }}
              placeholder={analysisCopy.inputPanel.placeholder}
              className="w-full rounded-2xl border border-[#e8ddd0] p-4 text-[#5b3f2d] placeholder-[#b8a392] focus:border-[#7fb3d1] focus:outline-none focus:ring-2 focus:ring-[#7fb3d1]/30 transition-all min-h-[120px] resize-y"
              maxLength={maxLength}
            />

            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-[#b8a392]">
                {characterCount} / {maxLength}
              </span>

              {error && (
                <span
                  className={`text-sm ${
                    error.includes("corto") ? "text-yellow-600" : "text-red-600"
                  }`}
                >
                  {error}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleAnalyze}
              disabled={isLoading || !content.trim()}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {analysisCopy.inputPanel.buttons.analyzing}
                </span>
              ) : (
                analysisCopy.inputPanel.buttons.analyze
              )}
            </Button>

            <Button variant="secondary" onClick={handleClear}>
              {analysisCopy.inputPanel.buttons.clear}
            </Button>
          </div>
        </div>
      </div>
    );
  },
);

AIInteractivePanel.displayName = "AIInteractivePanel";

export default AIInteractivePanel;