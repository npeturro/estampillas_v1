import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    TextField,
    Switch,
    Chip
} from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useState, useEffect } from 'react';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from 'react-router-dom';
import OnlineDetails from './online-details';
const stamps = [
    {
        id: "1",
        state: "finalizar_compra",
        total_stamps: 40,
        used_stamps: 25,
        stamps: {
            id: 133,
            cantidad: 7,
            precio: 3100
        }

    }
];

export default function OnlineStampsTable() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);


    const columns = [
        {
            field: 'id',
            headerName: 'Identificador',
            flex: 1,
        },
        {
            field: 'state',
            headerName: 'Estado de venta',
            flex: 1,
            renderCell: (params) => {
                const isFinalizada = params.value === "finalizada";
                const isPendiente = params.value === "finalizar_compra";

                if (isFinalizada) {
                    return (
                        <Chip
                            icon={<CheckCircleIcon />}
                            label="Finalizada"
                            color="success"
                            size="small"
                            variant="outlined"
                            sx={{
                                fontWeight: 500,
                                borderRadius: "8px",
                                pl: "4px",
                            }}
                        />
                    );
                }

                if (isPendiente) {
                    const { stamps } = params.row;
                    return (
                        <Chip
                            icon={<ShoppingCartIcon />}
                            label="Finalizar compra"
                            color="warning"
                            size="small"
                            clickable
                            variant="outlined"
                            onClick={(event) => {
                                event.stopPropagation(); // evita que se dispare el onRowClick
                                navigate(`/checkout_stamps?s=1&i=${stamps.id}&c=${stamps.cantidad}&p=${stamps.precio}`);
                            }}

                            sx={{
                                fontWeight: 500,
                                borderRadius: "8px",
                                pl: "4px",
                                '& .MuiChip-icon': { color: "#f59e0b" } // tono ámbar
                            }}
                        />
                    );
                }

                return (
                    <Chip
                        label="Desconocido"
                        size="small"
                        variant="outlined"
                        color="default"
                    />
                );
            }
        },
        {
            field: 'total_stamps',
            headerName: 'Total de estampillas',
            flex: 1,
            renderCell: (params) => {
                const { total_stamps, used_stamps } = params.row;

                return (
                    <Chip
                        label={`${used_stamps}/${total_stamps}`}
                        color="success"
                        size="small"
                        clickable
                        variant="outlined"
                        sx={{
                            fontWeight: 500,
                            borderRadius: "8px",
                            pl: "4px",
                            '& .MuiChip-icon': { color: "green" } // tono ámbar
                        }}
                    />
                );
            }
        }

    ];


    return (
        <Box sx={{ height: '100%', width: '100%' }}>
            <DataGrid
                rows={stamps}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { pageSize: 8 },
                    },
                }}
                pageSizeOptions={[8]}
                disableRowSelectionOnClick
                showToolbar
                onRowClick={(params) => {
                    setSelectedAppointment(params.row);
                    setIsModalOpen(true);
                }}
            />

            <OnlineDetails
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                data={selectedAppointment}
            />

        </Box>
    );
}
