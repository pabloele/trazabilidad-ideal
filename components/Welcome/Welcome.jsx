import React from 'react';

import { Grid, Box, Typography, Button } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Recent from '../recentProducts/Recent';
import { FaEthereum } from 'react-icons/fa';
const Welcome = () => {
  const router = useRouter();

  return (
    <Grid
      container
      spacing={0}
      justifyContent="center"
      sx={{
        minHeight: '90vh',
        backgroundColor: 'beige',
        borderRadius: 3,
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          justifyItems: 'center',
        }}
      >
        <Box sx={{ color: 'primary.main' }}>
          <Box sx={{ color: 'primary.main', fontSize: '3rem' }}>
            <FaEthereum />
          </Box>
          {/* <Typography sx={{ fontSize: 20 }}>
            Sistema de trazabilidad blockchain
          </Typography> */}
          <Typography sx={{ fontSize: 30, fontWeight: 'bold' }}>
            Sistema de trazabilidad blockchain
          </Typography>
          {/* <Typography sx={{ fontSize: 30, fontWeight: 'bold' }}>
            ¡Bienvenido!
          </Typography> */}

          <Button
            variant="contained"
            sx={{ marginY: 4 }}
            onClick={() => router.push('/nueva-produccion')}
          >
            Crear una nueva trazabilidad
          </Button>
        </Box>
      </Box>
      <Recent />
    </Grid>
  );
};

export default Welcome;
