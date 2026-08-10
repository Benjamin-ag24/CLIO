import { useState } from "react";
import Button from "../../common/Button";
import Logo from "../../common/Logo";
import Card from "../../common/Card";
import TextField from "../../common/TextField";
import Alert from "../../common/Alert";

const RegisterPage = ({ onRegisterSuccess, onGoToLogin }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!firstName.trim() || !lastName.trim()) {
      setError("Nombre y apellido son obligatorios.");
      return false;
    }
    if (!email.includes("@")) {
      setError("Ingresa un correo electrónico válido.");
      return false;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
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
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No fue posible registrarte");
      }

      setIsSuccess(true);
      setTimeout(() => onGoToLogin(), 1500);
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
            Crear cuenta
          </h2>
          <p className="text-sm text-[#93816F] mb-6">
            Regístrate para empezar a verificar hechos históricos.
          </p>

          {isSuccess ? (
            <Alert variant="success">
              ¡Cuenta creada! Redirigiendo al inicio de sesión...
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <TextField
                  label="Nombre"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />

                <TextField
                  label="Apellido"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              <TextField
                label="Correo electrónico"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@ejemplo.com"
              />

              <TextField
                label="Contraseña"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
              />

              {error && <Alert variant="error">{error}</Alert>}

              <Button
                type="submit"
                variant="accent"
                className="w-full py-3.5 mt-2"
                disabled={isLoading}
              >
                {isLoading ? "Creando cuenta..." : "Crear cuenta"}
              </Button>
            </form>
          )}

          <p className="text-center text-sm text-[#93816F] mt-6">
            ¿Ya tienes cuenta?{" "}
            <Button
              variant="text"
              className="text-[#6FA8C9] font-semibold hover:underline hover:text-[#6FA8C9]"
              onClick={onGoToLogin}
            >
              Inicia sesión
            </Button>
          </p>
        </Card>

        <p className="text-center text-xs text-[#B3A392] mt-6 tracking-wide">
          PUCE TEC · DEVCHALLENGE 2026
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;