import {
  headerContainerStyles,
  headerNavStyles,
  logoWrapperStyles,
  logoBoxStyles,
  logoImageStyles,
  brandNameStyles,
} from "./Header.styles";

const Header = () => {
  return (
    <header className={headerContainerStyles}>
      <nav className={headerNavStyles}>
        <div className={logoWrapperStyles}>
          <div className={logoBoxStyles}>
            <img src="logo/logo.png" className={logoImageStyles} />
          </div>
          <span className={brandNameStyles}>Clio</span>
        </div>
      </nav>
    </header>
  );
};

export default Header;