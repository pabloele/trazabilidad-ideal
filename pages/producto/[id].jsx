import React, { useState } from "react";
import TrazabilityLine from "../../components/TrazabilityLine/TrazabilityLine";
import { HomeLayout } from "../../layout";
import { Box, Typography, IconButton } from "@mui/material";
import useProduct from "../../hooks/useProduct";
import { useRouter } from "next/router";
import Modal from "@mui/material/Modal";
import { AddOutlined } from "@mui/icons-material";
import ImageIcon from "@mui/icons-material/Image";
import Trazability from "../../components/Trazability/Trazability";
const Producto = () => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 900,
    height: 600,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    textAlign: "center",
  };

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const [open, setOpen] = useState(false);

  const router = useRouter();

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
        <Modal open={open} onClose={handleClose}>
          <Box sx={style}>
            <Box>
              <Trazability product={product} />
            </Box>
          </Box>
        </Modal>

        <Box sx={{ height: "90vh" }}>
          <Typography
            sx={{
              color: "primary.main",
              fontSize: 24,
            }}
          >
            Cadena de produccion para : {product.name}
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
          onClick={handleOpen}
        >
          <AddOutlined sx={{ fontSize: 30 }} />
        </IconButton>
      </HomeLayout>
    );
  }
};

export default Producto;
