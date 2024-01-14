import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useProduct from '../../hooks/useProduct';
import Image from 'next/image';
import {
  Typography,
  Box,
  Button,
  useMediaQuery,
  Paper,
  Grid,
  Divider,
} from '@mui/material';
import UserNavBar from '../../components/NavBar/UserNavBar';
import { contractAddress, contractAbi } from '../../contract/contract';
import { ethers } from 'ethers';

import Link from 'next/link';

const ViewProduct = () => {
  const router = useRouter();
  const { product } = useProduct(router.query.id);

  const [productData, setProductData] = useState({ data: [], success: false });
  const [loading, setLoading] = useState(false);
  const isSmallScreen = useMediaQuery('(min-width: 720px)');
  const isMediumScreen = useMediaQuery('(min-width: 10240px)');

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
      setProductData({ data: data, success: true });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBlockChainData();
  }, []);

  const handleDownload = (atachment) => {
    fetch(`${atachment.url}?filename=${atachment.name}`)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', atachment.name);

        link.click();
      })
      .catch((error) => {
        console.error('Error al descargar el archivo', error);
      });
  };
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () => {
    setZoomLevel(zoomLevel + 0.1);
  };

  const handleZoomOut = () => {
    if (zoomLevel > 0.1) {
      setZoomLevel(zoomLevel - 0.1);
    }
  };

  const handleMove = (direction) => {
    const step = 10; 
    switch (direction) {
      case 'up':
        setPosition({ ...position, y: position.y - step });
        break;
      case 'down':
        setPosition({ ...position, y: position.y + step });
        break;
      case 'left':
        setPosition({ ...position, x: position.x - step });
        break;
      case 'right':
        setPosition({ ...position, x: position.x + step });
        break;
      default:
        break;
    }
  };
  const [position, setPosition] = useState({ x: 0, y: 0 });
  return (
    <Grid container justifyContent="center" direction={'column'}>
      <Grid item>
        <UserNavBar />
      </Grid>

      {/* Product header */}
      <Grid item marginY={4}>
        <Paper
          sx={{
            display: 'flex',
            flexDirection: 'row',
            padding: 4,
            boxShadow: '0px 4px 8px rgba(0, 0, 0.5, 0.5)',
          }}
        >
          {/* Product data */}
          <Grid container direction="row" gap={1} >
            <Grid
              item
              xs={5}
              sx={{
                display: 'flex',
                border:"primary.main",
                // borderStyle:"outset",
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'InfoBackground',
                direction: 'row',
              }}
            >

            <Paper
              sx={{
                position: 'relative', overflow: 'hidden', width: '100%', height: '100%',
                display: 'flex',
                flexDirection: 'row',
                // padding: 4,
                boxShadow: '0px 4px 8px rgba(0, 0, 0.5, 0.5)',
              }}
            >

                  <Image
                      style={{
                        transform: `scale(${zoomLevel}) translate(${position.x}px, ${position.y}px)`,
                        transition: 'transform 0.1s ease-in-out',
                      }}
                    src={product?.productImage}
                    width={isSmallScreen ? 350 : 300}
                    height={isSmallScreen ? 350 : 300}
                    alt="Product Image"
                  />
              </Paper>
              <Box style={{ position: 'absolute', top: 10, right: 10 }}>
              <Button
                      variant="contained"
                      sx={{
                        display: 'flex',
                        gap: 1,
                        alignItems: 'center',
                        marginTop: 2,
                        boxShadow: '0px 4px 8px rgba(0, 0, 0.5, 0.5)',
                      }}
                      onClick={handleZoomIn}
                    >
                      Zoom In
                      {/* <Image
                        src={'/images/logo-ideal.png'}
                        width={50}
                        height={20}
                        alt="logo"
                      /> */}
                    </Button>
                    <Button
                      variant="contained"
                      sx={{
                        display: 'flex',
                        gap: 1,
                        alignItems: 'center',
                        marginTop: 2,
                        boxShadow: '0px 4px 8px rgba(0, 0, 0.5, 0.5)',
                      }}
                      onClick={handleZoomOut}
                    >
                      Zoom Out
                      {/* <Image
                        src={'/images/logo-ideal.png'}
                        width={50}
                        height={20}
                        alt="logo"
                      /> */}
                    </Button>
                    <Button
                      variant="contained"
                      sx={{
                        display: 'flex',
                        gap: 1,
                        alignItems: 'center',
                        marginTop: 2,
                        boxShadow: '0px 4px 8px rgba(0, 0, 0.5, 0.5)',
                      }}
                     onClick={() => handleMove('right')}
                    >
                      Derecha
                      {/* <Image
                        src={'/images/logo-ideal.png'}
                        width={50}
                        height={20}
                        alt="logo"
                      /> */}
                    </Button>
                    <Button
                      variant="contained"
                      sx={{
                        display: 'flex',
                        gap: 1,
                        alignItems: 'center',
                        marginTop: 2,
                        boxShadow: '0px 4px 8px rgba(0, 0, 0.5, 0.5)',
                      }}
                     onClick={() => handleMove('left')}
                    >
                      Izquierda
                      {/* <Image
                        src={'/images/logo-ideal.png'}
                        width={50}
                        height={20}
                        alt="logo"
                      /> */}
                    </Button>
                    <Button
                      variant="contained"
                      sx={{
                        display: 'flex',
                        gap: 1,
                        alignItems: 'center',
                        marginTop: 2,
                        boxShadow: '0px 4px 8px rgba(0, 0, 0.5, 0.5)',
                      }}
                     onClick={() => handleMove('up')}
                    >
                      Arriba
                      {/* <Image
                        src={'/images/logo-ideal.png'}
                        width={50}
                        height={20}
                        alt="logo"
                      /> */}
                    </Button>
                    <Button
                      variant="contained"
                      sx={{
                        display: 'flex',
                        gap: 1,
                        alignItems: 'center',
                        marginTop: 2,
                        boxShadow: '0px 4px 8px rgba(0, 0, 0.5, 0.5)',
                      }}
                     onClick={() => handleMove('down')}
                    >
                      Abajo
                      {/* <Image
                        src={'/images/logo-ideal.png'}
                        width={50}
                        height={20}
                        alt="logo"
                      /> */}
                    </Button>
    
        </Box>
            </Grid>
            <Grid item xs={0.5}></Grid>
              <Grid container xs={5} direction="column" sx={{display:"flex",alignContent: 'center', justifyContent:"center"}}>

                            <Grid item  display="flex" justifyContent="center">
                              <Typography
                                
                                sx={{
                                  fontSize: 64,
                                  fontWeight: 'bold',
                                  color: 'primary.main',
                                  textJustify: 'auto',
                                }}
                              >
                                {product?.name}
                              </Typography>
                            </Grid>
                            <Grid item display="flex" justifyContent="center" bgcolor="primary.main">
                                    <Divider  sx={{display:"flex", width:"100%"}}></Divider>
                            </Grid>
                            <Grid item  display="flex" justifyContent="center">
                              <Typography
                                
                                sx={{
                                  fontSize: 32,
                                  fontWeight: 'bold',
                                  color: 'primary.main',
                                  textJustify: 'auto',
                                }}
                              >
                                 Bodegas Pepitón
                              </Typography>
                            </Grid>
                            <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer "
                    href="www.google.com"
                  >
                    <Button
                      variant="contained"
                      sx={{
                        display: 'flex',
                        gap: 1,
                        alignItems: 'center',
                        marginTop: 2,
                        boxShadow: '0px 4px 8px rgba(0, 0, 0.5, 0.5)',
                      }}
                    >
                      Datos del productor
                      {/* <Image
                        src={'/images/logo-ideal.png'}
                        width={50}
                        height={20}
                        alt="logo"
                      /> */}
                    </Button>
                  </Link>
                </Grid>
              </Grid>
            {productData.success && (
              <Grid
                item
                sx={{
                  backgroundColor: '#f5f5f5',
                  padding: 2,
                  color: 'primary.main',
                }}
              >
                <Typography sx={{ fontSize: 20, fontWeight: 'bold' }}>
                  Producto certificado
                </Typography>
                <Typography sx={{ fontSize: 20, marginTop: 2 }}>
                  La trazabilidad de este producto fue certificada con
                  tecnología blockchain
                </Typography>

                <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer "
                    href={`https://trazabilidadideal.infura-ipfs.io/ipfs/${productData.data.trazability}`}
                  >
                    <Button
                      variant="contained"
                      sx={{
                        display: 'flex',
                        gap: 1,
                        alignItems: 'center',
                        marginTop: 2,
                        boxShadow: '0px 4px 8px rgba(0, 0, 0.5, 0.5)',
                      }}
                    >
                      Ver trazabilidad
                      <Image
                        src={'/images/logo-ideal.png'}
                        width={50}
                        height={20}
                        alt="logo"
                      />
                    </Button>
                  </Link>
                </Grid>
              </Grid>
            )}
            {isMediumScreen && (
              <Grid container direction="row">
                <Grid
                  item
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: 'dotted',
                    direction: 'row',
                    backgroundImage:
                      'url("../../public/images/bg-product.jpg")',
                  }}
                >
                  <Image
                    style={{ objectFit: 'contain' }}
                    src={product?.productImage}
                    width={isSmallScreen ? 315 : 215}
                    height={isSmallScreen ? 315 : 215}
                    alt="Product Image"
                  />
                </Grid>
                <Grid item>
                  <Grid container direction="column">
                    <Grid item sx={{ display: 'flex', alignItems: 'flex-end' }}>
                      <Typography
                        sx={{
                          fontSize: 48,
                          fontWeight: 'bold',
                          color: 'primary.main',
                          textJustify: 'auto',
                        }}
                      >
                        {product?.name}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      sx={{
                        backgroundColor: '#f5f5f5',
                        padding: 2,
                        color: 'primary.main',
                      }}
                    >
                      <Typography sx={{ fontSize: 20, fontWeight: 'bold' }}>
                        Producto certificado
                      </Typography>
                      <Typography sx={{ fontSize: 20, marginTop: 2 }}>
                        La trazabilidad de este producto fue certificada con
                        tecnología blockchain
                      </Typography>
                      <Grid
                        item
                        sx={{ display: 'flex', justifyContent: 'flex-end' }}
                      >
                        <Button
                          onClick={getBlockChainData}
                          variant="contained"
                          sx={{
                            display: 'flex',
                            gap: 1,
                            alignItems: 'center',
                            marginTop: 2,
                            boxShadow: '0px 4px 8px rgba(0, 0, 0.5, 0.5)',
                          }}
                        >
                          Ver trazabilidad
                          <Image
                            src={'/images/logo-ideal.png'}
                            width={50}
                            height={20}
                            alt="logo"
                          />
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Grid>
          {/* Trazability line */}
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
        </Paper>
      </Grid>

      {/* milestones */}
      <Grid item>
        {product &&
          product.trazability &&
          product.trazability.map((trazability, index) => {
            const hasMilestones = trazability.line.some(
              (line) => line.milestones.length > 0
            );

            if (hasMilestones) {
              return (
                <Box key={index}>
                  {/* stage */}
                  <Typography
                    sx={{
                      fontSize: 26,
                      fontStyle: 'oblique',
                      color: 'whitesmoke',
                      backgroundColor: 'primary.main',
                      marginX: 10,
                      boxShadow: '0px 4px 8px rgba(0, 0, 0.5, 0.5)',
                    }}
                  >
                    {trazability.name}
                  </Typography>

                  <Box>
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
                                        display: 'flex',
                                        flexDirection: 'row',
                                        gap: 5,
                                        justifyContent: 'center',
                                      }}
                                      flexDirection={
                                        isSmallScreen ? 'row' : 'column'
                                      }
                                    >
                                      <Box
                                        sx={{
                                          width: '200px',
                                          height: '200px',
                                          position: 'relative',
                                        }}
                                      >
                                        <Image
                                          src={milestone.image}
                                          alt="Milestone Image"
                                          layout="fill"
                                          objectFit="contain"
                                        />
                                      </Box>

                                      <Box>
                                        <Box
                                          width={isSmallScreen ? 280 : 215}
                                          height={215}
                                          sx={{
                                            backgroundColor: '#f5f5f5',
                                            overflowY: 'auto',
                                            color: 'primary.main',
                                            minWidth: '800px',
                                            minHeight: '200px',
                                          }}
                                        >
                                          <Typography
                                            sx={{
                                              fontSize: 28,
                                              fontWeight: 'bold',
                                              color: 'primary.main',
                                            }}
                                          >
                                            {line.name}
                                          </Typography>
                                          <Typography
                                            sx={{
                                              fontSize: 20,
                                              marginTop: 2,
                                            }}
                                          >
                                            {milestone.description}
                                          </Typography>
                                          <Typography
                                            sx={{
                                              fontSize: 20,
                                              fontWeight: 'bold',
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
                                                  fontWeight: 'bold',
                                                  color: 'black',
                                                  textDecoration: 'none',
                                                  cursor: 'pointer',
                                                }}
                                                onClick={() =>
                                                  handleDownload(atachment)
                                                }
                                              >
                                                {atachment.name}
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
      </Grid>
    </Grid>
  );
};

export default ViewProduct;
