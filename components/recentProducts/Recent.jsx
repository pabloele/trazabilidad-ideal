import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Pagination,
  Paper,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import useProducts from '../../hooks/useProducts';
import { useRouter } from 'next/router';

const Recent = () => {
  const router = useRouter();

  const { user } = useAuth();

  const { products, setProducts } = useProducts();
  const ownerProducts = products.filter(
    (product) => product.ownerUid === user?.uid
  );

  const [page, setPage] = useState(1);
  const productsPerPage = 4;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const startIndex = (page - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const displayedProducts = ownerProducts.slice(startIndex, endIndex);
  if (!ownerProducts) return;
  return (
    <Paper
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.205)',
        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
        padding: '2rem',
        minWidth: '90%',
      }}
    >
      <Box width={'100%'} height={'100%'}>
        <Typography
          sx={{
            fontSize: 20,
            color: 'primary.main',
            marginY: '20px',
            textAlign: 'left',
            fontWeight: 'bold',
          }}
        >
          Trazabilidades recientes
        </Typography>

        <Grid container spacing={3}>
          {displayedProducts.map((product, index) => (
            <React.Fragment key={index}>
              <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                <Paper
                  sx={{
                    borderRadius: '20px',
                    boxShadow: '0 16px 20px 0 rgba(0,0,0,0.2)',
                  }}
                >
                  <Card
                    sx={{
                      position: 'relative',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 16px 20px 0 rgba(0,0,0,0.3)',
                        '&:before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          background: 'rgba(0, 0, 0, 0.3)',
                          borderRadius: '20px',
                          transition: 'opacity 0.3s',
                          pointerEvents: 'none',
                          opacity: 0.6,
                        },
                        '&:hover:before': {
                          opacity: 0.8,
                        },
                      },
                    }}
                    onClick={() => router.push(`/producto/${product.id}`)}
                  >
                    <CardMedia
                      component="img"
                      height="250"
                      image={product.productImage}
                      alt={product.name}
                      sx={{
                        width: '100%',
                        objectFit: 'contain',
                        position: 'relative',
                      }}
                    />
                    <CardContent
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        bgcolor: '#1e46b4e4',
                        borderRadius: '0 0 20px 20px',
                        padding: '12px',
                        transition: 'opacity 0.3s',
                        opacity: 1,
                        // '&:hover': {
                        //   opacity: 0,
                        // },
                      }}
                    >
                      <Typography
                        variant="h5"
                        component="div"
                        color="whitesmoke"
                      >
                        {product.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Paper>
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
        <Box
          sx={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}
        >
          <Pagination
            count={Math.ceil(ownerProducts.length / productsPerPage)}
            page={page}
            onChange={handleChangePage}
            color="primary"
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default Recent;
