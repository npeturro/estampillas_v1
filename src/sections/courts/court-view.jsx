import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Button,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";
import { toast } from "sonner";

export default function CourtView({ isOpen, onClose, data }) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [confirmData, setConfirmData] = useState(null);
    const [formData, setFormData] = useState(data || {});

    if (!data) return null;

    const { id, name, state, description } = data;

    // --- Modal de confirmación ---
    const openConfirm = (action) => setConfirmData({ action });
    const closeConfirm = () => setConfirmData(null);

    const confirmAction = () => {
        if (confirmData.action === "delete") handleDelete();
        if (confirmData.action === "disable") handleDisable();
    };

    return (
        <>
            <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle className="flex justify-between items-center text-black font-semibold text-lg">
                    <span>Detalle de cancha</span>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent className="bg-gray-50 space-y-4">
                    <div className="flex items-center space-x-2">
                        <SportsTennisIcon className="text-blue-600" />
                        <span className="font-semibold text-gray-800 text-lg">{name}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                        <span><strong>Estado:</strong></span>
                        <span
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${state == 1
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                        >
                            {state == 1 ? "Disponible" : "No disponible"}
                        </span>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-700 mb-1">Descripción</h3>
                        <p className="text-gray-600">{description || "Sin descripción"}</p>
                    </div>
                </DialogContent>

            </Dialog>

           
            {/* MODAL DE CONFIRMACIÓN */}
            <Dialog open={!!confirmData} onClose={closeConfirm} maxWidth="xs" fullWidth>
                <DialogTitle className="font-semibold text-gray-800">
                    Confirmar acción
                </DialogTitle>
                <DialogContent>
                    <Typography className="text-gray-700">
                        {confirmData?.action === "delete"
                            ? "¿Seguro que deseas eliminar esta cancha? Esta acción no se puede deshacer."
                            : "¿Seguro que deseas deshabilitar esta cancha?"}
                    </Typography>
                </DialogContent>
                <DialogActions className="p-4">
                    <Button onClick={closeConfirm}>Cancelar</Button>
                    <Button
                        variant="contained"
                        color={confirmData?.action === "delete" ? "error" : "warning"}
                        onClick={confirmAction}
                    >
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
