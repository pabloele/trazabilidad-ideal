import React, { useCallback, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useDropzone } from "react-dropzone";
import AttachmentIcon from "@mui/icons-material/Attachment";
import { uploadIPFS } from "../../contract/toBlockChain";

const AttachmentsFiles = ({ setUploadedFiles, uploadedFiles }) => {
  const onDropRejected = () => {
    throw new Error("Eskere");
  };

  const onDropAccepted = useCallback(
    async (acceptedFiles) => {
      // Concatenar los nuevos archivos con los existentes

      const file = new File([acceptedFiles[0]], acceptedFiles[0].name, {
        type: acceptedFiles[0].type,
        lastModified: acceptedFiles[0].lastModified,
      });

      const response = await uploadIPFS(file);

      setUploadedFiles((prevFiles) => [
        ...prevFiles,
        { name: file.name, url: response.url },
      ]);

      console.log(file);
      // Limpiar los archivos aceptados
      acceptedFiles.forEach((file) => {
        URL.revokeObjectURL(file.preview);
      });
      console.log(uploadedFiles);
    },
    [setUploadedFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDropAccepted,
    onDropRejected,
    maxSize: 100000000,
  });

  return (
    <Box
      {...getRootProps()}
      sx={{
        ":hover": {
          cursor: "pointer",
        },
        bgcolor: "#e1e1e1",
        height: "300px",
        width: "600px",
        border: "dashed",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginX: "auto",
      }}
    >
      <input className="h-100 " {...getInputProps()} />

      {uploadedFiles.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)", // 3 columnas iguales
            gap: 2, // Espacio entre las celdas
          }}
        >
          {uploadedFiles.map((file, index) => (
            <Box
              key={index}
              sx={{
                bgcolor: "primary.main",
                padding: 2,
                textAlign: "center",
              }}
            >
              {file.name}
            </Box>
          ))}
        </Box>
      ) : (
        <AttachmentIcon sx={{ color: "primary.main", fontSize: 60 }} />
      )}
    </Box>
  );
};

export default AttachmentsFiles;
