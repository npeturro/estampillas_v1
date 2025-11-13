import {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    Typography,
    Card,
    CardContent,
    Chip,
    Stack,
    IconButton,
    Button,
    Divider,
    useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalPostOfficeIcon from "@mui/icons-material/LocalPostOffice";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PersonIcon from "@mui/icons-material/Person";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

export default function ApprovedPay({ isOpen, onClose, data }) {
    const isMobile = useMediaQuery("(max-width:600px)");
    if (!data) return null;

    const pago = data?.pago?.[0];
    const detalles = data?.detalles_pago?.[0];
    const datosIntension = pago?.datos_intension ? JSON.parse(pago.datos_intension) : null;
    const jsonPago = detalles?.json_pago ? JSON.parse(detalles.json_pago) : null;
    const estado = detalles?.estado ? JSON.parse(detalles.estado) : null;

    const buyer = jsonPago?.buyer;
    const transaction = jsonPago?.transactions?.[0];
    const card = jsonPago?.payment_method;
    const aprobado = estado?.name === "APPROVED";

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            fullScreen={isMobile}
            fullWidth
            PaperProps={{
                sx: {
                    backdropFilter: "blur(10px)",
                    background: "#fafafa",
                    borderRadius: isMobile ? 0 : 4,
                    boxShadow: "0 6px 24px rgba(0,0,0,0.1)",
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: 2,
                    py: 1.5,
                    borderBottom: "1px solid #e2e8f0",
                    background: "#ffffff",
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                }}
            >

                Detalles del pago

                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent
                component={motion.div}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                sx={{
                    px: 2,
                    py: 2,
                    overflowY: "auto",
                }}
            >
                <Stack alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                    <Chip
                        icon={aprobado ? <CheckCircleIcon /> : <CancelIcon />}
                        label={aprobado ? "Pago aprobado" : estado?.name || "Desconocido"}
                        color={aprobado ? "success" : "error"}
                        sx={{
                            fontWeight: 600,
                            px: 2,
                            py: 1,
                            fontSize: "0.95rem",
                        }}
                    />
                    <Typography variant="body2" color="text.secondary">
                        {new Date(detalles?.fecha || pago?.fecha).toLocaleString("es-AR")}
                    </Typography>
                </Stack>

                <ModernCard icon={<CreditCardIcon color="primary" />} title="Resumen del pago">
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                        Monto: <strong>${transaction?.total_amount?.value || "—"}</strong>
                    </Typography>
                    <Typography variant="body2">
                        Método: {card?.product_id} ({card?.card_type})
                    </Typography>
                </ModernCard>

                <ModernCard icon={<PersonIcon color="primary" />} title="Comprador">
                    <Typography variant="body2">Nombre: {buyer?.name}</Typography>
                    <Typography variant="body2">DNI: {buyer?.doc_number}</Typography>
                    <Typography variant="body2">Email: {buyer?.user_email}</Typography>
                    <Typography variant="body2">
                        Dirección: {buyer?.billing_address?.street_1},{" "}
                        {buyer?.billing_address?.city}
                    </Typography>
                </ModernCard>

                <ModernCard icon={<ReceiptLongIcon color="primary" />} title="Transacción">
                    <Typography variant="body2">ID de pago: {jsonPago?.id}</Typography>
                </ModernCard>

                {data.estampillas_detalle?.length > 0 && (
                    <ModernCard
                        icon={<LocalPostOfficeIcon color="primary" />}
                        title="Estampillas"
                    >
                        <Stack spacing={1}>
                            {data.estampillas_detalle.map((item) => {
                                const parsed = JSON.parse(item.json_estampilla);
                                return (
                                    <Box
                                        key={item.id}
                                        sx={{
                                            p: 1.2,
                                            borderRadius: 2,
                                            border: "1px solid #e5e7eb",
                                            backgroundColor: "#f9fafb",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            gap: 1,
                                            flexWrap: "wrap",
                                            "@media (max-width:600px)": {
                                                flexDirection: "column",
                                                alignItems: "stretch",
                                                textAlign: "center",
                                            },
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            fontWeight={500}
                                            sx={{
                                                fontSize: "0.9rem",
                                                wordBreak: "break-word",
                                                flex: 1,
                                            }}
                                        >
                                            Nº {parsed.NumeroEstampilla}
                                        </Typography>

                                        <Button
                                            href={parsed.URLQR}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            size="small"
                                            fullWidth={{ xs: true, sm: false }}
                                            sx={{
                                                textTransform: "none",
                                                background: "#2563eb",
                                                color: "#fff",
                                                borderRadius: 2,
                                                px: 2,
                                                py: 0.6,
                                                fontSize: "0.85rem",
                                                width: { xs: "100%", sm: "auto" },
                                                "&:hover": { background: "#1d4ed8" },
                                            }}
                                        >
                                            Ver
                                        </Button>
                                    </Box>

                                );
                            })}
                        </Stack>
                    </ModernCard>
                )}
            </DialogContent>
        </Dialog>
    );
}

function ModernCard({ icon, title, children }) {
    return (
        <Card
            variant="outlined"
            sx={{
                mb: 2.5,
                borderRadius: 2,
                borderColor: "#e5e7eb",
                boxShadow: "none",
                background: "#fff",
            }}
        >
            <CardContent sx={{ p: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    {icon}
                    <Typography variant="subtitle1" fontWeight={600}>
                        {title}
                    </Typography>
                </Stack>
                <Divider sx={{ mb: 1 }} />
                {children}
            </CardContent>
        </Card>
    );
}
