import { jwtDecode } from "jwt-decode";


// Guardo el token en sessionStorage
export const setToken = (token) => {
    sessionStorage.setItem("token", token);
};
export const setUser = (us) => {
    sessionStorage.setItem("us", JSON.stringify(us));
};
// Obtengo el token
export const getToken = () => {
    return sessionStorage.getItem("token");
};
export const getUser = () => {
    const token = getToken();
    if (!token) return false;
    // if (isAuthenticated()) {
    //     const decoded = jwtDecode(token);
    //     return decoded.data;
    // }
    const stored = sessionStorage.getItem("us");
    return stored ? JSON.parse(stored) : null

};

// Elimino el token (logout)
export const removeToken = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("us");
};

// Verifico si el token es válido (no expirado)
export const isAuthenticated = () => {
    const token = getToken();
    if (!token) return false;

    return true
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
