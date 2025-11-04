import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import esLocale from "@fullcalendar/core/locales/es";
import { CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { useGET } from "../../hooks/useGET";
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PaymentIcon from '@mui/icons-material/Payment';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const CalendarAppointments = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [appointments, loading, error] = useGET("get_calendar");

    const events = appointments

    const handleEventClick = (clickInfo) => {
        setSelectedEvent(clickInfo.event);
        setIsModalOpen(true);
    };
    const handleEnviarWhatsApp = () => {
        const numero = selectedEvent?.extendedProps.phone.replace(/\D/g, '');
        const texto = 'Hola! Te escribo desde PádelPro';
        const url = `https://api.whatsapp.com/send?phone=${numero}&text=${texto}`;
        window.open(url, '_blank');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 mt-4">
                Ocurrió un error al cargar los datos. Si el error persiste, contacte con la administración.
            </div>
        );
    }

    return (
        <div className="p-4">
            <FullCalendar
                plugins={[timeGridPlugin, dayGridPlugin]}
                locale={esLocale}
                initialView="dayGridMonth"
                weekends={true}
                events={events}
                eventClick={handleEventClick}
                slotMinTime="09:00:00"
                slotMaxTime="23:00:00"
                height="100%"
                expandRows={true}
                contentHeight="auto"
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
            />

            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Detalle del turno</DialogTitle>
                <DialogContent className="bg-gray-50 p-6 space-y-4">
                    {selectedEvent && (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-2">
                                    <CalendarMonthIcon className="text-green-600" />
                                    <span>
                                        <strong>Día:</strong>{" "}
                                        {selectedEvent.start
                                            ? selectedEvent.start.toLocaleDateString("es-AR")
                                            : "-"}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <SportsTennisIcon className="text-blue-600" />
                                    <span>
                                        <strong>Cancha:</strong>{" "}
                                        {selectedEvent.title?.split("-")[1]?.trim() || "-"}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <AccessTimeIcon className="text-blue-500" />
                                    <span>
                                        <strong>Hora:</strong>{" "}
                                        {selectedEvent.start?.toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}{" "}
                                        -{" "}
                                        {selectedEvent.end?.toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </div>
                                {selectedEvent.extendedProps.price && (
                                    <div className="flex items-center space-x-2">
                                        <MonetizationOnIcon className="text-yellow-500" />
                                        <span>
                                            <strong>Precio:</strong> $
                                            {Number(selectedEvent.extendedProps.price).toLocaleString(
                                                "es-AR"
                                            )}
                                        </span>
                                    </div>
                                )}
                                {selectedEvent.extendedProps.payment_method && (
                                    <div className="flex items-center space-x-2">
                                        <PaymentIcon className="text-indigo-500" />
                                        <span>
                                            <strong>Pago:</strong>{" "}
                                            {selectedEvent.extendedProps.payment_method}
                                        </span>
                                    </div>
                                )}

                                {selectedEvent.extendedProps.payment_id && (
                                    <div className="flex items-center space-x-2">
                                        <span>
                                            <strong>ID de pago:</strong>{" "}
                                            {selectedEvent.extendedProps.payment_id}
                                        </span>
                                    </div>
                                )}
                                {selectedEvent.extendedProps.status && (
                                    <div className="flex items-center space-x-2">
                                        <span>
                                            <strong>Estado:</strong>
                                            <span
                                                className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${selectedEvent.extendedProps.status === "approved"
                                                    ? "bg-green-100 text-green-700"
                                                    : selectedEvent.extendedProps.status === "pending"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {selectedEvent.extendedProps.status}
                                            </span>
                                        </span>
                                    </div>
                                )}

                                {selectedEvent.extendedProps.created_at && (
                                    <div className="flex items-center space-x-2">
                                        <span>
                                            <strong>Creada:</strong>{" "}
                                            {new Date(
                                                selectedEvent.extendedProps.created_at
                                            ).toLocaleString("es-AR")}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <hr className="my-4 border-gray-300" />
                            <div className="space-y-2">
                                <h3 className="font-semibold text-gray-700 mb-2">
                                    Datos del cliente
                                </h3>

                                {selectedEvent.extendedProps.name && (
                                    <div className="flex items-center space-x-2">
                                        <PersonIcon className="text-gray-600" />
                                        <span>{selectedEvent.extendedProps.name}</span>
                                    </div>
                                )}

                                {selectedEvent.extendedProps.phone && (
                                    <div className="flex items-center space-x-2">
                                        <PhoneIcon className="text-gray-600" />
                                        <span>{selectedEvent.extendedProps.phone}</span>
                                    </div>
                                )}

                                {selectedEvent.extendedProps.email && (
                                    <div className="flex items-center space-x-2">
                                        <EmailIcon className="text-gray-600" />
                                        <span>{selectedEvent.extendedProps.email}</span>
                                    </div>
                                )}

                                {selectedEvent.extendedProps.description && (
                                    <div className="flex items-center space-x-2 mt-2">
                                        <span>
                                            <strong>Evento:</strong>{" "}
                                            {selectedEvent.extendedProps.description}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={handleEnviarWhatsApp}
                        color="success"
                        startIcon={<WhatsAppIcon />}
                        variant="contained"
                        sx={{ textTransform: 'none' }}
                    >
                        Enviar WhatsApp
                    </Button>
                    <Button
                        onClick={() => setIsModalOpen(false)}
                        color="primary"
                        variant="outlined"
                        sx={{ textTransform: 'none' }}
                    >
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default CalendarAppointments;
