import { ApiMessageError, errorDisplay, privateAxiosInstance, publicAxiosInstance } from "@/axios/axios"
import Button from "@/components/Button"
import FormInput from "@/components/FormInput"
import useAuthStore from "@/store/auth"
import useUserStore from "@/store/user"
import { zodResolver } from "@hookform/resolvers/zod"
import { AxiosError } from "axios"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { LoginForm, LoginResponse, loginSchema, UserResponse } from "./types"

const Login = () => {

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  })

  const { setAuthCredentials, removeAuthCredentials } = useAuthStore();

  const { setUserData, deleteUserData } = useUserStore();

  const navigate = useNavigate();

  const onSubmit = async (form: LoginForm) => {
    
    try {
      const tokenResponse = await publicAxiosInstance.post<LoginResponse>("/login", form);
      const { accessToken, expiresIn } = tokenResponse.data;
      setAuthCredentials({ token: accessToken, expiresIn });

      const userDataResponse = await privateAxiosInstance.get<UserResponse>("/users/me");
      const { data : userData } = userDataResponse;
      setUserData(userData);

      navigate("/");
    } catch (error) {
      errorDisplay(error as AxiosError<ApiMessageError>, (message) => toast.error(message));
      removeAuthCredentials();
      deleteUserData();
    }

  }

  return (
    <div 
      className="flex h-screen items-center justify-center relative"
      style={{ 
        backgroundImage: "url('/home01.webp')", 
        backgroundSize: 'cover', 
        backgroundPosition: 'center' 
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-lg"></div>
      <div className="relative z-10 bg-white rounded shadow p-10 w-full max-w-lg">
        <Link to="/" className="relative flex items-center justify-center bg-gray-900 px-2 py-0.5 rounded">
          <img src="/logo_white.svg" alt="Plataforma de Filmes" className="mr-3 h-5 lg:h-14" />
          <h1 className="font-bold text-white text-4xl">PlatFilmes</h1>
        </Link>
        
        <form 
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center justify-center mt-5 w-full"
        >
          <h1 className="text-3xl font-medium">Login</h1>
          <div className="w-full flex flex-col gap-2 mb-8 mt-8">
            <FormInput 
              name="username" 
              label="Usuário" 
              type="text"
              errors={errors}
              register={register}
              clearErrors={clearErrors}
            />
            <FormInput 
              name="password" 
              label="Senha" 
              type="password"
              errors={errors}
              register={register}
              clearErrors={clearErrors}
            />
          </div>
          <Button text="Entrar" type="submit"/>
          <div className="flex flex-col items-center gap-1 text-sm mt-4">
            <p>Ainda não possuí um cadastro?</p>
            <Link to="/subscribe" className="text-blue-700 hover:text-blue-500 font-bold underline">Cadastre-se</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login;

