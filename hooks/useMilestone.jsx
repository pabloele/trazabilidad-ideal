import React, { useState } from "react";
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
      input.accept = "image/*"; // Puedes ajustar las extensiones permitidas según tus necesidades

      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
          // Sube el archivo a Firestore Storage
          console.log(file);

          const response = await uploadFile(file);
          console.log(response);
          const firebaseFullPath = response.metadata.fullPath;
          setFileUri(await getFile(firebaseFullPath));
          console.log(fileUri);
        }
      };

      input.click();
    } catch (error) {
      console.error("Error al subir la imagen:", error);
    }
  };

  return {
    fileUri,
    milestone,
    setMilestone,
    handleImageUpload,
  };
};

export default useMilestone;
