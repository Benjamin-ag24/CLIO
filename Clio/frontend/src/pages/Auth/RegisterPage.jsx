import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../../common/Button";
import Logo from "../../common/Logo";
import Card from "../../common/Card";
import TextField from "../../common/TextField";
import Alert from "../../common/Alert";
import { register } from "../../services/authService";

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
  nameFieldsRowStyles,
  submitButtonStyles,
  footerTextStyles,
  footerActionStyles,
  brandTextStyles,
} from "./RegisterPage.styles";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!firstName.trim() || !lastName.trim()) {
      setError(authValidationMessages.requiredNames);
      return false;
    }

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await register(firstName, lastName, email, password);

      setIsSuccess(true);

      setTimeout(() => {
        navigate(ROUTE_PATHS.LOGIN, {
          replace: true,
        });
      }, 1500);
    } catch (err) {
      setError(err.message || authValidationMessages.defaultRegisterError);
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
            {authCopy.register.title}
          </h2>

          <p className={descriptionStyles}>
            {authCopy.register.description}
          </p>

          {isSuccess ? (
            <Alert variant="success">
              {authCopy.register.success}
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className={formStyles}>
              <div className={nameFieldsRowStyles}>
                <TextField
                  label={authCopy.register.fields.firstName}
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />

                <TextField
                  label={authCopy.register.fields.lastName}
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              <TextField
                label={authCopy.register.fields.email}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={authCopy.register.placeholders.email}
              />

              <TextField
                label={authCopy.register.fields.password}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={authCopy.register.placeholders.password}
              />

              {error && <Alert variant="error">{error}</Alert>}

              <Button
                type="submit"
                variant="accent"
                className={submitButtonStyles}
                disabled={isLoading}
              >
                {isLoading
                  ? authCopy.register.buttons.loading
                  : authCopy.register.buttons.submit}
              </Button>
            </form>
          )}

          <p className={footerTextStyles}>
            {authCopy.register.footer.hasAccount}{" "}
            <Button
              variant="text"
              className={footerActionStyles}
              onClick={() => navigate(ROUTE_PATHS.LOGIN)}
            >
              {authCopy.register.footer.action}
            </Button>
          </p>
        </Card>

        <p className={brandTextStyles}>
          {authCopy.register.brand}
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;