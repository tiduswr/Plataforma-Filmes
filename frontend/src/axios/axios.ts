import { HOST } from '@/links';
import useAuthStore from '@/store/auth';
import axios, { AxiosError } from 'axios';

type TokenExpiredError = {
  isCustomError: true;
  code: "TOKEN_EXPIRED";
  message: string;
};

type FieldError = {
  field: string,
  message: string
}

type ApiMessageError = {
  message? : string,
  full_message? : string,
  fields?: FieldError[]
}

const privateAxiosInstance = axios.create({
  baseURL: HOST,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const publicAxiosInstance = axios.create({
  baseURL: HOST,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

privateAxiosInstance.interceptors.request.use(
  (config) => {
    const { token, expirationDate, removeAuthCredentials } = useAuthStore.getState();

    if (token && expirationDate) {
      const expiresIn : Date = new Date(expirationDate);
      if (new Date() > expiresIn) {
        removeAuthCredentials();
        console.warn("Token expirado. O usuário foi deslogado.");
        throw {
          isCustomError: true,
          code: "TOKEN_EXPIRED",
          message: "Sessão expirada. Faça login novamente.",
        } as TokenExpiredError;
      }

      config.headers.Authorization = `Bearer ${token.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const isAxiosError = (error: unknown): error is AxiosError<ApiMessageError> => {
  return (error as AxiosError)?.isAxiosError ?? false;
}

const errorDisplay = async (
  error: unknown, 
  onError: (message: string) => void, 
  logEnabled: boolean = true
) => {
  
  if ((error as TokenExpiredError)?.isCustomError && (error as TokenExpiredError)?.code === "TOKEN_EXPIRED") {
    onError("Sua sessão expirou. Faça login novamente.");
    await new Promise(resolve => setTimeout(resolve, 2000));
    window.location.href = "/login"; // useNavigate só funciona dentro de componentes
    return;
  }

  if (!isAxiosError(error) || !error.response?.data) {
    onError((error as Error)?.message || "Ocorreu um erro desconhecido.");
    return;
  }

  const { response } = error;
  const { data, status, statusText } = response;
  
  if (data.fields?.length) {
    data.fields.forEach(field => onError(field.message));
  } else {
    onError(data.message || `Erro: ${status} ${statusText}`);
  }

  if (logEnabled && (data.full_message || response)) {
    console.error(data.full_message || response);
  }
}

export { errorDisplay, privateAxiosInstance, publicAxiosInstance };
export type { ApiMessageError, FieldError };

