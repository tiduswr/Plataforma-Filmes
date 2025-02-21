import { ApiMessageError, axiosInstance, errorDisplay } from "@/axios/axios"
import Button from "@/components/Button"
import FormInput from "@/components/FormInput"
import { zodResolver } from "@hookform/resolvers/zod"
import { AxiosError } from "axios"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import { SubscribeForm, SubscribeResponse, subscribeSchema } from "./types"

const Subscribe = () => {

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset
  } = useForm<SubscribeForm>({
    resolver: zodResolver(subscribeSchema)
  })

  const onSubmit = (data: SubscribeForm) => {
    
    axiosInstance.post<SubscribeResponse>(
      "/users/basic/register", 
      data
    ).then(({ data }) => {
      toast.success(`O usuário ${data.username} foi cadastrado!`);
      reset();
    }).catch((error : AxiosError<ApiMessageError>) => {
      errorDisplay(error, (message) => toast.error(message))
    })

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
          <h1 className="text-3xl font-medium">Cadastro</h1>
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
              name="name" 
              label="Nome" 
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
            <FormInput 
              name="passwordRepeat" 
              label="Repetir Senha" 
              type="password"
              errors={errors}
              register={register}
              clearErrors={clearErrors}
            />
          </div>
          <Button text="Cadastrar" type="submit"/>
          <div className="flex flex-col items-center gap-1 text-sm mt-4">
            <p>Já possuí um cadastro?</p>
            <Link to="/login" className="text-blue-700 hover:text-blue-500 font-bold underline">Fazer Login</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Subscribe;