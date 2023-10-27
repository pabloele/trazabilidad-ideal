import { LogoutOutlined, MenuOutlined } from "@mui/icons-material";
import { AppBar, Grid, IconButton, Toolbar, Typography } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";

export const NavBar = ({ drawerWidth }) => {
  const handleLogout = (e) => {
    try {
      logout();
    } catch (error) {
      console.log(error);
    }
  };
  const { user, logout } = useAuth();
  useEffect(() => {
    user ? console.log("USER    :", user) : console.log("Not logged in");
  }, [user]);
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
          <MenuOutlined />
        </IconButton>

        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" noWrap component="div">
            Bodega 1
          </Typography>
          <IconButton onClick={handleLogout}>
            <LogoutOutlined color="secondary" />
          </IconButton>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};
