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
    (product) => product.ownerUid === user.uid
  );

  const [page, setPage] = useState(1);
  const productsPerPage = 3;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const startIndex = (page - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const displayedProducts = ownerProducts.slice(startIndex, endIndex);
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
          Productos Recientes
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
                    sx={{ borderRadius: '20px' }}
                    onClick={() => router.push(`/producto/${product.id}`)}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={product.productImage}
                      alt={product.name}
                      sx={{
                        width: '100%',
                        height: 'auto',
                        objectFit: 'contain',
                        maxHeight: '150px',
                        bgcolor: '#e7e7e67a',
                      }}
                    />
                    <CardContent sx={{ bgcolor: '#0330abe4' }}>
                      <Typography
                        gutterBottom
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