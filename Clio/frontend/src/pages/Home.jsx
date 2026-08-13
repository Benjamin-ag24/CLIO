import { useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "../components/Header";
import AIInteractivePanel from "../components/AIInteractivePanel";
import ReportPanel from "../components/ReportPanel";
import AuditHistory from "../components/AuditHistory";
import ErrorBanner from "../components/ErrorBanner";
import Loading from "../common/Loading";
import Sidebar from "../components/Sidebar";
import Button from "../common/Button";

import { analyzeText } from "../services/analysisService";
import {
  getAuthUser,
  clearAuthSession,
} from "../services/authStorage";

import {
  featureList,
  homePageCopy,
} from "../constants/homePageConstants";

import { analysisCopy } from "../constants/analysisConstants";
import { ROUTE_PATHS } from "../routes/routePaths";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isAuditView =
    location.pathname === ROUTE_PATHS.AUDIT;

  const [content, setContent] = useState("");
  const [report, setReport] = useState(null);

  const [status, setStatus] = useState("inactive");
  const [error, setError] = useState(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const inputRef = useRef(null);

  const characterCount = useMemo(
    () => content.length,
    [content],
  );

  const analyzeContent = async () => {
    try {
      setStatus("loading");
      setError(null);
      setReport(null);

      const normalized = content.trim().toLowerCase();

      if (!normalized) {
        setStatus("inactive");
        return;
      }

      const analysisResult = await analyzeText(content);

      const keyTerms = analysisCopy.keyTerms.filter(
        (term) => normalized.includes(term),
      );

      const indicators =
        analysisResult.verdict === "veraz"
          ? analysisCopy.indicators.veraz
          : analysisResult.verdict === "dudoso"
            ? analysisCopy.indicators.dudoso
            : analysisCopy.indicators.falso;

      setReport({
        verdict: analysisResult.verdict,
        explanation: analysisResult.explanation,
        keyTerms,
        indicators,
      });

      setStatus("result");

      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      setStatus("error");

      setError({
        code: err?.code || "ERROR_ANALISIS",
        message:
          err?.message ||
          "No fue posible realizar el análisis. Por favor intenta de nuevo.",
      });
    }
  };

  const resetAnalysis = () => {
    setContent("");
    setReport(null);
    setError(null);
    setStatus("inactive");

    inputRef.current?.focus();
  };

  const selectAnalysis = (item) => {
    navigate(
      ROUTE_PATHS.ANALYSIS_BY_ID(item.id),
    );
  };

  const showAnalysis = () => {
    navigate(ROUTE_PATHS.DASHBOARD);
  };

  const handleLogout = () => {
    clearAuthSession();
    navigate(ROUTE_PATHS.LOGIN);
  };

  return (
    <main>
      <Header />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        refreshTrigger={refreshTrigger}
        onNewAnalysis={resetAnalysis}
        onSelectAnalysis={selectAnalysis}
      />

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-4 flex items-center justify-end gap-4">
          {isAuditView && (
            <Button
              variant="text"
              onClick={showAnalysis}
            >
              Back to Analysis
            </Button>
          )}

          <Button
            variant="text"
            onClick={() =>
              setIsSidebarOpen(true)
            }
          >
            {homePageCopy.actions.history}
          </Button>

          <Button
            variant="text"
            onClick={handleLogout}
          >
            {homePageCopy.actions.logoutPrefix} (
            {getAuthUser()?.nombre}
            )
          </Button>
        </div>

        {!isAuditView ? (
          <>
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-[#5b3f2d] md:text-4xl">
                {homePageCopy.title}
              </h1>

              <p className="mx-auto mt-3 max-w-2xl text-sm text-[#7b5f49] md:text-base">
                {homePageCopy.description}
              </p>

              <p className="mt-1 text-sm italic text-[#a6886a]">
                {homePageCopy.example}
              </p>
            </div>

            <AIInteractivePanel
              ref={inputRef}
              content={content}
              onChange={setContent}
              onClear={resetAnalysis}
              onAnalyze={analyzeContent}
              characterCount={characterCount}
            />

            {status === "loading" && (
              <div className="mt-8">
                <Loading />
              </div>
            )}

            {status === "error" && (
              <ErrorBanner
                message={error?.message}
                code={error?.code}
                onRetry={analyzeContent}
              />
            )}

            {status === "result" && (
              <div className="opacity-100 transition-all duration-500 ease-in">
                <ReportPanel
                  report={report}
                  onReset={resetAnalysis}
                />
              </div>
            )}

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {featureList.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl bg-white p-6 shadow-[0_8px_30px_-12px_rgba(91,55,35,0.2)] transition-shadow duration-300 hover:shadow-[0_16px_40px_-16px_rgba(91,55,35,0.25)]"
                >
                  <div
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${feature.accent} text-white shadow-sm`}
                  >
                    {feature.icon}
                  </div>

                  <h3 className="text-base font-semibold text-[#5b3f2d]">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-[#7b5f49]">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <AuditHistory />
        )}
      </div>
    </main>
  );
};

export default Home;