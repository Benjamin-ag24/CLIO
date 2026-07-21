const ReportPanel = ({ report, onReset }) => {
  if (!report) return null;

  const { verdict, explanation, keyTerms, indicators } = report;

  const verdictConfig = {
    veraz: {
      color: "green",
      bg: "bg-green-100",
      text: "text-green-800",
      icon: "🟢",
      label: "Veraz",
    },
    dudoso: {
      color: "yellow",
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      icon: "🟡",
      label: "Dudoso",
    },
    falso: {
      color: "red",
      bg: "bg-red-100",
      text: "text-red-800",
      icon: "🔴",
      label: "Falso",
    },
  };

  const config = verdictConfig[verdict] || verdictConfig.dudoso;

  return (
    <div className="mt-8 rounded-3xl bg-white p-6 shadow-[0_8px_30px_-12px_rgba(91,55,35,0.15)] animate-fadeIn">
      <div className="flex items-start gap-6">
        <div className="flex-shrink-0">
          <div
            className={`w-20 h-20 rounded-full ${config.bg} flex items-center justify-center text-4xl`}
          >
            {config.icon}
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-[#5b3f2d]">
            Resultado del análisis
          </h2>
          <p className={`text-2xl font-bold ${config.text} mt-1`}>
            {config.label}
          </p>
          <p className="text-[#7b5f49] mt-2 text-sm leading-relaxed">
            {explanation}
          </p>
        </div>
      </div>

      {keyTerms && keyTerms.length > 0 && (
        <div className="mt-4 border-t border-[#e8ddd0] pt-4">
          <h3 className="text-sm font-semibold text-[#5b3f2d] uppercase tracking-wide">
            Términos clave detectados
          </h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {keyTerms.map((term) => (
              <span
                key={term}
                className="rounded-full bg-[#f7f2ec] px-3 py-1 text-sm text-[#5b3f2d]"
              >
                {term}
              </span>
            ))}
          </div>
        </div>
      )}

      {indicators && indicators.length > 0 && (
        <div className="mt-4 border-t border-[#e8ddd0] pt-4">
          <h3 className="text-sm font-semibold text-[#5b3f2d] uppercase tracking-wide">
            Indicadores
          </h3>
          <ul className="mt-2 space-y-1">
            {indicators.map((indicator) => (
              <li
                key={indicator}
                className="flex items-start gap-2 text-sm text-[#7b5f49]"
              >
                <span className="text-[#7fb3d1]">•</span>
                {indicator}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => {
            /* Copiar reporte */
          }}
          className="rounded-full border border-[#e8ddd0] px-6 py-2.5 text-sm font-medium text-[#7b5f49] hover:bg-[#f7f2ec] transition-colors"
        >
          Copiar reporte
        </button>
        <button
          onClick={onReset}
          className="rounded-full bg-[#7fb3d1] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#6a9eb8] transition-colors"
        >
          Nuevo análisis
        </button>
      </div>
    </div>
  );
};

export default ReportPanel;
