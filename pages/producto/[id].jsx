import React, { useState } from "react";
import TrazabilityLine from "../../components/TrazabilityLine/TrazabilityLine";
import { HomeLayout } from "../../layout";
import { Box, Typography, IconButton, Tab, Tabs } from "@mui/material";
import useProduct from "../../hooks/useProduct";
import { useRouter } from "next/router";
import Modal from "@mui/material/Modal";
import { AddOutlined } from "@mui/icons-material";
import Trazability from "../../components/Trazability/Trazability";
import TabPanel from "../../components/TabPanel/TabPanel";
import useMilestone from "../../hooks/useMilestone";
const Producto = () => {
  const router = useRouter();

  const [tabActive, setTabActive] = useState(0);
  const [open, setOpen] = useState(false);

  const [subprocessSelected, setSubprocessSelected] = useState();

  const { milestone, setMilestone, handleImageUpload, fileUri, setFileUri } =
    useMilestone();

  const { product, setProduct, uploadProduct } = useProduct(router.query.id);

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);
  const handleClickSubprocess = (event) => {
    const subprocess = event.target.getAttribute("name");
    setSubprocessSelected(subprocess);
  };
  const handleChange = (event, newValue) => {
    setTabActive(newValue);
  };

  const saveMilestone = async () => {
    if (!milestone.image || !milestone.description) {
      alert("Por favor, completa la imagen y la descripción del hito.");
      return;
    }

    if (!subprocessSelected || tabActive === null) {
      alert("Por favor, selecciona un proceso y un subproceso.");
      return;
    }

    try {

      const selectedStage = product.trazability[tabActive];
      const selectedSubprocess = selectedStage.line.find(
        (sub) => sub.name === subprocessSelected
      );
      selectedSubprocess.milestones.push(milestone);

      const updateProduct = { ...product };
      updateProduct.trazability[tabActive] = selectedStage;
      setProduct(updateProduct);
      const response = await uploadProduct(updateProduct);


      // Restablecer estados y cerrar el modal
      setMilestone({
        image: "",
        description: "",
      });
      setSubprocessSelected(null);
      setTabActive(null);
      setOpen(false); // Cierra el modal

      setMilestone({
        image: "",
        description: "",
      });

      setFileUri("");
    } catch (error) {
      console.log(error);
    }
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80vw",
    height: "90vh",
    overflowY: "auto", // Habilita el desplazamiento vertical
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    textAlign: "center",
  };
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
              <Typography
                sx={{
                  color: "primary.main",
                  fontSize: 24,
                }}
              >
                ¿A que categoria te gustaria agregar una etapa?
              </Typography>
              <Tabs
                variant="scrollable"
                onChange={handleChange}
                value={tabActive}
              >
                {product.trazability.map((element, index) => (
                  <Tab
                    label={element.name}
                    sx={{
                      color: "primary.main",
                    }}
                  />
                ))}
              </Tabs>
            </Box>
            {product.trazability.map((element, index) => (
              <Box>
                <TabPanel
                  sx={{ display: "flex", flexDirection: "row", gap: 2 }}
                  value={tabActive}
                  index={index}
                  key={index}
                >
                  {element.line.map((subprocess, subprocessIndex) => (
                    <Box
                      key={subprocessIndex}
                      sx={{
                        marginTop: 1,
                        backgroundColor:
                          subprocessSelected === subprocess.name
                            ? "primary.main"
                            : "transparent",
                        transition: "background-color 0.3s ease", // Agregamos la transición CSS aquí
                      }}
                    >
                      <Typography
                        onClick={handleClickSubprocess}
                        name={subprocess.name}
                        sx={{
                          color:
                            subprocessSelected === subprocess.name
                              ? "white"
                              : "primary.main",
                          marginY: 2,
                          fontSize: 12,
                          textTransform: "uppercase",
                          ":hover": {
                            cursor: "pointer",
                          },
                        }}
                      >
                        {subprocess.name}
                      </Typography>
                    </Box>
                  ))}
                </TabPanel>
              </Box>
            ))}
            <Trazability
              fileUri={fileUri}
              handleImageUpload={handleImageUpload}
              product={product}
              subprocessSelected={subprocessSelected}
              milestone={milestone}
              setMilestone={setMilestone}
              saveMilestone={saveMilestone}
            />
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
