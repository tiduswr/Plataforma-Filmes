import { IconType } from "react-icons";
import { CiLogin, CiVideoOn } from "react-icons/ci";

type HeaderLink = {
    url: string;
    title: string;
    desc: string;
    icon: IconType;
    privated: boolean;
}

type LoginMenuOptions = {
    url : string;
    title : string;
}

const LOGIN_LINK : HeaderLink = {
    url : "/login",
    title : "Login",
    desc: "Login",
    icon : CiLogin,
    privated: false
}

const MOVIES_LINK : HeaderLink = {
    url : "/my_movies",
    title : "Meus Videos",
    desc: "Meus Videos",
    icon : CiVideoOn,
    privated: true
}

const EDITAR_CADASTRO : LoginMenuOptions = {
    url: "/edit/user-data",
    title: "Meus dados"
}

const HEADER_LINKS : HeaderLink[] = [
    MOVIES_LINK
]

const LOGIN_MENU_LINKS : LoginMenuOptions[] = [
    EDITAR_CADASTRO
]

const HOST : string = "http://localhost:8080";

export { HEADER_LINKS, HOST, LOGIN_LINK, LOGIN_MENU_LINKS, MOVIES_LINK };
export type { HeaderLink };

