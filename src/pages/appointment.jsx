import React, { useState, useEffect } from 'react';
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from 'react-router-dom';
import { useGET } from '../hooks/useGET';
import Loading from '../components/loading';
import { toast } from 'sonner';


const ReservationModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    const [appointments, loadingT, error] = useGET(`appointments`);
    const [courts, loadingC, errorC] = useGET(`courts`);

    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false)
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedCourt, setSelectedCourt] = useState(1);
    const [selectedTime, setSelectedTime] = useState('');
    const [price, setPrice] = useState(20000);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (!appointments || Object.keys(appointments).length === 0) return;

        const dateKey = selectedDate.toISOString().split('T')[0];
        const courtData = appointments[selectedCourt.id]; 

        if (courtData && courtData.turns[dateKey]) {
            const turns = courtData.turns[dateKey];
            const times = turns.map(t => t.start_time.slice(0, 5));
            setAvailableTimes(times);
        } else {
            setAvailableTimes([]);
        }

        setSelectedTime('');
    }, [appointments, selectedDate, selectedCourt]);

    useEffect(() => {
        if (!appointments || !selectedTime) return;

        const dateKey = selectedDate.toISOString().split('T')[0];
        const courtData = appointments[selectedCourt.id];

        const turno = courtData?.turns?.[dateKey]?.find(
            t => t.start_time.slice(0, 5) === selectedTime
        );

        if (turno) {
            setPrice(parseFloat(turno.price));
        }
    }, [appointments, selectedCourt, selectedDate, selectedTime]);



    const handleReserve = () => {
        if (selectedTime) {
            setLoading(true);
            setTimeout(() => {
                navigate(`/checkout?court=${selectedCourt.name}&id=${selectedCourt.id}&date=${selectedDate.toLocaleDateString('es-ES')}&time=${selectedTime}&price=${price}&description=${selectedCourt.description}&type=${selectedCourt.type}`);
                setOpenModal(true);
            }, 800);
        } else {
            toast.error("Por favor, selecciona un horario.");
        }
    };

    const today = new Date();


    const handleDateClick = (date) => {
        const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const newDateNormalized = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        if (newDateNormalized >= todayNormalized) {
            setSelectedDate(date);
        }
    };


    if (loadingT || loadingC) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Header del Modal */}
                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50 rounded-t-3xl">
                        <div className="flex justify-between items-center">
                            <h2 className="text-3xl font-black bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                                Reserva tu cancha
                            </h2>
                            <button onClick={onClose} className="cursor-pointer text-gray-500 hover:text-gray-700 text-2xl font-bold transition-colors">
                                ×
                            </button>
                        </div>
                        <p className="text-gray-600 mt-2">Selecciona fecha, horario y cancha para completar tu reserva.</p>
                    </div>
                    <div className="p-6 space-y-8">
                        <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl border border-gray-200/50 flex justify-center items-center">
                            <CircularProgress />
                        </div>
                    </div>

                </div>
            </div>
        )
    }

    if (error || errorC) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Header del Modal */}
                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50 rounded-t-3xl">
                        <div className="flex justify-between items-center">
                            <h2 className="text-3xl font-black bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                                Reserva tu cancha
                            </h2>
                            <button onClick={onClose} className="cursor-pointer text-gray-500 hover:text-gray-700 text-2xl font-bold transition-colors">
                                ×
                            </button>
                        </div>
                        <p className="text-gray-600 mt-2">Selecciona fecha, horario y cancha para completar tu reserva.</p>
                    </div>
                    <div className="p-6 space-y-8">
                        <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl border border-gray-200/50 flex justify-center items-center">
                            Ocurrió un error al cargar los datos. Si el error persiste, contáctese con la adminitración.
                        </div>
                    </div>

                </div>
            </div>
        );
    }



    return (
        <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Header del Modal */}
                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50 rounded-t-3xl">
                        <div className="flex justify-between items-center">
                            <h2 className="text-3xl font-black bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                                Reserva tu cancha
                            </h2>
                            <button onClick={onClose} className="cursor-pointer text-gray-500 hover:text-gray-700 text-2xl font-bold transition-colors">
                                ×
                            </button>
                        </div>
                        <p className="text-gray-600 mt-2">Selecciona fecha, horario y cancha para completar tu reserva.</p>
                    </div>

                    <div className="p-6 space-y-8">
                        {/* Selector de Fecha - Calendario Simple */}
                        <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl border border-gray-200/50">
                            <h3 className="text-xl font-bold mb-4 text-gray-800">Selecciona el día</h3>
                            <div className="grid grid-cols-7 gap-2 text-center">
                                {Array.from({ length: 7 }, (_, i) => {
                                    const headerDate = new Date(today);
                                    headerDate.setDate(today.getDate() + i);
                                    const weekdayShort = headerDate.toLocaleDateString("es-AR", { weekday: "short" });
                                    const label = weekdayShort.charAt(0).toUpperCase() + weekdayShort.slice(1);
                                    return (
                                        <div key={`hd-${i}`} className="font-semibold text-gray-600 py-2">
                                            {label}
                                        </div>
                                    );
                                })}
                                {Array.from({ length: 7 }, (_, i) => {
                                    const date = new Date(today);
                                    date.setDate(today.getDate() + i);

                                    const day = date.getDate();
                                    const month = date.getMonth();
                                    const year = date.getFullYear();

                                    const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                                    const dateNormalized = new Date(year, month, day);

                                    const isTodayOrFuture = dateNormalized >= todayNormalized;
                                    const isSelected =
                                        selectedDate.getDate() === day &&
                                        selectedDate.getMonth() === month &&
                                        selectedDate.getFullYear() === year;

                                    const isToday =
                                        day === today.getDate() &&
                                        month === today.getMonth() &&
                                        year === today.getFullYear();

                                    return (
                                        <button
                                            key={date.toISOString()}
                                            onClick={() => handleDateClick(new Date(year, month, day))}
                                            disabled={!isTodayOrFuture}
                                            className={`cursor-pointer flex items-center justify-center 
    h-10 w-full rounded-lg font-medium transition-all duration-300 text-sm sm:text-base
    ${isTodayOrFuture
                                                    ? "hover:bg-green-100 text-gray-800 hover:scale-105 shadow-md"
                                                    : "text-gray-300 cursor-not-allowed"}
    ${isSelected ? "bg-green-600 text-white shadow-lg scale-105" : ""}
    ${!isSelected && isToday ? "border border-green-400 bg-green-50" : ""}
  `}
                                        >
                                            {day}
                                        </button>

                                    );
                                })}
                            </div>

                        </div>


                        {/* Selector de Cancha */}
                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl border border-gray-200/50">
                            <h3 className="text-xl font-bold mb-4 text-gray-800">Elegí tu cancha</h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                {courts.map((court) => {
                                    const isOcupada = court.state == 0;
                                    return (
                                        <div
                                            key={court.id}
                                            onClick={() => {
                                                if (!isOcupada) setSelectedCourt(court);
                                            }}
                                            className={`group p-4 rounded-xl transition-all duration-300 border-2 ${selectedCourt.id === court.id
                                                ? 'border-green-600 bg-green-50 shadow-lg scale-105'
                                                : 'border-gray-200 hover:border-green-400 hover:bg-green-50'
                                                } ${isOcupada ? 'opacity-50 cursor-not-allowed hover:bg-none hover:border-gray-200' : 'cursor-pointer'}`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-semibold text-gray-800">{court.name}</h4>
                                                <div
                                                    className={`w-3 h-3 rounded-full ${court.state == 1 ? 'bg-green-500' : 'bg-red-500'
                                                        }`}
                                                ></div>
                                            </div>
                                            <p
                                                className={`text-sm ${selectedCourt.id === court.id ? 'text-green-600' : 'text-gray-600'
                                                    }`}
                                            >
                                                {court.state == 1 ? 'Disponible' : 'Ocupada'}
                                            </p>
                                            <p
                                                className={`text-xs 'text-gray-600'}`}
                                            >
                                                {court.description}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>

                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-gray-200/50">
                            <h3 className="text-xl font-bold mb-4 text-gray-800">
                                Horarios disponibles{" "}
                                <span className="text-sm font-normal text-gray-500">
                                    (Turnos 01:30hs.)
                                </span>
                            </h3>

                            {availableTimes.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {availableTimes.map((time) => (
                                        <button
                                            key={time}
                                            onClick={() => setSelectedTime(time)}
                                            className={`cursor-pointer py-3 px-4 rounded-xl font-semibold transition-all duration-300 border-2 ${selectedTime === time
                                                ? 'border-green-600 bg-green-600 text-white shadow-lg scale-105'
                                                : 'border-gray-300 hover:border-green-400 hover:bg-green-50 text-gray-700'
                                                }`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic text-center py-8">
                                    No hay horarios disponibles para esta fecha y cancha. Elige otra opción.
                                </p>
                            )}
                        </div>

            
                        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
                            <button
                                onClick={onClose}
                                className="cursor-pointer flex-1 bg-gray-500 text-white py-3 rounded-xl font-semibold hover:bg-gray-600 transition-all duration-300"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleReserve}
                                disabled={!selectedTime || loading}
                                className={`cursor-pointer flex items-center justify-center gap-2 flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform shadow-lg ${!selectedTime || loading
                                    ? "opacity-60 cursor-not-allowed"
                                    : "hover:from-green-700 hover:to-blue-700 hover:scale-105"
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <CircularProgress size={22} color="inherit" thickness={5} />
                                    </>
                                ) : (
                                    "Confirmar reserva"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ReservationModal;



