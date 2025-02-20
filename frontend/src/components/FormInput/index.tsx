import { FieldValues } from "react-hook-form";
import { InputProps } from "./types";

const FormInput = <T extends FieldValues>({
  name,
  label,
  type = "text",
  register,
  errors,
  clearErrors,  
}: InputProps<T>) => {

  const handleChange = () => {
    if(errors[name]){
      clearErrors(name);
    }
  };

  return (
    <div>
      <label htmlFor={name as string} className="block mb-1 text-sm font-medium text-gray-900">
        {label}
      </label>
      <input
        id={name as string}
        type={type}
        {...register(name)}
        onChange={handleChange}
        className={`appearance-none border ${errors[name] ? "border-red-600" : "border-gray-200"} 
          shadow w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 rounded text-base 
          focus:outline-none focus:ring-2 ${errors[name] ? "focus:ring-red-600" : "focus:ring-blue-800"} 
          focus:border-transparent`}
      />
      {errors[name] && typeof errors[name]?.message === "string" && (
        <p className="text-xs text-red-600 mt-1">{errors[name]?.message}</p>
      )}
    </div>
  );
};

export default FormInput;
