import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Switch,
    FormControlLabel,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import PersonIcon from '@mui/icons-material/Person';
import { usePut } from '../../hooks/usePut';

export default function CancelView({ isOpen, onClose, data, setAppointments }) {
    if (!data) return null;
    const { put, loadingP, errorP, value } = usePut();


    const {
        id,
        court_id,
        date_from,
        date_to,
        description,
        available,
        recurring,
        days_of_week,
        start_time,
        end_time,
    } = data;

    const [isAvailable, setIsAvailable] = useState(available == 1);

    const handleToggle = async () => {
        const newValue = !isAvailable; // solo el booleano

        try {
            const response = await put(`not_available/${id}`, { available: newValue ? 1 : 0 });
            if (response?.data) {
                setAppointments((prev) =>
                    prev.map((c) =>
                        c.id === id ? response.data : c
                    )
                );
                setIsAvailable(newValue);
            }
        } catch (error) {
            console.error("Error al actualizar estado:", error);
        }
    };

    const formatDate = (d) => {
        if (!d) return '-';
        const dateObj = new Date(d);
        return dateObj.toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const daysText = (days) => {
        if (!days) return '-';
        const map = {
            1: 'Lunes',
            2: 'Martes',
            3: 'Miércoles',
            4: 'Jueves',
            5: 'Viernes',
            6: 'Sábado',
            7: 'Domingo',
        };
        return days.split(',').map((d) => map[d.trim()] || '').join(', ');
    };

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle className="flex justify-between items-center text-black font-semibold text-lg">
                <span>Detalle del evento</span>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent className="bg-gray-50 space-y-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <span className="font-semibold">Estado:</span>
                        <span
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${isAvailable
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                                }`}
                        >
                            {isAvailable ? 'Vigente' : 'No vigente'}
                        </span>
                    </div>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={isAvailable}
                                onChange={handleToggle}
                                color="success"
                            />
                        }
                        label={isAvailable ? 'Activo' : 'Inactivo'}
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <CalendarMonthIcon className="text-green-600" />
                    <span><strong>Día desde:</strong> {formatDate(date_from)}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <CalendarMonthIcon className="text-green-600" />
                    <span><strong>Día hasta:</strong> {formatDate(date_to)}</span>
                </div>

                <div className="flex items-center space-x-2">
                    <SportsTennisIcon className="text-blue-600" />
                    <span><strong>Cancha:</strong> {court_id}</span>
                </div>

                <hr className="my-4 border-gray-300" />

                <div className="space-y-2">
                    <h3 className="font-semibold text-gray-700 mb-2">Información del evento</h3>
                    <div className="flex items-center space-x-2">
                        <PersonIcon className="text-gray-600" />
                        <span>{description}</span>
                    </div>

                    {recurring == 1 ? (
                        <>
                            <div>
                                <strong>Tipo:</strong> Recurrente
                            </div>
                            <div>
                                <strong>Días:</strong> {daysText(days_of_week)}
                            </div>
                            <div>
                                <strong>Horario:</strong> {start_time} - {end_time}
                            </div>
                        </>
                    ) : (
                        <div>
                            <strong>Tipo:</strong> Único
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
