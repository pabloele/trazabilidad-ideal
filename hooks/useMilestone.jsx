import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
const useMilestone = () => {
  const [milestones, setMilestones] = useState([
    { image: "", description: "" },
  ]);

  const [fileUri, setFileUri] = useState([]);

  const { uploadFile, getFile } = useAuth();

  const handleImageUpload = async (index) => {
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
