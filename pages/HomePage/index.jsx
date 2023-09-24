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
  const isMediumScreen = useMediaQuery('(min-width: 600px)');
  return (
    <HomeLayout>
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
