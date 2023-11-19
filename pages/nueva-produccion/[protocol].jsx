import React, { useEffect, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import useProtocols from "../../hooks/useProtocols";
import { HomeLayout } from "../../layout";
import ImageIcon from "@mui/icons-material/Image";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { create } from "ipfs-http-client";
import Image from "next/image";
import { addUserProduct } from "../../firebase/controllers/firestoreControllers";
import { useAuth } from "../../context/AuthContext";

const ProtocolPage = () => {
  const router = useRouter();

  const { protocols } = useProtocols();
  const { user } = useAuth();
  const [protocolSelected, setProtocolSelected] = useState();
  const [productName, setProductName] = useState("");
  const [lotNumber, setLotNumber] = useState("");
  const [expeditionDate, setExpeditionDate] = useState(null);
  const [expirationDate, setExpirationDate] = useState(null);
  const [fileUri, setFileUri] = useState("");
  const [loading, setLoading] = useState(false);
  const [missingFields, setMissingFields] = useState([]);

  useEffect(() => {
    if (protocols) {
      const findProtocol = protocols.find(
        (protocol) => protocol.name === router.query.protocol
      );

      setProtocolSelected(findProtocol);
    }
  }, [protocols]);

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

  const validateFields = () => {
    const missing = [];

    if (!productName.trim()) {
      missing.push("Nombre del producto");
    }

    if (!lotNumber.trim()) {
      missing.push("Número de lote");
    }

    if (!expeditionDate) {
      missing.push("Fecha de expedición");
    }

    if (!expirationDate) {
      missing.push("Fecha de vencimiento");
    }

    if (fileUri === "") {
      missing.push("Imagen del producto");
    }

    setMissingFields(missing);
    return missing.length === 0;
  };

  const handleImageUpload = async () => {
    try {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";

      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
          try {
            const result = await ipfs.add(file);
            const ipfsHash = result.path;
            const urlImage = `https://ipfs.io/ipfs/${ipfsHash}`;

            setFileUri(urlImage);
          } catch (error) {
            console.error("Error al subir la imagen a IPFS:", error);
          }
        }
      };

      input.click();
    } catch (error) {
      console.error("Error al subir la imagen:", error);
    }
  };

  const handleChange = (field, value) => {
    switch (field) {
      case "productName":
        setProductName(value);
        break;
      case "lotNumber":
        setLotNumber(value);
        break;
      case "expeditionDate":
        setExpeditionDate(value);
        break;
      case "expirationDate":
        setExpirationDate(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async () => {
    const isValid = validateFields();

    if (isValid) {
      setLoading(true);

      try {
        const docRef = await addUserProduct(user.uid, {
          name: productName,
          trazability: protocolSelected.trazability,
          status: "en curso",
          protocolName: protocolSelected.name,
          lotNumber,
          expeditionDate: expeditionDate.toISOString(),
          expirationDate: expirationDate.toISOString(),
          productImage: fileUri,
        });
        router.push(`/producto/${docRef}`);
      } catch (error) {
        console.error("Error al agregar el documento", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <HomeLayout>
      <Box sx={{ paddingY: 2 }}>
        <Box component={"form"}>
          <Typography sx={{ color: "primary.main", fontSize: 24 }}>
            Crea tu producto
          </Typography>

          <Typography sx={{ color: "primary.main", fontSize: 20 }}>
            Protocolo seleccionado:
            <span style={{ fontWeight: "bold" }}>{protocolSelected?.name}</span>
          </Typography>
        </Box>
        {missingFields.length > 0 && (
          <Typography sx={{ color: "error.main", fontSize: 16 }}>
            Por favor, completa los siguientes campos:
            {missingFields.join(", ")}
          </Typography>
        )}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          <Box sx={{ marginTop: 2 }}>
            <Typography sx={{ color: "primary.main", fontSize: 20 }}>
              Nombre del producto
            </Typography>
            <TextField
              autoComplete="off"
              label="Nombre"
              value={productName}
              onChange={(e) => handleChange("productName", e.target.value)}
            />
          </Box>

          <Box sx={{ marginTop: 2 }}>
            <Typography sx={{ color: "primary.main", fontSize: 20 }}>
              Numero de lote
            </Typography>
            <TextField
              autoComplete="off"
              label="Nro de lote"
              value={lotNumber}
              onChange={(e) => handleChange("lotNumber", e.target.value)}
            />
          </Box>
          <Box sx={{ marginTop: 2 }}>
            <Typography sx={{ color: "primary.main", fontSize: 20 }}>
              Fecha de expedición
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={expeditionDate}
                onChange={(date) => handleChange("expeditionDate", date)}
              />
            </LocalizationProvider>
          </Box>

          <Box sx={{ marginTop: 2 }}>
            <Typography sx={{ color: "primary.main", fontSize: 20 }}>
              Fecha de vencimiento
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={expirationDate}
                onChange={(date) => handleChange("expirationDate", date)}
              />
            </LocalizationProvider>
          </Box>
          <Box sx={{ marginTop: 2 }}>
            <Typography sx={{ color: "primary.main", fontSize: 20 }}>
              Imagen del producto
            </Typography>
            <Box
              onClick={handleImageUpload}
              sx={{
                backgroundColor: "#e1e1e1",
                width: 240,
                height: 120,
                color: "#000",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                marginTop: 2,
              }}
            >
              {fileUri ? (
                <Image src={fileUri} width={240} height={120} />
              ) : (
                <>
                  <ImageIcon />
                  <Typography>Selecciona una imagen</Typography>{" "}
                </>
              )}
            </Box>
          </Box>
        </Box>

        <Button
          sx={{ marginTop: 5 }}
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
        >
          Comenzar la trazabilidad
        </Button>
      </Box>
    </HomeLayout>
  );
};

export default ProtocolPage;
