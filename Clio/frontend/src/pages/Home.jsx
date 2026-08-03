import { useMemo, useRef, useState } from "react";
import Header from "../components/Header";
import InputPanel from "../components/InputPanel";
import ReportPanel from "../components/ReportPanel";
import ErrorBanner from "../components/ErrorBanner";
import LoadingSpinner from "../components/LoadingSpinner";
import LoginPage from "./Auth/LoginPage"; // ACTUALIZADO
import RegisterPage from "./Auth/RegisterPage"; // ACTUALIZADO
import { analizarTexto } from "../services/analysisService";
import { getAuthToken, getAuthUser, clearAuthSession } from "../services/authStorage"; // ACTUALIZADO

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
  // ACTUALIZADO: estado de autenticación + vista (login/registro)
  const [isAuthenticated, setIsAuthenticated] = useState(!!getAuthToken());
  const [vista, setVista] = useState("login");

  const [content, setContent] = useState("");
  const [report, setReport] = useState(null);

  // Estados generales
  const [status, setStatus] = useState("inactivo");
  const [error, setError] = useState(null);

  // Referencia al textarea
  const inputRef = useRef(null);

  const characterCount = useMemo(() => content.length, [content]);

  const analyzeContent = async () => {
    try {
      // Reiniciar estados
      setStatus("cargando");
      setError(null);
      setReport(null);

      const normalized = content.trim().toLowerCase();

      if (!normalized) {
        setStatus("inactivo");
        return;
      }

      const resultado = await analizarTexto(content);

      const keyTerms = [
        "veracidad",
        "indicios",
        "fuentes",
        "comprobable",
        "engañoso",
      ].filter((term) => normalized.includes(term));

      const indicators =
        resultado.veredicto === "veraz"
          ? ["Estructura coherente", "Lenguaje directo y claro"]
          : resultado.veredicto === "dudoso"
            ? ["Uso de palabras imprecisas", "Falta de fuentes concretas"]
            : ["Afirmaciones sin respaldo", "Lenguaje sensacionalista"];

      setReport({
        verdict: resultado.veredicto,
        explanation: resultado.explicacion,
        keyTerms,
        indicators,
      });

      setStatus("resultado");
    } catch (err) {
      setStatus("error");

      setError({
        codigo: err?.codigo || "ERROR_ANALISIS",
        mensaje:
          err?.mensaje ||
          "No fue posible realizar el análisis. Por favor intenta de nuevo.",
      });
    }
  };

  const resetAnalysis = () => {
    setContent("");
    setReport(null);
    setError(null);
    setStatus("inactivo");

    // Devuelve el foco al textarea
    inputRef.current?.focus();
  };

  // ACTUALIZADO: si no hay sesión, muestra login o registro según la vista
  if (!isAuthenticated) {
    if (vista === "registro") {
      return <RegisterPage onGoToLogin={() => setVista("login")} />;
    }
    return (
      <LoginPage
        onLoginSuccess={() => setIsAuthenticated(true)}
        onGoToRegister={() => setVista("registro")}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f2ec]">
      <Header />

      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* ACTUALIZADO: botón de cerrar sesión con nombre del usuario */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => {
              clearAuthSession();
              setIsAuthenticated(false);
            }}
            className="text-sm text-[#93816F] hover:text-[#5b3f2d] transition"
          >
            Cerrar sesión ({getAuthUser()?.nombre})
          </button>
        </div>

        {/* Título */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#5b3f2d] tracking-tight">
            ¿Qué hecho histórico quieres validar?
          </h1>

          <p className="mt-3 text-[#7b5f49] text-sm md:text-base max-w-2xl mx-auto">
            Pega o escribe el texto sobre un hecho histórico que deseas verificar
          </p>

          <p className="mt-1 text-[#a6886a] text-sm italic">
            Ejemplo: Antes de la década de 1440, la inmensa mayoría de los textos se copiaban a mano, un proceso sumamente lento y costoso realizado principalmente por monjes en monasterios. Esta barrera significaba que el saber estaba restringido a las élites y que los índices de alfabetización eran extremadamente bajos. En Europa, el monopolio de la información residía casi en su totalidad en la Iglesia
          </p>
        </div>

        {/* Panel de entrada */}
        <InputPanel
          ref={inputRef}
          content={content}
          onChange={setContent}
          onClear={resetAnalysis}
          onAnalyze={analyzeContent}
          characterCount={characterCount}
        />

        {/* Estado cargando */}
        {status === "cargando" && (
          <div className="mt-8">
            <LoadingSpinner />
          </div>
        )}

        {/* Estado error */}
        {status === "error" && (
          <ErrorBanner
            message={error?.mensaje}
            code={error?.codigo}
            onRetry={analyzeContent}
          />
        )}

        {/* Estado resultado */}
        {status === "resultado" && (
          <div className="transition-all duration-500 ease-in opacity-100">
            <ReportPanel report={report} onReset={resetAnalysis} />
          </div>
        )}

        {/* Tarjetas informativas */}
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
      </div>
    </main>
  );
};

export default Home;