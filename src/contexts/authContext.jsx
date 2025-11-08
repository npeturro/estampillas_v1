import { createContext, useContext, useEffect, useState } from "react";
import { getToken, isAuthenticated, removeToken } from "../utils/auth";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useGET } from "../hooks/useGET";

const AuthContext = createContext();
const baseURL = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async (mail) => {
        try {
            const response = await axios.get(`${baseURL}users?mail=${userMail}`);
            setUser(response.data);
        } catch (error) {
            console.error("Error fetching user:", error);
            removeToken();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const initAuth = async () => {
            const token = getToken();

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const decoded = jwtDecode(token);
                const mail = decoded?.mail;

                if (!mail) {
                    removeToken();
                    setLoading(false);
                    return;
                }
                console.log(mail)
                await fetchUser(mail);
            } catch (error) {
                console.error("Invalid token", error);
                removeToken();
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (mail, password) => {
        try {
            const response = await axios.post(`${baseURL}authenticacion/login`, { mail, password });

            const { token } = response.data;
            sessionStorage.setItem("token", token);

            const decoded = jwtDecode(token);
            const userMail = decoded?.mail;

            if (userMail) {
                const userRes = await axios.get(`${baseURL}users?mail=${userMail}`);
                setUser(userRes.data);
            }

        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            throw error; // Para manejarlo desde el componente que llama a login
        }
    };


    const logout = () => {
        removeToken();
        setUser(null);
    };


    return (
        <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
