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
    ? text.slice(0, max).trim() + "…"
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
  const [isUpdating, setIsUpdating] = useState(false);
  const [editError, setEditError] = useState("");

  const [deletingAnalysis, setDeletingAnalysis] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

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
    setEditError("");
  };

  const closeEditModal = () => {
    if (isUpdating) return;

    setEditingAnalysis(null);
    setEditText("");
    setEditError("");
  };

  const handleUpdate = async () => {
    const normalizedText = editText.trim();

    if (!normalizedText) {
      setEditError("El texto es obligatorio.");
      return;
    }

    setIsUpdating(true);
    setEditError("");

    try {
      await updateAnalysis(
        editingAnalysis.id,
        normalizedText,
      );

      await fetchHistory();

      closeEditModal();
    } catch (err) {
      setEditError(
        err.message ||
          "No fue posible actualizar el análisis.",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const openDeleteModal = (event, item) => {
    event.stopPropagation();

    setDeletingAnalysis(item);
    setDeleteError("");
  };

  const closeDeleteModal = () => {
    if (isDeleting) return;

    setDeletingAnalysis(null);
    setDeleteError("");
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError("");

    try {
      await deleteAnalysis(deletingAnalysis.id);

      await fetchHistory();

      closeDeleteModal();
    } catch (err) {
      setDeleteError(
        err.message ||
          "No fue posible eliminar el análisis.",
      );
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

      {/* EDIT MODAL */}
      {editingAnalysis && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5">
              <h2 className="text-2xl font-bold text-[#4A3226]">
                Editar análisis
              </h2>

              <p className="mt-1 text-sm text-[#93816F]">
                Modifica el texto del análisis y vuelve a
                analizarlo.
              </p>
            </div>

            <textarea
              value={editText}
              onChange={(event) =>
                setEditText(event.target.value)
              }
              rows={8}
              disabled={isUpdating}
              className="w-full resize-none rounded-xl border border-[#E9E1D3]
                         bg-[#FBFAF6] p-4 text-sm text-[#4A3226]
                         outline-none transition
                         focus:border-[#6FA8C9] focus:ring-2
                         focus:ring-[#6FA8C9]/20"
              placeholder="Escribe el texto que deseas analizar..."
            />

            {editError && (
              <p className="mt-3 rounded-lg bg-[#FBEAE8] px-4 py-3 text-sm text-[#C3564F]">
                {editError}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="secondary"
                type="button"
                onClick={closeEditModal}
                disabled={isUpdating}
              >
                Cancelar
              </Button>

              <Button
                variant="primary"
                type="button"
                onClick={handleUpdate}
                disabled={isUpdating}
              >
                {isUpdating
                  ? "Guardando..."
                  : "Guardar y volver a analizar"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deletingAnalysis && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5">
              <h2 className="text-2xl font-bold text-[#4A3226]">
                Eliminar análisis
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#7B5F49]">
                ¿Estás seguro de que deseas eliminar este
                análisis? Esta acción no se puede deshacer.
              </p>
            </div>

            <div className="rounded-xl border border-[#E9E1D3] bg-[#FBFAF6] p-4">
              <p className="text-sm leading-6 text-[#4A3226]">
                {deletingAnalysis.originalText}
              </p>
            </div>

            {deleteError && (
              <p className="mt-3 rounded-lg bg-[#FBEAE8] px-4 py-3 text-sm text-[#C3564F]">
                {deleteError}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="secondary"
                type="button"
                onClick={closeDeleteModal}
                disabled={isDeleting}
              >
                Cancelar
              </Button>

              <Button
                variant="primary"
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="!bg-[#C3564F] hover:!bg-[#A9443F]"
              >
                {isDeleting
                  ? "Eliminando..."
                  : "Sí, eliminar"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;