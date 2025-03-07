import { ButtonProps } from "./types";

const Button : React.FC<ButtonProps> = ({ text, className, btProps }) => {
  return (
    <button 
        {...btProps}
        className={`cursor-pointer font-bold text-white bg-blue-700 hover:bg-blue-900 active:bg-blue-500 rounded text-sm px-4 py-2 ${className}`}>
        {text}
    </button>
  )
}

export default Button;