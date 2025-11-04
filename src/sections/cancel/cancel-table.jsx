import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import {
    Button,
    CircularProgress,
    TextField,
    FormControlLabel,
    Switch,
    Checkbox,
    FormGroup,
    Typography,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
} from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import { useGET } from '../../hooks/useGET';
import CancelView from '../../components/modals/cancelView';
import axios from 'axios';
import { Grid } from '@mui/joy';
import { toast } from 'sonner';
import { usePost } from '../../hooks/usePost';

export default function CancelTable() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [not_available, loading, error] = useGET(`not_available`);
    const [courts, loadingC, errorC] = useGET(`courts`);
    const [appointments, setAppointments] = useState([]);
    const { post, loadingPost, errorPost } = usePost();

    // Cuando termina el GET, sincronizamos el estado local
    useEffect(() => {
        if (not_available) {
            setAppointments(not_available);
        }
    }, [not_available]);

    // Datos del formulario
    const [formData, setFormData] = useState({
        court_id: '',
        date_from: '',
        date_to: '',
        start_time: '',
        end_time: '',
        description: '',
        available: true,
        recurring: false,
        days_of_week: [],
    });

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleDayChange = (day) => {
        setFormData((prev) => {
            const selected = new Set(prev.days_of_week);
            selected.has(day) ? selected.delete(day) : selected.add(day);
            return { ...prev, days_of_week: Array.from(selected) };
        });
    };

    const handleSubmit = async () => {
        try {
            const isRecurring = formData.recurring;
            const payload = {
                court_id: formData.court_id,
                date_from: isRecurring
                    ? `${formData.date_from} 00:00:00`
                    : `${formData.date_from} ${formData.start_time || '00:00:00'}`,
                date_to: isRecurring
                    ? formData.date_to
                        ? `${formData.date_to} 23:59:59`
                        : null
                    : formData.date_to
                        ? `${formData.date_to} ${formData.end_time || '23:59:59'}`
                        : null,
                description: formData.description,
                recurring: isRecurring ? 1 : 0,

                days_of_week: isRecurring
                    ? formData.days_of_week.join(',')
                    : null,
                start_time: formData.start_time || null,
                end_time: formData.end_time || null,
            };

            const res = await post(`not_available`, payload);

            if (res?.data) {
                if (res?.data) {
                    setAppointments((prev) => [...prev, res.data]);
                }
                setIsCreateOpen(false);
                setFormData({
                    court_id: '',
                    date_from: '',
                    date_to: '',
                    start_time: '',
                    end_time: '',
                    description: '',
                    available: true,
                    recurring: false,
                    days_of_week: [],
                });
            }

        } catch (error) {
            console.error(error);
        }
    };


    if (loading || loadingC) {
        return (
            <div className="flex justify-center items-center h-64">
                <CircularProgress />
            </div>
        );
    }

    if (error || errorC) {
        return (
            <div>
                <p>Error al cargar los datos. Si persiste, contacte al administrador.</p>
            </div>
        );
    }

    const columns = [
        { field: 'court_id', headerName: 'Cancha', flex: 1 },
        {
            field: 'date_from',
            headerName: 'Día desde',
            flex: 1,
            valueGetter: (params) => {
                const date = new Date(params);
                return date.toLocaleDateString('es-AR');
            },
        },
        {
            field: 'date_to',
            headerName: 'Día hasta',
            flex: 1,
            valueGetter: (params) => {
                if (params != null) {
                    const date = new Date(params);
                    return date.toLocaleDateString('es-AR');
                } else {
                    return 'Indefinido'
                }
            },
        },
        {
            field: 'available',
            headerName: 'Estado',
            flex: 1,
            renderCell: (params) =>
                <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${params.value == 1
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                        }`}
                >
                    {params.value == 1 ? 'Vigente' : 'No vigente'}
                </span>

        },
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

    const days = [
        { label: 'Lunes', value: 1 },
        { label: 'Martes', value: 2 },
        { label: 'Miércoles', value: 3 },
        { label: 'Jueves', value: 4 },
        { label: 'Viernes', value: 5 },
        { label: 'Sábado', value: 6 },
        { label: 'Domingo', value: 0 },
    ];

    return (
        <Box sx={{ height: '100%', width: '100%' }}>
            {/* Botón Agregar */}
            <div className="flex justify-end mb-4">
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsCreateOpen(true)}>
                    Agregar
                </Button>
            </div>

            <DataGrid
                rows={appointments}
                columns={columns}
                initialState={{
                    pagination: { paginationModel: { pageSize: 8 } },
                }}
                pageSizeOptions={[8]}
                disableRowSelectionOnClick
            />

            <CancelView
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                data={selectedAppointment}
                setAppointments={setAppointments}
            />

            <Dialog open={isCreateOpen} onClose={() => setIsCreateOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Nueva reserva</DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            select
                            fullWidth
                            label="Cancha"
                            required
                            value={formData.court_id}
                            onChange={(e) => handleChange('court_id', e.target.value)}
                        >
                            {
                                courts.map((c) => {
                                    return (
                                        <MenuItem value={c.id}>{c.name}</MenuItem>
                                    )
                                })
                            }
                        </TextField>

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Fecha desde"
                                    type="date"
                                    value={formData.date_from}
                                    onChange={(e) => handleChange('date_from', e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Fecha hasta"
                                    type="date"
                                    value={formData.date_to}
                                    onChange={(e) => handleChange('date_to', e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Hora inicio"
                                    type="time"
                                    value={formData.start_time}
                                    onChange={(e) => handleChange('start_time', e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Hora fin"
                                    required
                                    type="time"
                                    value={formData.end_time}
                                    onChange={(e) => handleChange('end_time', e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                        </Grid>

                        <TextField
                            fullWidth
                            multiline
                            minRows={2}
                            label="Descripción"
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                        />

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.available}
                                        onChange={(e) => handleChange('available', e.target.checked)}
                                    />
                                }
                                label="Disponible"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.recurring}
                                        onChange={(e) => handleChange('recurring', e.target.checked)}
                                    />
                                }
                                label="Recurrente"
                            />
                        </Box>

                        {formData.recurring && (
                            <Box sx={{ mt: 1 }}>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    Días de la semana:
                                </Typography>
                                <FormGroup row>
                                    {days.map((d) => (
                                        <FormControlLabel
                                            key={d.value}
                                            control={
                                                <Checkbox
                                                    checked={formData.days_of_week.includes(d.value)}
                                                    onChange={() => handleDayChange(d.value)}
                                                />
                                            }
                                            label={d.label}
                                        />
                                    ))}
                                </FormGroup>
                            </Box>
                        )}

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Button variant="contained" onClick={handleSubmit}>
                                {loadingPost ? <CircularProgress /> : 'Guardar'}
                            </Button>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
}
