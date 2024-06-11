import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Button, Typography, Grid, useMediaQuery } from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import useMilestone from "../../hooks/useMilestone";
import { useProductStore } from "../../store";
import SelectProcessInput from "../Inputs/SelectProcessInput";
import SelectSubProcessInput from "../Inputs/SelectSubProcessInput";
import ImageIcon from "@mui/icons-material/Image";
import { useDropzone } from "react-dropzone";
import { uplaodImageIPFS } from "../../contract/toBlockChain";
import Image from "next/image";
import TextArea from "../Inputs/TextArea";
import AttachmentsFiles from "../Inputs/AttachmentsFiles";
import { v4 } from "uuid";

const STEPS = {
  CATEGORY: 0,
  ADD_IMAGE: 1,
  ADD_DESCRIPTION: 2,
  ADD_ATTACHMENTS: 3,
};

const TrazabilityAssistant = ({ initialMilestone, closeModal }) => {
  const { product, setProductData } = useProductStore();

  const { milestone, setMilestone } = useMilestone(initialMilestone);

  const [steps, setSteps] = useState(STEPS.CATEGORY);
  const [processSelected, setProcessSelected] = useState("");
  const [subProcessList, setSubProcessList] = useState([]);
  const [subProcessSelected, setSubProcessSelected] = useState("");
  const [description, setDescription] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [image, setImage] = useState("");

  const handleSubprocessInputChange = (event) => {
    setSubProcessSelected(event.target.value);
  };

  const handleProcessInputChange = (event) => {
    setProcessSelected(event.target.value);

    product.trazability.map((element) => {
      if (element.name === event.target.value) {
        setSubProcessList(element.line);
      }
    });
  };

  const onDropRejected = () => {
    throw new Error("Eskere");
  };

  const onDropAccepted = useCallback(async (acceptedFiles) => {
    try {
      const file = new File([acceptedFiles[0]], acceptedFiles[0].name, {
        type: acceptedFiles[0].type,
        lastModified: acceptedFiles[0].lastModified,
      });
      const response = await uplaodImageIPFS(file);
      setMilestone((prev) => ({
        ...prev,
        image: response.url,
      }));
      setImage(response.url);
    } catch (error) {
      console.error("Error durante el proceso de carga:", error);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({ onDropAccepted, onDropRejected, maxSize: 100000000 });

  const onNext = useCallback(() => {
    if (steps === STEPS.ADD_ATTACHMENTS) {
      return;
    }

    setSteps((value) => value + 1);
  }, [steps]);

  const onBack = useCallback(() => {
    setSteps((value) => value - 1);
  }, [steps]);

  const saveMilestone = async () => {
    const updatedProduct = { ...product };

    updatedProduct.trazability.forEach((element) => {
      console.log(processSelected);
      if (element.name === processSelected) {
        element.line.forEach((line) => {
          if (line.name === subProcessSelected) {
            let path = element.path;
            console.log(path);
            line.milestones.push({
              name: line.name,
              path: path,
              image: image,
              description: description,
              milestoneId: v4(),
              atachments: uploadedFiles,
            });
          }
        });
      }
    });
    setProductData(updatedProduct);
  };

  let bodyContent = (
    <>
      {
        <>
          <Typography sx={{ color: "primary.main", fontSize: 13 }}>
            Al seleccionar aseguresé de que el proceso y la etapa se ajusten a
            su encadenamiento productivo
          </Typography>
          <Box
            display="flex"
            justifyContent="center"
            flexDirection={"column"}
            marginTop={5}
            alignItems={"center"}
            gap={2}
          >
            <Box sx={{ display: "flex", gap: 1 }}>
              <Typography sx={{ color: "primary.main" }}>
                Seleccione un proceso:
              </Typography>
              <HelpIcon sx={{ color: "primary.main" }} />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <SelectProcessInput
                data={product.trazability}
                label={"Seleccione el proceso"}
                handleChange={handleProcessInputChange}
                value={processSelected}
              />
            </Box>
          </Box>

          <Grid
            display="flex"
            justifyContent="center"
            flexDirection={"column"}
            marginTop={5}
            alignItems={"center"}
            gap={2}
          >
            <Box sx={{ display: "flex", gap: 1 }}>
              <Typography sx={{ color: "primary.main" }}>
                Seleccione una etapa:
              </Typography>
              <HelpIcon sx={{ color: "primary.main" }} />
            </Box>
            <SelectSubProcessInput
              value={subProcessSelected}
              handleChange={handleSubprocessInputChange}
              data={subProcessList}
              label={"Seleccione el subproceso"}
            />
          </Grid>
        </>
      }
      <Box sx={{ padding: 4 }} width="100%">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              marginBottom: 2,
              gap: 2,
            }}
          >
            <Button
              variant="contained"
              onClick={onNext}
              disabled={processSelected == "" || subProcessSelected === ""}
            >
              Continuar
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );

  if (steps === STEPS.ADD_IMAGE) {
    bodyContent = (
      <>
        <Box>
          <Typography sx={{ color: "primary.main", marginTop: 2 }}>
            Completa los siguientes datos
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 2,
            }}
          >
            <Box
              {...getRootProps()}
              sx={{
                ":hover": {
                  cursor: "pointer",
                },
                height: "300px",
                width: "600px",
                border: "dashed",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <input className="h-100 " {...getInputProps()} />
              {milestone.image === "" ? (
                <>
                  {isDragActive ? (
                    <Typography sx={{ color: "primary.main" }}>
                      Suelta el archivo aqui
                    </Typography>
                  ) : (
                    <>
                      <ImageIcon sx={{ fontSize: "6rem", color: "#0330ab" }} />
                      <Typography sx={{ color: "primary.main" }}>
                        Añade una imagen
                      </Typography>
                    </>
                  )}
                </>
              ) : (
                <Image
                  src={milestone.image}
                  height={300}
                  width={600}
                  alt={"imagen del milestone"}
                />
              )}
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            marginTop: 5,
            justifyContent: "center",
          }}
        >
          <Button onClick={onBack} variant="contained">
            Volver
          </Button>
          <Button onClick={onNext} variant="contained" disabled={image === ""}>
            Siguiente
          </Button>
        </Box>
      </>
    );
  }

  if (steps === STEPS.ADD_DESCRIPTION) {
    bodyContent = (
      <>
        <Box>
          <Typography
            sx={{ color: "primary.main", marginTop: 2, marginBottom: 2 }}
          >
            Agrega una descripcion
          </Typography>
          <TextArea description={description} setDescription={setDescription} />
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            marginTop: 5,
            justifyContent: "center",
          }}
        >
          <Button onClick={onBack} variant="contained">
            Volver
          </Button>
          <Button onClick={onNext} variant="contained">
            Siguiente
          </Button>
        </Box>
      </>
    );
  }

  if (steps === STEPS.ADD_ATTACHMENTS) {
    bodyContent = (
      <>
        <Box>
          <Typography
            sx={{ color: "primary.main", marginTop: 2, marginBottom: 2 }}
          >
            ¿Le gustaria agregar archivos adjuntos?
          </Typography>

          <AttachmentsFiles
            setUploadedFiles={setUploadedFiles}
            uploadedFiles={uploadedFiles}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            marginTop: 5,
            justifyContent: "center",
          }}
        >
          <Button onClick={onBack} variant="contained">
            Volver
          </Button>
          <Button onClick={saveMilestone} variant="contained">
            Guardar
          </Button>
        </Box>
      </>
    );
  }

  return <>{bodyContent}</>;
};

export default TrazabilityAssistant;
