import logoImage from "../../assets/logo.png";
import Button from "../../common/Button";
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
            <img src={logoImage} alt="Clio" className={logoImageStyles} />
          </div>
          <span className={brandNameStyles}>Clio</span>
        </div>

        {onLogout && (
          <Button
            variant="text"
            className={logoutButtonStyles}
            onClick={onLogout}
          >
            Cerrar sesión {userName ? `(${userName})` : ""}
          </Button>
        )}
      </nav>
    </header>
  );
};

export default Header;