import { Schema } from '@mui/icons-material';
import {
  Box,
  Divider,
  Drawer,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import logo from '../../public/images/cropped-logo-ideal-2.png';
import Image from 'next/image';

export const SideBar = ({ drawerWidth = 240 }) => {
  const isMobileScreen = useMediaQuery('(min-width: 500px)');

  return (
    <Drawer
      variant={isMobileScreen ? 'permanent' : 'temporary'}
      open={isMobileScreen}
      sx={{
        width: drawerWidth,
        backgroundColor: 'primary.main',
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
        },
      }}
    >
      <Toolbar sx={{ backgroundColor: 'primary.main' }}>
        <Image src={logo} alt="logo" />
      </Toolbar>
      <Divider />
      <List sx={{ backgroundColor: 'primary.main', flexGrow: 1 }}>
        {['Vino 1', 'Vino 2', 'Vino 3', 'Vino 4'].map((t) => (
          <ListItem key={t} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <Schema />
              </ListItemIcon>
              <Grid container>
                <ListItemText primary={t} />
              </Grid>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};
