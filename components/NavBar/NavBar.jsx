import { LogoutOutlined, MenuOutlined } from "@mui/icons-material";
import {
  AppBar,
  Grid,
  IconButton,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { ConnectWallet } from "@thirdweb-dev/react";
import sideBarStore from "../../store/sideBarStore";
export const NavBar = ({ drawerWidth }) => {
  const handleLogout = (e) => {
    try {
      logout();
    } catch (error) {
      console.log(error);
    }
  };
  const { user, logout } = useAuth();

  const { onOpen } = sideBarStore();

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          sx={{ mr: 2, color: "secondary.main", display: { sm: "none" } }}
        >
          <MenuOutlined onClick={onOpen} />
        </IconButton>

        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" noWrap component="div">
            {user?.displayName}
          </Typography>

          <Box>
            <ConnectWallet btnTitle="Conectar billetera" />
            <IconButton onClick={handleLogout}>
              <LogoutOutlined color="secondary" />
            </IconButton>
          </Box>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};
