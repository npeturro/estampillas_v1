import { useNavigate } from 'react-router-dom';
import { removeToken } from '../../utils/auth';

export default function PaymentFailure() {
    const navigate = useNavigate();

    const handleNavigate = () => {
        removeToken();
        navigate('/');
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-red-100 text-red-900 px-4">
            <h1 className="text-3xl font-bold mb-4">Error en el pago ❌</h1>
            <p className="mb-6">El pago no se pudo completar. Por favor, intentá nuevamente o elegí otro método.</p>
            <button
                onClick={handleNavigate}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-xl shadow text-sm transition-all w-fit cursor-pointer"
            >
                Volver al inicio
            </button>
        </div>
    );
}
