import { useMemo, useState } from "react";
import Header from "../components/Header";
import InputPanel from "../components/InputPanel";
import ReportPanel from "../components/ReportPanel";

const featureList = [
  {
    title: "Verificación rigurosa",
    description:
      "Analizamos tu afirmación y la contrastamos con fuentes históricas confiables y académicas.",
    accent: "bg-[#7fb3d1]",
    icon: "🔍",
  },
  {
    title: "Fuentes confiables",
    description:
      "Utilizamos libros, artículos académicos y archivos históricos para ofrecerte información sustentada.",
    accent: "bg-[#caa77d]",
    icon: "📚",
  },
  {
    title: "Aprende y comprende",
    description:
      "No solo decimos si es verdadero o falso, sino que te explicamos el contexto histórico.",
    accent: "bg-[#a6886a]",
    icon: "🧠",
  },
];

const Home = () => {
  const [content, setContent] = useState("");
  const [report, setReport] = useState(null);

  const characterCount = useMemo(() => content.length, [content]);

  const analyzeContent = () => {
    const normalized = content.trim().toLowerCase();

    if (!normalized) {
      setReport(null);
      return;
    }

    // Simulación de IA (reemplazar con llamada real a Claude)
    const verdict =
      normalized.includes("falso") || normalized.includes("mentira")
        ? "falso"
        : normalized.includes("posible") ||
            normalized.includes("dudoso") ||
            normalized.includes("tal vez")
          ? "dudoso"
          : "veraz";

    const keyTerms = [
      "veracidad",
      "indicios",
      "fuentes",
      "comprobable",
      "engañoso",
    ].filter((term) => normalized.includes(term));

    const explanation =
      verdict === "veraz"
        ? "El texto presenta elementos consistentes, fuentes creíbles y no muestra señales de manipulación evidente."
        : verdict === "dudoso"
          ? "Se detectaron frases ambiguas o afirmaciones sin respaldo claro; conviene revisar los datos que se citan."
          : "El contenido contiene palabras o patrones que suelen asociarse con información incorrecta o engañosa.";

    const indicators =
      verdict === "veraz"
        ? ["Estructura coherente", "Lenguaje directo y claro"]
        : verdict === "dudoso"
          ? ["Uso de palabras imprecisas", "Falta de fuentes concretas"]
          : ["Afirmaciones sin respaldo", "Lenguaje sensacionalista"];

    setReport({ verdict, explanation, keyTerms, indicators });
  };

  const resetAnalysis = () => {
    setContent("");
    setReport(null);
  };

  return (
    <main className="min-h-screen bg-[#f7f2ec]">
      <Header />

      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Título principal centrado (como en el mockup) */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#5b3f2d] tracking-tight">
            ¿Qué hecho histórico quieres validar?
          </h1>
          <p className="mt-3 text-[#7b5f49] text-sm md:text-base max-w-2xl mx-auto">
            Escribe un enunciado o afirmación sobre un hecho histórico y te
            ayudaremos a verificarlo.
          </p>
          <p className="mt-1 text-[#a6886a] text-sm italic">
            Ejemplo: La independencia de Ecuador ocurrió el 24 de mayo de 1822.
          </p>
        </div>

        {/* InputPanel */}
        <InputPanel
          content={content}
          onChange={setContent}
          onClear={() => setContent("")}
          onAnalyze={analyzeContent}
          characterCount={characterCount}
        />

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-3 mt-12">
          {featureList.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl bg-white p-6 shadow-[0_8px_30px_-12px_rgba(91,55,35,0.2)] hover:shadow-[0_16px_40px_-16px_rgba(91,55,35,0.25)] transition-shadow duration-300"
            >
              <div
                className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${feature.accent} text-white shadow-sm`}
              >
                {feature.icon}
              </div>
              <h3 className="text-base font-semibold text-[#5b3f2d]">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#7b5f49]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* ReportPanel */}
        <ReportPanel report={report} onReset={resetAnalysis} />
      </div>
    </main>
  );
};

export default Home;
