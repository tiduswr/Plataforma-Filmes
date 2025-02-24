import { ButtonHTMLAttributes } from "react";

type ButtonProps = {
    type?: "button" | "submit" | "reset",
    text: string,
    className?: string,
    btProps?: ButtonHTMLAttributes<HTMLButtonElement>
}

export type { ButtonProps };
