import { useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "../components/Header/Header";
import AIInteractivePanel from "../components/AIInteractivePanel/AIInteractivePanel";
import ReportPanel from "../components/AnalysisResults/ReportPanel/ReportPanel";
import AuditHistory from "../components/AuditHistory/AuditHistory";
import ErrorBanner from "../components/ErrorBanner/ErrorBanner";
import Loading from "../common/Loading";
import Sidebar from "../components/Sidebar/Sidebar";
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

import {
  contentWrapperStyles,
  actionsRowStyles,
  heroWrapperStyles,
  heroTitleStyles,
  heroDescriptionStyles,
  heroExampleStyles,
  loadingWrapperStyles,
  resultWrapperStyles,
  featuresGridStyles,
  featureCardStyles,
  featureIconBaseStyles,
  featureTitleStyles,
  featureDescriptionStyles,
} from "./Home.styles";

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

      <div className={contentWrapperStyles}>
        <div className={actionsRowStyles}>
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
            <div className={heroWrapperStyles}>
              <h1 className={heroTitleStyles}>
                {homePageCopy.title}
              </h1>

              <p className={heroDescriptionStyles}>
                {homePageCopy.description}
              </p>

              <p className={heroExampleStyles}>
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
              <div className={loadingWrapperStyles}>
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
              <div className={resultWrapperStyles}>
                <ReportPanel
                  report={report}
                  onReset={resetAnalysis}
                />
              </div>
            )}

            <div className={featuresGridStyles}>
              {featureList.map((feature) => (
                <div
                  key={feature.title}
                  className={featureCardStyles}
                >
                  <div
                    className={`${featureIconBaseStyles} ${feature.accent}`}
                  >
                    {feature.icon}
                  </div>

                  <h3 className={featureTitleStyles}>
                    {feature.title}
                  </h3>

                  <p className={featureDescriptionStyles}>
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