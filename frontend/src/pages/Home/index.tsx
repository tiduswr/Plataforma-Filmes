import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { FaRegComments } from "react-icons/fa";
import { GrGroup } from "react-icons/gr";
import { LuSearch, LuVideo } from "react-icons/lu";

function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex flex-col">
        <section className="relative w-full h-100 flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center blur-xs"
            style={{
              backgroundImage: "url('/home01.webp')",
            }}
          ></div>
          <div className="absolute inset-0 bg-black/70"></div>
          <div className="relative text-white text-center p-10 lg:mx-20">
            <div className="flex flex-row items-center justify-center text-3xl lg:text-5xl">
              <img src="/logo_white.svg" alt="Plataforma de Filmes" className="mr-3 h-10 lg:h-14" />
              <h1 className="font-bold">PlatFilmes</h1>
            </div>
            <p className="mt-5 text-sm lg:text-base text-justify">
              Nossa plataforma oferece um espaço dinâmico para criadores e amantes de filmes compartilharem suas produções, 
              comentarem e interagirem com outros usuários. Aqui, você pode enviar seus vídeos, deixar reações, compartilhar 
              opiniões e descobrir novos conteúdos em uma comunidade vibrante e engajada.
            </p>
          </div>
        </section>
        <section className="flex items-center flex-col min-h-80 text-white gap-5 p-10 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 overflow-hidden">
          <h2 className="text-xl mb-3 lg:text-2xl font-bold lg:mb-10">Principais Funcionalidades:</h2>
          <ul className="space-y-3 text-center lg:flex lg:gap-5 lg:text-center">
            <li className="flex flex-col items-center gap-2">
              <LuVideo className="text-xl" size={50}/>
              <p><strong>Envio de vídeos</strong> para compartilhar suas produções</p>
            </li>
            <li className="flex flex-col items-center gap-2">
              <FaRegComments className="text-xl" size={50}/>
              <p><strong>Sistema de comentários</strong> e reações para interação direta</p>
            </li>
            <li className="flex flex-col items-center gap-2">
              <LuSearch className="text-xl" size={50}/>
              <p><strong>Descoberta de conteúdos</strong> através de recomendações e tendências</p>
            </li>
            <li className="flex flex-col items-center gap-2">
              <GrGroup className="text-xl" size={50}/>
              <p><strong>Comunidade engajada</strong>, conectando criadores e espectadores</p>
            </li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Home;
