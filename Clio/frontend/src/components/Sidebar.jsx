// frontend/src/components/Sidebar.jsx
import { useEffect, useState } from "react";
import { getAuthToken } from "../services/authStorage";
import { updateAnalysis, deleteAnalysis } from "../services/analysisService";
import Button from "../common/Button";

const VERDICT_STYLES = {
  veraz: { bg: "#EAF5EC", text: "#3E7C50", label: "Veraz" },
  dudoso: { bg: "#F1DFC0", text: "#8C6239", label: "Dudoso" },
  falso: { bg: "#FBEAE8", text: "#C3564F", label: "Falso" },
};

const API_URL = "http://localhost:3000/api/analysis";

const formatDate = (isoString) => {
  if (!isoString) return "";

  const date = new Date(isoString);

  return date.toLocaleString("es-EC", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const truncateText = (text, max = 70) => {
  if (!text) return "";

  return text.length > max ? text.slice(0, max).trim() + "…" : text;
};

const Sidebar = ({
  isOpen,
  onClose,
  onSelectAnalysis,
  onNewAnalysis,
  refreshTrigger,
}) => {
  const [analyses, setAnalyses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchHistory = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error("No fue posible cargar el historial");
      }

      const data = await response.json();
      setAnalyses(data);
    } catch (err) {
      setError(err.message || "Error al cargar el historial");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    fetchHistory();
  }, [isOpen, refreshTrigger]);

  const handleEdit = async (event, item) => {
    event.stopPropagation();

    const newText = window.prompt("Edita el texto del análisis:", item.originalText);

    if (!newText || newText.trim() === "") return;

    try {
      await updateAnalysis(item.id, newText);
      fetchHistory();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (event, id) => {
    event.stopPropagation();

    const confirmed = window.confirm("¿Seguro que quieres eliminar este análisis?");

    if (!confirmed) return;

    try {
      await deleteAnalysis(id);
      fetchHistory();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-[320px] bg-[#FBFAF6] 
                    border-r border-[#E9E1D3] z-50 
                    transform transition-transform duration-300 ease-in-out
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-5 py-5 border-b border-[#E9E1D3]">
            <h2 className="text-lg font-bold text-[#4A3226]">Historial</h2>

            <Button
              variant="text"
              onClick={onClose}
              className="text-xl leading-none"
              aria-label="Cerrar historial"
            >
              ✕
            </Button>
          </div>

          <div className="px-5 pt-4">
            <Button
              variant="accent"
              className="w-full"
              onClick={() => {
                onNewAnalysis();
                onClose();
              }}
            >
              + Nuevo análisis
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
            {isLoading && (
              <p className="text-sm text-[#93816F] text-center py-6">
                Cargando historial...
              </p>
            )}

            {!isLoading && error && (
              <p className="text-sm text-[#C3564F] text-center py-6">{error}</p>
            )}

            {!isLoading && !error && analyses.length === 0 && (
              <p className="text-sm text-[#93816F] text-center py-6">
                Aún no tienes análisis guardados.
              </p>
            )}

            {!isLoading &&
              !error &&
              analyses.map((item) => {
                const style = VERDICT_STYLES[item.verdict] || VERDICT_STYLES.dudoso;

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectAnalysis(item);
                      onClose();
                    }}
                    className="w-full text-left rounded-xl cursor-pointer
                               border border-[#E9E1D3] bg-white
                               px-4 py-3 hover:border-[#6FA8C9]
                               hover:bg-[#FBFAF6] transition"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: style.bg,
                          color: style.text,
                        }}
                      >
                        {style.label}
                      </span>

                      <span className="text-xs text-[#B3A392]">
                        {formatDate(item.createdAt)}
                      </span>
                    </div>

                    <p className="text-sm text-[#4A3226] leading-snug">
                      {truncateText(item.originalText)}
                    </p>

                    <div className="flex gap-3 mt-2">
                      <Button
                        variant="text"
                        className="text-[#6FA8C9] hover:text-[#4A3226]"
                        onClick={(event) => handleEdit(event, item)}
                      >
                        Editar
                      </Button>

                      <Button
                        variant="text"
                        className="text-[#C3564F] hover:text-[#4A3226]"
                        onClick={(event) => handleDelete(event, item.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;