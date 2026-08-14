import { analysisCopy } from "../../../constants/analysisConstants";
import { levels, verdictMap } from "./constantsForSemaphore";
import {
  highlightedTermStyles,
  wrapperStyles,
  cardStyles,
  leftSectionStyles,
  levelsColumnStyles,
  levelDotBaseStyles,
  levelDotInactiveStyles,
  verdictLabelBaseStyles,
  verdictHintStyles,
  immediateBoxBaseStyles,
  immediateTitleBaseStyles,
  immediateDescriptionBaseStyles,
} from "./Semaphore.styles";

const renderHighlightedText = (text, terms) => {
  if (!terms?.length) return text;

  const regex = new RegExp(
    `(${terms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "gi",
  );
  const chunks = text.split(regex);

  return chunks.map((chunk, index) => {
    const match = terms.find(
      (term) => term.toLowerCase() === chunk.toLowerCase(),
    );
    if (match) {
      return (
        <span
          key={index}
          className={highlightedTermStyles}
        >
          {chunk}
        </span>
      );
    }
    return <span key={index}>{chunk}</span>;
  });
};

const Semaphore = ({ verdict = "dudoso" }) => {
  const config = verdictMap[verdict] || verdictMap.dudoso;

  return (
    <div className={wrapperStyles}>
      <div className={cardStyles}>
        <div className={leftSectionStyles}>
          <div className={levelsColumnStyles}>
            {levels.map((level) => {
              const active = level.key === verdict;
              return (
                <span
                  key={level.key}
                  className={`${levelDotBaseStyles} ${
                    active ? level.color : levelDotInactiveStyles
                  }`}
                />
              );
            })}
          </div>

          <div>
            <div className={`${verdictLabelBaseStyles} ${config.text}`}>
              {config.label}
            </div>
            <p className={verdictHintStyles}>{config.hint}</p>
          </div>
        </div>

        <div
          className={`${immediateBoxBaseStyles} ${config.bg} ${config.ring} border ${config.ring}`}
        >
          <p className={`${immediateTitleBaseStyles} ${config.text}`}>
            {config.immediate || analysisCopy.verdicts.veraz.immediate}
          </p>
          <p className={`${immediateDescriptionBaseStyles} ${config.text}`}>
            {config.immediateDescription ||
              analysisCopy.verdicts.veraz.immediateDescription}
          </p>
        </div>
      </div>
    </div>
  );
};

export { renderHighlightedText };
export default Semaphore;