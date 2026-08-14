import { analysisCopy } from "../../../constants/analysisConstants";

export const verdictMap = {
  veraz: {
    label: analysisCopy.verdicts.veraz.label,
    hint: analysisCopy.verdicts.veraz.hint,
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    ring: "ring-emerald-100",
    dot: "bg-emerald-500",
  },
  dudoso: {
    label: analysisCopy.verdicts.dudoso.label,
    hint: analysisCopy.verdicts.dudoso.hint,
    bg: "bg-amber-50",
    text: "text-amber-800",
    ring: "ring-amber-100",
    dot: "bg-amber-400",
  },
  falso: {
    label: analysisCopy.verdicts.falso.label,
    hint: analysisCopy.verdicts.falso.hint,
    bg: "bg-rose-50",
    text: "text-rose-800",
    ring: "ring-rose-100",
    dot: "bg-rose-500",
  },
};

export const levels = [
  {
    key: "veraz",
    label: analysisCopy.verdicts.veraz.label,
    color: "bg-emerald-500",
  },
  {
    key: "dudoso",
    label: analysisCopy.verdicts.dudoso.label,
    color: "bg-amber-400",
  },
  {
    key: "falso",
    label: analysisCopy.verdicts.falso.label,
    color: "bg-rose-500",
  },
];
