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

import {
  pageWrapperStyles,
  pageWrapperNoPaddingStyles,
  contentWrapperStyles,
  contentWrapperWithPaddingStyles,
  backButtonStyles,
  backButtonTopStyles,
  titleWrapperStyles,
  titleStyles,
  subtitleStyles,
  originalTextBoxStyles,
  originalTextTitleStyles,
  originalTextContentStyles,
} from "./AnalysisPage.styles";

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
      <main className={pageWrapperStyles}>
        <div className={contentWrapperStyles}>
          <Loading />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={pageWrapperStyles}>
        <div className={contentWrapperStyles}>
          <ErrorBanner
            message={error.message}
            code={error.code}
            onRetry={() => window.location.reload()}
          />

          <Button
            variant="text"
            className={backButtonStyles}
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
    <main className={pageWrapperNoPaddingStyles}>
      <div className={contentWrapperWithPaddingStyles}>
        <Button
          variant="text"
          onClick={() => navigate(ROUTE_PATHS.DASHBOARD)}
          className={backButtonTopStyles}
        >
          Back to Analysis
        </Button>

        <div className={titleWrapperStyles}>
          <h1 className={titleStyles}>
            Analysis
          </h1>

          <p className={subtitleStyles}>
            Analysis #{analysis.id}
          </p>
        </div>

        <div className={originalTextBoxStyles}>
          <h2 className={originalTextTitleStyles}>
            Original Text
          </h2>

          <p className={originalTextContentStyles}>
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