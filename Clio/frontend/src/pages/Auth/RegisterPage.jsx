import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { ROUTE_PATHS } from "../../constants/routePaths";

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
      const response = await fetch(authApiEndpoints.register, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || authValidationMessages.defaultRegisterError,
        );
      }

      setIsSuccess(true);
      setTimeout(() => navigate(ROUTE_PATHS.LOGIN), 1500);
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
            {authCopy.register.title}
          </h2>

          <p className="text-sm text-[#93816F] mb-6">
            {authCopy.register.description}
          </p>

          {isSuccess ? (
            <Alert variant="success">{authCopy.register.success}</Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
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
                className="w-full py-3.5 mt-2"
                disabled={isLoading}
              >
                {isLoading
                  ? authCopy.register.buttons.loading
                  : authCopy.register.buttons.submit}
              </Button>
            </form>
          )}

          <p className="text-center text-sm text-[#93816F] mt-6">
            {authCopy.register.footer.hasAccount}{" "}
            <Button
              variant="text"
              className="text-[#6FA8C9] font-semibold hover:underline hover:text-[#6FA8C9]"
              onClick={() => navigate(ROUTE_PATHS.LOGIN)}
            >
              {authCopy.register.footer.action}
            </Button>
          </p>
        </Card>

        <p className="text-center text-xs text-[#B3A392] mt-6 tracking-wide">
          {authCopy.register.brand}
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;