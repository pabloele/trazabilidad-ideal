import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import IPFS from "ipfs-mini";

const useMilestone = () => {
  const [milestones, setMilestones] = useState([
    { image: "", description: "" },
  ]);

  const [fileUri, setFileUri] = useState([]);

  const { uploadFile, getFile } = useAuth();

  const handleImageUpload = async (index) => {
    const ipfs = new IPFS({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
      key: "2UrrpLL3Im3ATvqSRLI8EEwB25F",
      secret: "b9678eacd899ae478394e33bf2aa602d",
    });

    try {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";

      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();

          reader.onloadend = async () => {
            const buffer = Buffer.from(reader.result);

            // Sube el archivo a IPFS
            ipfs.add(buffer, async (err, result) => {
              if (err) {
                console.error("Error al subir el archivo a IPFS:", err);
              } else {
                const ipfsHash = result;
                const urlImage = `https://ipfs.infura.io/ipfs/${ipfsHash}`;

                setFileUri((prevFileUri) => {
                  const newFileUri = [...prevFileUri];
                  newFileUri[index] = urlImage;
                  return newFileUri;
                });

                // Establece el valor de image en el milestone actual
                setMilestones((prevMilestones) => {
                  const newMilestones = [...prevMilestones];
                  newMilestones[index].image = urlImage;
                  return newMilestones;
                });

                console.log(milestones);
              }
            });
          };

          reader.readAsArrayBuffer(file);
        }
      };

      input.click();
    } catch (error) {
      console.error("Error al subir la imagen:", error);
    }
  };

  return {
    setFileUri,
    fileUri,
    milestones,
    setMilestones,
    handleImageUpload,
  };
};

export default useMilestone;
