import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
 
import Logo from "../assets/logo";
import DefaultLayout from "../layout/defaultLayout";
import { useAuth } from "../context/auth";
import SecretEyeIcon from "../assets/SecretEyeIcon";
import axiosInstance from "../helper/axiosInstance";
import Toast from "../components/Toast/toast";
 
// Schema de validação usando Zod
const loginSchema = z.object({
  usuario: z
    .string()
    .min(1, "Usuário é obrigatório"),
  senha: z.string().min(1, "Senha é obrigatória"),
});
 
type ToastType = "success" | "danger" | "warning";
 
interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}
 
type LoginFormInputs = z.infer<typeof loginSchema>;
 
function Login() {
  const navigate = useNavigate();
  const { signIn, signOut, requirePasswordReset } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
 
  useEffect(() => {
    signOut();
  }, []);
 
  const addToast = (type: ToastType, message: string) => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, type, message }]);
    setTimeout(() => removeToast(id), 5000);
  };
 
  const removeToast = (id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };
 
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });
 
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
 
  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true);
 
    try {
      // Enviar usuário e senha para autenticação
      const authResponse = await axiosInstance.post(
        "/auth/loginVendedor",
        {
          login: data.usuario,
          senha: data.senha,  // Enviar a senha aqui
        },
        {
          headers: {
            "Content-Type": "application/json",
            // Removido "User-Agent" pois não pode ser configurado no navegador
          },
        }
      );
 
      if (!authResponse.data) {
        throw new Error("Sistema encontra-se fora do ar temporariamente.");
      }
 
      // Supondo que o backend retorne um cookie ou algo útil
      const { cookie } = authResponse.data;
      const { codemp } = authResponse.data;
      const { codvend } = authResponse.data;

      sessionStorage.setItem("authCookie", cookie);
      sessionStorage.setItem("codEmp", codemp);
      sessionStorage.setItem("codVend", codvend);

      // A lógica de navegação e autenticação vai aqui
      signIn();
      requirePasswordReset(false);
      navigate("/Tabela", {
        state: { usuario: data.usuario },
      });
    } catch (error) {
      let errorMessage =
        "Sistema encontra-se fora do ar temporariamente. ERR_43";
      if (error instanceof Error) {
        if ((error as any).response && (error as any).response.data) {
          errorMessage =
            (error as any).response.data.message ||
            (error as any).response.data.Response ||
            error.message;
        } else {
          errorMessage = error.message;
        }
      }
      addToast("danger", errorMessage);
    } finally {
      setLoading(false);
    }
  };
 
 
 
 
  return (
    <DefaultLayout>
      <div className="fixed bottom-0 right-0 mb-2 mr-6">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            type={toast.type}
            message={toast.message}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
      <section className="bg-gray-100 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
          <div className="flex items-center">
            <Logo className="w-full h-36 fill-black dark:fill-white" />
          </div>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <form
                className="space-y-4 md:space-y-6"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div>
                  <input
                    type="text"
                    placeholder="Digite seu Usuário"
                    disabled={loading}
                    {...register("usuario")}
                    className={`bg-gray-50 border text-gray-900 rounded-lg w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white ${errors.usuario
                      ? "border-red-500 outline-red-500"
                      : "border-gray-300 dark:border-gray-600"
                      }`}
                  />
                  {errors.usuario && (
                    <p className="text-red-500 text-sm">{errors.usuario.message}</p>
                  )}
                </div>
                <div>
                  <div className="relative w-full">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      disabled={loading}
                      maxLength={18}
                      {...register("senha")}
                      autoComplete="off"
                      className={`bg-gray-50 border text-gray-900 rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white ${errors.senha
                        ? "border-red-500 outline-red-500"
                        : "border-gray-300 dark:border-gray-600"
                        }`}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 end-0 flex items-center pe-3"
                    >
                      <SecretEyeIcon showPassword={showPassword} />
                    </button>
                  </div>
                  {errors.senha && (
                    <p className="text-red-500 text-sm">{errors.senha.message}</p>
                  )}
                </div>
 
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full text-white ${loading
                    ? "bg-gray-700 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                    } font-medium rounded-lg text-sm px-6 py-3 text-center`}
                >
                  {loading ? "Carregando..." : "Login"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
 
export default Login;