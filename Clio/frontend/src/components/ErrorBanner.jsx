const ErrorBanner = ({ message, code, onRetry }) => {
  return (
    <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-6 shadow-[0_8px_30px_-12px_rgba(220,38,38,0.15)]">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-700 shadow-sm">
          <span className="text-2xl">⚠️</span>
        </div>

        <div className="flex-1">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-600">
            Error en el análisis
          </p>
          <h3 className="mt-2 text-lg font-semibold text-[#7c1d1d]">
            No pudimos completar la verificación
          </h3>
          <p className="mt-3 text-sm leading-7 text-[#7c1d1d]">
            {message ||
              "Ocurrió un problema inesperado al procesar tu contenido."}
          </p>
          {code && (
            <p className="mt-2 text-xs text-red-600/80">Código: {code}</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={onRetry}
          className="inline-flex items-center justify-center rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-red-500/20 transition-colors hover:bg-red-700"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
};

export default ErrorBanner;
