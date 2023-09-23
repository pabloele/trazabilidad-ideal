import { IconButton, Typography } from '@mui/material';
import { AddOutlined, MailOutlined } from '@mui/icons-material';
import { HomeLayout } from '../../layout';
import { TrazabilityContent } from '../../components/';
const HomePage = () => {
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
