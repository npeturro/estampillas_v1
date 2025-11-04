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
const stamps = [
    {
        id: "1",
        client: "Pepito",
        state: "finalizada",

    }
];

export default function PhysicalSalesTable() {
    const navigate = useNavigate();


    const columns = [
        {
            field: 'id',
            headerName: 'Identificador',
            flex: 1,
        },
        {
            field: 'client',
            headerName: 'Cliente',
            flex: 1,
        },
        {
            field: 'state',
            headerName: 'Estado de venta',
            flex: 1,
            renderCell: (params) => {
                const isFinalizada = params.value === "finalizada";
                const isPendiente = params.value === "finalizar compra";

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
                    return (
                        <Chip
                            icon={<ShoppingCartIcon />}
                            label="Finalizar compra"
                            color="warning"
                            size="small"
                            clickable
                            variant="outlined"
                            onClick={() => navigate("/checkout")}
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
            field: 'actions',
            headerName: '',
            flex: 0.3,
            sortable: false,
            align: 'center',
            renderCell: (params) => (
                <>
                    <button
                        className="cursor-pointer"
                        title="Ver"
                    >
                        <VisibilityOutlinedIcon fontSize="small" />
                    </button>
                </>
            ),
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
            />

        </Box>
    );
}
