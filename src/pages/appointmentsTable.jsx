import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useGET } from '../hooks/useGET';
import { Button, CircularProgress } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import AppointmentView from '../components/modals/appointmentView';
import { useState, useEffect } from 'react';
import { useDelete } from '../hooks/useDelete';
import { toast } from 'sonner';

export default function AppointmentsTable() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [appointments, loading, error] = useGET(`appointments_reserved`);
    const { remove, loadingR } = useDelete();

    const [localAppointments, setLocalAppointments] = useState([]);

    // sincronizamos los datos al montar o actualizar el GET
    useEffect(() => {
        if (appointments) setLocalAppointments(appointments);
    }, [appointments]);

    const handleDelete = async (id = null) => {
        if (!id) return;

        try {
            const res = await remove(`appointments_reserved/${id}`);

            if (res?.status === 200 || res?.data?.status === 200) {
                setLocalAppointments((prev) => prev.filter((item) => item.id !== id));
            }

            setIsModalOpen(false);
        } catch (err) {
            console.error(err);
        }
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
            <div>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                        Ocurrió un error al cargar los datos. Si el error persiste, contáctese con la administración.
                    </table>
                </div>
            </div>
        );
    }

    const columns = [
        { field: 'id', headerName: 'Reserva', width: 90 },
        { field: 'court_id', headerName: 'Cancha', flex: 1 },
        {
            field: 'date',
            headerName: 'Día',
            flex: 1,
            valueGetter: (params) => {
                const date = new Date(params + 'T00:00:00');
                return date.toLocaleDateString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' });
            }

        },
        {
            field: 'start_time',
            headerName: 'Hora',
            flex: 1,
            valueGetter: (params) => {
                const time = new Date(`1970-01-01T${params}`);
                return time.toLocaleTimeString('es-AR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                });
            },
        },
        { field: 'status', headerName: 'Estado', flex: 1 },
        {
            field: 'actions',
            headerName: '',
            flex: 0.3,
            sortable: false,
            align: 'center',
            renderCell: (params) => (
                <button
                    className="cursor-pointer"
                    title="Ver reserva"
                    onClick={() => {
                        setSelectedAppointment(params.row);
                        setIsModalOpen(true);
                    }}
                >
                    <VisibilityOutlinedIcon fontSize="small" />
                </button>
            ),
        },
    ];

    return (
        <>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                Reservas
            </h2>
            <Box sx={{ height: '100%', width: '100%' }}>
                <DataGrid
                    rows={localAppointments}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 8 },
                        },
                    }}
                    pageSizeOptions={[8]}
                    checkboxSelection
                    disableRowSelectionOnClick
                />

                <AppointmentView
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    data={selectedAppointment}
                    onDelete={handleDelete}
                    loadingR={loadingR}
                />
            </Box>
        </>
    );
}
