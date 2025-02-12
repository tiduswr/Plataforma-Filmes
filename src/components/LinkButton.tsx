import { ReactNode } from "react";

interface LinkProps {
    url: string;
    children: ReactNode;
    className?: string;
}

const LinkButton = ({url = "#", children, className} : LinkProps) => {
    return (
        <a 
            href={url}
            className={`text-white bg-blue-900 hover:bg-blue-700 active:bg-blue-700 rounded text-sm px-4 py-2 ${className}`}
        >
            {children}
        </a>
    )
}

export default LinkButton;