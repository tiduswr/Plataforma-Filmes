import LinkButton from "@/components/Link";
import UnderlineHoverButton from "@/components/UnderlineHoverLink";
import { HEADER_LINKS, HeaderLink, LOGIN_LINK } from "@/links";
import useAuthStore from "@/store/auth";
import useUserStore from "@/store/user";
import { useState } from "react";
import { CiLogin, CiMenuBurger } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { Link } from "react-router-dom";
import LoginAvatar from "../LoginAvatar";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { logged } = useAuthStore();
    const { user } = useUserStore();

    return (
        <header className="absolute w-full z-50">
            <nav className="bg-white px-4 shadow-2xs border-b border-gray-200">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl py-2">
                    <Link to="/" className="flex items-center bg-gray-900 px-2 py-0.5 rounded">
                        <img src="/logo_white.svg" alt="Plataforma de Filmes" className="mr-3 h-6 sm:h-9" />
                        <span className="self-center text-xl font-semibold whitespace-nowrap text-white">PlatFilmes</span>
                    </Link>
                    <div className="flex items-center lg:order-2 text-sm">
                        
                        {logged && user ? (
                            <LoginAvatar />
                        ) : (
                            <LinkButton url={LOGIN_LINK.url} className="flex flex-row">
                                Login<CiLogin size={18} />
                            </LinkButton>
                        )}
                        
                        <button 
                            type="button"
                            className="ml-3 inline-flex items-center p-2 text-sm text-gray-500 rounded-lg lg:hidden active:text-blue-700 font-bold"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <span className="sr-only">Abrir menu</span>
                            {isMenuOpen ? (
                                <IoMdClose size={20} style={{ strokeWidth: 2 }} />
                            ) : (
                                <CiMenuBurger size={20} style={{ strokeWidth: 2 }} />
                            )}
                        </button>
                    </div>
                    <div className={`${isMenuOpen ? "flex" : "hidden"} flex-col justify-between items-center w-full lg:flex lg:w-auto lg:order-1`} id="mobile-menu-2">
                        <ul className="flex flex-col text-sm font-medium lg:flex-row lg:space-x-8 lg:mt-0 w-full h-full mt-3 gap-2">
                            {HEADER_LINKS.map(({ title, desc, icon: Icon }: HeaderLink, index) => (
                                <li key={index} className={isMenuOpen ? `active:outline-1 active:outline-blue-700 active:text-blue-700` : ""}>
                                    <UnderlineHoverButton title={title} desc={desc} icon={<Icon size={18} />} prepEndIcon={true} />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;
