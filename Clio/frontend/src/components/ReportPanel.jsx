import { useState } from "react";
import Semaphore, { renderHighlightedText } from "./Semaphore";
import Button from "../common/Button";

const buildReportText = ({ verdict, explanation, keyTerms, indicators }) => {
  const text = [
    "Reporte final de resultados",
    `Veredicto: ${verdict}`,
    "",
    "Explicación:",
    explanation,
  ];

  if (keyTerms?.length) {
    text.push("", "Términos clave:", keyTerms.join(", "));
  }

  if (indicators?.length) {
    text.push("", "Indicadores:", ...indicators.map((item) => `- ${item}`));
  }

  return text.join("\n");
};

const ReportPanel = ({ report, onReset }) => {
  const [copyState, setCopyState] = useState("idle");

  if (!report) return null;

  const { verdict, explanation, keyTerms, indicators } = report;

  const handleCopy = async () => {
    const text = buildReportText(report);

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      setCopyState("copied");
    } catch {
      setCopyState("error");
    }

    window.setTimeout(() => {
      setCopyState("idle");
    }, 1800);
  };

  return (
    <div className="mt-8 rounded-3xl bg-white p-6 shadow-[0_8px_30px_-12px_rgba(91,55,35,0.15)]">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
        <section className="rounded-3xl border border-[#e8ddd0] bg-[#fcfaf7] p-5">
          <div className="mb-4">
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#a78a6f]">
              Semáforo
            </span>
            <h2 className="mt-2 text-lg font-semibold text-[#5b3f2d]">
              Evaluación inmediata
            </h2>
          </div>
          <Semaphore verdict={verdict} />
        </section>

        <section className="rounded-3xl border border-[#e8ddd0] bg-[#fcfaf7] p-5">
          <div className="mb-4">
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#a78a6f]">
              Explicación
            </span>
            <h2 className="mt-2 text-lg font-semibold text-[#5b3f2d]">
              Qué se detectó en el contenido
            </h2>
          </div>
          <div className="space-y-4 text-sm leading-7 text-[#6e5544]">
            <p>{renderHighlightedText(explanation, keyTerms)}</p>

            {indicators?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#a78a6f]">
                  Indicadores
                </h3>
                <ul className="mt-3 space-y-2">
                  {indicators.map((indicator) => (
                    <li
                      key={indicator}
                      className="flex items-start gap-3 rounded-2xl bg-[#fff8f3] p-3 text-sm text-[#705944]"
                    >
                      <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#e8d7c1] text-xs font-semibold text-[#7b5d42]">
                        ✓
                      </span>
                      <span>{indicator}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {keyTerms?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#a78a6f]">
                  Términos clave
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {keyTerms.map((term) => (
                    <span
                      key={term}
                      className="rounded-full bg-[#f2ede6] px-3 py-1 text-sm font-medium text-[#5b3f2d]"
                    >
                      {term}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={handleCopy} type="button">
          <span className="mr-2 text-base">
            {copyState === "copied" ? "✅" : "📋"}
          </span>
          {copyState === "copied" ? "Reporte copiado" : "Copiar reporte"}
        </Button>

        <Button variant="primary" onClick={onReset} type="button">
          Nuevo análisis
        </Button>
      </div>
    </div>
  );
};

export default ReportPanel;