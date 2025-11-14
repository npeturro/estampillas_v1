import {
    Box,
    Typography,
    Drawer,
    IconButton,
    Stack,
    Divider,
    useTheme,
    useMediaQuery,
    Chip,
    CircularProgress,
    Button
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalPostOfficeIcon from "@mui/icons-material/LocalPostOffice";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { DataGrid } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getToken, getUser } from "../../utils/auth";
import { useGET } from "../../hooks/useGET";

export default function PhysicalSalesGrid() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const token = getToken();
    const user = getUser();

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const monthParam = searchParams.get("month");
    const yearParam = searchParams.get("year");

    const initialDate = monthParam && yearParam
        ? new Date(parseInt(yearParam), parseInt(monthParam) - 1, 1)
        : new Date();

    const [currentMonth, setCurrentMonth] = useState(initialDate);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth() + 1;
        const params = new URLSearchParams(searchParams);
        params.set("year", year);
        params.set("month", month);
        navigate({ search: params.toString() }, { replace: true });
    }, [currentMonth]);

    const fd = useMemo(() => {
        const first = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        return first.toISOString().split("T")[0];
    }, [currentMonth]);

    const fh = useMemo(() => {
        const last = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
        return last.toISOString().split("T")[0];
    }, [currentMonth]);

    const [data, loading, error] = useGET(
        `ventas?apellido=${user.apellido ?? "bonavera"}&fd=${fd}&fh=${fh}&id=-4&nro_pago=&token=${token}&app_online=1`
    );

    const handlePrevMonth = () => {
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
        );
    };

    const handleNextMonth = () => {
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
        );
    };

    const columns = [
        {
            field: "fecha_creacion",
            headerName: "Fecha",
            flex: 1,
            renderCell: (params) => {
                const d = new Date(params.row.fecha_creacion);

                const dia = String(d.getDate()).padStart(2, "0");
                const mes = String(d.getMonth() + 1).padStart(2, "0");
                const año = d.getFullYear();
                const hora = String(d.getHours()).padStart(2, "0");
                const min = String(d.getMinutes()).padStart(2, "0");

                return `${dia}/${mes}/${año} ${hora}:${min}`;
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
            <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="center"
                mb={2}
            >
                <Button
                    variant="outlined"
                    size="small"
                    onClick={handlePrevMonth}
                    sx={{
                        minWidth: 36,
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        padding: 0,
                        borderColor: "rgba(0,0,0,0.2)",
                        color: "inherit",
                        "&:hover": {
                            backgroundColor: "rgba(0,0,0,0.05)",
                            borderColor: "rgba(0,0,0,0.3)"
                        }
                    }}
                >
                    <ArrowBackIosNewIcon fontSize="small" />
                </Button>

                <Typography variant="subtitle1" fontWeight={600}>
                    {currentMonth.toLocaleDateString("es-AR", {
                        month: "long",
                        year: "numeric",
                    })}
                </Typography>

                <Button
                    variant="outlined"
                    size="small"
                    onClick={handleNextMonth}
                    sx={{
                        minWidth: 36,
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        padding: 0,
                        borderColor: "rgba(0,0,0,0.2)",
                        color: "inherit",
                        "&:hover": {
                            backgroundColor: "rgba(0,0,0,0.05)",
                            borderColor: "rgba(0,0,0,0.3)"
                        }
                    }}
                >
                    <ArrowForwardIosIcon fontSize="small" />
                </Button>
            </Stack>

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
                        pageSize={5}
                        showToolbar
                        rowsPerPageOptions={[5, 10]}
                        disableRowSelectionOnClick
                        onRowClick={(params) => setSelected(params.row)}
                        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                    />
                )}
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

                        {selected.detalle?.length ? (
                            selected.detalle.map((d) => (
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
                            ))
                        ) : (
                            <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
                                No hay detalles disponibles.
                            </Typography>
                        )}
                    </>
                )}
            </Drawer>
        </Box>
    );
}
