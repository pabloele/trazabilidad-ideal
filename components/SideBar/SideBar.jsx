import { Schema } from "@mui/icons-material";
import Link from "next/link";
import FactoryIcon from "@mui/icons-material/Factory";
import SettingsIcon from "@mui/icons-material/Settings";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { HiMiniUser } from "react-icons/hi2";
import {
  AccordionDetails,
  Accordion,
  AccordionSummary,
  Divider,
  Drawer,
  List,
  Toolbar,
  Typography,
  useMediaQuery,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Styles from "./Sidebar.module.css";
import logo from "../../public/images/logo-ideal.png";
import Image from "next/image";
import sideBarStore from "../../store/sideBarStore";
import { useRouter } from "next/router";
import { useAuth } from "../../context/AuthContext";

export const SideBar = ({ drawerWidth = 240 }) => {
  const router = useRouter();
  // const isMobileScreen = useMediaQuery("(min-width: 600px)");
  const isMobileScreen = false;

  const { user } = useAuth();

  const { isOpen, onClose } = sideBarStore();
  const handleHover = (event) => {
    event.currentTarget.classList.add("overlay-hover");
  };

  const handleLeave = (event) => {
    event.currentTarget.classList.remove("overlay-hover");
  };

  return (
    <Drawer
      variant={isMobileScreen ? "permanent" : "temporary"}
      open={isOpen}
      onBackdropClick={onClose}
      sx={{
        width: drawerWidth,
        backgroundColor: "primary.main",
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
        },
      }}
    >
      <Toolbar
        sx={{
          backgroundColor: "primary.main",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Image
          src={logo}
          alt="logo"
          onClick={() => {
            router.push("/home");
          }}
          style={{ cursor: "pointer" }}
        />

        {/* {!isMobileScreen && (
          <CloseIcon
            onClick={onClose}
            sx={{
              position: 'fixed',
              left: drawerWidth,
              color: '#fff',
              fontSize: 40,
              ':hover': {
                cursor: 'pointer',
              },
            }}
          />
        )} */}
      </Toolbar>

      <Divider sx={{ backgroundColor: "#fff" }} />
      <List sx={{ backgroundColor: "primary.main", flexGrow: 1 }}>
        <Box>
          <Box
            onClick={() => {
              router.push("/productos");
              onClose();
            }}
            sx={{
              backgroundColor: "rgba(13, 0, 128, 0.589)",
              cursor: "pointer",
              position: "relative",
              "&:hover::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(13, 0, 128, 0.925)",
                zIndex: 1,
              },
            }}
          >
            <Typography
              sx={{
                color: "#fff",
                display: "flex",
                gap: 1,
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                zIndex: 2,
              }}
            >
              <FactoryIcon sx={{ fontSize: 15, marginRight: 1 }} />
              Producción
              {/* <Box minWidth="2.3rem"></Box> */}
            </Typography>
          </Box>
          <Divider
            sx={{ backgroundColor: "rgba(13, 0, 128, 0.925)", marginY: 1 }}
          />
          <Accordion sx={{ background: "transparent" }}>
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon sx={{ color: "#fff", marginRight: 1 }} />
              }
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
                Trazabilidad
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                display: "flex",
                flexDirection: "column",
                border: "none",
                backgroundColor: "#fff",
                gap: 2,
              }}
            >
              <Link
                className={Styles.link}
                href={"/nueva-produccion"}
                onClick={onClose}
              >
                <Typography>Nueva</Typography>
              </Link>
              <Link
                className={Styles.link}
                href={"/productos/pendiente"}
                onClick={onClose}
              >
                <Typography>En curso</Typography>
              </Link>

              {/* <Link className={Styles.link} href={"/productos/realizado"}>
                Realizadas
              </Link> */}
            </AccordionDetails>
          </Accordion>
        </Box>
        <Divider sx={{ backgroundColor: "#fff", marginY: 1 }} />

        <Box
          onClick={() => {
            router.push("/profile");
          }}
          sx={{
            backgroundColor: "rgba(13, 0, 128, 0.589)",
            cursor: "pointer",
            position: "relative",
            "&:hover::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(13, 0, 128, 0.925)",
              zIndex: 1,
            },
          }}
        >
          <Typography
            sx={{
              color: "#fff",
              display: "flex",
              gap: 1,
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              zIndex: 2,
            }}
          >
            <HiMiniUser sx={{ fontSize: 15 }} />
            Perfil
          </Typography>
        </Box>
        <Divider
          sx={{ backgroundColor: "rgba(13, 0, 128, 0.925)", marginY: 1 }}
        />

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
              {/* <SettingsIcon sx={{ fontSize: 15 }} /> */}
              Usuario
            </Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              display: "flex",
              flexDirection: "column",
              border: "none",
              backgroundColor: "#fff",
              gap: 2,
            }}
          >
            <Link
              className={Styles.link}
              href={`/profile/${user?.uid}`}
              onClick={onClose}
            >
              <Typography>Perfil</Typography>
            </Link>

            <Link
              className={Styles.link}
              href={"https://ideal.org.ar/contacto/"}
              target="_blank"
              onClick={onClose}
            >
              <Typography>Suscripción</Typography>
            </Link>
          </AccordionDetails>
        </Accordion>
      </List>
    </Drawer>
  );
};
