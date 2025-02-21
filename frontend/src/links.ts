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
    url : "/login",
    title : "Login",
    desc: "Login",
    icon : CiLogin
}

const HOST : string = "http://localhost:8080";

export { HEADER_LINKS, HOST, LOGIN_LINK };
export type { HeaderLink };

