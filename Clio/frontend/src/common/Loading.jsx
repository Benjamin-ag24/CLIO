import { loadingWrapperStyles, spinnerStyles, loadingTextStyles } from "./Loading.styles";

const Loading = () => {
  return (
    <div className={loadingWrapperStyles}>
      <div className={spinnerStyles}></div>
      <span className={loadingTextStyles}>Cargando...</span>
    </div>
  );
};

export default Loading;