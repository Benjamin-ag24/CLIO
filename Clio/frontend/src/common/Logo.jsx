import { logoWrapperStyles, iconBoxStyles, brandNameStyles } from "./Logo.styles";

const Logo = () => {
  return (
    <div className={logoWrapperStyles}>
      <div className={iconBoxStyles}>
        <svg width="26" height="26" viewBox="0 0 38 38" fill="none">
          <path d="M4 8C9 6 14 6 19 9V30C14 27 9 27 4 29V8Z" fill="#B08355" />
          <path d="M34 8C29 6 24 6 19 9V30C24 27 29 27 34 29V8Z" fill="#8C6239" />
          <path d="M19 9V30" stroke="#5C4234" strokeWidth="1.4" />
        </svg>
      </div>
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