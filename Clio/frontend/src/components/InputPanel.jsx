const InputPanel = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-3xl">

      <h2 className="text-2xl font-semibold mb-2">
        Analiza tu contenido
      </h2>

      <p className="text-gray-500 mb-6">
        Pega una URL o escribe el texto que deseas verificar
      </p>

      <textarea
        className="w-full border rounded-lg p-4 min-h-60 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Escribe aquí tu texto o pega una URL..."
      ></textarea>

      <div className="flex justify-between mt-3">

        <span className="text-sm text-gray-500">
          0 / 5000 caracteres
        </span>

        <div className="space-x-3">

          <button className="px-5 py-2 border rounded-lg">
            Limpiar
          </button>

          <button className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Analizar
          </button>

        </div>

      </div>

    </div>
  );
};

export default InputPanel;