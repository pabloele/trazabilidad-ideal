import { LogoutOutlined, MenuOutlined } from "@mui/icons-material";
import {
  AppBar,
  Grid,
  IconButton,
  Toolbar,
  Typography,
  Box,
  useMediaQuery,
} from "@mui/material";
import { AuthContextProvider, useAuth } from "../../context/AuthContext";
import { ConnectWallet } from "@thirdweb-dev/react";
import sideBarStore from "../../store/sideBarStore";
import { useEffect } from "react";
import { useRouter } from "next/router";
import PersonIcon from "@mui/icons-material/Person";
import BackButton from "../Buttons/BackButton";
import Styles from "../SideBar/Sidebar.module.css";
import Link from "next/link";

export const NavBar = ({ drawerWidth }) => {
  const router = useRouter();
  const isNotSmallScreen = useMediaQuery("(min-width: 600px)");
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
    >
      <BackButton />
      <Toolbar>
        <IconButton edge="start" sx={{ mr: 2, color: "secondary.main" }}>
          <MenuOutlined onClick={onOpen} />
        </IconButton>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item>
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              onClick={() => router.push(`/profile/${user?.uid}`)}
              sx={{ cursor: "pointer" }}
            >
              <PersonIcon
                color="secondary"
                sx={{ fontSize: 30, marginRight: 1 }}
              />
              {isNotSmallScreen && (
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{
                    textTransform: "uppercase",
                    fontWeight: "800",
                  }}
                >
                  {user?.displayName}
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item>
            <Grid container alignItems="center">
              <Grid item>
                <ConnectWallet
                  btnTitle="Conectar Wallet"
                  style={{
                    fontSize: "12px",
                    textTransform: "uppercase",
                    color: "purple",
                    fontWeight: "800",
                  }}
                />
              </Grid>
              <Grid item>
                <IconButton onClick={handleLogout}>
                  <LogoutOutlined color="secondary" />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};
