import React from "react";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
const UserNavBar = () => {
  return (
    <Box sx={{ bgcolor: "primary.main", height: 90, paddingX: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", height: 100 }}>
        <Image src={"/images/logo-ideal.png"} width={130} height={45} />

        <Box
          sx={{
            display: "flex",
            gap: 5,
            marginLeft: 2,
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Link style={{ color: "#fff", fontSize: 18 }} href={"#"}>
            Sobre nosotros
          </Link>
          <Link style={{ color: "#fff", fontSize: 18 }} href={"#"}>
            Tecnología
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default UserNavBar;
