import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { saveAuthSession } from "../../services/authStorage";
import { login } from "../../services/authService";
import Button from "../../common/Button";
import Logo from "../../common/Logo";
import Card from "../../common/Card";
import TextField from "../../common/TextField";
import Alert from "../../common/Alert";

import {
  authCopy,
  authValidationMessages,
} from "../../constants/authConstants";

import { ROUTE_PATHS } from "../../routes/routePaths";

import {
  pageWrapperStyles,
  contentWrapperStyles,
  titleStyles,
  descriptionStyles,
  formStyles,
  submitButtonStyles,
  footerTextStyles,
  footerActionStyles,
  brandTextStyles,
} from "./LoginPage.styles";

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!email.includes("@")) {
      setError(authValidationMessages.invalidEmail);
      return false;
    }

    if (password.length < 6) {
      setError(authValidationMessages.passwordLength);
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const data = await login(email, password);

      saveAuthSession(data.token, data.user);

      if (data.user?.role === "admin") {
        navigate(ROUTE_PATHS.ADMIN, {
          replace: true,
        });
      } else {
        navigate(ROUTE_PATHS.DASHBOARD, {
          replace: true,
        });
      }
    } catch (err) {
      console.error("LOGIN ERROR:", err);

      setError(
        err?.message ||
          authValidationMessages.defaultLoginError,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={pageWrapperStyles}>
      <div className={contentWrapperStyles}>
        <Logo />

        <Card>
          <h2 className={titleStyles}>
            {authCopy.login.title}
          </h2>

          <p className={descriptionStyles}>
            {authCopy.login.description}
          </p>

          <form
            onSubmit={handleSubmit}
            className={formStyles}
          >
            <TextField
              label={authCopy.login.fields.email}
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder={authCopy.login.placeholders.email}
            />

            <TextField
              label={authCopy.login.fields.password}
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder={
                authCopy.login.placeholders.password
              }
            />

            {error && (
              <Alert variant="error">
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              variant="accent"
              className={submitButtonStyles}
              disabled={isLoading}
            >
              {isLoading
                ? authCopy.login.buttons.loading
                : authCopy.login.buttons.submit}
            </Button>
          </form>

          <p className={footerTextStyles}>
            {authCopy.login.footer.noAccount}{" "}

            <Button
              variant="text"
              className={footerActionStyles}
              onClick={() =>
                navigate(ROUTE_PATHS.REGISTER)
              }
            >
              {authCopy.login.footer.action}
            </Button>
          </p>
        </Card>

        <p className={brandTextStyles}>
          {authCopy.login.brand}
        </p>
      </div>
    </div>
  );
};

export default LoginPage;