import { useNavigate } from 'react-router-dom';
import { removeToken } from '../../utils/auth';

export default function PaymentPending() {
    const navigate = useNavigate();

    const handleNavigate = () => {
        removeToken();
        navigate('/');
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-100 text-yellow-900 px-4">
            <h1 className="text-3xl font-bold mb-4">Pago pendiente ⏳</h1>
            <p className="mb-6">Tu pago está siendo procesado. Veras la información una vez aprobado el pago.</p>
            <button
                onClick={handleNavigate}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-xl shadow text-sm transition-all w-fit cursor-pointer"
            >
                Volver al inicio
            </button>
        </div>
    );
}
