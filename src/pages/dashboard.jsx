import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import GroupsIcon from '@mui/icons-material/Groups';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { useGET } from '../hooks/useGET';
import { CircularProgress, Typography } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Dashboard() {
    const [dashboard, loading, error] = useGET('dashboard');
    const currentMonth = new Date().toLocaleString('es-ES', { month: 'long' });
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 mt-10">
                Ocurrió un error al cargar los datos. Si el error persiste, contáctese con la administración.
            </div>
        );
    }

    const cards = [
        {
            title: "Canchas activas",
            value: dashboard?.courts_available ?? 0,
            icon: <GroupsIcon className="text-yellow-500" />,
            color: "from-yellow-100 to-yellow-50",
        },
        {
            title: "Reservas hoy",
            value: dashboard?.appointments_today ?? 0,
            icon: <AccessTimeIcon className="text-blue-500" />,
            color: "from-blue-100 to-blue-50",
        },
        {
            title: "Reservas del mes",
            value: dashboard?.appointments_month ?? 0,
            icon: <FitnessCenterIcon className="text-green-500" />,
            color: "from-green-100 to-green-50",
        },
        {
            title: `Ingresos de ${currentMonth}`,
            value: `$${parseFloat(dashboard?.prices_month?.price || 0).toLocaleString()}`,
            icon: <MonetizationOnIcon className="text-emerald-500" />,
            color: "from-emerald-100 to-emerald-50",
        },
    ];

    const COLORS = ['#60A5FA', '#FBBF24', '#34D399', '#F87171', '#A78BFA'];

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                Dashboard
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {cards.map((card, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className={`cursor-pointer bg-gradient-to-br ${card.color} rounded-2xl shadow-md p-5 flex items-center justify-between transition`}
                    >
                        <div>
                            <p className="text-sm text-gray-500 font-medium">
                                {card.title}
                            </p>
                            <h3 className="text-2xl font-bold text-gray-800 mt-1">
                                {card.value}
                            </h3>
                        </div>
                        <div className="bg-white p-3 rounded-xl shadow-inner">
                            {card.icon}
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Reservas por cancha del día
                </h3>
                {dashboard?.stats_per_court &&
                    dashboard.stats_per_court.some(item => parseInt(item.total_turnos) > 0) ? (
                    <div className="bg-white rounded-2xl shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">
                            Reservas por cancha
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={dashboard?.stats_per_court?.map(item => ({
                                        ...item,
                                        total_turnos: Number(item.total_turnos)  // <- convertir a num
                                    })) || []}
                                    dataKey="total_turnos"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label
                                >
                                    {dashboard?.stats_per_court?.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>

                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-10 bg-gray-50 rounded-2xl shadow-inner">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-14 h-14 text-gray-400 mb-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>

                        <Typography variant="h6" className="text-gray-600 font-medium mb-1">
                            No hay datos que mostrar
                        </Typography>
                        <Typography variant="body2" className="text-gray-500 text-center max-w-sm">
                            Aún no se registraron reservas para este día
                        </Typography>
                    </div>
                )}

            </div>
        </div>
    );
}
