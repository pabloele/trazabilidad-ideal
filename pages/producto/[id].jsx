import React, { useState, useEffect } from "react";
import TrazabilityLine from "../../components/TrazabilityLine/TrazabilityLine";
import { HomeLayout } from "../../layout";
import { Box, Typography, IconButton, Tab, Tabs, Button } from "@mui/material";
import useProduct from "../../hooks/useProduct";
import { useRouter } from "next/router";
import Modal from "@mui/material/Modal";
import { AddOutlined } from "@mui/icons-material";
import Trazability from "../../components/Trazability/Trazability";
import TabPanel from "../../components/TabPanel/TabPanel";
import useMilestone from "../../hooks/useMilestone";
import QRCode from "qrcode";
import Image from "next/image";
import { create } from "ipfs-http-client";
import { ethers } from "ethers";
import { contractAddress, contractAbi } from "../../contract/contract";
import { useAuth } from "../../context/AuthContext";
const Producto = () => {
  const router = useRouter();
  const { user } = useAuth();

  console.log(user);
  const [tabActive, setTabActive] = useState(0);
  const [open, setOpen] = useState(false);

  const [milestoneBox, setMilestoneBox] = useState([1]);

  const [subprocessSelected, setSubprocessSelected] = useState();

  const { milestones, setMilestones, handleImageUpload, fileUri, setFileUri } =
    useMilestone();

  const { product, setProduct, uploadProduct, uploadQr } = useProduct(
    router.query.id
  );

  const auth =
    "Basic " +
    Buffer.from(
      process.env.NEXT_PUBLIC_IPFS_API_KEY +
        ":" +
        process.env.NEXT_PUBLIC_IPFS_KEY_SECRET
    ).toString("base64");

  const ipfs = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization: auth,
    },
  });

  const handleOpen = () => {
    setTabActive(0);
    setSubprocessSelected(null);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);
  const handleClickSubprocess = (event) => {
    const subprocess = event.target.getAttribute("name");
    setSubprocessSelected(subprocess);
  };
  const handleChange = (event, newValue) => {
    setTabActive(newValue);
  };

  const saveMilestone = async (index) => {
    let milestonesValid = true;

    milestones.forEach((element, index) => {
      if (element.image === "" || element.description === "") {
        const number = index + 1;
        alert(`Faltan completar datos en el hito número ${number}`);
        milestonesValid = false;
      }
    });

    if (!milestonesValid) {
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

      milestones.forEach((element, index) => {
        selectedSubprocess.milestones.push(element);
      });

      const updateProduct = { ...product };

      console.log(updateProduct);

      uploadProduct(updateProduct);

      // Restablecer estados y cerrar el modal
      setMilestoneBox([0]);
      setMilestones([{ description: "", image: "" }]);
      setFileUri("");
      setSubprocessSelected(null);
      setTabActive(null);
      setOpen(false); // Cierra el modal
    } catch (error) {
      console.log(error);
    }
  };

  const uploadToBlockChain = async () => {
    try {
      console.log("Iniciando la función uploadToBlockChain");
      const trazabilidadAgrupada = [];

      // Iterar sobre las líneas de trazabilidad
      for (const linea of product.trazability) {
        const etapa = {
          name: linea.name,
          milestones: [],
        };

        // Iterar sobre las etapas de la línea
        for (const etapaItem of linea.line) {
          // Filtrar milestones vacíos
          const milestonesNoVacios = etapaItem.milestones.filter(
            (milestone) => milestone.description.trim() !== ""
          );

          // Agregar etapa solo si tiene milestones no vacíos
          if (milestonesNoVacios.length > 0) {
            etapa.milestones.push({
              path: etapaItem.path,
              name: etapaItem.name,
              milestones: milestonesNoVacios,
            });
          }
        }

        // Agregar etapa solo si tiene milestones no vacíos
        if (etapa.milestones.length > 0) {
          trazabilidadAgrupada.push(etapa);
        }
      }

      const trazability = await ipfs.add(JSON.stringify(trazabilidadAgrupada));

      const formatProduct = {
        //id hardcoded
        id: router.query.id,
        lotNumber: product.lotNumber,
        protocolName: product.protocolName,
        name: product.name,
        status: "realizado",
        ownerUid: user.uid,
        trazability: trazability.path,
      };

      const tokenData = {
        name: product.name,
        description: {
          expeditionDate: product.expeditionDate,
          productImage: product.productImage,
          protocolName: product.protocolName,
          name: product.name,
          lotNumber: product.lotNumber,
          ownerUid: product.ownerUid,
          status: "realizado",
          expirationDate: product.expirationDate,
        },

        image: product.productImage,
      };

      const toIPFS = JSON.stringify(tokenData);
      const added = await ipfs.add(toIPFS);
      const url = `https://ipfs.io/ipfs/${added.path}`;
      console.log("Operación IPFS completada");

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const trazabilityContract = new ethers.Contract(
        contractAddress,
        contractAbi,
        signer
      );

      await window.ethereum.enable();

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const userAddress = accounts[0];

      try {
        console.log(
          "Datos para safeMint:",
          userAddress,
          url,
          formatProduct,
          product.lotNumber
        );
        await trazabilityContract.safeMint(userAddress, formatProduct, 1, url);
      } catch (error) {
        console.log(error);
      }

      console.log("Operación Ethereum completada");
    } catch (error) {
      console.error(error.stack);
      console.error(error);
    }
  };

  const createQRcode = () => {
    const QRdata = `${process.env.NEXT_PUBLIC_PAGE_URL}/history/${router.query.id}`;

    const canvas = document.getElementById("canvas");

    QRCode.toCanvas(canvas, QRdata, async function (err, url) {
      const qrUrl = canvas.toDataURL("image/png");

      const response = await uploadQr(product, qrUrl);
    });
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80vw",
    height: "90vh",
    overflowY: "auto",
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
                    key={element.name}
                  />
                ))}
              </Tabs>
            </Box>
            {product.trazability.map((element, index) => (
              <Box key={element.name}>
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
                        transition: "background-color 0.3s ease",
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
            <Box>
              <Trazability
                fileUri={fileUri}
                handleImageUpload={handleImageUpload}
                product={product}
                subprocessSelected={subprocessSelected}
                milestones={milestones}
                setMilestones={setMilestones}
                saveMilestone={saveMilestone}
                setMilestoneBox={setMilestoneBox}
                milestoneBox={milestoneBox}
              />
            </Box>
          </Box>
        </Modal>

        <Box>
          <Typography
            sx={{
              color: "primary.main",
              fontSize: 24,
            }}
          >
            Cadena de produccion para : {product.name}
          </Typography>
          <Box sx={{ display: "flex" }}>
            <TrazabilityLine protocol={product.trazability} />
            {!product?.qrcode && <canvas id="canvas"></canvas>}
            <Image
              src={product?.qrcode}
              width={148}
              height={148}
              alt="profile image"
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              onClick={createQRcode}
              disabled={product?.qrcode ? true : false}
            >
              Crear QR
            </Button>
            <Button variant="contained" onClick={uploadToBlockChain}>
              Certificar en blockchain
            </Button>
          </Box>
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
