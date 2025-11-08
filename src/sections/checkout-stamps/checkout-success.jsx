import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Link,
  Grid,
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../utils/auth";
import estampillaImg from "../../assets/estampilla_0.png"; // ✅ ajustá la ruta si es distinta

export default function CheckoutSuccess({ id_venta }) {
  const navigate = useNavigate();
  const token = getToken();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const fakeResponse = {
        status: "success",
        pago: {
          id_venta: id_venta || 12345,
          fecha: "2025-11-07 12:30:00",
          nro_pago: 39425029777,
          entidad_pago: "GALICIA",
          total: 320000,
          estampillas: 4
        },
        estampillas: [
          { id: 1, url: "https://sitio.gob.ar/estampilla/abc123" },
          { id: 2, url: "https://sitio.gob.ar/estampilla/def456" },
          { id: 3, url: "https://sitio.gob.ar/estampilla/ghi789" },
          { id: 4, url: "https://sitio.gob.ar/estampilla/jkl012" },
        ],
        error: null,
      };

      setData(fakeResponse);
      setLoading(false);
    }, 1000);
  }, [id_venta, token]);

  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!data) {
    return (
      <Typography textAlign="center" color="text.secondary" mt={4}>
        No se encontraron datos del pago.
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {data.status === "success" ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ width: "100%" }}
        >
          <Paper
            elevation={3}
            sx={{
              p: { xs: 1, sm: 2 },
              borderRadius: 4,
              background: "#ffffffcc",
              backdropFilter: "blur(6px)",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: "#1e293b",
                textAlign: "center",
                mb: 1,
              }}
            >
              ¡Compra realizada con éxito!
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              mb={3}
            >
              Detalles de tu pago y estampillas adquiridas.
            </Typography>

            <Box
              sx={{
                mb: 3,
                p: 2,
                borderRadius: 2,
                backgroundColor: "#f1f5f9",
              }}
            >
              <Typography variant="body2">
                <strong>Nro pago:</strong> {data.pago.nro_pago}
              </Typography>
              <Typography variant="body2">
                <strong>Fecha:</strong> {data.pago.fecha}
              </Typography>
              <Typography variant="body2">
                <strong>Banco:</strong> {data.pago.entidad_pago}
              </Typography>
              <Typography variant="body2">
                <strong>Estampillas:</strong> {data.pago.estampillas}
              </Typography>
              <Typography variant="body2">
                <strong>Total:</strong> ${data.pago.total}
              </Typography>
            </Box>

            <Typography variant="h6" mb={2} textAlign="center">
              Estampillas adquiridas
            </Typography>

            <Grid container spacing={2}>
              {data.estampillas.map((est) => (
                <Grid item xs={12} sm={6} key={est.id}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: "#f8fafc",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                      transition: "transform 0.2s ease",
                      "&:hover": {
                        transform: "scale(1.02)",
                      },
                    }}
                  >
                    <img
                      src={estampillaImg}
                      alt={`Estampilla ${est.id}`}
                      width={40}
                      height={40}
                      style={{ borderRadius: 8 }}
                    />
                    <Link
                      href={est.url}
                      target="_blank"
                      rel="noopener"
                      underline="hover"
                      sx={{ fontWeight: 500 }}
                    >
                      Estampilla #{est.id}
                    </Link>
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ textAlign: "center", mt: 4 }}>
              <Button
                variant="contained"
                onClick={() => navigate("/online_stamps")}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  px: 4,
                  py: 1.2,
                  background: "linear-gradient(135deg, #6366f1 0%, #818cf8 100%)",
                  boxShadow: "0 3px 10px rgba(99,102,241,0.3)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
                  },
                }}
              >
                Volver al inicio
              </Button>
            </Box>
          </Paper>
        </motion.div>
      ) : (
        <Paper
          elevation={3}
          sx={{
            p: 2,
            borderRadius: 4,
            textAlign: "center",
            backgroundColor: "#fee2e2",
          }}
        >
          <Typography
            variant="h5"
            sx={{ color: "#b91c1c", fontWeight: 700, mb: 2 }}
          >
            Error en el pago
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {data.error ||
              "El pago no pudo completarse. Por favor, intente nuevamente o comuníquese con soporte."}
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              onClick={() => navigate("/online_stamps")}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                background:
                  "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #b91c1c 0%, #ef4444 100%)",
                },
              }}
            >
              Volver al inicio
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
}
