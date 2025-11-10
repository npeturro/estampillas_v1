import {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    Typography,
    Card,
    CardContent,
    Divider,
    Chip,
    Stack,
    IconButton,
} from "@mui/material";
import { motion } from "framer-motion";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PersonIcon from "@mui/icons-material/Person";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

export default function ApprovedPay({ isOpen, onClose, data }) {
    if (!data) return null;

    const pago = data?.pago?.[0];
    const detalles = data?.detalles_pago?.[0];

    const datosIntension = pago?.datos_intension ? JSON.parse(pago.datos_intension) : null;
    const jsonPago = detalles?.json_pago ? JSON.parse(detalles.json_pago) : null;
    const estado = detalles?.estado ? JSON.parse(detalles.estado) : null;

    const buyer = jsonPago?.buyer;
    const seller = jsonPago?.seller?.store;
    const transaction = jsonPago?.transactions?.[0];
    const card = jsonPago?.payment_method;

    const aprobado = estado?.name === "APPROVED";

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: {
                    backdropFilter: "blur(10px)",
                    background: "rgba(255,255,255,0.85)",
                    borderRadius: 4,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    pb: 0,
                }}
            >
                <Typography variant="h6" fontWeight={700}>
                    Detalles del pago
                </Typography>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Stack alignItems="center" spacing={1} sx={{ mb: 3 }}>
                    <Chip
                        icon={aprobado ? <CheckCircleIcon /> : <CancelIcon />}
                        label={aprobado ? "Pago aprobado" : estado?.name || "Desconocido"}
                        color={aprobado ? "success" : "error"}
                        sx={{ fontWeight: 600, px: 1.5, py: 0.5 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                        {new Date(detalles?.fecha || pago?.fecha).toLocaleString("es-AR")}
                    </Typography>
                </Stack>

                <Card variant="outlined" sx={{ mb: 3 }}>
                    <CardContent>
                        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                            <CreditCardIcon color="primary" />
                            <Typography variant="subtitle1" fontWeight={600}>
                                Resumen del pago
                            </Typography>
                        </Stack>
                        <Typography variant="body2">Monto: <strong>${transaction?.total_amount?.value || "—"}</strong></Typography>
                        <Typography variant="body2">
                            Método: {card?.product_id} ({card?.card_type})
                        </Typography>
                    </CardContent>
                </Card>

                <Card variant="outlined" sx={{ mb: 3 }}>
                    <CardContent>
                        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                            <PersonIcon color="primary" />
                            <Typography variant="subtitle1" fontWeight={600}>
                                Comprador
                            </Typography>
                        </Stack>
                        <Typography variant="body2">Nombre: {buyer?.name}</Typography>
                        <Typography variant="body2">DNI: {buyer?.doc_number}</Typography>
                        <Typography variant="body2">Email: {buyer?.user_email}</Typography>
                        <Typography variant="body2">
                            Dirección: {buyer?.billing_address?.street_1}, {buyer?.billing_address?.city}
                        </Typography>
                    </CardContent>
                </Card>

                <Card variant="outlined">
                    <CardContent>
                        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                            <ReceiptLongIcon color="primary" />
                            <Typography variant="subtitle1" fontWeight={600}>
                                Transacción
                            </Typography>
                        </Stack>
                        <Typography variant="body2">ID de pago: {jsonPago?.id}</Typography>
                        <Typography variant="body2">
                            Ticket: {transaction?.auth_data?.ticket?.number}
                        </Typography>
                        <Typography variant="body2">
                            Autorización: {transaction?.auth_data?.auth_id}
                        </Typography>
                    </CardContent>
                </Card>
                
                <Card variant="outlined">
                    <CardContent>
                        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                            <ReceiptLongIcon color="primary" />
                            <Typography variant="subtitle1" fontWeight={600}>
                                Transacción
                            </Typography>
                        </Stack>
                        <Typography variant="body2">ID de pago: {jsonPago?.id}</Typography>
                        <Typography variant="body2">
                            Ticket: {transaction?.auth_data?.ticket?.number}
                        </Typography>
                        <Typography variant="body2">
                            Autorización: {transaction?.auth_data?.auth_id}
                        </Typography>
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    );
}
