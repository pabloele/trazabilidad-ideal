import {
  IconButton,
  Typography,
  Button,
  Grid,
  TextField,
  useMediaQuery,
  Box,
} from '@mui/material';
import { AddOutlined, Image, MailOutlined } from '@mui/icons-material';
import { HomeLayout } from '../../layout';
import { TrazabilityContent } from '../../components/';
import mintImg from '../../public/images/nft_8146034.png';

const HomePage = () => {
  const isMediumScreen = useMediaQuery('(min-width: 500px)');
  return (
    <HomeLayout>
      {/* <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignContent: 'center',
          position: 'fixed',
          paddingBottom: 2,
        }}
      >
        <Typography
          fontSize={isMediumScreen ? 36 : 24}
          fontWeight="light"
          sx={{ padding: '1rem', display: 'flex' }}
        >
          Trazabilidad
        </Typography>

        <Button
          sx={{
            padding: 2,
            backgroundColor: 'crypto.main',
            color: 'white.main',
            display: 'flex',
          }}
        >
          <Image
            src={mintImg}
            alt="Mint icon"
            style={{ height: '30px', width: '30px', paddingRight: 3 }}
          />
          {isMediumScreen ? 'Mintear' : ''}
        </Button>
      </Box> */}

      <TrazabilityContent />
      <IconButton
        size="large"
        sx={{
          color: 'white',
          backgroundColor: 'error.main',
          ':hover': { backgroundColor: 'error.main', opacity: 0.9 },
          position: 'fixed',
          right: 50,
          bottom: 50,
        }}
      >
        <AddOutlined sx={{ fontSize: 30 }} />
      </IconButton>
    </HomeLayout>
  );
};

export default HomePage;
