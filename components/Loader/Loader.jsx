import React from "react";
import { PuffLoader } from "react-spinners";
import { Box } from "@mui/material";
const Loader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <PuffLoader size={100} color="blue" />
    </Box>
  );
};

export default Loader;
