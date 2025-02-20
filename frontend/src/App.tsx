import DefaultLayout from "@/layouts/DefaultLayout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Importação do CSS obrigatório
import Subscribe from "./pages/Subscribe";

const App: React.FC = () => {
    return (
        <Router>
            <ToastContainer 
                closeOnClick={true}
                autoClose={2000}
            />

            <Routes>
                <Route element={<DefaultLayout />}>
                    <Route path="/" element={<Home />} />
                </Route>

                <Route path="/login" element={<Login />} />
                <Route path="/subscribe" element={<Subscribe />} />

                <Route element={<DefaultLayout />}>
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
