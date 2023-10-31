import React from "react";
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete"; // Importa el ícono de "tacho de basura" de Material-UI
import useProducts from "../../../hooks/useProducts";
import LaunchIcon from "@mui/icons-material/Launch";
import { useRouter } from "next/router";
const Products = () => {
  const { products } = useProducts();
  console.log(products);
  const router = useRouter();
  return (
    <HomeLayout>
      <Box sx={{ height: "90vh" }}>
        <Typography sx={{ color: "primary.main", fontSize: 24 }}>
          Productos pendientes
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Protocolo</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products &&
              products?.map((product) => {
                if (product.status === "en curso") {
                  return (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.protocolName}</TableCell>
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
                }
              })}
          </TableBody>
        </Table>
      </Box>
    </HomeLayout>
  );
};

export default Products;
