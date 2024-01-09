import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { create } from "ipfs-http-client";
import { v4 } from "uuid";
import imageCompression from "browser-image-compression";

const options = {
  maxSizeMB: 2,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
};

const useMilestone = (
  initialMilestone = {
    name: "",
    path: "",
    image: "",
    description: "",
    milestoneId: "",
    atachments: [],
  }
) => {
  const [milestone, setMilestone] = useState(initialMilestone);

  const [fileUri, setFileUri] = useState([]);

  const { uploadFile, getFile } = useAuth();

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
    apiPath: "/api/v0",
    headers: {
      authorization: auth,
    },
  });

  const handleImageUpload = async () => {
    try {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";

      input.onchange = async (e) => {
        const rawFile = e.target.files[0];
        const file = await imageCompression(rawFile, options);
        if (file) {
          try {
            const result = await ipfs.add(file);
            const ipfsHash = result.path;
            const urlImage = `https://trazabilidadideal.infura-ipfs.io/ipfs/${ipfsHash}`;

            // setFileUri((prevFileUri) => {
            //   const newFileUri = [...prevFileUri];
            //   newFileUri[index] = urlImage;
            //   return newFileUri;
            // });

            setMilestone((prev) => ({
              ...prev,
              image: urlImage,
            }));
          } catch (error) {
            alert(error.message);
          }
        }
      };

      input.click();
    } catch (error) {
      console.error("Error al subir la imagen:", error);
    }
  };

  const handleFileUpload = async () => {
    try {
      const input = document.createElement("input");
      input.type = "file";

      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
          const extension = file.name.split(".").pop();
          const uniqueId = v4().substr(0, 8);
          const randomName = `${uniqueId}.${extension}`;

          // const randomName = `${uniqueId}`;

          const result = await ipfs.add(file);
          const ipfsHash = result.path;
          const urlFile = `https://trazabilidadideal.infura-ipfs.io/ipfs/${ipfsHash}`;

          const atachments = [
            ...milestone.atachments,
            { name: randomName, url: urlFile },
          ];
          setMilestone((prev) => ({
            ...prev,
            atachments,
          }));
        }
      };

      input.click();
    } catch (error) {
      console.error("Error al subir el archivo", error);
    }
  };
  const handleRemoveAtachment = (i) => {
    const updatedAttachments = [...milestone.atachments];

    updatedAttachments.splice(i, 1);

    setMilestone((prev) => ({
      ...prev,
      atachments: updatedAttachments,
    }));
  };

  const handleChangeMilestoneField = (e) => {
    setMilestone((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return {
    setFileUri,
    fileUri,
    milestone,
    setMilestone,
    handleImageUpload,
    handleFileUpload,
    handleChangeMilestoneField,
    handleRemoveAtachment,
  };
};

export default useMilestone;
