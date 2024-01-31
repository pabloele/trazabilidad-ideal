import React from "react";
import { Button, Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/router";

const BackButton = () => {
  const router = useRouter();
  return (
    <Button variant="contained" onClick={() => router.back()}>
      <ArrowBackIcon
        sx={{
          fontSize: 40,
          position: "fixed",
          top: 100,
          left: 30,
          color: "primary.main",
        }}
      />
    </Button>
  );
};

export default BackButton;
