import React from "react";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
const Protocols = () => {
  return (
    <Box
      sx={{
        marginTop: 5,
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box sx={{ marginBottom: 2 }}>
        <Typography>Seleccione un protocolo</Typography>
      </Box>

      <Box>
        <Box container sx={{ display: "flex", gap: 2 }}>
          <Box
            item
            sx={{
              backgroundColor: "#e1e1e1",
              padding: 2,
              width: 200,
              height: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "&:hover": {
                cursor: "pointer",
                color: "#fff",
                backgroundColor: "primary.main",
              },
              transition: "all ease .3s",
            }}
          >
            <Link href={"/nueva-produccion/agroalimentario"}>
              Agroalimentario
            </Link>
          </Box>

          <Box
            item
            sx={{
              backgroundColor: "#e1e1e1",
              padding: 2,
              width: 200,
              height: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "&:hover": {
                cursor: "pointer",
                color: "#fff",
                backgroundColor: "primary.main",
              },
              transition: "all ease .3s",
            }}
          >
            <Typography>No agroalimentario</Typography>
          </Box>

          <Box
            item
            sx={{
              backgroundColor: "#e1e1e1",
              padding: 2,
              width: 200,
              height: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "&:hover": {
                cursor: "pointer",
                color: "#fff",
                backgroundColor: "primary.main",
              },
              transition: "all ease .3s",
            }}
          >
            <Typography>Ambiental</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Protocols;
