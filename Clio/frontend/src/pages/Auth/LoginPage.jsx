import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { saveAuthSession } from "../../services/authStorage";
import Button from "../../common/Button";
import Logo from "../../common/Logo";
import Card from "../../common/Card";
import TextField from "../../common/TextField";
import Alert from "../../common/Alert";

import {
  authCopy,
  authValidationMessages,
  authApiEndpoints,
} from "../../constants/authConstants";

import { ROUTE_PATHS } from "../../routes/routePaths";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch(authApiEndpoints.login, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || authValidationMessages.defaultLoginError,
        );
      }

      saveAuthSession(data.token, data.user);

      navigate(ROUTE_PATHS.DASHBOARD, {
        replace: true,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F7F2EC] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Logo />

        <Card>
          <h2 className="text-2xl font-bold text-[#4A3226] mb-1">
            {authCopy.login.title}
          </h2>

          <p className="text-sm text-[#93816F] mb-6">
            {authCopy.login.description}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField
              label={authCopy.login.fields.email}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={authCopy.login.placeholders.email}
            />

            <TextField
              label={authCopy.login.fields.password}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={authCopy.login.placeholders.password}
            />

            {error && <Alert variant="error">{error}</Alert>}

            <Button
              type="submit"
              variant="accent"
              className="w-full py-3.5 mt-2"
              disabled={isLoading}
            >
              {isLoading
                ? authCopy.login.buttons.loading
                : authCopy.login.buttons.submit}
            </Button>
          </form>

          <p className="text-center text-sm text-[#93816F] mt-6">
            {authCopy.login.footer.noAccount}{" "}
            <Button
              variant="text"
              className="text-[#6FA8C9] font-semibold hover:underline hover:text-[#6FA8C9]"
              onClick={() => navigate(ROUTE_PATHS.REGISTER)}
            >
              {authCopy.login.footer.action}
            </Button>
          </p>
        </Card>

        <p className="text-center text-xs text-[#B3A392] mt-6 tracking-wide">
          {authCopy.login.brand}
        </p>
      </div>
    </div>
  );
};

export default LoginPage;