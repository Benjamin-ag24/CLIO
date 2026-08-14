import { logoWrapperStyles, logoImageStyles, brandNameStyles } from "./Logo.styles";
import logoImage from "../assets/logo.png";
import { ALT_LOGO } from "../constants/uiConstants";

const Logo = () => {
  return (
    <div className={logoWrapperStyles}>
      <img src={logoImage} alt={ALT_LOGO} className={logoImageStyles} />
      <span
        className={brandNameStyles}
        style={{ fontFamily: "serif" }}
      >
        Clio
      </span>
    </div>
  );
};

export default Logo;