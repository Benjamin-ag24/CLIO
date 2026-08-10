import { useState } from "react";
import Button from "../../common/Button";

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
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#F1DFC0] flex items-center justify-center">
            <svg width="26" height="26" viewBox="0 0 38 38" fill="none">
              <path
                d="M4 8C9 6 14 6 19 9V30C14 27 9 27 4 29V8Z"
                fill="#B08355"
              />
              <path
                d="M34 8C29 6 24 6 19 9V30C24 27 29 27 34 29V8Z"
                fill="#8C6239"
              />
              <path d="M19 9V30" stroke="#5C4234" strokeWidth="1.4" />
            </svg>
          </div>
          <span
            className="text-3xl font-bold text-[#4A3226]"
            style={{ fontFamily: "serif" }}
          >
            Clio
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-[#E9E1D3] shadow-sm p-8">
          <h2 className="text-2xl font-bold text-[#4A3226] mb-1">
            Crear cuenta
          </h2>
          <p className="text-sm text-[#93816F] mb-6">
            Regístrate para empezar a verificar hechos históricos.
          </p>

          {isSuccess ? (
            <div className="rounded-xl bg-[#EAF5EC] border border-[#C9E4CE] text-[#3E7C50] text-sm px-4 py-3">
              ¡Cuenta creada! Redirigiendo al inicio de sesión...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-[#4A3226] mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full rounded-xl border border-[#E9E1D3] bg-[#FBFAF6] px-4 py-3
                               text-[#4A3226] focus:outline-none focus:border-[#6FA8C9]
                               focus:ring-2 focus:ring-[#DCEBF3] transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#4A3226] mb-1">
                    Apellido
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-xl border border-[#E9E1D3] bg-[#FBFAF6] px-4 py-3
                               text-[#4A3226] focus:outline-none focus:border-[#6FA8C9]
                               focus:ring-2 focus:ring-[#DCEBF3] transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#4A3226] mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tucorreo@ejemplo.com"
                  className="w-full rounded-xl border border-[#E9E1D3] bg-[#FBFAF6] px-4 py-3
                             text-[#4A3226] placeholder-[#B3A392]
                             focus:outline-none focus:border-[#6FA8C9] focus:ring-2 focus:ring-[#DCEBF3]
                             transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#4A3226] mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full rounded-xl border border-[#E9E1D3] bg-[#FBFAF6] px-4 py-3
                             text-[#4A3226] placeholder-[#B3A392]
                             focus:outline-none focus:border-[#6FA8C9] focus:ring-2 focus:ring-[#DCEBF3]
                             transition"
                />
              </div>

              {error && (
                <div className="rounded-xl bg-[#FBEAE8] border border-[#EFC9C5] text-[#C3564F] text-sm px-4 py-3">
                  {error}
                </div>
              )}

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
        </div>

        <p className="text-center text-xs text-[#B3A392] mt-6 tracking-wide">
          PUCE TEC · DEVCHALLENGE 2026
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;