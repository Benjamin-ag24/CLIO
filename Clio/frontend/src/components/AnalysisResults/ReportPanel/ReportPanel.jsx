import { useState } from "react";
import Semaphore, { renderHighlightedText } from "../Semaphore/Semaphore";
import Button from "../../../common/Button";
import { analysisCopy } from "../../../constants/analysisConstants";
import {
  panelContainerStyles,
  gridStyles,
  sectionCardStyles,
  sectionHeaderStyles,
  sectionLabelStyles,
  sectionTitleStyles,
  explanationWrapperStyles,
  indicatorsTitleStyles,
  indicatorsListStyles,
  indicatorItemStyles,
  indicatorIconStyles,
  keyTermsTitleStyles,
  keyTermsListStyles,
  keyTermBadgeStyles,
  actionsRowStyles,
  copyIconStyles,
} from "./ReportPanel.styles";

const buildReportText = ({ verdict, explanation, keyTerms, indicators }) => {
  const text = [
    analysisCopy.reportPanel.copy.defaultTitle,
    `${analysisCopy.reportPanel.copy.verdictPrefix} ${verdict}`,
    "",
    analysisCopy.reportPanel.copy.explanationLabel,
    explanation,
  ];

  if (keyTerms?.length) {
    text.push(
      "",
      analysisCopy.reportPanel.copy.keyTermsLabel,
      keyTerms.join(", "),
    );
  }

  if (indicators?.length) {
    text.push(
      "",
      analysisCopy.reportPanel.copy.indicatorsLabel,
      ...indicators.map((item) => `- ${item}`),
    );
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
    <div className={panelContainerStyles}>
      <div className={gridStyles}>
        <section className={sectionCardStyles}>
          <div className={sectionHeaderStyles}>
            <span className={sectionLabelStyles}>
              {analysisCopy.reportPanel.sections.semaphore.label}
            </span>
            <h2 className={sectionTitleStyles}>
              {analysisCopy.reportPanel.sections.semaphore.title}
            </h2>
          </div>
          <Semaphore verdict={verdict} />
        </section>

        <section className={sectionCardStyles}>
          <div className={sectionHeaderStyles}>
            <span className={sectionLabelStyles}>
              {analysisCopy.reportPanel.sections.explanation.label}
            </span>
            <h2 className={sectionTitleStyles}>
              {analysisCopy.reportPanel.sections.explanation.title}
            </h2>
          </div>
          <div className={explanationWrapperStyles}>
            <p>{renderHighlightedText(explanation, keyTerms)}</p>

            {indicators?.length > 0 && (
              <div>
                <h3 className={indicatorsTitleStyles}>
                  {analysisCopy.reportPanel.sections.indicators}
                </h3>
                <ul className={indicatorsListStyles}>
                  {indicators.map((indicator) => (
                    <li
                      key={indicator}
                      className={indicatorItemStyles}
                    >
                      <span className={indicatorIconStyles}>
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
                <h3 className={keyTermsTitleStyles}>
                  {analysisCopy.reportPanel.sections.keyTerms}
                </h3>
                <div className={keyTermsListStyles}>
                  {keyTerms.map((term) => (
                    <span
                      key={term}
                      className={keyTermBadgeStyles}
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

      <div className={actionsRowStyles}>
        <Button variant="secondary" onClick={handleCopy} type="button">
          <span className={copyIconStyles}>
            {copyState === "copied" ? "✅" : "📋"}
          </span>
          {copyState === "copied"
            ? analysisCopy.reportPanel.copy.copied
            : analysisCopy.reportPanel.copy.button}
        </Button>

        <Button variant="primary" onClick={onReset} type="button">
          {analysisCopy.reportPanel.copy.newAnalysis}
        </Button>
      </div>
    </div>
  );
};

export default ReportPanel;