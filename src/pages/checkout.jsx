import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePost } from "../hooks/usePost";
import { CircularProgress } from "@mui/material";
import { useGET } from "../hooks/useGET";
import { toast } from "sonner";

const Checkout = () => {
    const [searchParams] = useSearchParams();
    const [settings, loadingS, errorS] = useGET('settings');
    const [data, setData] = useState(null);

    useEffect(() => {
        if (settings && settings.length > 0 && !data) {
            setData(settings[0]);
        }
    }, [settings]);

    const navigate = useNavigate();
    const { post, loading, error } = usePost();
    const [userData, setUserData] = useState({
        nombre: "",
        telefono: "",
        email: "",
    });

    const court = searchParams.get('court') || 'No especificado';
    const id = searchParams.get('id') || 'No especificado';
    const date = searchParams.get('date') || 'No especificado';
    const time = searchParams.get('time') || 'No especificado';
    const description = searchParams.get('description') || 'No especificado';
    const type = searchParams.get('type') || 'No especificado';
    const price = parseFloat(searchParams.get('price')) || 20;
    const total = price;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const [day, month, year] = date.split("/");
        const formattedDate = `${year}-${month}-${day}`;
        const start_time = `${time}:00`;
        const [hours, minutes] = time.split(":").map(Number);
        const endDate = new Date();
        endDate.setHours(hours);
        endDate.setMinutes(minutes + 90);
        const end_time = `${String(endDate.getHours()).padStart(2, "0")}:${String(
            endDate.getMinutes()
        ).padStart(2, "0")}:00`;
        if (userData.email !== userData.emailConfirm) {
            toast.error('Los e-mails no coinciden');
            return;
        }


        const payload = {
            court_id: Number(id) || null,
            date: formattedDate,
            start_time,
            end_time,
            price,
            status: "approved",
            payment_method: "MercadoPago",
            payment_id: "MP-123456789",
            name: userData.nombre,
            phone: userData.telefono,
            email: userData.email,
        };

        try {
            const response = await post('appointments', payload);
            if (response && response.appointment_id) {
                navigate("/");
            }
        } catch (error) {
            console.error("Error al enviar los datos:", error);
        }
    };

    if (loadingS) {
        return (
            <div className="flex justify-center items-center h-64">
                <CircularProgress />
            </div>
        );
    }

    if (errorS) {
        return (
            <div className="text-center text-red-500 mt-4">
                Ocurrió un error al cargar los datos. Si el error persiste, contacte con la administración.
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-10 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">¡Ya casi terminamos!</h1>
                    <p className="text-gray-600">
                        Para completar tu reserva en <span className="font-semibold">{data?.name}</span>, por favor chequeá tus datos y luego confirmá.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="bg-green-600 text-white px-4 py-2 text-sm font-semibold tracking-wide">
                            {type.toUpperCase()}
                        </div>


                        <div className="p-6">
                            <div className="flex items-center gap-5 mb-6">
                                <img
                                    src="https://images.unsplash.com/photo-1641237003312-07cf9f83c9a5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FuY2hhcyUyMGRlJTIwcGFkZWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500"
                                    alt={data?.name}
                                    className="w-24 h-24 object-cover rounded-xl border border-gray-200 shadow-sm"
                                />
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-1">{data?.name}</h2>
                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2.25c4.97 0 9 4.03 9 9 0 6.75-9 10.5-9 10.5S3 18 3 11.25c0-4.97 4.03-9 9-9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 13.5a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" />
                                        </svg>
                                        {data?.address}
                                    </p>
                                </div>
                            </div>
                            <div className="divide-y divide-gray-200 text-sm text-gray-700">
                                <div className="flex justify-between py-2">
                                    <span className="font-medium">Fecha</span>
                                    <span>{date}</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="font-medium">Turno</span>
                                    <span>{time}</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="font-medium">Duración</span>
                                    <span>01:30hs</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="font-medium">{court}</span>
                                    <span>{description}</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="font-medium">Precio</span>
                                    <span className="font-semibold text-gray-900">${price.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between py-3 mt-2 border-t font-bold text-gray-800">
                                    <span>Seña / Total</span>
                                    <span className="text-green-600">${total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>


                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
                                <h3 className="text-lg font-bold mb-4 text-gray-800">Información personal</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-gray-600">Nombre: *</label>
                                        <input
                                            type="text"
                                            value={userData.nombre}
                                            required
                                            onChange={(e) => setUserData({ ...userData, nombre: e.target.value })}
                                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm text-gray-600">Teléfono: *</label>
                                        <input
                                            type="tel"
                                            value={userData.telefono}
                                            required
                                            onChange={(e) => setUserData({ ...userData, telefono: e.target.value })}
                                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="text-sm text-gray-600">E-mail: *</label>
                                        <input
                                            type="email"
                                            value={userData.email}
                                            required
                                            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                                        />

                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="text-sm text-gray-600">Confirmar e-mail: *</label>
                                        <input
                                            type="email"
                                            value={userData.emailConfirm || ''}
                                            required
                                            onChange={(e) => setUserData({ ...userData, emailConfirm: e.target.value })}
                                            className={`w-full mt-1 p-2 border rounded-md outline-none ${userData.emailConfirm && userData.emailConfirm !== userData.email
                                                ? 'border-red-500 focus:ring-red-500'
                                                : 'border-gray-300 focus:ring-green-500'
                                                }`}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            (Recibirás el voucher de la reserva)
                                        </p>
                                        {/* {userData.emailConfirm && userData.emailConfirm !== userData.email && (
                                            <p className="text-xs text-red-500 mt-1">Los correos no coinciden</p>
                                        )} */}
                                    </div>

                                </div>
                            </div>

                            <div className="text-center">
                                <button
                                    type="submit"
                                    className="cursor-pointer bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-full transition-all shadow-md"
                                >
                                    {loading ? (
                                        <CircularProgress size={22} color="inherit" thickness={5} />
                                    ) : (
                                        "Pagar con Mercado Pago"
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
};

export default Checkout;
