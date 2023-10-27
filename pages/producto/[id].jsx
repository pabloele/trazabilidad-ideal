import React from "react";
import TrazabilityLine from "../../components/TrazabilityLine/TrazabilityLine";
import { HomeLayout } from "../../layout";
import { Box, Typography } from "@mui/material";
import useProduct from "../../hooks/useProduct";
import { AddOutlined, Image, MailOutlined } from "@mui/icons-material";
import { IconButton, useMediaQuery } from "@mui/material";

import { useRouter } from "next/router";

const Producto = () => {
  const router = useRouter();

  console.log(router.query.id);

  const { product } = useProduct(router.query.id);

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
        <Box container sx={{ height: "90vh" }}>
          <Typography sx={{ color: "primary.main", fontSize: 24 }}>
            Producto: {product.name}
          </Typography>
          <TrazabilityLine />
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
          onClick={() => {}}
        >
          <AddOutlined sx={{ fontSize: 30 }} />
        </IconButton>
      </HomeLayout>
    );
  }
};

export default Producto;
