export const overlayStyles = "fixed inset-0 bg-black/30 z-40";

export const asideBaseStyles = `fixed top-0 left-0 h-full w-[320px] bg-[#FBFAF6]
                    border-r border-[#E9E1D3] z-50
                    transform transition-transform duration-300 ease-in-out`;

export const asideOpenStyles = "translate-x-0";
export const asideClosedStyles = "-translate-x-full";

export const sidebarWrapperStyles = "flex flex-col h-full";
export const sidebarHeaderStyles = "flex items-center justify-between px-5 py-5 border-b border-[#E9E1D3]";
export const sidebarTitleStyles = "text-lg font-bold text-[#4A3226]";
export const closeButtonStyles = "text-xl leading-none";

export const newAnalysisWrapperStyles = "px-5 pt-4";
export const newAnalysisButtonStyles = "w-full";

export const listWrapperStyles = "flex-1 overflow-y-auto px-5 py-4 space-y-2";
export const loadingTextStyles = "text-sm text-[#93816F] text-center py-6";
export const errorTextStyles = "text-sm text-[#C3564F] text-center py-6";
export const emptyTextStyles = "text-sm text-[#93816F] text-center py-6";

export const analysisItemStyles = `w-full text-left rounded-xl cursor-pointer
                               border border-[#E9E1D3] bg-white
                               px-4 py-3 hover:border-[#6FA8C9]
                               hover:bg-[#FBFAF6] transition`;

export const itemHeaderStyles = "flex items-center justify-between mb-1.5";
export const verdictBadgeStyles = "text-xs font-bold px-2 py-0.5 rounded-full";
export const itemDateStyles = "text-xs text-[#B3A392]";
export const itemTextStyles = "text-sm text-[#4A3226] leading-snug";
export const itemActionsStyles = "flex gap-3 mt-2";
export const editButtonStyles = "text-[#6FA8C9] hover:text-[#4A3226]";
export const deleteButtonStyles = "text-[#C3564F] hover:text-[#4A3226]";

export const modalOverlayStyles = "fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4";
export const editModalBoxStyles = "w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl";
export const deleteModalBoxStyles = "w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl";
export const modalTitleStyles = "text-2xl font-bold text-[#4A3226]";
export const modalSubtitleStyles = "mt-2 text-sm text-[#93816F]";

export const editFieldWrapperStyles = "mt-5";
export const editLabelStyles = "mb-2 block text-sm font-semibold text-[#4A3226]";
export const editTextareaStyles = `w-full resize-none rounded-xl border border-[#E9E1D3]
                           bg-[#FBFAF6] p-4 text-sm text-[#4A3226]
                           outline-none transition
                           focus:border-[#6FA8C9]
                           focus:ring-2 focus:ring-[#6FA8C9]/20
                           disabled:opacity-60`;

export const modalActionsStyles = "mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end";

export const deleteConfirmTextStyles = "mt-3 text-sm leading-6 text-[#7B5F49]";
export const deletePreviewBoxStyles = "mt-4 rounded-xl bg-[#FBFAF6] p-4";
export const deletePreviewTextStyles = "text-sm leading-6 text-[#4A3226]";
export const deleteWarningTextStyles = "mt-4 text-xs leading-5 text-[#93816F]";
export const deleteButtonDangerStyles = "bg-[#C3564F] px-5 py-2.5 text-white rounded-lg hover:bg-[#A9433D]";