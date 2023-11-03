import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
const useMilestone = () => {
  const [milestone, setMilestone] = useState({
    image: "",
    description: "",
  });

  const [fileUri, setFileUri] = useState();

  const { uploadFile, getFile } = useAuth();

  const handleImageUpload = async () => {
    try {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";

      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
          const response = await uploadFile(file);
          const firebaseFullPath = response.metadata.fullPath;
          const urlImage = await getFile(firebaseFullPath);

          setFileUri(urlImage);

          // Establece el valor de image en milestone después de que fileUri esté listo
          setMilestone({ ...milestone, image: urlImage });

          console.log(milestone);
        }
      };

      input.click();
    } catch (error) {
      console.error("Error al subir la imagen:", error);
    }
  };

  useEffect(() => {
    console.log("Milestone updated:", milestone);
  }, [milestone]);

  return {
    setFileUri,
    fileUri,
    milestone,
    setMilestone,
    handleImageUpload,
  };
};

export default useMilestone;
