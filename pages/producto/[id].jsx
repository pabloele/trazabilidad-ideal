import React, { useState, useEffect, useRef } from "react";
import TrazabilityLine from "../../components/TrazabilityLine/TrazabilityLine";
import { HomeLayout } from "../../layout";
import {
  Box,
  Typography,
  IconButton,
  Tab,
  Tabs,
  Button,
  Grid,
} from "@mui/material";
import useProduct from "../../hooks/useProduct";
import { useRouter } from "next/router";
import Modal from "@mui/material/Modal";
import { AddOutlined } from "@mui/icons-material";
import Trazability from "../../components/Trazability/Trazability";
import TabPanel from "../../components/TabPanel/TabPanel";
import useMilestone from "../../hooks/useMilestone";
import { ethers } from "ethers";
import { contractAddress, contractAbi } from "../../contract/contract";
import { useAuth } from "../../context/AuthContext";
import { agroupMilestones, uploadIPFS } from "../../contract/toBlockChain";
import ModalDialog from "../../components/Modals/ModalDialog";
import Spinner from "../../components/Spinner/Spinner";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import {
  addProtocol,
  updateProduct,
} from "../../firebase/controllers/firestoreControllers";
const Producto = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [path, setPath] = useState("");

  const [txHash, setTxHash] = useState();

  const [error, setError] = useState();

  const {
    DialogModal,
    open: openDialog,
    setOpen: setOpenDialog,
  } = ModalDialog();

  const [qrcode, setQrCode] = useState();

  const ref = useRef(null);

  const [tabActive, setTabActive] = useState(0);
  const [open, setOpen] = useState(false);
  const [boxIndex, setBoxIndex] = useState(0);

  const [milestoneBox, setMilestoneBox] = useState([1]);

  const [subprocessSelected, setSubprocessSelected] = useState();
  const [showCategories, setShowCategories] = useState(false);

  const {
    milestones,
    setMilestones,
    handleImageUpload,
    fileUri,
    setFileUri,
    handleAddMilestone,
    handleFileUpload,
  } = useMilestone();

  const { product, setProduct, uploadProduct, uploadQr } = useProduct(
    router.query.id
  );

  useEffect(() => {
    // Verifica que el código se esté ejecutando en el lado del cliente
    if (typeof window !== "undefined") {
      // Importa la biblioteca solo en el lado del cliente
      import("qr-code-styling").then((module) => {
        const QRCodeStyling = module.default;

        // Usa la biblioteca aquí
        const qrCodeInstance = new QRCodeStyling({
          width: 180,
          height: 180,
          image: "/images/cropped-logo-ideal-2.png",
          dotsOptions: { type: "extra-rounded", color: "#000000" },
          imageOptions: {
            hideBackgroundDots: true,
            imageSize: 0.4,
            margin: 0,
          },
        });

        setQrCode(qrCodeInstance);
        if (product?.qrcode) {
          qrCodeInstance.append(ref.current);
          qrCodeInstance.update({ data: product.qrcode });
        }
      });
    }
  }, [product?.qrcode]);

  const handleOpen = () => {
    setTabActive(0);
    setSubprocessSelected(null);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleClickSubprocess = ({ name, path }) => {
    const updatedMilestones = [...milestones];

    updatedMilestones[boxIndex] = {
      ...updatedMilestones[boxIndex],
      name: name,
      path: path,
    };

    const subprocess = name;

    setSubprocessSelected(subprocess);
    setPath(path);
    setMilestones([...updatedMilestones]);
    setShowCategories(false);
  };

  const handleChange = (event, newValue) => {
    console.log("event", event.target.value);
    console.log("value", newValue);
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
      setLoading(true);
      const trazabilidadAgrupada = agroupMilestones(product);

      const trazability = await uploadIPFS(trazabilidadAgrupada);

      const formatProduct = {
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
          trazability: trazability.path,
        },

        image: product.productImage,
      };

      const tokenDataIPFS = await uploadIPFS(tokenData);

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

      console.log(userAddress, formatProduct, 1, tokenDataIPFS.url);

      try {
        const response = await trazabilityContract.safeMint(
          userAddress,
          formatProduct,
          1,
          tokenDataIPFS.url
        );

        setTxHash(response.hash);

        const updated = await updateProduct(router.query.id, "realizado");
      } catch (error) {
        setError(error.reason);

        console.log(error);
      }
    } catch (error) {
      console.error(error.stack);
      console.error(error);

      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const createQRcode = async () => {
    qrcode.append(ref.current);

    const QRdata = `${process.env.NEXT_PUBLIC_PAGE_URL}/history/${router.query.id}`;
    qrcode.update({
      data: QRdata,
    });
    const response = await uploadQr(product, QRdata);

    setProduct({ ...product, qrcode: QRdata });
  };

  const handleOpenModal = async () => {
    Swal.fire({
      title:
        "¿Seguro que deseas certificar este proceso productivo en la blockchain?",
      text: "Esta acción no es reversible y sera información pública",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Certificar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setOpenDialog(true);

        try {
          const response = await uploadToBlockChain();
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  if (!product) {
    return (
      <HomeLayout>
        <Box container sx={{ height: "90vh" }}>
          <Spinner />
        </Box>
      </HomeLayout>
    );
  } else {
    return (
      <HomeLayout>
        <DialogModal txHash={txHash} loading={loading} />
        {console.log(product)}
        {/* <Button onClick={addProtocol}>agregar</Button> */}

        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
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
            }}
          >
            {showCategories && (
              <React.Fragment>
                <Grid display="flex" justifyContent="center">
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
                </Grid>

                {product.trazability.map((element, index) => (
                  // categoría
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
                            transition: "gray 0.3s ease",
                            borderRadius: "40px",
                          }}
                        >
                          <Typography
                            onClick={() => {
                              handleClickSubprocess({
                                path: element.path,
                                name: subprocess.name,
                              });
                            }}
                            name={subprocess.name}
                            sx={{
                              color:
                                subprocessSelected === subprocess.name
                                  ? "white"
                                  : "primary.main",
                              marginY: 1,
                              marginX: 1,
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
              </React.Fragment>
            )}
            <Box key={boxIndex}>
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
                handleAddMilestone={handleAddMilestone}
                path={path}
                handleFileUpload={handleFileUpload}
                setShowCategories={setShowCategories}
                setBoxIndex={setBoxIndex}
                boxIndex={boxIndex}
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
          {error && (
            <Typography sx={{ color: "#FF0000", fontSize: 20 }}>
              {error}
            </Typography>
          )}
          <Box sx={{ display: "flex" }}>
            <TrazabilityLine protocol={product.trazability} />

            <Box ref={ref}></Box>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              onClick={createQRcode}
              disabled={product?.qrcode ? true : false}
            >
              Crear QR
            </Button>
            <Button
              variant="contained"
              onClick={handleOpenModal}
              disabled={product?.status !== "en curso"}
            >
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
