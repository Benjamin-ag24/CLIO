// frontend/src/pages/Home.jsx
import { useMemo, useRef, useState } from "react";
import Header from "../components/Header";
import InputPanel from "../components/InputPanel";
import ReportPanel from "../components/ReportPanel";
import ErrorBanner from "../components/ErrorBanner";
import Loading from "../common/Loading";
import Sidebar from "../components/Sidebar";
import LoginPage from "./Auth/LoginPage";
import RegisterPage from "./Auth/RegisterPage";
import Button from "../common/Button";
import { analyzeText } from "../services/analysisService";
import {
  getAuthToken,
  getAuthUser,
  clearAuthSession,
} from "../services/authStorage";
import { featureList, homePageCopy } from "../constants/homePageConstants";
import { analysisCopy } from "../constants/analysisConstants";

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getAuthToken());
  const [view, setView] = useState("login");

  const [content, setContent] = useState("");
  const [report, setReport] = useState(null);

  const [status, setStatus] = useState("inactive");
  const [error, setError] = useState(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const inputRef = useRef(null);

  const characterCount = useMemo(() => content.length, [content]);

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

      const keyTerms = analysisCopy.keyTerms.filter((term) =>
        normalized.includes(term),
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
    setContent(item.originalText);

    setReport({
      verdict: item.verdict,
      explanation: item.explanation,
      keyTerms: [],
      indicators:
        item.verdict === "veraz"
          ? analysisCopy.indicators.veraz
          : item.verdict === "dudoso"
            ? analysisCopy.indicators.dudoso
            : analysisCopy.indicators.falso,
    });

    setStatus("result");
  };

  if (!isAuthenticated) {
    if (view === "registro") {
      return <RegisterPage onGoToLogin={() => setView("login")} />;
    }

    return (
      <LoginPage
        onLoginSuccess={() => setIsAuthenticated(true)}
        onGoToRegister={() => setView("registro")}
      />
    );
  }

  return (
    <main>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        refreshTrigger={refreshTrigger}
        onNewAnalysis={resetAnalysis}
        onSelectAnalysis={selectAnalysis}
      />

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex justify-end items-center gap-4 mb-4">
          <Button variant="text" onClick={() => setIsSidebarOpen(true)}>
            {homePageCopy.actions.history}
          </Button>

          <Button
            variant="text"
            onClick={() => {
              clearAuthSession();
              setIsAuthenticated(false);
            }}
          >
            {homePageCopy.actions.logoutPrefix} ({getAuthUser()?.nombre})
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#5b3f2d] tracking-tight">
            {homePageCopy.title}
          </h1>

          <p className="mt-3 text-[#7b5f49] text-sm md:text-base max-w-2xl mx-auto">
            {homePageCopy.description}
          </p>

          <p className="mt-1 text-[#a6886a] text-sm italic">
            {homePageCopy.example}
          </p>
        </div>

        <InputPanel
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
          <div className="transition-all duration-500 ease-in opacity-100">
            <ReportPanel report={report} onReset={resetAnalysis} />
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3 mt-12">
          {featureList.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl bg-white p-6 shadow-[0_8px_30px_-12px_rgba(91,55,35,0.2)] hover:shadow-[0_16px_40px_-16px_rgba(91,55,35,0.25)] transition-shadow duration-300"
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
      </div>
    </main>
  );
};

export default Home;
