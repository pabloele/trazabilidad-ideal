import React from "react";
import { useRouter } from "next/router";
import useProduct from "../../hooks/useProduct";
import Image from "next/image";
import { Typography, Box, Button, useMediaQuery } from "@mui/material";
import UserNavBar from "../../components/NavBar/UserNavBar";
const ViewProduct = () => {
  const router = useRouter();
  const { product } = useProduct(router.query.id);

  const isSmallScreen = useMediaQuery("(min-width: 720px)");

  console.log(product);
  return (
    <>
      <UserNavBar />

      <Box
        sx={{ padding: 2, display: "flex", gap: 5 }}
        flexDirection={isSmallScreen ? "row" : "column"}
      >
        <Box>
          <Image
            style={{ borderRadius: 60 }}
            src={product?.productImage}
            width={isSmallScreen ? 515 : 315}
            height={isSmallScreen ? 515 : 315}
            alt="Product Image"
          />
        </Box>

        <Box sx={{ marginTop: 4 }}>
          <Typography
            sx={{ fontSize: 55, fontWeight: "bold", color: "primary.main" }}
          >
            {product?.name}

            <hr />
            <Box sx={{ backgroundColor: "#f5f5f5", padding: 2 }}>
              <Typography sx={{ fontSize: 20, fontWeight: "bold" }}>
                Producto certificado
              </Typography>
              <Typography sx={{ fontSize: 20, marginTop: 2 }}>
                La trazabilidad de este producto fue certificada con tecnología
                blockchain
              </Typography>

              <Button
                variant="contained"
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
                  marginTop: 2,
                }}
              >
                Ver trazabilidad
                <Image
                  src={"/images/logo-ideal.png"}
                  width={50}
                  height={20}
                  alt="logo"
                />
              </Button>
            </Box>
          </Typography>
        </Box>
      </Box>
      <Box sx={{ paddingX: 2, marginY: 10 }}>
        {product &&
          product.trazability.map((trazability, index) => {
            const hasMilestones = trazability.line.some(
              (line) => line.milestones.length > 0
            );

            if (hasMilestones) {
              return (
                <Box sx={{ backgroundColor: "primary.main", padding: 2 }}>
                  <Typography sx={{ color: "#fff", fontSize: 24 }}>
                    {trazability.name}
                  </Typography>

                  <Box sx={{ marginY: 2 }}>
                    {trazability.line.map((line, lineIndex) => {
                      if (line.milestones.length > 0) {
                        return (
                          <Box>
                            <Typography
                              key={lineIndex}
                              sx={{ color: "#fff", fontSize: 16, marginY: 5 }}
                            >
                              {line.name}
                            </Typography>
                            <Box>
                              {line.milestones.map(
                                (milestone, milestoneIndex) => (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      gap: 2,
                                      alignItems: "center",
                                    }}
                                    key={milestoneIndex}
                                  >
                                    <Image
                                      style={{ borderRadius: 20 }}
                                      width={isSmallScreen ? 300 : 150}
                                      height={isSmallScreen ? 300 : 150}
                                      src={milestone.image}
                                      alt={milestone.description}
                                    />

                                    <Typography key={milestoneIndex}>
                                      {milestone.description}
                                    </Typography>
                                  </Box>
                                )
                              )}
                            </Box>
                            <hr />
                          </Box>
                        );
                      }
                    })}
                  </Box>
                </Box>
              );
            }
          })}
      </Box>
    </>
  );
};

export default ViewProduct;
