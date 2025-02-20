import { Link } from "react-router-dom";
import { LinkProps } from "./types";

const LinkButton : React.FC<LinkProps> = ({url = "#", children, className}) => {
    return (
        <Link 
            to={url}
            className={`cursor-pointer font-bold text-white bg-blue-700 hover:bg-blue-900 active:bg-blue-500 rounded text-sm px-4 py-2 ${className}`}
        >
            {children}
        </Link>
    )
}

export default LinkButton;