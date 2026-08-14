import logoImage from "../../assets/logo.png";
import Button from "../../common/Button";
import { ALT_LOGO, LOGOUT_LABEL } from "../../constants/uiConstants";
import {
  headerContainerStyles,
  headerNavStyles,
  logoWrapperStyles,
  logoBoxStyles,
  logoImageStyles,
  brandNameStyles,
  logoutButtonStyles,
} from "./Header.styles";

const Header = ({ userName, onLogout }) => {
  return (
    <header className={headerContainerStyles}>
      <nav className={headerNavStyles}>
        <div className={logoWrapperStyles}>
          <div className={logoBoxStyles}>
            <img src={logoImage} alt={ALT_LOGO} className={logoImageStyles} />
          </div>
          <span className={brandNameStyles}>Clio</span>
        </div>

        {onLogout && (
          <Button
            variant="text"
            className={logoutButtonStyles}
            onClick={onLogout}
          >
            {LOGOUT_LABEL} {userName ? `(${userName})` : ""}
          </Button>
        )}
      </nav>
    </header>
  );
};

export default Header;