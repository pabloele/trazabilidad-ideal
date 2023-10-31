import React from "react";
import TrazabilityLine from "../../components/TrazabilityLine/TrazabilityLine";
import { HomeLayout } from "../../layout";
import { Box, Typography } from "@mui/material";
import useProduct from "../../hooks/useProduct";
import { AddOutlined, Image, MailOutlined } from "@mui/icons-material";
import { IconButton, useMediaQuery } from "@mui/material";
import { useRouter } from "next/router";
import Trazability from "../../components/Trazability/Trazability";

const Producto = () => {
  const router = useRouter();

  const { product } = useProduct(router.query.id);

  console.log(product);

  if (!product) {
    return (
      <HomeLayout>
        <Box container sx={{ height: "90vh" }}>
          <p>Loading...</p>
        </Box>
      </HomeLayout>
    );
  } else {
    return (
      <HomeLayout>
        <Box sx={{ height: "90vh" }}>
          <Typography
            sx={{
              color: "primary.main",
              fontSize:24
            }}
          >
           Cadena de produccion para :  {product.name}
          </Typography>
          <TrazabilityLine protocol={product.trazability} />
        </Box>
        <IconButton
          size="large"
          sx={{
            color: "white",
            backgroundColor: "error.main",
            ":hover": { backgroundColor: "error.main", opacity: 0.9 },
            position: "fixed",
            right: 50,
            bottom: 50,
          }}
          onClick={() => router.push("/AddMilestone")}
        >
          <AddOutlined sx={{ fontSize: 30 }} />
        </IconButton>
      </HomeLayout>
    );
  }
};

export default Producto;
