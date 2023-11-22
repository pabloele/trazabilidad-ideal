import { Schema } from "@mui/icons-material";
import Link from "next/link";
import FactoryIcon from "@mui/icons-material/Factory";
import SettingsIcon from "@mui/icons-material/Settings";
import AssignmentIcon from "@mui/icons-material/Assignment";
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
export const SideBar = ({ drawerWidth = 240 }) => {
  const isMobileScreen = useMediaQuery("(min-width: 600px)");

  const { isOpen, onClose } = sideBarStore();

  return (
    <Drawer
      variant={isMobileScreen ? "permanent" : "temporary"}
      open={isOpen}
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
        <Image src={logo} alt="logo" />

        {!isMobileScreen && (
          <CloseIcon
            onClick={onClose}
            sx={{
              position: "fixed",
              left: drawerWidth,
              color: "#fff",
              fontSize: 40,
              ":hover": {
                cursor: "pointer",
              },
            }}
          />
        )}
      </Toolbar>

      <Divider sx={{ backgroundColor: "#fff" }} />
      <List sx={{ backgroundColor: "primary.main", flexGrow: 1 }}>
        <Box style={{}}>
          <Box
            sx={{
              backgroundColor: "primary.main",
            }}
          >
            <Typography
              sx={{
                color: "#fff",
                display: "flex",
                gap: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Producción
            </Typography>
          </Box>
          <Divider sx={{ backgroundColor: "#fff", marginY: 1 }} />
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
                <AssignmentIcon sx={{ fontSize: 15 }} />
                Producción
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
              <Link className={Styles.link} href={"/nueva-produccion"}>
                Nueva
              </Link>
              <Link className={Styles.link} href={"/productos/pendiente"}>
                En curso
              </Link>

              <Link className={Styles.link} href={"/productos/realizado"}>
                Realizadas
              </Link>
            </AccordionDetails>
          </Accordion>
        </Box>
        <Divider sx={{ backgroundColor: "#fff", marginY: 1 }} />

        <Box
          sx={{
            backgroundColor: "primary.main",
          }}
        >
          <Typography
            sx={{
              color: "#fff",
              display: "flex",
              gap: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Configuración
          </Typography>
        </Box>
        <Divider sx={{ backgroundColor: "#fff", marginY: 1 }} />

        {/* <Accordion sx={{ background: "transparent" }}>
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
              <AssignmentIcon sx={{ fontSize: 15 }} />
              Materia prima
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
            <Link className={Styles.link} href={"/"}>
              Ingreso
            </Link>
            <Link className={Styles.link} href={"/"}>
              Historico
            </Link>

            <Link className={Styles.link} href={"/"}>
              Baja de stock
            </Link>
          </AccordionDetails>
        </Accordion> */}
        {/* <Accordion sx={{ background: "transparent" }}>
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
              <AssignmentIcon sx={{ fontSize: 15 }} />
              Insumos
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
            <Link className={Styles.link} href={"/"}>
              Ingreso
            </Link>
            <Link className={Styles.link} href={"/"}>
              Historico
            </Link>

            <Link className={Styles.link} href={"/"}>
              Baja de stock
            </Link>
          </AccordionDetails>
        </Accordion> */}
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
              <SettingsIcon sx={{ fontSize: 15 }} />
              General
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
            <Link className={Styles.link} href={"/"}>
              Certificados
            </Link>

            <Link className={Styles.link} href={"/"}>
              Documentacion de la empresa
            </Link>
          </AccordionDetails>
        </Accordion>
      </List>
    </Drawer>
  );
};
