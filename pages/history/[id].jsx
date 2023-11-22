import React from 'react';
import { useRouter } from 'next/router';
import useProduct from '../../hooks/useProduct';

import Image from 'next/image';
import { Typography, Box, Button } from '@mui/material';

import UserNavBar from '../../components/NavBar/UserNavBar';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ViewProduct = () => {
  const router = useRouter();
  const { product } = useProduct(router.query.id);

  console.log(product);
  return (
    <>
      <UserNavBar />

      <Box sx={{ padding: 2, display: 'flex', gap: 5 }}>
        <Box>
          <Image
            style={{ borderRadius: 60 }}
            src={product?.productImage}
            width={630}
            height={630}
            alt="Product Image"
          />
        </Box>

        <Box sx={{ marginTop: 4 }}>
          <Typography
            sx={{ fontSize: 55, fontWeight: 'bold', color: 'primary.main' }}
          >
            {product?.name}

            <hr />
            <Box sx={{ backgroundColor: '#f5f5f5', padding: 2 }}>
              <Typography sx={{ fontSize: 20, fontWeight: 'bold' }}>
                Producto certificado
              </Typography>
              <Typography sx={{ fontSize: 20, marginTop: 2 }}>
                La trazabilidad de este producto fue certificada con tecnología
                blockchain
              </Typography>

              <Button
                variant="contained"
                sx={{
                  display: 'flex',
                  gap: 1,
                  alignItems: 'center',
                  marginTop: 2,
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
                <Accordion sx={{ backgroundColor: 'primary.main' }} key={index}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography sx={{ color: '#fff', fontSize: 20 }}>
                      {trazability.name}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box>
                      {trazability.line.map((line, lineIndex) => {
                        if (line.milestones.length > 0) {
                          return (
                            <Typography
                              key={lineIndex}
                              sx={{ color: '#fff', fontSize: 20 }}
                            >
                              <h2>{line.name}</h2>
                              <Box>
                                {line.milestones.map(
                                  (milestone, milestoneIndex) => (
                                    <Box
                                      sx={{ display: 'flex', gap: 2 }}
                                      key={milestoneIndex}
                                    >
                                      <Image
                                        style={{ borderRadius: 20 }}
                                        width={200}
                                        height={200}
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
                            </Typography>
                          );
                        }
                        return null;
                      })}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              );
            }
            return null;
          })}
      </Box>
    </>
  );
};

export default ViewProduct;
