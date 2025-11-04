import { jwtDecode } from "jwt-decode";


// Guardo el token en localStorage
export const setToken = (token) => {
    localStorage.setItem("token", token);
};
export const setUser = (us) => {
    localStorage.setItem("us", us);
};

// Obtengo el token
export const getToken = () => {
    return localStorage.getItem("token");
};
export const getUser = () => {
    const token = getToken();
    if (!token) return false;
    // if (isAuthenticated()) {
    //     const decoded = jwtDecode(token);
    //     return decoded.data;
    // }
    return localStorage.getItem("us");

};

// Elimino el token (logout)
export const removeToken = () => {
    localStorage.removeItem("token");
};

// Verifico si el token es válido (no expirado)
export const isAuthenticated = () => {
    const token = getToken();
    if (!token) return false;

    try {
        const { exp } = jwtDecode(token);
        return exp * 1000 > Date.now(); // Comparar con el tiempo actual ya q viene 1746915479  
    } catch (err) {
        return false;
    }
};

// Obtener los datos del usuario desde el token
export const getUserFromToken = () => {
    const token = getToken();
    if (!token) return null;

    try {
        return jwtDecode(token);
    } catch (err) {
        return null;
    }
};
