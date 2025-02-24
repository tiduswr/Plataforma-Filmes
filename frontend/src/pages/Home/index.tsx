import { FaRegComments } from "react-icons/fa";
import { GrGroup } from "react-icons/gr";
import { LuSearch, LuVideo } from "react-icons/lu";

const Home :React.FC= () => {
  return (
    <>
      <div className="flex flex-col mt-14">
        <section className="h-134 flex items-center justify-center bg-cover bg-center relative sm:px-10 xl:px-50"
          style={{ backgroundImage: "url('/home01.webp')"}}>
          <div className="absolute inset-0 bg-black/80"></div>
          <div className="relative text-white text-center p-10 lg:mx-20">
            <div className="flex flex-row items-center justify-center text-5xl lg:text-7xl">
              <img src="/logo_white.svg" alt="Plataforma de Filmes" className="mr-3 h-16 lg:h-14" />
              <h1 className="font-bold">PlatFilmes</h1>
            </div>
            <p className="mt-5 lg:text-xl text-justify">
              Nossa plataforma oferece um espaço dinâmico para criadores e amantes de filmes compartilharem suas produções, 
              comentarem e interagirem com outros usuários. Aqui, você pode enviar seus vídeos, deixar reações, compartilhar 
              opiniões e descobrir novos conteúdos em uma comunidade vibrante e engajada.
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center text-white bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 p-10 sm:px-10 xl:px-80 lg:h-80">
          <div className="text-center">
            <h2 className="text-xl mb-3 lg:text-2xl font-bold lg:mb-10">Principais Funcionalidades:</h2>
            <ul className="space-y-3 text-center lg:flex lg:gap-5 lg:text-center">
              <li className="flex flex-col items-center gap-2">
                <LuVideo className="text-xl" size={50} />
                <p><strong>Envio de vídeos</strong> para compartilhar suas produções</p>
              </li>
              <li className="flex flex-col items-center gap-2">
                <FaRegComments className="text-xl" size={50} />
                <p><strong>Sistema de comentários</strong> e reações para interação direta</p>
              </li>
              <li className="flex flex-col items-center gap-2">
                <LuSearch className="text-xl" size={50} />
                <p><strong>Descoberta de conteúdos</strong> através de recomendações e tendências</p>
              </li>
              <li className="flex flex-col items-center gap-2">
                <GrGroup className="text-xl" size={50} />
                <p><strong>Comunidade engajada</strong>, conectando criadores e espectadores</p>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}

export default Home;
