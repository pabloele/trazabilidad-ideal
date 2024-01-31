import { Box } from '@mui/system';
import { NavBar, SideBar } from '../../components';

const drawerWidth = 200;

export const HomeLayout = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        backgroundColor: 'beige',
        // backgroundColor: 'primary.main'
      }}
      className="animate__animated animate__fadeIn animate__faster"
    >
      <NavBar drawerWidth={drawerWidth} />

      <SideBar drawerWidth={drawerWidth} />

      <Box
        component="main"
        sx={{ backgroundColor: 'beige', flexGrow: 1, p: 7, marginTop: '3rem' }}
      >
        {children}
      </Box>
    </Box>
  );
};
