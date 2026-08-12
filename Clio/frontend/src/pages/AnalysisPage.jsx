import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "../common/Button";
import Loading from "../common/Loading";
import Alert from "../common/Alert";

import { getAnalysisById } from "../services/analysisService";
import { ROUTE_PATHS } from "../constants/routePaths";

const AnalysisPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAnalysis = async () => {
      try {
        setIsLoading(true);
        setError("");

        const data = await getAnalysisById(id);

        setAnalysis(data);
      } catch (err) {
        setError(
          err?.message || "No fue posible obtener el análisis.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalysis();
  }, [id]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F7F2EC] p-8">
        <Loading />
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#F7F2EC] p-8">
        <Alert variant="error">{error}</Alert>

        <Button
          variant="text"
          onClick={() => navigate(ROUTE_PATHS.DASHBOARD)}
        >
          Back to Dashboard
        </Button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F2EC] p-8">
      <div className="mx-auto max-w-4xl">
        <Button
          variant="text"
          onClick={() => navigate(ROUTE_PATHS.DASHBOARD)}
        >
          Back to Dashboard
        </Button>

        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-[#5b3f2d]">
            Analysis #{analysis.id}
          </h1>

          <div className="mt-6">
            <h2 className="font-semibold text-[#5b3f2d]">
              Original Text
            </h2>

            <p className="mt-2 text-[#7b5f49]">
              {analysis.originalText}
            </p>
          </div>

          <div className="mt-6">
            <h2 className="font-semibold text-[#5b3f2d]">
              Verdict
            </h2>

            <p className="mt-2 text-[#7b5f49]">
              {analysis.verdict}
            </p>
          </div>

          <div className="mt-6">
            <h2 className="font-semibold text-[#5b3f2d]">
              Explanation
            </h2>

            <p className="mt-2 text-[#7b5f49]">
              {analysis.explanation}
            </p>
          </div>

          {analysis.keywords?.length > 0 && (
            <div className="mt-6">
              <h2 className="font-semibold text-[#5b3f2d]">
                Keywords
              </h2>

              <div className="mt-2 flex flex-wrap gap-2">
                {analysis.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full bg-[#F7F2EC] px-3 py-1 text-sm text-[#7b5f49]"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default AnalysisPage;