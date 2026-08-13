// frontend/src/components/Sidebar.jsx
import { useEffect, useState } from "react";
import { getAuthToken } from "../services/authStorage";
import {
  updateAnalysis,
  deleteAnalysis,
} from "../services/analysisService";
import Button from "../common/Button";
import { analysisCopy } from "../constants/analysisConstants";

const VERDICT_STYLES = {
  veraz: {
    bg: "#EAF5EC",
    text: "#3E7C50",
    label: analysisCopy.verdicts.veraz.label,
  },
  dudoso: {
    bg: "#F1DFC0",
    text: "#8C6239",
    label: analysisCopy.verdicts.dudoso.label,
  },
  falso: {
    bg: "#FBEAE8",
    text: "#C3564F",
    label: analysisCopy.verdicts.falso.label,
  },
};

const API_URL = "http://localhost:3000/api/analysis";

const formatDate = (isoString) => {
  if (!isoString) return "";

  const date = new Date(isoString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

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

  return text.length > max
    ? `${text.slice(0, max).trim()}…`
    : text;
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

  const [editingAnalysis, setEditingAnalysis] = useState(null);
  const [editText, setEditText] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const [deletingAnalysis, setDeletingAnalysis] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
        throw new Error(
          analysisCopy.sidebar.errorDefault,
        );
      }

      const data = await response.json();
      setAnalyses(data);
    } catch (err) {
      setError(
        err.message ||
          analysisCopy.sidebar.errorDefault,
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    fetchHistory();
  }, [isOpen, refreshTrigger]);

  const openEditModal = (event, item) => {
    event.stopPropagation();

    setEditingAnalysis(item);
    setEditText(item.originalText || "");
  };

  const closeEditModal = () => {
    if (isSavingEdit) return;

    setEditingAnalysis(null);
    setEditText("");
  };

  const handleSaveEdit = async () => {
    const trimmedText = editText.trim();

    if (!trimmedText) {
      return;
    }

    setIsSavingEdit(true);

    try {
      await updateAnalysis(
        editingAnalysis.id,
        trimmedText,
      );

      await fetchHistory();
      closeEditModal();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const openDeleteModal = (event, item) => {
    event.stopPropagation();

    setDeletingAnalysis(item);
  };

  const closeDeleteModal = () => {
    if (isDeleting) return;

    setDeletingAnalysis(null);
  };

  const handleDelete = async () => {
    if (!deletingAnalysis) return;

    setIsDeleting(true);

    try {
      await deleteAnalysis(deletingAnalysis.id);

      await fetchHistory();
      closeDeleteModal();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-[320px] bg-[#FBFAF6]
                    border-r border-[#E9E1D3] z-50
                    transform transition-transform duration-300 ease-in-out
                    ${
                      isOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-5 py-5 border-b border-[#E9E1D3]">
            <h2 className="text-lg font-bold text-[#4A3226]">
              {analysisCopy.sidebar.title}
            </h2>

            <Button
              variant="text"
              onClick={onClose}
              className="text-xl leading-none"
              aria-label={analysisCopy.sidebar.closeLabel}
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
              {analysisCopy.sidebar.newAnalysis}
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
            {isLoading && (
              <p className="text-sm text-[#93816F] text-center py-6">
                {analysisCopy.sidebar.loading}
              </p>
            )}

            {!isLoading && error && (
              <p className="text-sm text-[#C3564F] text-center py-6">
                {error}
              </p>
            )}

            {!isLoading &&
              !error &&
              analyses.length === 0 && (
                <p className="text-sm text-[#93816F] text-center py-6">
                  {analysisCopy.sidebar.empty}
                </p>
              )}

            {!isLoading &&
              !error &&
              analyses.map((item) => {
                const style =
                  VERDICT_STYLES[item.verdict] ||
                  VERDICT_STYLES.dudoso;

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
                        onClick={(event) =>
                          openEditModal(event, item)
                        }
                      >
                        {analysisCopy.sidebar.edit}
                      </Button>

                      <Button
                        variant="text"
                        className="text-[#C3564F] hover:text-[#4A3226]"
                        onClick={(event) =>
                          openDeleteModal(event, item)
                        }
                      >
                        {analysisCopy.sidebar.delete}
                      </Button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </aside>


      {editingAnalysis && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4"
          onClick={closeEditModal}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-[#4A3226]">
              Editar análisis
            </h2>

            <p className="mt-2 text-sm text-[#93816F]">
              Modifica el texto del análisis y vuelve a
              analizarlo para obtener un nuevo resultado.
            </p>

            <div className="mt-5">
              <label
                htmlFor="edit-analysis-text"
                className="mb-2 block text-sm font-semibold text-[#4A3226]"
              >
                Texto del análisis
              </label>

              <textarea
                id="edit-analysis-text"
                value={editText}
                onChange={(event) =>
                  setEditText(event.target.value)
                }
                rows={8}
                disabled={isSavingEdit}
                className="w-full resize-none rounded-xl border border-[#E9E1D3]
                           bg-[#FBFAF6] p-4 text-sm text-[#4A3226]
                           outline-none transition
                           focus:border-[#6FA8C9]
                           focus:ring-2 focus:ring-[#6FA8C9]/20
                           disabled:opacity-60"
                placeholder="Escribe el texto que deseas analizar..."
              />
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                variant="secondary"
                type="button"
                onClick={closeEditModal}
                disabled={isSavingEdit}
              >
                Cancelar
              </Button>

              <Button
                variant="accent"
                type="button"
                onClick={handleSaveEdit}
                disabled={
                  isSavingEdit ||
                  !editText.trim()
                }
              >
                {isSavingEdit
                  ? "Guardando y analizando..."
                  : "Guardar y volver a analizar"}
              </Button>
            </div>
          </div>
        </div>
      )}


      {deletingAnalysis && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4"
          onClick={closeDeleteModal}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-[#4A3226]">
              Eliminar análisis
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#7B5F49]">
              ¿Estás seguro de que deseas eliminar este
              análisis?
            </p>

            <div className="mt-4 rounded-xl bg-[#FBFAF6] p-4">
              <p className="text-sm leading-6 text-[#4A3226]">
                {truncateText(
                  deletingAnalysis.originalText,
                  180,
                )}
              </p>
            </div>

            <p className="mt-4 text-xs leading-5 text-[#93816F]">
              El análisis dejará de aparecer en tu
              historial.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                variant="secondary"
                type="button"
                onClick={closeDeleteModal}
                disabled={isDeleting}
              >
                Cancelar
              </Button>

              <Button
                variant="text"
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-[#C3564F] px-5 py-2.5 text-white rounded-lg hover:bg-[#A9433D]"
              >
                {isDeleting
                  ? "Eliminando..."
                  : "Eliminar"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;