import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getUser, removeToken } from '../utils/auth';
import { useGET } from '../hooks/useGET';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { usePost } from '../hooks/usePOST';
import Loading from '../components/loading';

export default function PaymentService() {
    const navigate = useNavigate();
    const location = useLocation();
    const userAuth = getUser();
    const { post, loadingp, errorp } = usePost();
    const [services, loading, error] = useGET('services');
    const [selectedService, setSelectedService] = useState(location.state?.serviceId || '');
    const [selectedServiceData, setSelectedServiceData] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('transferencia');
    const [loadingPayment, setLoadingPayment] = useState(false);
    const [preferenceId, setPreferenceId] = useState(null);

    useEffect(() => {
        initMercadoPago("APP_USR-cc9e3c6c-a0c8-4875-a2e7-a904e1d0b2de", { locale: "es-AR" });
    }, []);

    useEffect(() => {
        if (selectedService) {
            const servicio = services.find(s => s.id === selectedService);
            setSelectedServiceData(servicio || null);
        }
    }, [selectedService, services]);

    const createPreference = async () => {
        try {
            const datos = {
                title: selectedServiceData.title,
                quantity: 1,
                price: selectedServiceData.price,
                user_id: userAuth.id,
                service_id: selectedServiceData.id
            };
            const response = await post('payments/createPreference', datos);
            return response.id;
        } catch (error) {
            console.error('Error al crear preferencia:', error);
        }
    };

    const handleSubmit = async () => {
        if (!selectedService || !paymentMethod) return;
        setLoadingPayment(true);

        if (paymentMethod === 'mercado_pago') {
            const id = await createPreference();
            if (id) setPreferenceId(id);
        } else {
            const datos = {
                user_id: userAuth.id,
                service_id: selectedServiceData.id,
                price: selectedServiceData.price
            };
            const response = await post('payments/method/transfer', datos);
            alert("Recordá el alias, serás redirigido al inicio!");
            removeToken();
            navigate('/');
        }

        setLoadingPayment(false);
    };

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
        >
            <div className="bg-black text-white px-6 py-8 mb-20 min-h-screen">
                <h1 className="text-3xl font-bold mb-8">Elegí tu servicio y forma de pago</h1>

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Servicio</label>
                    <select
                        value={selectedService}
                        onChange={(e) => {
                            setSelectedService(e.target.value);
                            setPreferenceId(null);
                        }}
                        className="w-full p-2 rounded-lg bg-white text-black"
                    >
                        <option value="">Seleccioná un servicio</option>
                        {services.map(service => (
                            <option key={service.id} value={service.id}>
                                {service.title}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedServiceData && (
                    <div className="bg-gray-900 p-4 rounded-lg my-6 border border-gray-700">
                        <h2 className="text-xl font-semibold mb-2">{selectedServiceData.title}</h2>
                        <p className="text-sm text-gray-400">{selectedServiceData.description || 'Sin descripción disponible'}</p>
                        <p className="text-lg font-bold mt-2 text-yellow-400">$ {selectedServiceData.price}</p>
                    </div>
                )}

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Método de pago</label>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div
                            onClick={() => { setPaymentMethod('transferencia'); setPreferenceId(null); }}
                            className={`p-4 rounded-lg border cursor-pointer transition-all ${paymentMethod === 'transferencia' ? 'border-yellow-500 bg-gray-800' : 'border-gray-700'
                                }`}
                        >
                            <h3 className="text-lg font-bold mb-2">🏦 Transferencia</h3>
                            <p className="text-sm text-gray-300">Pagá con alias. Requiere comprobante.</p>
                        </div>

                        <div
                            onClick={() => { setPaymentMethod('mercado_pago'); setPreferenceId(null); }}
                            className={`p-4 rounded-lg border cursor-pointer transition-all ${paymentMethod === 'mercado_pago' ? 'border-yellow-500 bg-gray-800' : 'border-gray-700'
                                }`}
                        >
                            <h3 className="text-lg font-bold mb-2">💳 Mercado Pago</h3>
                            <p className="text-sm text-gray-300">Pagá al instante con tu cuenta.</p>
                        </div>
                    </div>
                </div>

                {paymentMethod === 'transferencia' && (
                    <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 mb-4">
                        <h4 className="text-lg font-semibold mb-2">Datos para transferencia</h4>
                        <p><strong>Alias:</strong> mi.alias.mp</p>
                        <p>Se activará tu suscripción una vez aprobada la transferencia</p>
                        <p className="mt-2 text-sm text-gray-400">Luego de transferir, por favor enviá el comprobante al WhatsApp + 54 9 341 555 8585 o por email a pagos@pagos.com.</p>
                    </div>
                )}

                {paymentMethod === 'mercado_pago' && preferenceId && (
                    <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 mb-4">
                        <h4 className="text-lg font-semibold mb-2">Pagá con Mercado Pago</h4>
                        <Wallet
                            initialization={{ preferenceId }}
                            customization={{ texts: { valueProp: "smart_option" } }}
                        />
                    </div>
                )}

                <div className="flex justify-end">
                    <button
                        disabled={!selectedService || loadingPayment}
                        onClick={handleSubmit}
                        className="bg-yellow-500 cursor-pointer hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded-full transition w-full sm:w-auto mt-4"
                    >
                        {loadingPayment ? 'Procesando...' : 'Confirmar'}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
