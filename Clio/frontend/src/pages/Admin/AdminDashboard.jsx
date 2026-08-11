import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import Card from "../../common/Card";
import Loading from "../../common/Loading";
import Alert from "../../common/Alert";
import Button from "../../common/Button";
import { getStatistics } from "../../services/statisticsService";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function AdminDashboard({ onBack }) {
  const [statistics, setStatistics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStatistics = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getStatistics();
      setStatistics(data);
    } catch (err) {
      setError(err.message || "Error al cargar las estadísticas.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10">
        <Alert variant="error">{error}</Alert>
        <div className="mt-4 text-center">
          <Button variant="secondary" onClick={fetchStatistics}>
            Intentar de nuevo
          </Button>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: statistics.byDate.map((row) =>
      new Date(row.date).toLocaleDateString("es-EC", {
        day: "2-digit",
        month: "2-digit",
      })
    ),
    datasets: [
      {
        label: "Veraz",
        data: statistics.byDate.map((row) => row.veraz),
        backgroundColor: "#3E7C50",
      },
      {
        label: "Dudoso",
        data: statistics.byDate.map((row) => row.dudoso),
        backgroundColor: "#8C6239",
      },
      {
        label: "Falso",
        data: statistics.byDate.map((row) => row.falso),
        backgroundColor: "#C3564F",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#f7f2ec] px-6 py-8">
      <div className="mx-auto max-w-6xl">
        {onBack && (
          <Button variant="text" onClick={onBack} className="mb-4">
            ← Volver
          </Button>
        )}

        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#5b3f2d] mb-1">
              Panel de estadísticas
            </h1>
            <p className="text-[#7b5f49] text-sm">
              Vista global de análisis, usuarios y temas más frecuentes.
            </p>
          </div>
          <Button variant="text" onClick={fetchStatistics}>
            ↻ Actualizar
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="!p-6">
            <p className="text-3xl font-bold text-[#5b3f2d]">
              {statistics.summary.totalAnalyses}
            </p>
            <p className="text-sm text-[#7b5f49] mt-1">Análisis totales</p>
          </Card>
          <Card className="!p-6">
            <p className="text-3xl font-bold text-[#5b3f2d]">
              {statistics.summary.totalActiveUsers}
            </p>
            <p className="text-sm text-[#7b5f49] mt-1">Usuarios activos</p>
          </Card>
          <Card className="!p-6">
            <p className="text-3xl font-bold text-[#3E7C50]">
              {statistics.summary.verdictBreakdown.veraz}
            </p>
            <p className="text-sm text-[#7b5f49] mt-1">Veredicto "veraz"</p>
          </Card>
          <Card className="!p-6">
            <p className="text-3xl font-bold text-[#C3564F]">
              {statistics.summary.verdictBreakdown.falso}
            </p>
            <p className="text-sm text-[#7b5f49] mt-1">Veredicto "falso"</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 !p-6">
            <h2 className="text-base font-semibold text-[#5b3f2d] mb-4">
              Análisis por fecha
            </h2>
            {statistics.byDate.length === 0 ? (
              <p className="text-sm text-[#93816F]">
                Aún no hay análisis registrados.
              </p>
            ) : (
              <Bar data={chartData} />
            )}
          </Card>

          <Card className="!p-6">
            <h2 className="text-base font-semibold text-[#5b3f2d] mb-4">
              Temas más frecuentes
            </h2>
            {statistics.topKeywords.length === 0 ? (
              <p className="text-sm text-[#93816F]">
                Aún no hay palabras clave registradas.
              </p>
            ) : (
              <ul className="space-y-2">
                {statistics.topKeywords.map((item) => (
                  <li
                    key={item.keyword}
                    className="flex justify-between text-sm text-[#5b3f2d]"
                  >
                    <span>{item.keyword}</span>
                    <span className="text-[#93816F]">{item.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}