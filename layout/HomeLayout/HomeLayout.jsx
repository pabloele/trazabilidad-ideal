import { Box } from "@mui/system";
import { NavBar, SideBar } from "../../components";
import { useMediaQuery } from "@mui/material";

const drawerWidth = 200;

export const HomeLayout = ({ children }) => {
  const isNotSmallScreen = useMediaQuery("(min-width: 600px)");
  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "beige",
        // backgroundColor: 'primary.main'
      }}
      className="animate__animated animate__fadeIn animate__faster"
    >
      <NavBar drawerWidth={drawerWidth} />

      <SideBar drawerWidth={drawerWidth} />

      <Box
        component="main"
        sx={{
          backgroundColor: "beige",
          flexGrow: 1,
          p: isNotSmallScreen ? 7 : 0.5,
          paddingTop: isNotSmallScreen ? "" : "3.5rem",
          paddingLeft: isNotSmallScreen ? "" : "1rem",
          marginTop: "3rem",
          marginLeft: isNotSmallScreen ? "2rem" : "0.5rem",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
