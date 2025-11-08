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
import { useNavigate, useSearchParams } from 'react-router-dom';
import OnlineDetails from './online-details';
import { useGET } from '../../hooks/useGET';
import { getToken } from '../../utils/auth';
import { esES } from '@mui/x-data-grid/locales';


export default function OnlineStampsTable() {
    const navigate = useNavigate();
    const token = getToken();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [data, loading, error] = useGET(`ventas/online?token=${token}`);

    const initialPage = parseInt(searchParams.get("p") || "1", 10) - 1;
    const [page, setPage] = useState(initialPage);

    // Actualizar la URL cuando cambie la página
    useEffect(() => {
        setSearchParams({ p: page + 1 });
    }, [page, setSearchParams]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return (
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                    Ocurrió un error al cargar los datos. Si el error persiste, contáctese con la administración.
                </table>
            </div>
        );
    }

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
                const { fecha_pago, nro_pago, entidad_pago, pago } = params.row;

                const isPendiente = pago.length === 0;
                const isFinalizada = !isPendiente;


                if (isFinalizada) {
                    return (
                        <Chip
                            icon={<CheckCircleIcon />}
                            label="Aprobado"
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
                    const { id_venta, cantidad, precio } = params.row.detalle[0];
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
                                navigate(`/checkout_stamps?s=1&i=${id_venta}&c=${cantidad}&p=${precio}`);
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
                const { estampillas } = params.row;

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

            <OnlineDetails
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                data={selectedAppointment}
            />

        </Box>
    );
}
