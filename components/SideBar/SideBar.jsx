import { Schema } from "@mui/icons-material";
import Link from "next/link";
import FactoryIcon from "@mui/icons-material/Factory";
import {
  AccordionDetails,
  Accordion,
  AccordionSummary,
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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Styles from "./Sidebar.module.css";
import logo from "../../public/images/logo-ideal.png";
import Image from "next/image";

export const SideBar = ({ drawerWidth = 240 }) => {
  const isMobileScreen = useMediaQuery("(min-width: 600px)");

  return (
    <Drawer
      variant={isMobileScreen ? "permanent" : "temporary"}
      open={isMobileScreen}
      sx={{
        width: drawerWidth,
        backgroundColor: "primary.main",
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
        },
      }}
    >
      <Toolbar sx={{ backgroundColor: "primary.main" }}>
        <Image src={logo} alt="logo" />
      </Toolbar>
      <Divider />
      <List sx={{ backgroundColor: "primary.main", flexGrow: 1 }}>
        {/* {["Vino 1", "Vino 2", "Vino 3", "Vino 4"].map((t) => (
          <ListItem key={t} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <Schema />
              </ListItemIcon>
              <Grid container>
                <ListItemText sx={{ color: "secondary.main" }} primary={t} />
              </Grid>
            </ListItemButton>
          </ListItem>
        ))} */}

        <div style={{}}>
          <Accordion sx={{ background: "transparent" }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography
                sx={{
                  color: "#fff",
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
                }}
              >
                <FactoryIcon sx={{ fontSize: 15 }} />
                Administracion
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                display: "flex",
                border: "none",
                backgroundColor: "#fff",
                paddingX: 2,
                paddingY: 2,
              }}
            >
              <Link className={Styles.link} href={"/"}>
                Mis productos
              </Link>
            </AccordionDetails>
          </Accordion>
        </div>
      </List>
    </Drawer>
  );
};
