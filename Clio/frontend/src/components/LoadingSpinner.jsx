function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center p-5">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      <span className="ml-3">Cargando...</span>
    </div>
  );
}

export default LoadingSpinner;