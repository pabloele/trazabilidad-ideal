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
  useMediaQuery,
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
import Swal from "sweetalert2";
import { useAddress } from "@thirdweb-dev/react";
import { updateProduct } from "../../firebase/controllers/firestoreControllers";
import { v4 } from "uuid";
import CloseIcon from "@mui/icons-material/Close";
import { useProductStore } from "../../store";
import useModalStore from "../../store/useModalStore";
const Producto = () => {
  const address = useAddress();

  const isSmallScreen = useMediaQuery("(min-width: 600px)");
  const router = useRouter();
  const { user } = useAuth();

  const { product, setProductData } = useProductStore();

  const [loading, setLoading] = useState(true);
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

  const { isOpen, onOpen, onClose } = useModalStore();

  const { setProduct, uploadProduct, uploadQr } = useProduct(router.query.id);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("qr-code-styling").then((module) => {
        const QRCodeStyling = module.default;

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

  const onDownloadClick = () => {
    if (!qrcode) return;
    qrcode.download({
      extension: "png",
    });
  };

  const handleOpen = () => {
    setTabActive(0);
    setSubprocessSelected(null);
    onOpen();
  };

  const handleClose = () => onClose();

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

  const saveMilestone = async (milestone) => {
    if (
      milestone.image === "" ||
      milestone.description === "" ||
      milestone.name === ""
    ) {
      alert(`Descripción, imagen y/o categoría faltantes`);

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

      setMilestoneBox([0]);
      setMilestones([
        {
          description: "",
          image: "",
          path: "",
          milestoneUid: v4(),
          atachments: [],
        },
      ]);
      setFileUri("");
      setSubprocessSelected(null);
      setTabActive(null);
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const uploadToBlockChain = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      if (!address)
        throw new Error(
          "Conecte una billetera para certificar la trazabilidad"
        );

      setLoading(true);
      const trazabilidadAgrupada = agroupMilestones(product);

      const trazability = await uploadIPFS(trazabilidadAgrupada);

      const productToIpfs = await uploadIPFS(product);

      const formatProduct = {
        id: router.query.id,
        name: product.name,
        trazability: trazability.path,
        productReference: productToIpfs.path,
      };

      const formatedDescription = `La trazabilidad del producto  "${product.name}" esta certificado con tecnología blockchain gracias a la plataforma de la Fundacion Ideal`;

      const tokenData = {
        name: product.name,
        description: `La trazabilidad del producto  "${product.name}" esta certificado con tecnología blockchain gracias a la plataforma de la Fundacion Ideal`,

        image: product.productImage,
      };

      const tokenDataIPFS = await uploadIPFS(tokenData);

      const signer = provider.getSigner();

      const network = await provider.getNetwork();

      console.log(network);
      if (network.chainId !== Number(process.env.NEXT_PUBLIC_CHAIN_ID)) {
        throw new Error(
          `No estás en la red correcta, por favor seleccione la red ${process.env.NEXT_PUBLIC_NETWORK_NAME.toString()}`
        );
      }

      const trazabilityContract = new ethers.Contract(
        contractAddress,
        contractAbi,
        signer
      );

      try {
        const response = await trazabilityContract.safeMint(
          address,
          formatProduct,
          1,
          tokenDataIPFS.url
        );

        if (txHash) {
          const updated = await updateProduct(
            router.query.id,
            "realizado",
            txHash
          );
        } else {
          console.error("El valor de txHash es undefined.");
        }
      } catch (error) {
        setError(error.reason);

        console.log(error);
      }
    } catch (error) {
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

    setProductData({ ...product, qrcode: QRdata });
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
        <Box
          container
          sx={{
            height: "90vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spinner />
        </Box>
      </HomeLayout>
    );
  } else {
    return (
      <HomeLayout>
        <DialogModal txHash={txHash} loading={loading} />

        {/* <Button onClick={addProtocol}>agregar</Button> */}

        <Modal open={isOpen} onClose={handleClose} sx={{ width: "100%" }}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: isSmallScreen ? "95%" : "95%",
              height: "90vh",
              overflowY: "auto",
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              margin: isSmallScreen ? "0" : "auto",
              textAlign: "center",
              justifyContent: "center",
              p: 4,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <CloseIcon
                onClick={() => onClose()}
                sx={{
                  color: "red",
                  ":hover": {
                    cursor: "pointer",
                  },
                }}
              />
            </Box>
            <Box>
              <Typography
                sx={{
                  color: "primary.main",
                  fontSize: 24,
                }}
              >
                Complete los datos del hito
              </Typography>
              <Trazability />
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

            {product?.qrcode && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box ref={ref}></Box>

                <Box sx={{ display: "flex" }}>
                  <Button onClick={onDownloadClick} sx={{ fontSize: 12 }}>
                    Descargar QR
                  </Button>
                  <Button
                    onClick={() => router.push(`/history/${router.query.id}`)}
                    sx={{ fontSize: 12 }}
                  >
                    Visitar trazabilidad
                  </Button>
                </Box>
              </Box>
            )}
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
              // disabled={product?.status !== "en curso"}
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
