import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    TextField,
    Switch
} from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditIcon from "@mui/icons-material/Edit";
import { useState, useEffect } from 'react';
import { useGET } from '../../hooks/useGET';
import CourtView from './court-view';
import { DialogTitle, Stack } from '@mui/joy';
import { usePut } from '../../hooks/usePut';

export default function CourtDetail() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
    const [courts, loading, error] = useGET(`courts`);
    const { put, loadingP, errorP, data } = usePut(`courts`);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        description: '',
    });

    // ✅ Cuando seleccionás una cancha para editar, llenamos formData
    useEffect(() => {
        if (selectedAppointment) {
            setFormData({
                id: selectedAppointment.id || '',
                name: selectedAppointment.name || '',
                description: selectedAppointment.description || '',
                state: selectedAppointment.state || '',
            });
        }
    }, [selectedAppointment]);

    useEffect(() => {
        if (data && data.data) {
            setCourts((prev) =>
                prev.map((c) =>
                    c.id === data.data.id ? data.data : c
                )
            );
        }
    }, [data]);

    const [courtsList, setCourts] = useState([]);

    useEffect(() => {
        if (courts) setCourts(courts);
    }, [courts]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return (
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                    Ocurrió un error al cargar los datos. Si el error persiste, contáctese con la administración.
                </table>
            </div>
        );
    }

    const columns = [
        {
            field: 'name',
            headerName: 'Cancha',
            flex: 1,
        },
        {
            field: 'type',
            headerName: 'Tipo',
            flex: 1,
        },
        {
            field: 'state',
            headerName: 'Estado',
            flex: 1,
            renderCell: (params) =>
                params.value == 1
                    ? <span className="text-green-600 font-medium">Disponible</span>
                    : <span className="text-red-500 font-medium">No disponible</span>
        },
        {
            field: 'actions',
            headerName: '',
            flex: 0.3,
            sortable: false,
            align: 'center',
            renderCell: (params) => (
                <>
                    <button
                        className="cursor-pointer mr-2"
                        title="Editar"
                        onClick={() => {
                            setSelectedAppointment(params.row);
                            setIsModalOpenEdit(true);
                        }}
                    >
                        <EditIcon fontSize="small" />
                    </button>
                    <button
                        className="cursor-pointer"
                        title="Ver"
                        onClick={() => {
                            setSelectedAppointment(params.row);
                            setIsModalOpen(true);
                        }}
                    >
                        <VisibilityOutlinedIcon fontSize="small" />
                    </button>
                </>
            ),
        }
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = async () => {
        const response = await put(`courts/${formData.id}`, formData);

        if (response?.data?.data) {
            setCourts((prev) =>
                prev.map((c) =>
                    c.id === response.data.data.id ? response.data.data : c
                )
            );
        }

        setIsModalOpenEdit(false);
    };

    return (
        <Box sx={{ height: '100%', width: '100%' }}>
            <DataGrid
                rows={courtsList}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { pageSize: 8 },
                    },
                }}
                pageSizeOptions={[8]}
                disableRowSelectionOnClick
            />

            <CourtView
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                data={selectedAppointment}
            />

            <Dialog
                open={isModalOpenEdit}
                onClose={() => setIsModalOpenEdit(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogContent dividers>
                    <Stack spacing={3} mt={1}>
                        <TextField
                            label="Nombre"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            label="Descripción"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Stack>
                    <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm text-gray-700">
                            Estado:{" "}
                            <strong className={formData.state ? "text-green-600" : "text-red-500"}>
                                {formData.state == 1 ? "Disponible" : "No disponible"}
                            </strong>
                        </span>
                        <Switch
                            checked={formData.state == 1}
                            color="success"
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    state: e.target.checked ? 1 : 0,
                                })
                            }
                        />
                    </div>

                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsModalOpenEdit(false)}>Cancelar</Button>
                    <Button variant="contained" color="primary" onClick={handleSave}>
                        {loadingP ? <CircularProgress /> : "Guardar"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
