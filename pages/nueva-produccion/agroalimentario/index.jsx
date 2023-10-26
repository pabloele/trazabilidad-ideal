import React, { useState } from "react";
import { HomeLayout } from "../../../layout";
import { Box } from "@mui/material";
import formularioTrazabilidad from "../../../protocols/protocols";
const Agroalimentario = () => {
  const [formData, setFormData] = useState({});

  // Función para manejar los cambios en los campos del formulario
  const handleFieldChange = (etapa, campo, valor) => {
    setFormData({
      ...formData,
      [etapa]: {
        ...formData[etapa],
        [campo]: valor,
      },
    });
  };

  // Función para renderizar los campos de un formulario
  const renderCampos = (etapa) => {
    return formularioTrazabilidad.etapas
      .find((e) => e.nombre === etapa)
      .campos.map((campo) => (
        <div style={{ display: "flex", gap: 5 }} key={campo.nombre}>
          <label style={{ width: 100 }} htmlFor={campo.nombre}>
            {campo.nombre}:
          </label>
          {campo.tipo === "fecha" ? (
            <input
              type="date"
              id={campo.nombre}
              value={formData[etapa]?.[campo.nombre] || ""}
              onChange={(e) =>
                handleFieldChange(etapa, campo.nombre, e.target.value)
              }
            />
          ) : campo.tipo === "opciones" ? (
            <select
              id={campo.nombre}
              value={formData[etapa]?.[campo.nombre] || ""}
              onChange={(e) =>
                handleFieldChange(etapa, campo.nombre, e.target.value)
              }
            >
              <option value="">Seleccione una opción</option>
              {campo.opciones.map((opcion) => (
                <option key={opcion} value={opcion}>
                  {opcion}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
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
      <Box sx={{ color: "primary.main", height: "90vh" }}>
        {formularioTrazabilidad.etapas.map((etapa) => (
          <div key={etapa.nombre}>
            <h2>{etapa.nombre}</h2>
            {renderCampos(etapa.nombre)}
          </div>
        ))}
        <button onClick={() => console.log(formData)}>Guardar Datos</button>
      </Box>
    </HomeLayout>
  );
};

export default Agroalimentario;
