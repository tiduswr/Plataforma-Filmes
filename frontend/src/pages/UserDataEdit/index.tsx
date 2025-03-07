import { errorDisplay, privateAxiosInstance } from "@/axios/axios";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import ImagePicker from "@/components/ImagePicker";
import LoadingDots from "@/components/LoadingDots";
import useUserStore, { User } from "@/store/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BiSolidError } from "react-icons/bi";
import { toast } from "react-toastify";
import { UserEditForm, userEditSchema } from "./types";

const fetchUser = async ()  : Promise<User> => {    
    const response = await privateAxiosInstance.get<User>("/users/me");
    return response.data;
};

const updateUser = async (data: Partial<UserEditForm>) : Promise<User> => {
    const response = await privateAxiosInstance.put<User>("/users/update", data);
    return response.data;
};

const checkField = (field: keyof UserEditForm | keyof User, formData: UserEditForm, originalData?: User): string | undefined => {
    const formDataField = field as keyof UserEditForm;
    const originalDataField = field as keyof User;

    if (!(formDataField && originalDataField)) return undefined;
        
    return formData[formDataField] && formData[formDataField] !== originalData?.[originalDataField] ? formData[formDataField] : undefined;
}

const UserDataEdit = () => {

    const [enabledToSend, setEnabledToSend] = useState<boolean>(true);

    const { 
        data : originalData, 
        isLoading, 
        error,
        refetch
    } = useQuery<User>({ queryKey: ["users/me"], queryFn: fetchUser })

    const { setUserData } = useUserStore();

    const {
        register,
        handleSubmit,
        formState : { errors },
        clearErrors,
        setValue
    } = useForm<UserEditForm>({
        resolver: zodResolver(userEditSchema)
    });

    const updateAdSetUserData = async () => {
        try{
            const data = await fetchUser();
            setUserData(data);
        }catch(error){
            errorDisplay(error, (message) => toast.error(message));
        }
    }

    const { mutate } = useMutation<User, AxiosError, Partial<UserEditForm>>({
        mutationFn: updateUser,
        onSuccess: async (data) => {
            toast.success("Dados atualizados!");
            setUserData(data);
            await refetch();
        },
        onError: (error) => {
            errorDisplay(error, (message) => toast.error(message));
        },
        onSettled: () => {
            setEnabledToSend(true);
        }
    });    

    useEffect(() => {
        if(originalData){
            setValue("username", originalData.username);
            setValue("name", originalData.name);
            setValue("password", "");
            setValue("passwordRepeat", "");
        }
    }, [originalData, setValue])

    const onSubmit = (formData : UserEditForm) =>{
        setEnabledToSend(false);
        mutate({
            username: checkField("username", formData, originalData),
            name: checkField("name", formData, originalData),
            password: checkField("password", formData, originalData),
            passwordRepeat: checkField("passwordRepeat", formData, originalData)
        });
    }

    if(isLoading){
        return (
            <div className="flex flex-col items-center justify-center h-screen w-full">
                <div className="bg-white p-10 rounded shadow ml-5 mr-5 w-auto">
                    <LoadingDots />
                </div>
            </div>            
        )
    }

    if(error){
        return (
            <div className="flex flex-col items-center justify-center h-screen w-full">
                <div className="bg-white p-10 rounded shadow ml-5 mr-5 w-auto md:w-3xl">
                    <div className="flex flex-col gap-3 items-center justify-center text-center">
                        <div className="flex flex-row items-center justify-center">
                            <BiSolidError size={50} className="text-red-600"/>
                            <h1 className="font-bold text-3xl">{error.message}</h1>
                        </div>
                        <p>{error.stack}</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center h-screen w-full">
                <div className="bg-white p-10 rounded shadow ml-5 mr-5 w-auto md:w-2xl">
                    <h1 className="text-2xl font-medium">Editar dados cadastrais</h1>

                    <ImagePicker classname="mb-4 mt-6" onUpdate={updateAdSetUserData}/>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col gap-5 items-center justify-center"
                    >                        
                        <div className="w-full flex flex-col gap-2 mb-8">            
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
                        {enabledToSend ? (
                            <Button text="Salvar" type="submit"/>
                        ) : (
                            <LoadingDots />
                        )}                        
                    </form>
                </div>
            </div>
        </>
    );
}

export default UserDataEdit;