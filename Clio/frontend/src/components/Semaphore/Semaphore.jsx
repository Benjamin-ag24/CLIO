import { analysisCopy } from "../../constants/analysisConstants";
import { levels, verdictMap } from "./constantsForSemaphore";

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
          className="rounded-md bg-slate-100 px-1.5 py-0.5 text-slate-800"
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 p-6 rounded-[28px] border border-[#d3b79b] bg-[#fff6ee] shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex flex-col justify-between items-center rounded-[28px] border border-[#d3b79b] bg-[#f4e8dd] p-3">
            {levels.map((level) => {
              const active = level.key === verdict;
              return (
                <span
                  key={level.key}
                  className={`block h-4 w-4 rounded-full border ${
                    active ? level.color : "bg-[#dcc7b3] border-[#dcc7b3]"
                  }`}
                />
              );
            })}
          </div>

          <div>
            <div className={`text-3xl font-semibold ${config.text}`}>
              {config.label}
            </div>
            <p className="mt-2 text-sm text-[#7a6250]">{config.hint}</p>
          </div>
        </div>

        <div
          className={`rounded-[28px] px-5 py-4 ${config.bg} ${config.ring} border ${config.ring}`}
        >
          <p className={`text-lg font-medium ${config.text}`}>
            {config.immediate || analysisCopy.verdicts.veraz.immediate}
          </p>
          <p className={`mt-2 text-sm ${config.text}`}>
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
