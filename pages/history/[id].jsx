import React, { useState } from "react";
import { useRouter } from "next/router";
import useProduct from "../../hooks/useProduct";
import Image from "next/image";
import { Typography, Box, Button, useMediaQuery, Paper } from "@mui/material";
import UserNavBar from "../../components/NavBar/UserNavBar";
import { contractAddress, contractAbi } from "../../contract/contract";
import { ethers } from "ethers";

import Link from "next/link";

const ViewProduct = () => {
  const router = useRouter();
  const { product } = useProduct(router.query.id);

  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(false);
  const isSmallScreen = useMediaQuery("(min-width: 720px)");

  const getBlockChainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = provider.getSigner();

    const trazabilityContract = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );

    try {
      setLoading(true);
      const data = await trazabilityContract.getProductData(router.query.id);
      setProductData(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <UserNavBar />

      <Box
        sx={{ padding: 2, display: "flex", gap: 5, marginY: 4 }}
        flexDirection={isSmallScreen ? "row" : "column"}
        justifyContent="center"
      >
        <Paper
          sx={{
            display: "flex",
            flexDirection: "row",
            padding: 4,
            boxShadow: "0px 4px 8px rgba(0, 0, 0.5, 0.5)",
          }}
        >
          <Box>
            <Image
              style={{ objectFit: "contain" }}
              src={product?.productImage}
              width={isSmallScreen ? 315 : 215}
              height={isSmallScreen ? 315 : 215}
              alt="Product Image"
            />
          </Box>

          <Box sx={{ marginTop: 4 }}>
            <Typography
              sx={{ fontSize: 48, fontWeight: "bold", color: "primary.main" }}
            >
              {product?.name}
            </Typography>

            <hr />
            <Box
              sx={{
                backgroundColor: "#f5f5f5",
                padding: 2,
                color: "primary.main",
              }}
            >
              <Typography sx={{ fontSize: 20, fontWeight: "bold" }}>
                Producto certificado
              </Typography>
              <Typography sx={{ fontSize: 20, marginTop: 2 }}>
                La trazabilidad de este producto fue certificada con tecnología
                blockchain
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  onClick={getBlockChainData}
                  variant="contained"
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                    marginTop: 2,
                    boxShadow: "0px 4px 8px rgba(0, 0, 0.5, 0.5)",
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
            </Box>

            {productData?.length > 0 && (
              <Box>
                <Box>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer "
                    href={`https://trazabilidadideal.infura-ipfs.io/ipfs/${productData.trazability}`}
                  >
                    Linea de trazabilidad
                  </Link>
                </Box>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
      <Box sx={{ paddingX: 2 }}>
        {product &&
          product?.trazability?.map((trazability, index) => {
            const hasMilestones = trazability.line.some(
              (line) => line.milestones.length > 0
            );

            if (hasMilestones) {
              return (
                <Box sx={{ backgroundColor: "", padding: 1 }} key={index}>
                  <Typography
                    sx={{
                      fontSize: 32,
                      fontWeight: "bold",
                      color: "primary.main",
                      marginX: 10,
                    }}
                  >
                    {trazability.name}
                  </Typography>

                  <Box sx={{ marginY: 2 }}>
                    {trazability.line.map((line, lineIndex) => {
                      if (line.milestones.length > 0) {
                        return (
                          <Box key={lineIndex}>
                            <Box>
                              {line.milestones.map(
                                (milestone, milestoneIndex) => (
                                  <React.Fragment key={milestoneIndex}>
                                    <Box
                                      sx={{
                                        padding: 2,
                                        display: "flex",
                                        gap: 5,
                                      }}
                                      flexDirection={
                                        isSmallScreen ? "row" : "column"
                                      }
                                    >
                                      <Box>
                                        <Image
                                          style={{ objectFit: "contain" }}
                                          src={milestone.image}
                                          width={isSmallScreen ? 280 : 215}
                                          height={isSmallScreen ? 280 : 215}
                                          alt="Product Image"
                                        />
                                      </Box>

                                      <Box>
                                        <Typography
                                          sx={{
                                            fontSize: 28,
                                            fontWeight: "bold",
                                            color: "primary.main",
                                          }}
                                        >
                                          {line.name}
                                        </Typography>

                                        <hr />
                                        <Box
                                          sx={{
                                            backgroundColor: "#f5f5f5",

                                            color: "primary.main",
                                            minWidth: "800px",
                                            minHeight: "200px",
                                          }}
                                        >
                                          <Typography
                                            sx={{ fontSize: 20, marginTop: 2 }}
                                          >
                                            {milestone.description}
                                          </Typography>
                                          <Typography
                                            sx={{
                                              fontSize: 20,
                                              fontWeight: "bold",
                                              paddingTop: 1,
                                            }}
                                          >
                                            Archivos adjuntos:
                                          </Typography>
                                          {milestone.atachments?.map(
                                            (atachment, index) => (
                                              <Typography
                                                key={atachment.name}
                                                sx={{
                                                  fontSize: 14,
                                                  fontWeight: "bold",
                                                  color: "black",
                                                  textDecoration: "none",
                                                }}
                                              >
                                                <Link href={atachment.url}>
                                                  {atachment.name}
                                                </Link>
                                              </Typography>
                                            )
                                          )}
                                        </Box>

                                        {productData?.length > 0 && (
                                          <Box>
                                            <Box>
                                              <Link
                                                target="_blank"
                                                rel="noopener noreferrer "
                                                href={`https://trazabilidadideal.infura-ipfs.io/ipfs/${productData.trazability}`}
                                              >
                                                Linea de trazabilidad
                                              </Link>
                                            </Box>
                                          </Box>
                                        )}
                                      </Box>
                                    </Box>
                                  </React.Fragment>
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
