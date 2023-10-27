import React, { useState } from "react";
import { HomeLayout } from "../../../layout";
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextareaAutosize,
} from "@mui/material";
import formularioTrazabilidad from "../../../protocols/protocols";

const Agroalimentario = () => {
  const [formData, setFormData] = useState({});

  const handleFieldChange = (etapa, campo, valor) => {
    setFormData({
      ...formData,
      [etapa]: {
        ...formData[etapa],
        [campo]: valor,
      },
    });
  };

  const handleObservationsChange = (event) => {
    setFormData({
      ...formData,
      observaciones: event.target.value, // Campo de observaciones
    });
  };

  const renderCampos = (etapa) => {
    return formularioTrazabilidad.etapas
      .find((e) => e.nombre === etapa)
      .campos.map((campo) => (
        <div
          style={{ display: "flex", alignItems: "center", gap: 10 }}
          key={campo.nombre}
        >
          <InputLabel htmlFor={campo.nombre} style={{ width: 250 }}>
            {campo.nombre}:
          </InputLabel>
          {campo.tipo === "fecha" ? (
            <TextField
              sx={{ width: 200, backgroundColor: "#ffff" }}
              type="date"
              id={campo.nombre}
              value={formData[etapa]?.[campo.nombre] || ""}
              onChange={(e) =>
                handleFieldChange(etapa, campo.nombre, e.target.value)
              }
            />
          ) : campo.tipo === "opciones" ? (
            <FormControl>
              <Select
                sx={{ width: 200, backgroundColor: "#ffff" }}
                id={campo.nombre}
                value={formData[etapa]?.[campo.nombre] || ""}
                onChange={(e) =>
                  handleFieldChange(etapa, campo.nombre, e.target.value)
                }
              >
                <MenuItem value="">Seleccione una opción</MenuItem>
                {campo.opciones.map((opcion) => (
                  <MenuItem key={opcion} value={opcion}>
                    {opcion}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <TextField
              type="text"
              sx={{ width: 200, backgroundColor: "#ffff" }}
              id={campo.nombre}
              value={formData[etapa]?.[campo.nombre] || ""}
              onChange={(e) =>
                handleFieldChange(etapa, campo.nombre, e.target.value)
              }
            />
          )}
        </div>
      ));
  };

  return (
    <HomeLayout>
      <Box sx={{ color: "primary.main", minHeight: "90vh", padding: 2 }}>
        {formularioTrazabilidad.etapas.map((etapa) => (
          <div key={etapa.nombre} style={{ marginBottom: 20 }}>
            <h2>{etapa.nombre}</h2>
            {renderCampos(etapa.nombre)}
          </div>
        ))}

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <InputLabel sx={{ width: 250 }}>Observaciones</InputLabel>
          <TextareaAutosize
            minRows={4}
            sx={{ width: 200 }}
            id="observaciones"
            value={formData.observaciones || ""}
            onChange={handleObservationsChange}
          />
        </Box>

        <Button
          sx={{ marginY: 5 }}
          variant="contained"
          color="primary"
          onClick={() => console.log(formData)}
        >
          Guardar Datos
        </Button>
      </Box>
    </HomeLayout>
  );
};

export default Agroalimentario;
