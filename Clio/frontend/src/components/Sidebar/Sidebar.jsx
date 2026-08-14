// frontend/src/components/Sidebar.jsx
import { BACKEND_URL } from "../../constants/configConstants";
import { useEffect, useState } from "react";
import { getAuthToken } from "../../services/authStorage";
import {
  updateAnalysis,
  deleteAnalysis,
} from "../../services/analysisService";
import Button from "../../common/Button";
import { analysisCopy } from "../../constants/analysisConstants";
import {
  overlayStyles,
  asideBaseStyles,
  asideOpenStyles,
  asideClosedStyles,
  sidebarWrapperStyles,
  sidebarHeaderStyles,
  sidebarTitleStyles,
  closeButtonStyles,
  newAnalysisWrapperStyles,
  newAnalysisButtonStyles,
  listWrapperStyles,
  loadingTextStyles,
  errorTextStyles,
  emptyTextStyles,
  analysisItemStyles,
  itemHeaderStyles,
  verdictBadgeStyles,
  itemDateStyles,
  itemTextStyles,
  itemActionsStyles,
  editButtonStyles,
  deleteButtonStyles,
  modalOverlayStyles,
  editModalBoxStyles,
  deleteModalBoxStyles,
  modalTitleStyles,
  modalSubtitleStyles,
  editFieldWrapperStyles,
  editLabelStyles,
  editTextareaStyles,
  modalActionsStyles,
  deleteConfirmTextStyles,
  deletePreviewBoxStyles,
  deletePreviewTextStyles,
  deleteWarningTextStyles,
  deleteButtonDangerStyles,
} from "./Sidebar.styles";

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

const API_URL = `${BACKEND_URL}/analysis`;

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
          className={overlayStyles}
          onClick={onClose}
        />
      )}

      <aside
        className={`${asideBaseStyles} ${
          isOpen ? asideOpenStyles : asideClosedStyles
        }`}
      >
        <div className={sidebarWrapperStyles}>
          <div className={sidebarHeaderStyles}>
            <h2 className={sidebarTitleStyles}>
              {analysisCopy.sidebar.title}
            </h2>

            <Button
              variant="text"
              onClick={onClose}
              className={closeButtonStyles}
              aria-label={analysisCopy.sidebar.closeLabel}
            >
              ✕
            </Button>
          </div>

          <div className={newAnalysisWrapperStyles}>
            <Button
              variant="accent"
              className={newAnalysisButtonStyles}
              onClick={() => {
                onNewAnalysis();
                onClose();
              }}
            >
              {analysisCopy.sidebar.newAnalysis}
            </Button>
          </div>

          <div className={listWrapperStyles}>
            {isLoading && (
              <p className={loadingTextStyles}>
                {analysisCopy.sidebar.loading}
              </p>
            )}

            {!isLoading && error && (
              <p className={errorTextStyles}>
                {error}
              </p>
            )}

            {!isLoading &&
              !error &&
              analyses.length === 0 && (
                <p className={emptyTextStyles}>
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
                    className={analysisItemStyles}
                  >
                    <div className={itemHeaderStyles}>
                      <span
                        className={verdictBadgeStyles}
                        style={{
                          backgroundColor: style.bg,
                          color: style.text,
                        }}
                      >
                        {style.label}
                      </span>

                      <span className={itemDateStyles}>
                        {formatDate(item.createdAt)}
                      </span>
                    </div>

                    <p className={itemTextStyles}>
                      {truncateText(item.originalText)}
                    </p>

                    <div className={itemActionsStyles}>
                      <Button
                        variant="text"
                        className={editButtonStyles}
                        onClick={(event) =>
                          openEditModal(event, item)
                        }
                      >
                        {analysisCopy.sidebar.edit}
                      </Button>

                      <Button
                        variant="text"
                        className={deleteButtonStyles}
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
          className={modalOverlayStyles}
          onClick={closeEditModal}
        >
          <div
            className={editModalBoxStyles}
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className={modalTitleStyles}>
              Editar análisis
            </h2>

            <p className={modalSubtitleStyles}>
              Modifica el texto del análisis y vuelve a
              analizarlo para obtener un nuevo resultado.
            </p>

            <div className={editFieldWrapperStyles}>
              <label
                htmlFor="edit-analysis-text"
                className={editLabelStyles}
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
                className={editTextareaStyles}
                placeholder="Escribe el texto que deseas analizar..."
              />
            </div>

            <div className={modalActionsStyles}>
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
          className={modalOverlayStyles}
          onClick={closeDeleteModal}
        >
          <div
            className={deleteModalBoxStyles}
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className={modalTitleStyles}>
              Eliminar análisis
            </h2>

            <p className={deleteConfirmTextStyles}>
              ¿Estás seguro de que deseas eliminar este
              análisis?
            </p>

            <div className={deletePreviewBoxStyles}>
              <p className={deletePreviewTextStyles}>
                {truncateText(
                  deletingAnalysis.originalText,
                  180,
                )}
              </p>
            </div>

            <p className={deleteWarningTextStyles}>
              El análisis dejará de aparecer en tu
              historial.
            </p>

            <div className={modalActionsStyles}>
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
                className={deleteButtonDangerStyles}
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