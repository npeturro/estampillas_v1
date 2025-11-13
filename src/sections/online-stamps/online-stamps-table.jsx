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
import AddIcon from "@mui/icons-material/Add";
import { useNavigate, useSearchParams } from 'react-router-dom';
import OnlineDetails from './online-details';
import { useGET } from '../../hooks/useGET';
import { getToken } from '../../utils/auth';
import { esES } from '@mui/x-data-grid/locales';
import ApprovedPay from './approved-pay';
import { Stack } from '@mui/joy';


export default function OnlineStampsTable() {
    const navigate = useNavigate();
    const token = getToken();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenApproved, setIsModalOpenApproved] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [data, loading, error] = useGET(`ventas/online?token=${token}`);

    const initialPage = parseInt(searchParams.get("p") || "1", 10) - 1;
    const [page, setPage] = useState(initialPage);

    // Actualizar la URL cuando cambie la página
    useEffect(() => {
        setSearchParams({ p: page + 1 });
    }, [page, setSearchParams]);

    const columns = [
        {
            field: 'fecha_creacion',
            headerName: 'Fecha',
            flex: 1,
            renderCell: (params) => {
                return (
                    new Date(params.row.fecha_creacion).toLocaleDateString("es-AR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false
                    })
                )
            }
        },
        {
            field: 'state',
            headerName: 'Estado de compra',
            flex: 1,
            renderCell: (params) => {
                const { fecha_pago, nro_pago, entidad_pago, pago, detalles_pago } = params.row;
                const estado = detalles_pago[0]?.estado ? JSON.parse(detalles_pago[0].estado) : null;

                const isFinalizada = estado?.name === "APPROVED";
                const isPendiente = !isFinalizada;


                if (isFinalizada) {
                    return (
                        <Chip
                            icon={<CheckCircleIcon />}
                            label="Aprobado"
                            color="success"
                            size="small"
                            variant="outlined"
                            onClick={(event) => {
                                event.stopPropagation(); // evita que se dispare el onRowClick
                                setSelectedAppointment(params.row);
                                setIsModalOpenApproved(true);
                            }}
                            sx={{
                                fontWeight: 500,
                                borderRadius: "8px",
                                pl: "4px",
                            }}
                        />
                    );
                }

                if (isPendiente) {
                    const { id_venta, cantidad, precio, tipo_valor } = params.row.detalle[0];
                    return (
                        <Chip
                            icon={<ShoppingCartIcon />}
                            label="Pendiente de pago"
                            color="warning"
                            size="small"
                            clickable
                            variant="outlined"
                            onClick={(event) => {
                                event.stopPropagation(); // evita que se dispare el onRowClick
                                navigate(`/checkout_stamps?s=1&i=${id_venta}&c=${cantidad}&p=${precio}&t=${tipo_valor}`);
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
            field: 'total',
            headerName: 'Total',
            flex: 1,
            renderCell: (params) => { return (`$${params.row.total}`) }
        },
        {
            field: 'total_stamps',
            headerName: 'Total de estampillas',
            flex: 1,
            renderCell: (params) => {
                const { estampillas, estampillas_detalle = [], detalles_pago = [] } = params.row;
                const { id_venta, cantidad, precio, tipo_valor } = params.row.detalle[0]
                const estado = detalles_pago[0]?.estado ? JSON.parse(detalles_pago[0].estado) : null;
                const APPROVED = estado?.name === "APPROVED";

                if (estampillas_detalle.length > 0) {
                    return (
                        <Chip
                            label={`0/${estampillas}`}
                            color="success"
                            size="small"
                            clickable
                            variant="outlined"
                            sx={{
                                fontWeight: 500,
                                borderRadius: "8px",
                                "& .MuiChip-icon": { color: "green" },
                            }}
                        />
                    );
                }

                if (estampillas_detalle.length === 0 && APPROVED) {
                    return (
                        <Chip
                            icon={<AddIcon />}
                            label="Solicitar estampillas"
                            color="warning"
                            size="small"
                            clickable
                            variant="outlined"
                            onClick={(event) => {
                                event.stopPropagation();
                                navigate(`/checkout_stamps?s=2&i=${id_venta}&c=${cantidad}&t=${tipo_valor}`);
                            }}
                            sx={{
                                fontWeight: 500,
                                borderRadius: "8px",
                                pl: "4px",
                                "& .MuiChip-icon": { color: "#f59e0b" },
                            }}
                        />
                    );
                }

            }
        }

    ];


    return (
        <Box
            sx={{
                width: "100%",
                mx: "auto",
                minHeight: "calc(100vh - 150px)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}
        >
            <Box
                sx={{
                    flexGrow: 1,
                    height: 420,
                    backgroundColor: "#fff",
                    borderRadius: 2,
                    position: "relative",
                    "& .MuiDataGrid-cell": { fontSize: 13 },
                    "& .MuiDataGrid-columnHeaders": {
                        fontWeight: "bold",
                        fontSize: 13,
                    },
                }}
            >
                {loading ? (
                    <Stack
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                            height: "100%",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 10,
                            backgroundColor: "rgba(255,255,255,0.7)",
                        }}
                    >
                        <CircularProgress />
                    </Stack>
                ) : error ? (
                    <Typography
                        variant="body2"
                        color="error"
                        sx={{ textAlign: "center", pt: 4 }}
                    >
                        Ocurrió un error al cargar los datos.
                    </Typography>
                ) : (
                    <DataGrid
                        rows={data}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 8, page },
                            },
                        }}
                        page={page}
                        onPaginationModelChange={(model) => {
                            setPage(model.page);
                        }}
                        pageSizeOptions={[8, 25]}
                        disableRowSelectionOnClick
                        showToolbar
                        onRowClick={(params) => {
                            setSelectedAppointment(params.row);
                            setIsModalOpen(true);
                        }}
                        localeText={esES.components.MuiDataGrid.defaultProps.localeText}

                    />
                )}
            </Box>

            <OnlineDetails
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                data={selectedAppointment}
            />

            <ApprovedPay
                isOpen={isModalOpenApproved}
                onClose={() => setIsModalOpenApproved(false)}
                data={selectedAppointment}
            />

        </Box>
    );
}
