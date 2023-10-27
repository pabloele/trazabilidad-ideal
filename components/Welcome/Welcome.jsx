import React from "react";

import { Grid, Box, Typography } from "@mui/material";
import Image from "next/image";
const Welcome = () => {
  return (
    <Grid
      container
      spacing={0}
      justifyContent="center"
      sx={{
        minHeight: "calc(100vh - 110px)",
        backgroundColor: "beige",
        borderRadius: 3,
        textAlign: "center",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ color: "primary.main" }}>
          <Typography sx={{ fontSize: 30, fontWeight: "bold" }}>
            ¡Bienvenido!
          </Typography>
          <Typography sx={{ fontSize: 20 }}>
            Sistema de trazabilidad blockchain
          </Typography>
        </Box>
      </Box>
    </Grid>
  );
};

export default Welcome;
