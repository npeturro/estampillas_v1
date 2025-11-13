import { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Typography,
    LinearProgress,
    Box,
    Grid,
    DialogActions,
    Button,
    Menu,
    MenuItem,
    DialogContentText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { getToken } from "../../utils/auth";
import { usePost } from "../../hooks/usePost";
import { toast } from "sonner";

export default function OnlineDetails({ isOpen, onClose, data, fetchData }) {
    const [stamps, setStamps] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedStamp, setSelectedStamp] = useState(null);
    const [isDirty, setIsDirty] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const token = getToken();
    const [unMarkStamp, setUnMarkStamp] = useState(false);
    const [openUnmarkConfirm, setOpenUnmarkConfirm] = useState(false);
    const { post, loading, errorPost } = usePost();
    const [loadingInterno, setLoadingInterno] = useState(false)


    useEffect(() => {
        if (isOpen && data?.estampillas_detalle) {
            const parsed = data.estampillas_detalle.map((e) => {
                const info = JSON.parse(e.json_estampilla);
                return {
                    id: e.id,
                    id_venta: e.id_venta,
                    nro_estampilla: e.nro_estampilla,
                    usada: e.usada === "1",
                    NumeroEstampilla: info.NumeroEstampilla,
                    URLQR: info.URLQR,
                };
            });
            setStamps(parsed);
            setIsDirty(false);
        }
    }, [isOpen, data]);

    const totalStamps = stamps.length;
    const usedStamps = stamps.filter((s) => s.usada).length;

    const handleMenuOpen = (event, stamp) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedStamp(stamp);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedStamp(null);
    };

    const handleUnmark = () => {
        if (selectedStamp) {
            setStamps((prev) =>
                prev.map((s) =>
                    s.id === selectedStamp.id ? { ...s, usada: false } : s
                )
            );
            setIsDirty(true);
            setUnMarkStamp(true);
        }
        handleMenuClose();
    };

    const handleSelect = (id) => {
        setStamps((prev) =>
            prev.map((s) =>
                s.id === id ? { ...s, usada: !s.usada } : s
            )
        );
        setIsDirty(true);
    };
    const handleSubmit = () => {
        //si no hubo cambios no hago nada
        if (!isDirty) return;

        // si se destildo una usada primero confirmo
        if (unMarkStamp) {
            setOpenUnmarkConfirm(true);
            return;
        }

        // no hay destildadas, lo envio
        sendData();
    };

    const sendData = async () => {
        setLoadingInterno(true);
        const params = stamps.map((s) => ({
            id_venta: s.id_venta,
            nro_estampilla: s.nro_estampilla,
            usada: s.usada ? "1" : "0",
        }));

        const sendDataForm = {
            token,
            e: params
        }

        const response = await post(`estampillas_online/estampillas_online`, sendDataForm, "PUT");
        if (response && response == "OK") {
            await fetchData(false);
            setIsDirty(false);
            setUnMarkStamp(false);
            onClose();
            toast.success("Estampillas modificadas con éxito!")
        }
        setLoadingInterno(false);
    };
    const handleAttemptClose = () => {
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

    if (!data) return null;

    return (
        <>
            <Dialog open={isOpen} onClose={handleAttemptClose} maxWidth="sm" fullWidth>
                <DialogTitle className="flex justify-between items-center text-black">
                    <span>Detalle de estampillas #{data.id}</span>
                    <IconButton onClick={handleAttemptClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent className="bg-gray-50 space-y-4">
                    <Box className="w-full">
                        <Typography variant="subtitle2" className="text-gray-700 mb-1">
                            Estampillas usadas: {usedStamps} / {totalStamps}
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
                        {stamps.map((item) => (
                            <Grid item xs={12} sm={6} key={item.id}>
                                <Box
                                    sx={{
                                        position: "relative",
                                        cursor: item.usada ? "default" : "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        p: 1,
                                        borderRadius: 2,
                                        border: "1px solid #e5e7eb",
                                        backgroundColor: item.usada ? "#f3f4f6" : "#fff",
                                        opacity: item.usada ? 0.7 : 1,
                                        transition:
                                            "background-color 0.2s ease, border-color 0.2s ease",
                                        "&:hover": {
                                            backgroundColor: item.usada
                                                ? "#f3f4f6"
                                                : "#f9fafb",
                                        },
                                    }}
                                    onClick={() => {
                                        if (!item.usada) handleSelect(item.id);
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
                                            fontSize: "0.7rem",
                                            fontWeight: item.usada ? 400 : 600,
                                        }}
                                    >
                                        {item.NumeroEstampilla}
                                    </Typography>

                                    {item.usada && (
                                        <IconButton
                                            size="small"
                                            onClick={(e) => handleMenuOpen(e, item)}
                                            sx={{
                                                position: "absolute",
                                                top: 4,
                                                right: 4,
                                            }}
                                        >
                                            <MoreVertIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={handleSubmit}
                        variant="outlined"
                        size="small"
                        disabled={!isDirty || loading || loadingInterno}
                        sx={{
                            borderRadius: "8px",
                            textTransform: "none",
                            fontWeight: 500,
                            opacity: !isDirty ? 0.6 : 1,
                        }}
                    >
                        {(loading || loadingInterno) ? "Guardando.." : "Guardar"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleUnmark}>Destildar estampilla</MenuItem>
            </Menu>

            <Dialog
                open={openConfirm}
                onClose={() => setOpenConfirm(false)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle className="font-semibold text-gray-800">
                    Cambios sin guardar
                </DialogTitle>
                <DialogContent>
                    <DialogContentText className="text-gray-700">
                        Tenés cambios sin guardar. ¿Seguro que querés salir?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setOpenConfirm(false)}
                        variant="outlined"
                        size="small"
                        sx={{
                            borderRadius: "8px",
                            textTransform: "none",
                            fontWeight: 500,
                        }}
                    >
                        Cancelar
                    </Button>
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

            <Dialog
                open={openUnmarkConfirm}
                onClose={() => setOpenUnmarkConfirm(false)}
                maxWidth="xs"
                fullWidth
            >
                <DialogContent>
                    <DialogContentText className="text-gray-700">
                        Estás por destildar una estampilla que estaba marcada como usada.
                        ¿Querés continuar?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setOpenUnmarkConfirm(false)}
                        variant="outlined"
                        size="small"
                        sx={{
                            borderRadius: "8px",
                            textTransform: "none",
                            fontWeight: 500,
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        color="warning"
                        onClick={() => {
                            setOpenUnmarkConfirm(false);
                            sendData();
                        }}
                        variant="outlined"
                        size="small"
                        disabled={loading || loadingInterno}
                        sx={{
                            borderRadius: "8px",
                            textTransform: "none",
                            fontWeight: 500,
                        }}
                    >
                        {(loading || loadingInterno) ? "Guardando.." : "Guardar"}
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    );
}
