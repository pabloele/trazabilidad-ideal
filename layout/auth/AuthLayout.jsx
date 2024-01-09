import { Box, Grid, Typography } from '@mui/material';
import { ConnectWallet } from '@thirdweb-dev/react';
import logo from '../../public/images/logo-ideal.png';
import Image from 'next/image';
import styles from '../../styles/Login.module.css';
import { useState } from 'react';
export const AuthLayout = ({ children, title = '', logingIn }) => {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        minHeight: '100vh',
        backgroundImage: `url("/images/bg-home.jpg")`,
        backgroundSize: 'cover',
        padding: 4,
      }}
    >
      <Image
        src={logo}
        alt="logo"
        style={{
          marginBottom: 50,
        }}
      />
      {!logingIn && (
        <Grid
          item
          className="box-shadow"
          xs={3}
          sx={{
            width: { sm: 450 },
            backgroundColor: '#ffff',
            padding: 3,
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h5" color="primary.main" sx={{ mb: 1 }}>
              {title}
            </Typography>

            {/* <ConnectWallet className={styles.connectWallet} /> */}
          </Box>
          {children}
        </Grid>
      )}
    </Grid>
  );
};
