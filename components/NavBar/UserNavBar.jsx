import React from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

const UserNavBar = () => {
  const isSmallScreen = useMediaQuery("(min-width: 720px)");

  return (
    <Box
      sx={{
        bgcolor: "primary.main",
        height: 90,
        paddingX: 2,
        width: "100%",
        paddingX: "2rem",
      }}
    >
      <Box
        sx={{ display: "flex" }}
        justifyContent={isSmallScreen ? "center" : "center"}
        alignItems={"center"}
        height={100}
      >
        <Box>
          <Image
            src={"/images/logo-ideal.png"}
            width={130}
            height={45}
            alt="logo"
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            width: "100%",
          }}
          justifyContent={"right"}
        >
          {/* <Link style={{ color: '#fff', fontSize: 18 }} href={'https://ideal.org.ar/'} target="_blank">
            Sobre nosotros
          </Link> */}
          <Link
            style={{ color: "#fff", fontSize: 18 }}
            href={"https://ideal.org.ar/ideal-tech/"}
            target="_blank"
          >
            Sobre nosotros
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default UserNavBar;
