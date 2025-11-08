import {
    Box,
    Typography,
    TextField,
    Drawer,
    IconButton,
    Stack,
    Divider,
    useTheme,
    useMediaQuery,
    Chip,
    CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalPostOfficeIcon from "@mui/icons-material/LocalPostOffice";
import { DataGrid } from "@mui/x-data-grid";
import { esES } from '@mui/x-data-grid/locales';
import { useState, useMemo } from "react";
import { getToken } from "../../utils/auth";
import { useGET } from "../../hooks/useGET";

export default function PhysicalSalesGrid() {
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const token = getToken();
    const [data, loading, error] = useGET(`ventas?apellido=bonavera&fd=2025-09-01&fh=2025-09-24&id=-1&nro_pago=&token=${token}&app_online=1`);

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
            field: "nombre",
            headerName: "Nombre completo",
            flex: 1,
            minWidth: 160,
            renderCell: (params) => `${params.row.nombre} ${params.row.apellido}`,
        },
        {
            field: "estampillas",
            headerName: "Estampillas",
            flex: 0.5,
            minWidth: 100,
            renderCell: (params) => (
                <Chip
                    icon={<LocalPostOfficeIcon fontSize="small" color="info" />}
                    label={params.value}
                    color="success"
                    size="small"
                    variant="outlined"
                    sx={{
                        fontWeight: 500,
                        borderRadius: "8px",
                        pl: "4px",
                    }}
                />
            ),
        },
        {
            field: "total",
            headerName: "Total",
            flex: 0.6,
            minWidth: 100,
            renderCell: (params) => (
                <Chip
                    icon={<CheckCircleIcon fontSize="small" color="success" />}
                    label={`$${params.value}`}
                    color="success"
                    size="small"
                    variant="outlined"
                    sx={{
                        fontWeight: 500,
                        borderRadius: "8px",
                        pl: "4px",
                    }}
                />
            ),
        },
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
                    "& .MuiDataGrid-cell": { fontSize: 13 },
                    "& .MuiDataGrid-columnHeaders": {
                        fontWeight: "bold",
                        fontSize: 13,
                    },
                }}
            >
                <DataGrid
                    rows={data}
                    columns={columns}
                    pageSize={5}
                    showToolbar
                    rowsPerPageOptions={[5, 10]}
                    disableRowSelectionOnClick
                    onRowClick={(params) => setSelected(params.row)}
                    localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                />
            </Box>

            <Drawer
                anchor={isMobile ? "bottom" : "right"}
                open={Boolean(selected)}
                onClose={() => setSelected(null)}
                PaperProps={{
                    sx: {
                        width: isMobile ? "100%" : 380,
                        p: 2,
                        borderTopLeftRadius: isMobile ? 12 : 0,
                        borderTopRightRadius: isMobile ? 12 : 0,
                    },
                }}
            >
                {selected && (
                    <>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            mb={1.5}
                        >
                            <Typography variant="h6" fontSize={16} fontWeight={600}>
                                {selected.nombre} {selected.apellido}
                            </Typography>
                            <IconButton onClick={() => setSelected(null)} size="small">
                                <CloseIcon />
                            </IconButton>
                        </Stack>

                        <Divider sx={{ mb: 1 }} />

                        <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Fecha creación:</strong>{" "}
                            {new Date(selected.fecha_creacion).toLocaleDateString("es-AR", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                            })}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Pago:</strong> {selected.entidad_pago} — N° {selected.nro_pago}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Vendedor:</strong> {selected.vendedor}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Total:</strong> ${selected.total}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Estampillas:</strong> {selected.estampillas}
                        </Typography>

                        <Divider sx={{ my: 1 }} />

                        {selected.detalle.map((d) => (
                            <Box key={d.id} sx={{ mb: 2 }}>
                                <Typography variant="body2" sx={{ mb: 0.5 }}>
                                    <strong>Cantidad:</strong> {d.cantidad}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 0.5 }}>
                                    <strong>Precio:</strong> ${d.precio}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 0.5 }}>
                                    <strong>Subtotal:</strong> ${d.subtotal}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        mt: 0.5,
                                        overflowY: "auto",
                                        fontSize: 14,
                                        color: "text.secondary",
                                    }}
                                >
                                    {d.estampillas}
                                </Typography>
                            </Box>
                        ))}
                    </>
                )}
            </Drawer>
        </Box>
    );
}
