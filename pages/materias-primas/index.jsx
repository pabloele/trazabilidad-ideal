import React, { useEffect, useState } from "react";
import { HomeLayout } from "../../layout/HomeLayout/HomeLayout";
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
import useRawMaterials from "../../hooks/useRawMaterials";
import DeleteIcon from "@mui/icons-material/Delete"; // Importa el ícono de "tacho de basura" de Material-UI

const RawMaterials = () => {
  const { materias } = useRawMaterials();
  const [rawMaterials, setRawMaterials] = useState();

  const handleDelete = (id) => {
    // Función para eliminar un elemento de la lista
    const updatedMaterials = rawMaterials.filter(
      (material) => material.id !== id
    );
    setRawMaterials(updatedMaterials);
  };
  useEffect(() => {
    setRawMaterials(materias);
  }, [materias]);
  return (
    <HomeLayout>
      <Box container sx={{ height: "90vh" }}>
        <Typography
          sx={{ fontSize: 24, fontWeight: "bold", color: "primary.main" }}
        >
          Materias primas
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "end" }}>
          <Button variant="contained">Agregar</Button>
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Materia prima</TableCell>
              <TableCell>Marcas</TableCell>
              <TableCell>Proveedores</TableCell>
              <TableCell>Presentación</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rawMaterials &&
              rawMaterials?.map((material) => (
                <TableRow key={material.id}>
                  <TableCell>{material.nombre}</TableCell>
                  <TableCell>{material.marcas.join(", ")}</TableCell>
                  <TableCell>{material.provedores.join(", ")}</TableCell>
                  <TableCell>{material.presentacion}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDelete(material.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Box>
    </HomeLayout>
  );
};

export default RawMaterials;
