import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import {
  Button,
  Box,
  Typography,
  useMediaQuery,
  IconButton,
  TextField,
} from "@mui/material";
import Image from "next/image";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { uplaodImageIPFS } from "../../contract/toBlockChain";
import SaveIcon from "@mui/icons-material/Save";
import { doc, getDoc, setDoc } from "firebase/firestore/lite";
import { db } from "../../firebase/config";
import Swal from "sweetalert2";

const EditProduct = ({ isOpen, setIsOpen, product, setProductData }) => {
  const isSmallScreen = useMediaQuery("(min-width: 600px)");

  const [loadingImage, setLoadingImage] = useState(false);

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [editedName, setEditedName] = useState(product.name);
  const [editedCompany, setEditedCompany] = useState(product.company);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleNameEdit = () => {
    setIsEditingName(true);
  };

  const handleCompanyEdit = () => {
    setIsEditingCompany(true);
  };

  const handleNameSave = () => {
    setProductData({ ...product, name: editedName });
    setIsEditingName(false);
  };

  const handleCompanySave = () => {
    setProductData({ ...product, company: editedCompany });
    setIsEditingCompany(false);
  };

  const handleImageUpload = async () => {
    try {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";

      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
          try {
            setLoadingImage(true);
            const result = await uplaodImageIPFS(file);

            setProductData({ ...product, productImage: result.url });
          } catch (error) {
            console.error("Error al subir la imagen a IPFS:", error);
          } finally {
            setLoadingImage(false);
          }
        }
      };

      input.click();
    } catch (error) {
      console.error("Error al subir la imagen:", error);
    }
  };

  const handleUpdateChanges = async () => {
    console.log(product);

    try {
      const updateProduct = { ...product };
      const productRef = doc(db, "products", product.id);

      const response = await setDoc(productRef, updateProduct, { merge: true });

      Swal.fire({
        title: "Producto editado correctamente",
        icon: "success",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Continuar",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      sx={{ width: "100%" }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: isSmallScreen ? "95%" : "95%",
          height: "90vh",
          overflowY: "auto",
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          margin: isSmallScreen ? "0" : "auto",
          textAlign: "center",
          justifyContent: "center",
          p: 4,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <CloseIcon
            onClick={handleClose}
            sx={{
              color: "red",
              ":hover": {
                cursor: "pointer",
              },
            }}
          />
        </Box>
        <Typography sx={{ color: "primary.main", fontSize: 24 }}>
          Editar producto
        </Typography>

        <Box
          sx={{
            marginTop: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              transition: "filter 0.3s ease-in", // Agrega una transición suave para el efecto hover
              ":hover": {
                filter: "grayscale(100%)",
              },
            }}
          >
            <Image
              style={{
                borderRadius: 20,
                objectFit: "contain",

                width: isSmallScreen ? 300 : 300,
                height: isSmallScreen ? 300 : 300,
              }}
              src={product?.productImage}
              width={isSmallScreen ? 350 : 300}
              height={isSmallScreen ? 350 : 300}
              alt={product.name}
            />
            <IconButton onClick={handleImageUpload}>
              <EditIcon fontSize="200px" />
            </IconButton>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              sx={{ color: "primary.main", fontSize: 23, fontWeight: "bold" }}
            >
              Nombre:
            </Typography>
            {isEditingName ? (
              <>
                <TextField
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                />
                <IconButton onClick={handleNameSave}>
                  <SaveIcon fontSize="large" />
                </IconButton>
              </>
            ) : (
              <>
                <Typography sx={{ color: "primary.main", fontSize: 20 }}>
                  {product.name}
                </Typography>
                <IconButton onClick={handleNameEdit}>
                  <EditIcon fontSize="200px" />
                </IconButton>
              </>
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              sx={{ color: "primary.main", fontSize: 23, fontWeight: "bold" }}
            >
              Empresa:
            </Typography>
            {isEditingCompany ? (
              <>
                <TextField
                  type="text"
                  value={editedCompany}
                  onChange={(e) => setEditedCompany(e.target.value)}
                />
                <IconButton onClick={handleCompanySave}>
                  <SaveIcon fontSize="large" />
                </IconButton>
              </>
            ) : (
              <>
                <Typography sx={{ color: "primary.main", fontSize: 20 }}>
                  {product.company}
                </Typography>
                <IconButton onClick={handleCompanyEdit}>
                  <EditIcon fontSize="200px" />
                </IconButton>
              </>
            )}
          </Box>
          <Button variant="contained" onClick={handleUpdateChanges}>
            Guardar cambios
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditProduct;
