import DefaultLayout from "@/layouts/DefaultLayout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./components/PrivateRoute";
import Subscribe from "./pages/Subscribe";
import UserDataEdit from "./pages/UserDataEdit";

const queryClient = new QueryClient();

const App: React.FC = () => {
    return (
        <Router>
            <QueryClientProvider client={queryClient}>
                <ToastContainer 
                    closeOnClick={true}
                    autoClose={2000}
                />

                <Routes>
                    {/* Rotas públicas */}
                    <Route element={<DefaultLayout />}>
                        <Route path="/" element={<Home />} />
                    </Route>
                    <Route path="/login" element={<Login />} />
                    <Route path="/subscribe" element={<Subscribe />} />

                    {/* Rotas privadas */}
                    <Route element={<PrivateRoute />}>
                        <Route element={<DefaultLayout />}>
                            <Route path="/edit/user-data" element={<UserDataEdit />} />
                        </Route>
                    </Route>

                    {/* Rota 404 */}
                    <Route element={<DefaultLayout />}>
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Routes>
            </QueryClientProvider>
        </Router>
    );
}

export default App;
