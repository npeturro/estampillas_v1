
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { usePost } from "../hooks/usePost";
import { setToken, setUser } from "../utils/auth";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useGET } from "../hooks/useGET";
import { toast } from "sonner";


export default function Login() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    // const { post, loading, error } = usePost();
    // cada vez que cambie `routine` del hook, la guardamos en el context
    // const onSubmit = async (data) => {
    //     const userCredentials = {
    //         user: data.user,
    //         password: data.password
    //     };
    //     navigate('/online_stamps');

        // const response = await post('login', userCredentials);

        // if (response && response.token) {
        //     setToken(response.token);
        //     const decoded = jwtDecode(response.token);
        //     if (decoded.data.role === "admin") {
        //         navigate('/admin/dashboard');
        //     }
        // }
    // };
    const onSubmit = async (data) => {
        try {
            setLoading(true);
            // no uso el hook de useGET porq en este no me sirve y no vale la pena armar otro solo para login
            const tokenResponse = await axios.get(`https://circulokinesiologossursantafe.com/estampillas/circulo_estampillas_be/api/login/estampilla_online?u=${data.user}`);

            const token = tokenResponse.data.token;
            if (!token) {
                toast.error("Ha ocurrido un error al intentar ingresar.");
            }

            const loginResponse = await axios.post(
                `https://circulokinesiologossursantafe.com/estampillas/circulo_estampillas_be/api/login/estampilla_online`,
                {
                    t: token,
                    ss: data.password,
                }
            );

            const userData = loginResponse.data;

            setToken(token);
            setUser(userData);
            // ver esto
            // if (userData.rol === "Administrador") {
            //     navigate("/admin/dashboard");
            // } else {
            //     navigate("/online_stamps");
            // }
            navigate("/online_stamps");

        } catch (err) {
            console.error("Error al iniciar sesión:", err);
            toast.error("Error al iniciar sesión. Verificá tus credenciales.");
        } finally{
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        alt="company"
                        src={"src/assets/logo_ck.png"}
                        className="mx-auto h-40 w-40 object-cover rounded-full shadow-lg"
                    />
                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                        Iniciar sesión
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    placeholder="Usuario"
                                    {...register("user", { required: "El usuario es obligatorio" })}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none ${errors.user ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {errors.user && (
                                    <p className="text-red-500 text-sm">{errors.user.message}</p>
                                )}
                            </div>

                        </div>

                        <div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Contraseña"
                                    {...register("password", {
                                        required: "La contraseña es obligatoria",
                                    })}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none ${errors.password ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-4 text-sm text-gray-500"
                                >
                                    {showPassword ? "Ocultar" : "Ver"}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-sm">{errors.password.message}</p>
                            )}
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                {loading ? 'Cargando...' : 'Ingresar'}
                            </button>
                            {/* {error && (
                                <p className="text-red-500 text-sm mt-2">{error}</p>
                            )} */}
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
