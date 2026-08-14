import { forwardRef, useState } from "react";
import Button from "../../common/Button";
import { analysisCopy } from "../../constants/analysisConstants";
import {
  panelContainerStyles,
  contentWrapperStyles,
  helperTextStyles,
  labelStyles,
  textareaStyles,
  counterRowStyles,
  characterCountStyles,
  errorWarningStyles,
  errorDangerStyles,
  buttonsRowStyles,
  analyzeButtonStyles,
  loadingContentStyles,
  spinnerStyles,
  spinnerTrackStyles,
  spinnerFillStyles,
} from "./AIInteractivePanel.styles";

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
      <div className={panelContainerStyles}>
        <div className={contentWrapperStyles}>
          <div>
            <p className={helperTextStyles}>
              {analysisCopy.inputPanel.helperText}
            </p>
          </div>

          <div>
            <label className={labelStyles}>
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
              className={textareaStyles}
              maxLength={maxLength}
            />

            <div className={counterRowStyles}>
              <span className={characterCountStyles}>
                {characterCount} / {maxLength}
              </span>

              {error && (
                <span
                  className={
                    error.includes("corto") ? errorWarningStyles : errorDangerStyles
                  }
                >
                  {error}
                </span>
              )}
            </div>
          </div>

          <div className={buttonsRowStyles}>
            <Button
              variant="primary"
              className={analyzeButtonStyles}
              onClick={handleAnalyze}
              disabled={isLoading || !content.trim()}
            >
              {isLoading ? (
                <span className={loadingContentStyles}>
                  <svg
                    className={spinnerStyles}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className={spinnerTrackStyles}
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className={spinnerFillStyles}
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