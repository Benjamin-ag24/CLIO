export const analysisCopy = {
  inputPanel: {
    title: "Texto a analizar",
    helperText: "Pega o escribe el texto que deseas verificar",
    placeholder: "Escribe aquí tu texto histórico o fragmento a verificar...",
    validation: {
      empty: "El campo no puede estar vacío",
      short: "El texto es muy corto, el análisis puede ser impreciso",
    },
    buttons: {
      analyze: "Validar hecho",
      analyzing: "Analizando...",
      clear: "Limpiar",
    },
  },
  reportPanel: {
    sections: {
      semaphore: {
        label: "Semáforo",
        title: "Evaluación inmediata",
      },
      explanation: {
        label: "Explicación",
        title: "Qué se detectó en el contenido",
      },
      indicators: "Indicadores",
      keyTerms: "Términos clave",
    },
    copy: {
      defaultTitle: "Reporte final de resultados",
      verdictPrefix: "Veredicto:",
      explanationLabel: "Explicación:",
      keyTermsLabel: "Términos clave:",
      indicatorsLabel: "Indicadores:",
      button: "Copiar reporte",
      copied: "Reporte copiado",
      newAnalysis: "Nuevo análisis",
    },
  },
  home: {
    title: "¿Qué hecho histórico quieres validar?",
    description:
      "Pega o escribe el texto sobre un hecho histórico que deseas verificar",
    example:
      "Ejemplo: Antes de la década de 1440, la inmensa mayoría de los textos se copiaban a mano, un proceso sumamente lento y costoso realizado principalmente por monjes en monasterios.",
    actions: {
      history: "☰ Historial",
      logoutPrefix: "Cerrar sesión",
    },
  },
  sidebar: {
    title: "Historial",
    closeLabel: "Cerrar historial",
    newAnalysis: "+ Nuevo análisis",
    loading: "Cargando historial...",
    empty: "Aún no tienes análisis guardados.",
    errorDefault: "No fue posible cargar el historial",
    editPrompt: "Edita el texto del análisis:",
    deleteConfirm: "¿Seguro que quieres eliminar este análisis?",
    edit: "Editar",
    delete: "Eliminar",
  },
  errorBanner: {
    title: "Error en el análisis",
    subtitle: "No pudimos completar la verificación",
    fallbackMessage: "Ocurrió un problema inesperado al procesar tu contenido.",
    retry: "Intentar de nuevo",
  },
  verdicts: {
    veraz: {
      label: "Veraz",
      hint: "El contenido parece consistente y confiable.",
      immediate: "Resultado inmediato",
      immediateDescription:
        "Se refleja en el semáforo para que lo veas rápido.",
    },
    dudoso: {
      label: "Dudoso",
      hint: "Hay señales que requieren una revisión más profunda.",
      immediate: "Resultado inmediato",
      immediateDescription:
        "Se refleja en el semáforo para que lo veas rápido.",
    },
    falso: {
      label: "Falso",
      hint: "El contenido muestra indicios de información incorrecta.",
      immediate: "Resultado inmediato",
      immediateDescription:
        "Se refleja en el semáforo para que lo veas rápido.",
    },
  },
  indicators: {
    veraz: ["Estructura coherente", "Lenguaje directo y claro"],
    dudoso: ["Uso de palabras imprecisas", "Falta de fuentes concretas"],
    falso: ["Afirmaciones sin respaldo", "Lenguaje sensacionalista"],
  },
  keyTerms: ["veracidad", "indicios", "fuentes", "comprobable", "engañoso"],
};

export const analysisApiEndpoints = {
  base: "http://localhost:3000/api/analysis",
};
