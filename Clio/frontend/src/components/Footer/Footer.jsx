import {
  footerContainerStyles,
  footerContentStyles,
  footerInfoRowStyles,
  footerCopyrightStyles,
} from "./Footer.styles";

const Footer = () => {
  return (
    <footer className={footerContainerStyles}>
      <div className={footerContentStyles}>
        <div className={footerInfoRowStyles}>
          <span>contacto@clio.app</span>
          <span>www.clio.app</span>
          <span>Quito, Ecuador</span>
        </div>

        <span className={footerCopyrightStyles}>
          © {new Date().getFullYear()} Clio. Todos los derechos reservados.
        </span>
      </div>
    </footer>
  );
};

export default Footer;