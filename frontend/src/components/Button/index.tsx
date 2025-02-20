import { ButtonProps } from "./types";

const Button : React.FC<ButtonProps> = ({ type, text }) => {
  return (
    <button type={type} 
        className="cursor-pointer font-bold text-white bg-blue-700 hover:bg-blue-900 active:bg-blue-500 rounded text-sm px-4 py-2">
        {text}
    </button>
  )
}

export default Button;