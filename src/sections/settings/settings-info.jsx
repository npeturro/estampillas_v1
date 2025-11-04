import { useState, useEffect } from 'react';
import { useGET } from '../../hooks/useGET';
import {
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Stack,
    Card,
    CardContent,
    Typography,
    IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { usePut } from '../../hooks/usePut';

export default function SettingsInfo() {
    const [settings, loading, error] = useGET('settings');
    const { put, loadingS, errorS, data } = usePut(`settings`);

    const [formData, setFormData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (settings && settings.length > 0 && !formData) {
            setFormData(settings[0]);
        }
    }, [settings]);
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

    if (!formData) return null;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };


    const handleSave = async () => {
        const response = await put(`settings/${formData.id}`, formData);

        if (response?.data?.data) {
            setFormData((prev) =>
                prev.map((c) =>
                    c.id === response.data.data.id ? response.data.data : c
                )
            );
        }

        setIsModalOpen(false);
    };

    return (
        <>
            <div className=" mx-auto">
                <Card variant="outlined" className="mb-6 shadow-lg">
                    <CardContent>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="h5" fontWeight="bold">
                                {formData.name}
                            </Typography>
                            <IconButton onClick={() => setIsModalOpen(true)} color="primary">
                                <EditIcon />
                            </IconButton>
                        </Stack>
                        <Stack spacing={1} mt={2}>
                            <Typography><strong>Dirección:</strong> {formData.address}</Typography>
                            <Typography><strong>Teléfono:</strong> {formData.phone}</Typography>
                            <Typography><strong>Email:</strong> {formData.email}</Typography>
                            <Typography><strong>Horario:</strong> {formData.opening_time} - {formData.closing_time}</Typography>
                            <Typography><strong>Duración de turno:</strong> {formData.time_appointment} min</Typography>
                        </Stack>
                    </CardContent>
                </Card>

                <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Editar configuración</DialogTitle>
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
                                label="Dirección"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                fullWidth
                            />
                            <TextField
                                label="Teléfono"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                fullWidth
                            />
                            <TextField
                                label="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                fullWidth
                            />
                            <Stack direction="row" spacing={2}>
                                <TextField
                                    label="Hora de apertura"
                                    name="opening_time"
                                    type="time"
                                    value={formData.opening_time}
                                    onChange={handleChange}
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                />
                                <TextField
                                    label="Hora de cierre"
                                    name="closing_time"
                                    type="time"
                                    value={formData.closing_time}
                                    onChange={handleChange}
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                />
                            </Stack>
                            <TextField
                                label="Duración de turno (min)"
                                name="time_appointment"
                                type="number"
                                value={formData.time_appointment}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                        <Button variant="contained" color="primary" onClick={handleSave}>
                            {loadingS ? <CircularProgress/> : "Guardar"}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    );
}
