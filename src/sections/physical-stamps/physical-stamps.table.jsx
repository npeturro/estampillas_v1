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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalPostOfficeIcon from "@mui/icons-material/LocalPostOffice";
import { DataGrid } from "@mui/x-data-grid";
import { useState, useMemo } from "react";
import { getToken } from "../../utils/auth";
import { useGET } from "../../hooks/useGET";

const stamps = [
    {
        id: "1446",
        fecha_creacion: "2025-10-29 16:38:07",
        total: "320000.00",
        entidad_pago: "GALICIA",
        nro_pago: "39425029777",
        apellido: "BONAVERA",
        nombre: "DIEGO MARIANO",
        vendedor: "cgamarra",
        estampillas: 80,
        detalle: [
            {
                id: "1449",
                cantidad: "80",
                precio: "4000.00",
                subtotal: "320000.00",
                estampillas:
                    "52631, 52632, 52633, 52634, 52635, 52636, 52637, 52638, 52639, 52640, 52641, 52642, 52643, 52644, 52645, 52646, 52647, 52648, 52649, 52650, 52651, 52652, 52653, 52654, 52655, 52656, 52657, 52658, 52659, 52660, 52661, 52662, 52663, 52664, 52665, 52666, 52667, 52668, 52669, 52670, 52671, 52672, 52673, 52674, 52675, 52676, 52677, 52678, 52679, 52680, 52681, 52682, 52683, 52684, 52685, 52686, 52687, 52688, 52689, 52690, 52691, 52692, 52693, 52694, 52695, 52696, 52697, 52698, 52699, 52700, 52701, 52702, 52703, 52704, 52705, 52706, 52707, 52708, 52709, 52710",
            },
        ],
    },
    {
        id: "1367",
        fecha_creacion: "2025-09-29 16:16:00",
        total: "30000.00",
        entidad_pago: "GALICIA",
        nro_pago: "39017336265",
        apellido: "BONAVERA",
        nombre: "DIEGO MARIANO",
        vendedor: "cgamarra",
        estampillas: 10,
        detalle: [
            {
                id: "1370",
                cantidad: "10",
                precio: "3000.00",
                subtotal: "30000.00",
                estampillas:
                    "503491, 503492, 503493, 503494, 503495, 503496, 503497, 503498, 503499, 503500",
            },
        ],
    },
];

export default function PhysicalSalesGrid() {
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const token = getToken();
    // const [data, loading, error] = useGET(`ventas?apellido=bonavera&fd=2025-09-01&fh=2025-09-24&id=-1&nro_pago=&token=${token}`);
    // console.log(data)

    const filtered = useMemo(() => {
        const lower = search.toLowerCase();
        return stamps.filter(
            (s) =>
                s.nombre.toLowerCase().includes(lower) ||
                s.apellido.toLowerCase().includes(lower) ||
                s.vendedor.toLowerCase().includes(lower) ||
                s.entidad_pago.toLowerCase().includes(lower) ||
                s.id.includes(lower)
        );
    }, [search]);

    const columns = [
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
                direction={isMobile ? "column" : "row"}
                spacing={1}
                justifyContent="space-between"
                alignItems={isMobile ? "stretch" : "center"}
                mb={2}
            >
                <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Buscar ..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{
                        flex: 1,
                        backgroundColor: "#fff",
                        borderRadius: 2,
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            fontSize: 14,
                        },
                    }}
                />
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: isMobile ? "right" : "left" }}
                >
                    {filtered.length} resultados
                </Typography>
            </Stack>

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
                    rows={filtered}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10]}
                    disableRowSelectionOnClick
                    onRowClick={(params) => setSelected(params.row)}
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
