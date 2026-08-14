import {
  primaryButtonStyles,
  secondaryButtonStyles,
  dangerButtonStyles,
  textButtonStyles,
  accentButtonStyles,
} from "./Button.styles";

const VARIANTS = {
  primary: primaryButtonStyles,
  secondary: secondaryButtonStyles,
  danger: dangerButtonStyles,
  text: textButtonStyles,
  accent: accentButtonStyles,
};

const Button = ({ variant = "primary", className = "", children, ...props }) => {
  const style = VARIANTS[variant] || VARIANTS.primary;

  return (
    <button className={`${style} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;