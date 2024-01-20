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
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore/lite";
import { db } from "../../firebase/config";
import Swal from "sweetalert2";

const EditProduct = ({ isOpen, setIsOpen, product, setProductData }) => {
  const isSmallScreen = useMediaQuery("(min-width: 600px)");

  const [loadingImage, setLoadingImage] = useState(false);

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [editedName, setEditedName] = useState(product.name);
  const [editedCompany, setEditedCompany] = useState(product.company);

  const handleNameEdit = () => {
    setIsEditingName(true);
  };

  const handleCompanyEdit = () => {
    setIsEditingCompany(true);
  };

  const handleNameSave = async () => {
    try {
      setProductData({ ...product, name: editedName });

      const productRef = doc(db, "products", product.id);

      const productDoc = await getDoc(productRef);

      const updateData = {
        ...productDoc.data(),
        name: editedName,
      };

      console.log(updateData);

      await updateDoc(productRef, updateData);
      setIsEditingName(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCompanySave = async () => {
    try {
      setProductData({ ...product, company: editedCompany });

      const productRef = doc(db, "products", product.id);

      const productDoc = await getDoc(productRef);

      const updateData = {
        ...productDoc.data(),
        company: editedCompany,
      };

      await updateDoc(productRef, updateData);
      setIsEditingCompany(false);
    } catch (error) {
      console.log(error);
    }
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

  return (
    // <Modal
    //   open={isOpen}
    //   onClose={() => setIsOpen(false)}
    //   sx={{ width: "100%" }}
    // >
    <Box sx={{ marginBottom: 10 }}>
      <Typography
        sx={{ color: "primary.main", fontSize: 24, fontWeight: "bold" }}
      >
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
            flexDirection: "column",
            transition: "filter 0.3s ease-in", // Agrega una transición suave para el efecto hover
            ":hover": {
              filter: "grayscale(100%)",
            },
          }}
        >
          <Typography
            sx={{ color: "primary.main", fontSize: 22, fontWeight: "bold" }}
          >
            Imagen del producto:
          </Typography>
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
              <Button variant="contained" onClick={handleNameSave}>
                Guardar
              </Button>
              <Button
                variant="outlined"
                onClick={() => setIsEditingName(false)}
              >
                Cancelar
              </Button>
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
              {/* <IconButton onClick={handleCompanySave}> */}
              <Button variant="contained" onClick={handleCompanySave}>
                Guardar
              </Button>
              <Button
                variant="outlined"
                onClick={() => setIsEditingCompany(false)}
              >
                Cancelar
              </Button>
              {/* </IconButton> */}
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
      </Box>
    </Box>
    // </Modal>
  );
};

export default EditProduct;
