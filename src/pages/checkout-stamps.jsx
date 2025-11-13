import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Button,
    TextField,
    Typography,
    Box,
    IconButton,
    Divider,
    Stack,
    Chip,
    CircularProgress,
    Card,
    CardContent,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useGET } from "../hooks/useGET";
import { usePost } from "../hooks/usePost";
import { getToken, getUser } from "../utils/auth";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { toast } from "sonner";


export default function CheckoutStamps() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = getToken();
    const user = getUser();
    const [price, loadingp, error] = useGET(`estampillas_online/precio?token=${token}`);
    const stepFromUrl = parseInt(searchParams.get("s")) || 0;
    const tipoFromUrl = searchParams.get("t") || "";
    const cantidadFromUrl = parseInt(searchParams.get("c")) || 1;
    const precioFromUrl = parseFloat(searchParams.get("p")) || 0;
    const idFromUrl = parseFloat(searchParams.get("i")) || null;
    const [activeStep, setActiveStep] = useState(stepFromUrl);
    const [cantidad, setCantidad] = useState(cantidadFromUrl);
    const [precioUnitario, setPrecioUnitario] = useState(precioFromUrl);
    const [confirmId, setConfirmId] = useState(idFromUrl);
    const [tipoValor, setTipoValor] = useState(tipoFromUrl);
    const [data, loadingPago, errorPago] = useGET(
        idFromUrl ? `pagos_online/nave?token=${token}&id_venta=${idFromUrl}` : null
    );
    const [loadingStamps, setLoadingStamps] = useState(false);

    const detalles = data[0]?.detalle?.[0];
    const estado = detalles?.estado ? JSON.parse(detalles.estado) : null;
    const transaction = detalles?.json_pago ? JSON.parse(detalles.json_pago) : null;
    const aprobado = estado?.name === "APPROVED";

    const { post, loading, errorPost } = usePost();
    const steps = ["Cantidad", "Pago", "Estampillas"];

    useEffect(() => {
        if (!precioFromUrl && price?.TiposValores?.length > 0) {
            setPrecioUnitario(price.TiposValores[0].Valor);
            setTipoValor(price.TiposValores[0].Codigo)
        }
    }, [precioFromUrl, price]);


    useEffect(() => setActiveStep(stepFromUrl), [stepFromUrl]);
    const handleNext = () => setActiveStep((p) => Math.min(p + 1, steps.length - 1));
    const handleBack = () => setActiveStep((p) => Math.max(p - 1, 0));

    const handleCantidad = (action) => {
        if (action === "inc") setCantidad((p) => p + 1);
        if (action === "dec" && cantidad > 1) setCantidad((p) => p - 1);
    };

    // const onSubmit = (data) => handleNext();

    const handleConfirm = async () => {
        const total = precioUnitario * cantidad;
        const sendData = {
            id_profesional: user.id,
            cantidad,
            tipo_valor: tipoValor,
            precio: precioUnitario,
            total,
            obs: '',
            token
        };


        try {
            let response;

            if (!confirmId) {
                response = await post("ventas/online", sendData);
                if (response?.id) {
                    setConfirmId(response.id);
                }
            } else {
                const sendDataPut = {
                    id: confirmId,
                    cantidad,
                    tipo_valor: tipoValor,
                    precio: precioUnitario,
                    total,
                    obs: '',
                    token
                };
                response = await post(`ventas/online`, sendDataPut, "PUT");
            }

            if (response) handleNext();

        } catch (err) {
            console.error("Error al guardar la venta:", err);
        }
        // handleNext();
    };
    const handlePay = async () => {
        const total = precioUnitario * cantidad;
        const sendData = {
            id_venta: confirmId,
            cantidad,
            precio: precioUnitario,
            total,
            callback_url: 'https://circulokinesiologossursantafe.com/', //nose si va o no va
            token
        };

        try {
            const response = await post("pagos_online/nave", sendData);

            if (typeof response === "string" && response.startsWith("http")) {
                window.location.href = response;
            } else {
                console.error("Respuesta inesperada:", response);
            }


        } catch (err) {
            console.error("Error al crear el pago NAVE:", err);
        }
    };

    const handleStamps = async () => {
        setLoadingStamps(true);
        const sendData = {
            id_venta: idFromUrl,
            usuario: user.usuario,
            nro_ospac: user.nro_ospac,
            nro_ficha: user.usuario, //es identificacion del paciente que no tengo
            tipo_valor: tipoValor,
            cantidad: cantidad,
            token
        }

        try {
            const response = await post("estampillas_online/estampillas_online", sendData);
            if (response) {
                toast.success("¡Estampillas solicitadas con éxito! Serás redirigido al inicio");
                setTimeout(() => navigate("/online_stamps"), 1500);
            }

        } catch (err) {
            // toast.error("Ha ocurrido un error al intentar solicitar las estampillas. Reintenlo nuevamente y si el error persiste contactese con la administración.")
            console.error("Error:", err);
        } finally {
            setLoadingStamps(false);
        }

    };


    if (loadingp) {
        return (
            <div className="flex justify-center items-center h-64">
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 mt-10">
                Ocurrió un error al cargar los datos. Si el error persiste, contáctese con la administración.
            </div>
        );
    }

    return (
        <Box
            className="flex items-start justify-center"
        >
            <Box
                sx={{
                    width: "100%",
                    backdropFilter: "blur(8px)",
                    backgroundColor: "rgba(255,255,255,0.85)",
                    borderRadius: "16px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
                    p: { xs: 1.5, sm: 2 },
                }}
            >

                <Box mb={4}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 1,
                        }}
                    >
                        {steps.map((step, i) => (
                            <Box
                                key={i}
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 0.5,
                                }}
                            >
                                <motion.div
                                    animate={{
                                        backgroundColor:
                                            i <= activeStep ? "#6366f1" : "rgba(0,0,0,0.1)",
                                        scale: i === activeStep ? 1.1 : 1,
                                    }}
                                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                                >
                                    {i + 1}
                                </motion.div>
                                <Typography
                                    variant="caption"
                                    color={i <= activeStep ? "primary" : "textSecondary"}
                                >
                                    {step}
                                </Typography>
                            </Box>
                        ))}
                    </Box>

                    <Box
                        sx={{
                            position: "relative",
                            height: 3,
                            borderRadius: 2,
                            backgroundColor: "#e0e0e0",
                            overflow: "hidden",
                        }}
                    >
                        <motion.div
                            layout
                            initial={false}
                            animate={{
                                width: `${((activeStep + 1) / steps.length) * 100}%`,
                                backgroundColor: "#6366f1",
                            }}
                            transition={{ duration: 0.4 }}
                            className="h-full"
                        />
                    </Box>
                </Box>

                <AnimatePresence mode="wait">

                    {activeStep === 0 && (
                        <motion.div
                            key="step0"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.35 }}
                            className="flex flex-col items-center gap-4"
                        >
                            <Typography variant="h6" className="font-semibold text-gray-800">
                                Cantidad de estampillas
                            </Typography>

                            <Box className="flex items-center gap-5">
                                <IconButton
                                    onClick={() => handleCantidad("dec")}
                                    disabled={cantidad <= 1}
                                    sx={{
                                        bgcolor: "grey.100",
                                        "&:hover": { bgcolor: "grey.200" },
                                        border: "1px solid #e0e0e0",
                                    }}
                                >
                                    <RemoveIcon />
                                </IconButton>

                                <motion.div
                                    key={cantidad}
                                    initial={{ scale: 0.9, opacity: 0.8 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Typography variant="h4" fontWeight={600}>
                                        {cantidad}
                                    </Typography>
                                </motion.div>

                                <IconButton
                                    onClick={() => handleCantidad("inc")}
                                    sx={{
                                        bgcolor: "grey.100",
                                        "&:hover": { bgcolor: "grey.200" },
                                        border: "1px solid #e0e0e0",
                                    }}
                                >
                                    <AddIcon />
                                </IconButton>
                            </Box>

                            <Typography variant="body2" color="text.secondary">
                                Seleccioná cuántas estampillas querés comprar.
                            </Typography>
                            <Box
                                sx={{
                                    width: "100%",
                                    p: 3,
                                    borderRadius: 3,
                                    backgroundColor: "#f9fafb",
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                <Typography variant="subtitle2" color="text.secondary">
                                    Precio por unidad
                                </Typography>
                                {
                                    (precioUnitario) ? (
                                        <Typography variant="h6" sx={{ color: "#4f46e5", fontWeight: 600 }}>
                                            ${precioUnitario}
                                        </Typography>
                                    ) : (
                                        <Typography variant="h6" sx={{ color: "#4f46e5", fontWeight: 600 }}>
                                            Valor no disponible. Recargar la página.
                                        </Typography>
                                    )
                                }

                                <Divider sx={{ width: "40%", my: 1 }} />

                                <Typography variant="subtitle2" color="text.secondary">
                                    Total a pagar
                                </Typography>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 700,
                                        color: "#1e293b",
                                        letterSpacing: "0.5px",
                                    }}
                                >
                                    ${(cantidad * precioUnitario).toLocaleString("es-AR")}
                                </Typography>
                            </Box>


                            <Divider sx={{ width: "100%", my: 2 }} />

                            <Box className="flex justify-end w-full">
                                <Button
                                    variant="contained"
                                    onClick={handleConfirm}
                                    disabled={loading}
                                    sx={{
                                        textTransform: "none",
                                        borderRadius: 2,
                                        background: "linear-gradient(135deg, #6366f1 0%, #818cf8 100%)",
                                        px: 3,
                                    }}
                                >
                                    {loading ? (
                                        <>
                                            <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                                            Procesando...
                                        </>
                                    ) : (
                                        "Confirmar compra"
                                    )}
                                </Button>

                            </Box>
                        </motion.div>

                    )}

                    {activeStep === 1 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.35 }}
                            className="flex flex-col gap-4"
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                    color: "#1e293b",
                                    textAlign: "center",
                                    mb: 1,
                                }}
                            >
                                Confirmación del pedido
                            </Typography>

                            <Box
                                sx={{
                                    width: "100%",
                                    p: 3,
                                    borderRadius: 3,
                                    backgroundColor: "#f9fafb",
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                <Typography variant="subtitle2" color="text.secondary">
                                    Cantidad seleccionada
                                </Typography>
                                <Typography variant="h6" sx={{ color: "#4f46e5", fontWeight: 600 }}>
                                    {cantidad}
                                </Typography>

                                <Divider sx={{ width: "40%", my: 1 }} />

                                <Typography variant="subtitle2" color="text.secondary">
                                    Total
                                </Typography>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 700,
                                        color: "#1e293b",
                                        letterSpacing: "0.5px",
                                    }}
                                >
                                    ${(cantidad * precioUnitario).toLocaleString("es-AR")}
                                </Typography>
                            </Box>


                            <Typography
                                variant="body2"
                                sx={{
                                    textAlign: "center",
                                    color: "text.secondary",
                                    mt: 1,
                                }}
                            >
                                Revisá los datos antes de continuar con el pago.
                            </Typography>


                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    mt: 2,
                                }}
                            >
                                <Button
                                    onClick={handleBack}
                                    variant="outlined"
                                    sx={{
                                        borderRadius: 3,
                                        textTransform: "none",
                                        px: 3,
                                    }}
                                >
                                    Volver
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handlePay}
                                    disabled={loading}
                                    sx={{
                                        textTransform: "none",
                                        borderRadius: 2,
                                        background: "linear-gradient(135deg, #6366f1 0%, #818cf8 100%)",
                                        px: 3,
                                    }}
                                >
                                    {loading ? (
                                        <>
                                            <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                                            Redirigiendo...
                                        </>
                                    ) : (
                                        "Ir a pagar"
                                    )}
                                </Button>
                            </Box>
                        </motion.div>
                    )}

                    {activeStep === 2 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.35 }}
                            className="flex flex-col gap-4"
                        >
                            {loadingPago ? (
                                <CircularProgress size={24} />
                            ) : estado ? (
                                <Box
                                    sx={{
                                        width: "100%",
                                        p: 3,
                                        borderRadius: 3,
                                        backgroundColor: "#f9fafb",
                                        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: 1,
                                    }}
                                >
                                    <Stack alignItems="center" spacing={1} sx={{ mb: 3 }}>
                                        <Chip
                                            icon={aprobado ? <CheckCircleIcon /> : <CancelIcon />}
                                            label={aprobado ? "Pago aprobado" : estado?.name || "Desconocido"}
                                            color={aprobado ? "success" : "error"}
                                            sx={{ fontWeight: 600, px: 1.5, py: 0.5 }}
                                        />
                                        <Typography variant="body2" color="text.secondary">
                                            {new Date(data[0]?.fecha).toLocaleString("es-AR")}
                                        </Typography>
                                    </Stack>

                                    <Card variant="outlined">
                                        <CardContent>
                                            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                                                <ReceiptLongIcon color="primary" />
                                                <Typography variant="subtitle1" fontWeight={600}>
                                                    Resumen del pago
                                                </Typography>
                                            </Stack>
                                            <Typography variant="body2">
                                                ID de pago: {transaction?.id}
                                            </Typography>
                                            <Typography variant="body2">
                                                Monto: <strong>${transaction?.transactions[0]?.amount?.value || "—"}</strong>
                                            </Typography>
                                        </CardContent>
                                    </Card>

                                    {aprobado && (
                                        <Button
                                            onClick={handleStamps}
                                            variant="contained"
                                            color="success"
                                            disabled={loadingStamps}
                                            startIcon={!loadingStamps && <AddCircleOutlineIcon />}
                                            sx={{
                                                mt: 2,
                                                px: 3,
                                                py: 1,
                                                borderRadius: "50px",
                                                fontWeight: 700,
                                                letterSpacing: 0.5,
                                                textTransform: "none",
                                                boxShadow: "0 3px 8px rgba(0, 128, 0, 0.25)",
                                                transition: "all 0.25s ease",
                                                "&:hover": {
                                                    boxShadow: "0 4px 12px rgba(0, 128, 0, 0.35)",
                                                    transform: "translateY(-1px)"
                                                },
                                            }}
                                        >
                                            {loadingStamps ? (
                                                <CircularProgress size={22} sx={{ color: "white" }} />
                                            ) : (
                                                "Solicitar estampillas"
                                            )}
                                        </Button>

                                    )}
                                </Box>
                            ) : null}
                        </motion.div>
                    )}


                </AnimatePresence>
            </Box>
        </Box>
    );
}
