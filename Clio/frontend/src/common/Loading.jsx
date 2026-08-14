import { loadingWrapperStyles, spinnerStyles } from "./Loading.styles";

const Loading = () => {
  return (
    <div className={loadingWrapperStyles}>
      <div className={spinnerStyles}></div>
      <span className="ml-3">Cargando...</span>
    </div>
  );
};

export default Loading;