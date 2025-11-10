import { useState, useMemo, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    TextField,
    Typography,
    LinearProgress,
    Box,
    FormControlLabel,
    Checkbox,
    Grid,
    DialogActions,
    Button,
    DialogContentText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function OnlineDetails({ isOpen, onClose, data }) {
    const [selected, setSelected] = useState([]);
    const [search, setSearch] = useState("");
    const [openConfirm, setOpenConfirm] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    const totalStamps = data?.estampillas || 0;
    const usedStamps = data?.estampillas_detalle || 0;

    const stampsList = useMemo(
        () =>
            Array.from({ length: totalStamps }, (_, i) => ({
                id: i + 1,
                name: `#${i + 1}`,
            })),
        [totalStamps]
    );

    const filteredList = stampsList.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        if (isOpen) {
            setSelected(data?.used_stamps_ids || []);
            setIsDirty(false);
        }
    }, [isOpen, data]);


    const handleSelect = (id) => {
        setSelected((prev) => {
            const newSelected = prev.includes(id)
                ? prev.filter((x) => x !== id)
                : [...prev, id];
            console.log("Seleccionadas:", newSelected);
            setIsDirty(true);
            return newSelected;
        });
    };

    const handleClose = () => {
        if (isDirty) {
            setOpenConfirm(true);
        } else {
            onClose();
        }
    };

    const handleConfirmClose = () => {
        setOpenConfirm(false);
        setIsDirty(false);
        onClose();
    };

    const handleSubmit = () => {
        console.log("Guardado:", selected);
        setIsDirty(false);
        onClose();
    };

    if (!data) return null;

    return (
        <>
            <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle className="flex justify-between items-center text-black font-semibold text-lg">
                    <span>Detalle de estampillas #{data.id}</span>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent className="bg-gray-50 space-y-4">
                    <Box className="w-full">
                        <Typography variant="subtitle2" className="text-gray-700 mb-1">
                            Estampillas usadas: 0 / {totalStamps}
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            value={(usedStamps / totalStamps) * 100}
                            sx={{
                                height: 10,
                                borderRadius: 5,
                                "& .MuiLinearProgress-bar": {
                                    backgroundColor: "#f59e0b",
                                },
                                backgroundColor: "#e5e7eb",
                            }}
                        />
                    </Box>

                    <Grid container spacing={1}>
                        {filteredList.map((item) => {
                            const isSelected = selected.includes(item.id);
                            return (
                                <Grid item xs={12} sm={6} key={item.id}>
                                    <Box
                                        onClick={() => handleSelect(item.id)}
                                        sx={{
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                            p: 1,
                                            borderRadius: 2,
                                            border: "1px solid #e5e7eb",
                                            backgroundColor: isSelected ? "#fff8e1" : "#fff", // fondo clarito cuando está seleccionado
                                            transition: "background-color 0.2s ease, border-color 0.2s ease",
                                            "&:hover": {
                                                backgroundColor: isSelected ? "#fff3cd" : "#f9fafb",
                                            },
                                        }}
                                    >
                                        <img
                                            src={"src/assets/estampilla_0.png"}
                                            alt="Estampilla"
                                            style={{
                                                width: 70,
                                                height: 70,
                                                objectFit: "contain",
                                                borderRadius: 4,
                                            }}
                                        />
                                        <Typography
                                            variant="body2"
                                            className="text-gray-700"
                                            sx={{
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                fontSize: "0.9rem",
                                                fontWeight: isSelected ? 600 : 400,
                                            }}
                                        >
                                            {item.name}
                                        </Typography>
                                    </Box>
                                </Grid>
                            );
                        })}
                    </Grid>
                </DialogContent>



                <DialogActions>
                    <Button
                        onClick={handleSubmit}
                        variant="outlined"
                        size="small"
                        sx={{
                            borderRadius: "8px",
                            textTransform: "none",
                            fontWeight: 500,
                        }}
                    >
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)} maxWidth="xs" fullWidth>
                <DialogTitle className="font-semibold text-gray-800">
                    Cambios sin guardar
                </DialogTitle>
                <DialogContent>
                    <DialogContentText className="text-gray-700">
                        Tenés cambios sin guardar. ¿Seguro que querés salir?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirm(false)}
                        variant="outlined"
                        size="small"
                        sx={{
                            borderRadius: "8px",
                            textTransform: "none",
                            fontWeight: 500,
                        }}>Cancelar</Button>
                    <Button
                        color="warning"
                        onClick={handleConfirmClose}
                        variant="outlined"
                        size="small"
                        sx={{
                            borderRadius: "8px",
                            textTransform: "none",
                            fontWeight: 500,
                        }}
                    >
                        Salir sin guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
