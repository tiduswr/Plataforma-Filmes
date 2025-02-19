import { IconType } from "react-icons";
import { CiLogin, CiVideoOn } from "react-icons/ci";

type HeaderLink = {
    url: string;
    title: string;
    desc: string;
    icon: IconType;
}

const HEADER_LINKS : HeaderLink[] = [
    {
        url : "#",
        title : "Filmes",
        desc: "Filmes",
        icon : CiVideoOn
    }
]

const LOGIN_LINK : HeaderLink = {
    url : "#",
    title : "Login",
    desc: "Login",
    icon : CiLogin
}

export { HEADER_LINKS, LOGIN_LINK };
export type { HeaderLink };

