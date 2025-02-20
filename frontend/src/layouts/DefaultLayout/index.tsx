import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Outlet } from "react-router-dom";

const DefaultLayout : React.FC  = () => {
  return (
    <div className="flex flex-col h-screen">
        <Header/>
        <main>
          <Outlet/>
        </main>
        <Footer/>
    </div>
  )
}

export default DefaultLayout
