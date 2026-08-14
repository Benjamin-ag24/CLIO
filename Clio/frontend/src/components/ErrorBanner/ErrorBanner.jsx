import Button from "../../common/Button";
import { analysisCopy } from "../../constants/analysisConstants";
import {
  bannerContainerStyles,
  bannerRowStyles,
  iconWrapperStyles,
  iconTextStyles,
  contentWrapperStyles,
  titleStyles,
  subtitleStyles,
  messageStyles,
  codeStyles,
  retryWrapperStyles,
} from "./ErrorBanner.styles";

const ErrorBanner = ({ message, code, onRetry }) => {
  return (
    <div className={bannerContainerStyles}>
      <div className={bannerRowStyles}>
        <div className={iconWrapperStyles}>
          <span className={iconTextStyles}>⚠️</span>
        </div>

        <div className={contentWrapperStyles}>
          <p className={titleStyles}>
            {analysisCopy.errorBanner.title}
          </p>
          <h3 className={subtitleStyles}>
            {analysisCopy.errorBanner.subtitle}
          </h3>
          <p className={messageStyles}>
            {message || analysisCopy.errorBanner.fallbackMessage}
          </p>
          {code && (
            <p className={codeStyles}>Código: {code}</p>
          )}
        </div>
      </div>

      <div className={retryWrapperStyles}>
        <Button variant="danger" onClick={onRetry}>
          {analysisCopy.errorBanner.retry}
        </Button>
      </div>
    </div>
  );
};

export default ErrorBanner;