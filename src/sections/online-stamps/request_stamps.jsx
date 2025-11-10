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

export default function RequestStamps({ isOpen, onClose, data }) {

    const handleClose = () => {
        onClose();
    };


    if (!data) return null;

    return (
        <>
            <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle className="flex justify-between items-center text-black font-semibold text-lg">
                    <span>Solicitar estampillas #{data.detalle[0].id_venta}</span>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
            </Dialog>
        </>
    );
}
