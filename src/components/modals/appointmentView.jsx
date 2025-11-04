import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    DialogActions,
    Button,
    DialogContentText,
    CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PaymentIcon from '@mui/icons-material/Payment';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

export default function AppointmentView({ isOpen, onClose, data, onDelete, loadingR }) {
    const [confirmOpen, setConfirmOpen] = useState(false);

    if (!data) return null;

    const {
        id,
        date,
        start_time,
        end_time,
        court_id,
        price,
        status,
        payment_method,
        payment_id,
        created_at,
        name,
        phone,
        email,
    } = data;

    const formatDate = (d) => {
        const dateObj = new Date(d);
        return dateObj.toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
        });
    };

    const formatTime = (t) => {
        const time = new Date(`1970-01-01T${t}`);
        return time.toLocaleTimeString('es-AR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    };

    const handleDeleteClick = () => {
        setConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        setConfirmOpen(false);
        if (onDelete) onDelete(id); 
        onClose(); 
    };

    return (
        <>
            <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle className="flex justify-between items-center text-black font-semibold text-lg">
                    <span>Detalle de la Reserva #{id}</span>
                    <IconButton onClick={onClose} className="text-white hover:bg-white/20 cursor-pointer">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent className="bg-gray-50 p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                            <CalendarMonthIcon className="text-green-600" />
                            <span><strong>Día:</strong> {formatDate(date)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <SportsTennisIcon className="text-blue-600" />
                            <span><strong>Cancha:</strong> {court_id}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <AccessTimeIcon className="text-blue-500" />
                            <span><strong>Hora:</strong> {formatTime(start_time)} - {formatTime(end_time)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <MonetizationOnIcon className="text-yellow-500" />
                            <span><strong>Precio:</strong> ${Number(price).toLocaleString('es-AR')}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <PaymentIcon className="text-indigo-500" />
                            <span><strong>Pago:</strong> {payment_method}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span><strong>ID de pago:</strong> {payment_id}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span><strong>Estado:</strong>
                                <span
                                    className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${status === 'approved'
                                        ? 'bg-green-100 text-green-700'
                                        : status === 'pending'
                                            ? 'bg-yellow-100 text-yellow-700'
                                            : 'bg-red-100 text-red-700'
                                        }`}
                                >
                                    {status}
                                </span>
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span><strong>Creada:</strong> {formatDate(created_at)}</span>
                        </div>
                    </div>

                    <hr className="my-4 border-gray-300" />

                    <div className="space-y-2">
                        <h3 className="font-semibold text-gray-700 mb-2">Datos del cliente</h3>
                        <div className="flex items-center space-x-2">
                            <PersonIcon className="text-gray-600" />
                            <span>{name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <PhoneIcon className="text-gray-600" />
                            <span>{phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <EmailIcon className="text-gray-600" />
                            <span>{email}</span>
                        </div>
                    </div>
                </DialogContent>

                <DialogActions>
                    <Button color="error" variant="contained" onClick={handleDeleteClick}>Eliminar</Button>
                </DialogActions>
            </Dialog>

            {/* Modal de confirmación */}
            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>Confirmar eliminación</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Seguro que deseas eliminar la reserva #{id}? Esta acción no se puede deshacer.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)}>Cancelar</Button>
                    <Button color="error" variant="contained" onClick={handleConfirmDelete}>
                        {loadingR ? <CircularProgress /> : "Eliminar"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
