import { Box, Grid, Typography } from '@mui/material';
import { ConnectWallet } from '@thirdweb-dev/react';
import styles from '../../styles/Login.module.css';
export const AuthLayout = ({ children, title = '' }) => {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: '100vh', backgroundColor: 'primary.main', padding: 4 }}
    >
      <Grid
        item
        className="box-shadow"
        xs={3}
        sx={{
          width: { sm: 450 },
          backgroundColor: 'white',
          padding: 3,
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h5" color="secondary.main" sx={{ mb: 1 }}>
            {title}
          </Typography>

          <ConnectWallet className={styles.connectWallet} />
        </Box>
        {children}
      </Grid>
    </Grid>
  );
};
