import React from 'react';

import { Grid, Box, Typography, Button } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Recent from '../recentProducts/Recent';
import { FaEthereum } from 'react-icons/fa';
import useProducts from '../../hooks/useProducts';
import { useAuth } from '../../context/AuthContext';

const Welcome = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { products, setProducts } = useProducts();
  const ownerProducts = products.filter(
    (product) => product.ownerUid === user?.uid
  );

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
      <Button
        variant="contained"
        sx={{
          position: 'fixed',
          top: '5rem',
          right: '6%',
          marginTop: '5rem',
          zIndex: 9999,
        }}
        onClick={() => router.push('/nueva-produccion')}
      >
        NUEVA TRAZABILIDAD
      </Button>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          justifyItems: 'center',
        }}
      >
        <Box
          sx={{ color: 'primary.main', display: 'flex', alignItems: 'center' }}
        >
          <Grid container direction="column">
            <Box sx={{ fontSize: '3rem', marginRight: '1rem' }}>
              <FaEthereum />
            </Box>
            <Typography sx={{ fontSize: 30, fontWeight: 'bold' }}>
              Sistema de trazabilidad blockchain
            </Typography>
          </Grid>
        </Box>
      </Box>
      {/* {ownerProducts?.length && <Recent />} */}
    </Grid>
  );
};

export default Welcome;
