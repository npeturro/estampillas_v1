import React from "react";
import { Box, CircularProgress, Typography } from "@mui/joy";

const ErrorCard = () => {

    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <Typography color="error">Error al cargar los datos</Typography>
        </Box>
    );

};

export default ErrorCard;