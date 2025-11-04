import { useParams } from "react-router-dom";
const { establecimiento } = useParams();
const usuarios = [
    { id: 1, nombre: "Juan Pérez", email: `sa@${establecimiento}.com`, rol: "Admin" },
    { id: 2, nombre: "María López", email: `prof1@${establecimiento}.com`, rol: "Profesional" },
    { id: 3, nombre: "Carlos Gómez", email: `prof2@${establecimiento}.com`, rol: "Profesional" },
];

export default usuarios;
