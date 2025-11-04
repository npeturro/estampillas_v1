import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function CheckoutSuccess() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [estampillas, setEstampillas] = useState([]);

  useEffect(() => {
    const fetchEstampillas = async () => {
      try {
        const response = await fetch("/api/estampillas-compradas");
        const data = await response.json();
        setEstampillas(data);
      } catch (error) {
        console.error("Error al cargar las estampillas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEstampillas();
  }, []);

  return (
    <Box
      sx={{
        p: 4,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        alignItems: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, color: "#1e293b" }}>
          ¡Compra realizada con éxito!
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center" mt={1}>
          Estas son tus estampillas adquiridas recientemente.
        </Typography>
      </motion.div>

      <Paper
        elevation={2}
        sx={{
          width: "100%",
          maxWidth: 800,
          p: 2,
          borderRadius: 3,
          background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
        }}
      >
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Typography>Estampillas detalles</Typography>
        )}
      </Paper>


      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          onClick={() => navigate("/")}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            background: "linear-gradient(135deg, #6366f1 0%, #818cf8 100%)",
            boxShadow: "0 3px 8px rgba(99,102,241,0.3)",
            "&:hover": {
              background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
            },
          }}
        >
          Volver al inicio
        </Button>
      </Box>
    </Box>
  );
}
