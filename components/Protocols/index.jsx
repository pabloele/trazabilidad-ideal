import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/router";
import { addUserProduct } from "../../firebase/controllers/firestoreControllers";
import { useAuth } from "../../context/AuthContext";
const Protocols = () => {
  const { user } = useAuth();

  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [productName, setProductName] = useState("");
  const [protocolSelected, setProtocolSelected] = useState();
  const [loading, setLoading] = useState(false);
  const protocols = [
    {
      name: "Agroalimentario",
    },
  ];

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    textAlign: "center",
  };

  const handleClose = () => setOpen(false);

  const handleClickProtocol = async (event) => {
    const nameProtocol = event.target.getAttribute("name");
    console.log(nameProtocol);
    setProtocolSelected(nameProtocol); // Actualiza el estado primero
    setOpen(true); // Luego abre el modal
  };

  const handleSaveProduct = async () => {
    setLoading(true);

    try {
      const docRef = await addUserProduct(user.uid, {
        name: productName,
        trazability: [
          {
            name: "Producción",
            line: [
              {
                name: "Origen de la producción",
                milestones: [],
                path: "/vino1/produccion-primaria/etapa1",
              },
              {
                name: "Características fenológicas / ciclos",
                milestones: [],
                path: "/vino1/produccion-primaria/etapa2",
              },
              {
                name: "Métodos de cultivo / cría",
                milestones: [],
                path: "/vino1/produccion-primaria/etapa3",
              },
              {
                name: "Registros fitosanitarios / sanidad",
                milestones: [],
                path: "/vino1/produccion-primaria/misc",
              },
              {
                name: "Caracteristicas adicionales",
                milestones: [],
                path: "/vino1/produccion-primaria/misc",
              },
            ],
          },
          {
            name: "Elaboracion / Procesamiento",
            line: [
              {
                name: "Procesos de elaboración",
                milestones: [],
                path: "/vino1/elaboracion/etapa1",
              },
              {
                name: "Etiquetado y empaque",
                milestones: [],
                path: "/vino1/elaboracion/etapa2",
              },
              {
                name: "Normativa aplicable",
                milestones: [],
                path: "/vino1/elaboracion/etapa3",
              },
              {
                name: "Capacitación del personal",
                milestones: [],
                path: "/vino1/elaboracion/misc",
              },
              {
                name: "Auditorías y verificaciones",
                milestones: [],
                path: "/vino1/elaboracion/misc",
              },
              {
                name: "Caracteristicas adicionales",
                milestones: [],
                path: "/vino1/produccion-primaria/misc",
              },
            ],
          },
          {
            name: "Despacho / Distribución",
            line: [
              {
                name: "Transporte",
                milestones: [],
                path: "/vino1/despacho/etapa1",
              },
              {
                name: "Almacenamiento",
                milestones: [],
                path: "/vino1/despacho/etapa2",
              },
              {
                name: "Caracteristicas adicionales",
                milestones: [],
                path: "/vino1/produccion-primaria/misc",
              },
            ],
          },
          {
            name: "Comercialización",
            line: [
              {
                name: "Trazabilidad del producto",
                milestones: [],
                path: "/vino1/comercializacion/etapa1",
              },
              {
                name: "Caracteristicas adicionales",
                milestones: [],
                path: "/vino1/produccion-primaria/misc",
              },
            ],
          },
        ],
      });

      router.push(`/producto/${docRef}`);
    } catch (error) {
      console.error("Error al agregar el documento", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    setProductName(event.target.value);
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Box
            sx={{
              color: "#000",
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: 2,
            }}
          >
            <CloseIcon
              sx={{
                ":hover": {
                  cursor: "pointer",
                },
              }}
              onClick={handleClose}
            />
          </Box>

          <Box>
            <Typography sx={{ color: "primary.main" }}>
              Seleccionaste el protocolo:
            </Typography>

            <Typography
              sx={{ color: "primary.main", marginY: 1, fontWeight: "bold" }}
            >
              {protocolSelected}
            </Typography>

            <Typography sx={{ color: "primary.main" }}>
              Ingrese el nombre del producto
            </Typography>
          </Box>

          <Box sx={{ marginY: 2, display: "flex", flexDirection: "column" }}>
            <TextField value={productName} onChange={handleInputChange} />

            <Button
              disabled={loading}
              variant="contained"
              sx={{ marginY: 2 }}
              onClick={handleSaveProduct}
            >
              Guardar
            </Button>
          </Box>
        </Box>
      </Modal>
      <Box
        sx={{
          marginTop: 5,
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box sx={{ marginBottom: 2 }}>
          <Typography>Seleccione un protocolo</Typography>
        </Box>

        <Box>
          <Box container sx={{ display: "flex", gap: 2 }}>
            {protocols.map((protocol, index) => (
              <Box
                key={index}
                name={protocol.name}
                onClick={handleClickProtocol}
                item
                sx={{
                  backgroundColor: "#e1e1e1",
                  padding: 2,
                  width: 200,
                  height: 100,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "&:hover": {
                    cursor: "pointer",
                    color: "#fff",
                    backgroundColor: "primary.main",
                  },
                  transition: "all ease .3s",
                }}
              >
                <Typography name={protocol.name}>{protocol.name}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Protocols;
