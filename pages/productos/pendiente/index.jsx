import React, { useState } from "react";
import { HomeLayout } from "../../../layout";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Button,
  TextField,
  useMediaQuery,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import useProducts from "../../../hooks/useProducts";
import LaunchIcon from "@mui/icons-material/Launch";
import { useRouter } from "next/router";
import { useAuth } from "../../../context/AuthContext";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import { deleteProduct } from "../../../firebase/controllers/firestoreControllers";
import { useProductStore } from "../../../store";

const Products = () => {
  const { user } = useAuth();
  const { products, setProducts } = useProducts();
  const { setProductData } = useProductStore();
  const router = useRouter();
  const ownerProducts = products.filter(
    (product) => product.ownerUid === user.uid
  );
  // const isMediumScreen = useMediaQuery('(min-width: 900px)');

  const handleDelete = (id) => {
    Swal.fire({
      title: "¿Estas seguro de eliminar este producto?",
      text: "Esta opcion no se puede revertir",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Estoy seguro",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const productFiltter = products.filter((product) => product.id !== id);

        try {
          await deleteProduct(id);

          setProductData(productFiltter);

          Swal.fire({
            title: "Producto eliminado",

            icon: "success",
          });
        } catch (error) {}
      }
    });
  };

  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  const filteredProducts = ownerProducts.filter((product) => {
    const { name, protocolName, status } = product;
    const searchTermLowerCase = searchTerm.toLowerCase();

    return (
      name.toLowerCase().includes(searchTermLowerCase) ||
      protocolName.toLowerCase().includes(searchTermLowerCase) ||
      status.toLowerCase().includes(searchTermLowerCase)
    );
  });
  return (
    <HomeLayout>
      <Box sx={{ height: "90vh", display: "flex", flexDirection: "column" }}>
        <Box minHeight="2rem"></Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginY: "4",
            marginBottom: "10",
          }}
        >
          <Box display="flex" flexDirection="row">
            {/* {isMediumScreen && <></>} */}
            <Typography sx={{ color: "primary.main", fontSize: 24 }}>
              Trazabilidades
            </Typography>
            <TextField
              label="Buscar"
              variant="outlined"
              size="small"
              onChange={handleSearch}
              sx={{ width: "20%", marginLeft: "2rem", minWidth: "10rem" }}
            />
          </Box>
          <Button
            variant="contained"
            onClick={() => router.push("/nueva-produccion")}
          >
            Nueva
          </Button>
        </Box>
        <Box minHeight="1rem"></Box>
        <Table aria-label="simple table" marginY="20rem">
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.main" }}>
              <TableCell
                sx={{ fontWeight: "bold", fontSize: 18, color: "#fff" }}
              >
                Nombre
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", fontSize: 18, color: "#fff" }}
              >
                Protocolo
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", fontSize: 18, color: "#fff" }}
              >
                Estado
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", fontSize: 18, color: "#fff" }}
              >
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ backgroundColor: "#fff" }}>
            {filteredProducts &&
              filteredProducts?.map((product) => {
                return (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell sx={{ textTransform: "capitalize" }}>
                      {product.protocolName}
                    </TableCell>
                    <TableCell>{product.status}</TableCell>

                    <TableCell>
                      <IconButton onClick={() => handleDelete(product.id)}>
                        <DeleteIcon />
                      </IconButton>

                      <IconButton
                        onClick={() => router.push(`/producto/${product.id}`)}
                      >
                        <LaunchIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </Box>
    </HomeLayout>
  );
};

export default Products;
