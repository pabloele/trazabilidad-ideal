import { useEffect } from "react";
import { Grape, Lock, Mail } from "lucide-react";
import { Google } from "@mui/icons-material";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { createUser } from "../../firebase/controllers/firestoreControllers";
import { FirebaseAuth } from "../../firebase/config";
import { getRedirectResult } from "firebase/auth";
import { useForm } from "../../hooks/useForm";

const initialForm = {
  email: "",
  password: "",
};

const formValidations = {
  email: [(value) => value.includes("@"), "Proporcione un email válido."],
  password: [
    (value) => value.length >= 6,
    "La contraseña debe tener más de seis caracteres.",
  ],
};

const LoginPage = () => {
  const { loginWithGoogle, login } = useAuth();
  const router = useRouter();

  const [logingIn, setLogingIn] = useState(false);
  const [error, setError] = useState("");

  const [showErrors, setShowErrors] = useState(false);

  const {
    password,
    email,
    onInputChange,
    formState,
    passwordValid,
    emailValid,
    usernameValid,
    isFormValid,
  } = useForm(initialForm, formValidations);

  const onUserEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const onUserPasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      setShowErrors(true);
      return;
    }

    try {
      const response = await login(email, password);

      console.log(response);
      console.log("Login successful: ", response);
      if (response.user) {
        router.push("/home");
      }
    } catch (error) {
      setError("Usuario o contraseña incorrectos");

      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  const handleLoginWithGoogle = (e) => {
    setLogingIn(true);
    loginWithGoogle().then((res) => {
      console.log(res.user.uid);

      createUser({
        uid: res.user.uid,
        data: { name: res.user.displayName, email: res.user.email },
        products: [],
      });
      if (res.user) {
        router.push("/home");
      }
    });
  };

  const handleRedirectResult = async () => {
    try {
      const result = await getRedirectResult(FirebaseAuth);

      if (result.user) {
        router.push("/home");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    handleRedirectResult();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#3D1B1F] via-[#722F37] to-[#8B4049] p-4">
      <div className="w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#C9A961] rounded-full mb-4">
            <Grape className="w-8 h-8 text-[#3D1B1F]" />
          </div>
          <h1 className="text-white text-3xl mb-2">VineTrace</h1>
          <p className="text-[#F5E6D3] text-sm">
            Trazabilidad Vitivinícola con Blockchain
          </p>
        </div>

        {/* Formulario de login */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          <h2 className="text-[#3D1B1F] text-2xl mb-6 text-center">
            Iniciar Sesión
          </h2>

          <form
            //  onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm text-[#722F37] mb-2"
              >
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8B4049]" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-[#C9A961]/30 rounded-lg focus:outline-none focus:border-[#722F37] transition-colors"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm text-[#722F37] mb-2"
              >
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8B4049]" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-[#C9A961]/30 rounded-lg focus:outline-none focus:border-[#722F37] transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Olvidé mi contraseña */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-[#8B4049] hover:text-[#722F37] transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Botón de submit */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#722F37] to-[#8B4049] text-white py-3 rounded-lg hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
            >
              Iniciar Sesión
            </button>
          </form>

          {/* Separador */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-[#C9A961]/30"></div>
            <span className="px-4 text-sm text-gray-500">o</span>
            <div className="flex-1 border-t border-[#C9A961]/30"></div>
          </div>

          {/* Registro */}
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              ¿No tienes una cuenta?{" "}
              <button
                onClick={onToggleView}
                className="text-[#722F37] hover:text-[#8B4049] transition-colors"
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-[#F5E6D3] text-xs">
            © 2026 VineTrace. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
