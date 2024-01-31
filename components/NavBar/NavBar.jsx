import { LogoutOutlined, MenuOutlined } from "@mui/icons-material";
import {
  AppBar,
  Grid,
  IconButton,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";
import { AuthContextProvider, useAuth } from "../../context/AuthContext";
import { ConnectWallet } from "@thirdweb-dev/react";
import sideBarStore from "../../store/sideBarStore";
import { useEffect } from "react";
import { useRouter } from "next/router";
import PersonIcon from "@mui/icons-material/Person";
import BackButton from "../Buttons/BackButton";
export const NavBar = ({ drawerWidth }) => {
  const router = useRouter();

  const handleLogout = (e) => {
    try {
      logout();

      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };
  const { user, logout } = useAuth();

  const { onOpen } = sideBarStore();

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user]);

  return (
    <AppBar
      position="fixed"
      sx={{
        width: "100%",
      }}
      // sx={{
      //   width: { sm: `calc(100% - ${drawerWidth}px)` },
      //   ml: { sm: `${drawerWidth}px` },
      // }}
    >
      <BackButton />

      <Toolbar>
        <IconButton
          edge="start"
          sx={{ mr: 2, color: "secondary.main", display: "flex" }}
          // sx={{ mr: 2, color: 'secondary.main', display: { sm: 'none' } }}
        >
          <MenuOutlined onClick={onOpen} />
        </IconButton>

        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignContent="center"
          alignItems="center"
        >
          <Box display={"flex"} flexDirection={"row"}>
            <PersonIcon
              color="secondary"
              sx={{ fontSize: 30, marginRight: 1 }}
            />
            <Typography
              variant="h5"
              noWrap
              component="div"
              sx={{
                textTransform: "uppercase",
                // fontStyle: 'italic',
                fontWeight: "800",
              }}
            >
              {user?.displayName}
            </Typography>
          </Box>

          <Box>
            <ConnectWallet
              btnTitle="Conectar Wallet"
              style={{
                fontSize: "14px",
                textTransform: "uppercase",
                color: "purple",
                fontWeight: "600",
              }}
            />
            <IconButton onClick={handleLogout}>
              <LogoutOutlined color="secondary" />
            </IconButton>
          </Box>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};
