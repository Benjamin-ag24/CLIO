import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "../common/Button";
import Loading from "../common/Loading";
import ErrorBanner from "../components/ErrorBanner";
import ReportPanel from "../components/ReportPanel";

import {
  getAnalysisById,
} from "../services/analysisService";

import { analysisCopy } from "../constants/analysisConstants";
import { ROUTE_PATHS } from "../routes/routePaths";

const AnalysisPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAnalysis = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getAnalysisById(id);

        setAnalysis(data);
      } catch (err) {
        setError({
          code: err?.code || "ANALYSIS_ERROR",
          message:
            err?.message ||
            "No fue posible obtener el análisis.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalysis();
  }, [id]);

  const getIndicators = (verdict) => {
    if (verdict === "veraz") {
      return analysisCopy.indicators.veraz;
    }

    if (verdict === "dudoso") {
      return analysisCopy.indicators.dudoso;
    }

    return analysisCopy.indicators.falso;
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F7F2EC] px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <Loading />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#F7F2EC] px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <ErrorBanner
            message={error.message}
            code={error.code}
            onRetry={() => window.location.reload()}
          />

          <Button
            variant="text"
            className="mt-4"
            onClick={() => navigate(ROUTE_PATHS.DASHBOARD)}
          >
            Back to Analysis
          </Button>
        </div>
      </main>
    );
  }

  if (!analysis) {
    return null;
  }

  const report = {
    verdict: analysis.verdict,
    explanation: analysis.explanation,
    keyTerms: analysis.keywords || [],
    indicators: getIndicators(analysis.verdict),
  };

  return (
    <main className="min-h-screen bg-[#F7F2EC]">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <Button
          variant="text"
          onClick={() => navigate(ROUTE_PATHS.DASHBOARD)}
          className="mb-6"
        >
          Back to Analysis
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#5b3f2d]">
            Analysis
          </h1>

          <p className="mt-2 text-[#7b5f49]">
            Analysis #{analysis.id}
          </p>
        </div>

        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#5b3f2d] mb-3">
            Original Text
          </h2>

          <p className="text-sm leading-relaxed text-[#7b5f49] whitespace-pre-wrap">
            {analysis.originalText}
          </p>
        </div>

        <ReportPanel
          report={report}
          onReset={() => navigate(ROUTE_PATHS.DASHBOARD)}
        />
      </div>
    </main>
  );
};

export default AnalysisPage;