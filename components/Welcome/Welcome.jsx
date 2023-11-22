import React from "react";

import { Grid, Box, Typography, Button } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
const Welcome = () => {
  const router = useRouter();

  return (
    <Grid
      container
      spacing={0}
      justifyContent="center"
      sx={{
        minHeight: "90vh",
        backgroundColor: "beige",
        borderRadius: 3,
        textAlign: "center",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", overflow: "hidden" }}>
        <Box sx={{ color: "primary.main" }}>
          <Typography sx={{ fontSize: 30, fontWeight: "bold" }}>
            ¡Bienvenido!
          </Typography>
          <Typography sx={{ fontSize: 20 }}>
            Sistema de trazabilidad blockchain
          </Typography>

          <Button
            variant="contained"
            sx={{ marginY: 4 }}
            onClick={() => router.push("/nueva-produccion")}
          >
            Crear una trazabilidad
          </Button>
        </Box>
      </Box>
    </Grid>
  );
};

export default Welcome;
