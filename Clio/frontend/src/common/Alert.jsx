import { errorAlertStyles, successAlertStyles } from "./Alert.styles";

const VARIANTS = {
  error: errorAlertStyles,
  success: successAlertStyles,
};

const Alert = ({ variant = "error", children }) => {
  const style = VARIANTS[variant] || VARIANTS.error;

  return <div className={style}>{children}</div>;
};

export default Alert;