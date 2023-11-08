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

      <List sx={{ backgroundColor: "primary.main", flexGrow: 1 }}>
        <Box style={{}}>
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
              Proovedores
            </Link>
            <Link className={Styles.link} href={"/"}>
              Clientes
            </Link>

            <Link className={Styles.link} href={"/"}>
              Configuraciones
            </Link>
          </AccordionDetails>
        </Accordion>
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
              flexDirection: "column",
              border: "none",
              backgroundColor: "#fff",
              gap: 2,
            }}
          >
            <Link className={Styles.link} href={"/materias-primas"}>
              Materias primas
            </Link>
            <Link className={Styles.link} href={"/"}>
              Insumos
            </Link>

            <Link className={Styles.link} href={"/"}>
              Produccion
            </Link>
            <Link className={Styles.link} href={"/"}>
              Producto Final
            </Link>
          </AccordionDetails>
        </Accordion>
      </List>
    </Drawer>
  );
};
