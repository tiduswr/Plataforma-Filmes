import { HOST } from '@/links';
import axios, { AxiosError } from 'axios';

const axiosInstance = axios.create({
  baseURL: HOST,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

type FieldError = {
  field: string,
  message: string
}

type ApiMessageError = {
  message? : string,
  full_message? : string,
  fields?: FieldError[]
}

const errorDisplay = (
  { response } : AxiosError<ApiMessageError>, 
  onError : (message : string) => void,
  logEnabled : boolean = true
) : void => {

  const data = response?.data;

  if(data && data.fields){
    const fields = data.fields;

    fields.forEach(field => {
      onError(field.message);
    });
  }else if(!data || !data.message){
    onError(response ? `Erro no servidor: ${response.status} ${response.statusText}` : "Serviço indisponível");
    if(response && logEnabled) console.error(response);
  }else{
    onError(data.message);
    if(data.full_message && logEnabled){
      console.error(data.full_message);
    }
  }

}

export { axiosInstance, errorDisplay };
export type { ApiMessageError, FieldError };

