import React, { useState } from "react";
import { Box, Button, Grid, Typography, TextField } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { Dropdown } from "@mui/base/Dropdown";
import { Menu } from "@mui/base/Menu";
import { MenuButton as BaseMenuButton } from "@mui/base/MenuButton";
import { MenuItem as BaseMenuItem, menuItemClasses } from "@mui/base/MenuItem";
import { styled } from "@mui/system";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from "@mui/lab/TimelineOppositeContent";
const Trazability = ({ product }) => {
  const productObject = {
    name: product.name,
    title: "",
    description: "",
    company: "",
    images: [],
  };

  const updateProduct = (field, newValue) => {
    // Aquí debes actualizar el producto con el nuevo valor
    // Puedes usar un estado global, Redux, o enviar una solicitud al servidor
    // Por simplicidad, aquí solo actualizamos el campo especificado
    productObject[field] = newValue;

    console.log(productObject);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography sx={{ color: "primary.main", fontSize: 24 }}>
        Crea tu trazabilidad para {product.name}
      </Typography>

      <Box
        sx={{
          bgcolor: "#e7e7e6",
          width: "30rem",
          height: "10rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 2,
        }}
      >
        <Box>
          <ImageIcon sx={{ color: "#9f9f9f", fontSize: "5rem" }} />
        </Box>

        <Box>
          <Typography sx={{ color: "#000" }}>
            Añadir imagen encabezado
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          marginTop: 3,
          color: "primary.main",
          display: "flex",
          gap: 1,
          alignItems: "center",
        }}
      >
        <EditableField
          value={product.title}
          label={"Escribe un titulo"}
          onSave={(newValue) => updateProduct("title", newValue)}
        />
      </Box>

      <Box
        sx={{
          marginTop: 3,
          color: "primary.main",
          display: "flex",
          gap: 1,
          alignItems: "center",
        }}
      >
        <EditableField
          value={product.title}
          label={"Escribe la compañia"}
          onSave={(newValue) => updateProduct("company", newValue)}
        />
      </Box>

      <Typography
        sx={{
          color: "primary.main",
          fontSize: 24,
          fontWeight: "bold",
          marginTop: 4,
        }}
      >
        El producto
      </Typography>

      <Box
        sx={{
          marginTop: 2,
          color: "primary.main",
          display: "flex",
          gap: 1,
          alignItems: "center",
        }}
      >
        <EditableField
          label={"Escrible la descripcion"}
          value={productObject.description}
          onSave={(newValue) => updateProduct("description", newValue)}
        />
      </Box>

      <Grid
        container={"true"}
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 1, sm: 2, md: 2 }}
      >
        {[1, 2, 3, 4].map((e, i) => (
          <Grid
            key={i}
            item
            sx={{
              padding: 0,
            }}
          >
            <Box
              sx={{
                bgcolor: "#e7e7e6",
                width: "30rem",
                height: "10rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 2,
              }}
            >
              <Box>
                <ImageIcon sx={{ color: "#9f9f9f", fontSize: "5rem" }} />
              </Box>

              <Box>
                <Typography sx={{ color: "#000" }}>
                  Añadir imagen encabezado
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 3 }}>
        <Dropdown>
          <MenuButton>Agregar contenido</MenuButton>
          <Menu slots={{ listbox: Listbox }}>
            <MenuItem>
              {" "}
              <ImageIcon /> Imagen
            </MenuItem>
            <MenuItem>
              {" "}
              <FormatAlignLeftIcon /> Texto
            </MenuItem>
            <MenuItem>
              {" "}
              <AttachFileIcon /> Adjuntar
            </MenuItem>
          </Menu>
        </Dropdown>
      </Box>

      <Typography
        sx={{
          color: "primary.main",
          fontSize: 24,
          fontWeight: "bold",
          marginTop: 1,
        }}
      >
        La historia
      </Typography>

      <Box>
        <Timeline
          sx={{
            [`& .${timelineOppositeContentClasses.root}`]: {
              flex: 0.2,
            },
          }}
        >
          <TimelineItem>
            <TimelineOppositeContent
              sx={{ m: "auto 0" }}
              align="right"
              variant="body2"
              color="text.secondary"
            ></TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot>
                <ModeEditIcon />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Box
                sx={{
                  border: "1px solid black",
                  width: "620px",
                  height: "183px",
                  padding: "20px",
                  display: "flex",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    bgcolor: "#e7e7e6",
                    width: "114px",
                    height: "110px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 2,
                  }}
                >
                  <Box>
                    <ImageIcon sx={{ color: "#9f9f9f" }} />
                  </Box>

                  <Box>
                    <Typography sx={{ color: "#000" }}>
                      Añadir imagen
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <EditableField label={"Descripcion"} size={15} />
                </Box>
              </Box>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineOppositeContent
              sx={{ m: "auto 0" }}
              align="right"
              variant="body2"
              color="text.secondary"
            ></TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot>
                <ModeEditIcon />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Box
                sx={{
                  border: "1px solid black",
                  width: "620px",
                  height: "183px",
                  padding: "20px",
                  display: "flex",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    bgcolor: "#e7e7e6",
                    width: "114px",
                    height: "110px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 2,
                  }}
                >
                  <Box>
                    <ImageIcon sx={{ color: "#9f9f9f" }} />
                  </Box>

                  <Box>
                    <Typography sx={{ color: "#000" }}>
                      Añadir imagen
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <EditableField label={"Descripcion"} size={15} />
                </Box>
              </Box>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </Box>
    </Box>
  );
};

const EditableField = ({ label, value, onSave, size = 24 }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(value);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    onSave(editedValue);
  };

  return (
    <Box
      sx={{
        color: "primary.main",
        display: "flex",
        gap: 1,
        alignItems: "center",
        marginY: 2,
      }}
    >
      <Typography sx={{ fontSize: size, marginRight: 1 }}>{label}</Typography>
      {/* Mostrar el label aquí */}
      {isEditing ? (
        <TextField
          value={editedValue}
          onChange={(e) => setEditedValue(e.target.value)}
        />
      ) : (
        <Typography sx={{ fontSize: size }}>{editedValue}</Typography>
      )}
      {isEditing ? (
        <Button variant="contained" onClick={handleSaveClick}>
          Guardar
        </Button>
      ) : (
        <ModeEditIcon
          sx={{ fontSize: size, cursor: "pointer" }}
          onClick={handleEditClick}
        />
      )}
    </Box>
  );
};

export default Trazability;

const blue = {
  50: "#F0F7FF",
  100: "#C2E0FF",
  200: "#99CCF3",
  300: "#66B2FF",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E6",
  700: "#0059B3",
  800: "#004C99",
  900: "#003A75",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const Listbox = styled("ul")(
  ({ theme }) => `
    font-family: IBM Plex Sans, sans-serif;
    font-size: 0.875rem;
    box-sizing: border-box;
    padding: 6px;
    margin: 12px 0;
    min-width: 200px;
    border-radius: 12px;
    overflow: auto;
    outline: 0px;
    background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    box-shadow: 0px 4px 30px ${
      theme.palette.mode === "dark" ? grey[900] : grey[200]
    };
    z-index: 1;
    `
);

const MenuItem = styled(BaseMenuItem)(
  ({ theme }) => `
    list-style: none;
    padding: 8px;
    border-radius: 8px;
    cursor: default;
    user-select: none;
    display:flex;
    align-items:center;
    gap:2px;
    &:last-of-type {
      border-bottom: none;
    }
  
    &.${menuItemClasses.focusVisible} {
      outline: 3px solid ${
        theme.palette.mode === "dark" ? blue[600] : blue[200]
      };
      background-color: ${
        theme.palette.mode === "dark" ? grey[800] : grey[100]
      };
      color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    }
  
    &.${menuItemClasses.disabled} {
      color: ${theme.palette.mode === "dark" ? grey[700] : grey[400]};
    }
  
    &:hover:not(.${menuItemClasses.disabled}) {
      background-color: ${theme.palette.mode === "dark" ? blue[900] : blue[50]};
      color: ${theme.palette.mode === "dark" ? blue[100] : blue[900]};
    }
    `
);

const MenuButton = styled(BaseMenuButton)(
  ({ theme }) => `
    font-family: IBM Plex Sans, sans-serif;
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1.5;
    padding: 8px 16px;
    border-radius: 8px;
    color: #ffff;
    transition: all 150ms ease;
    cursor: pointer;
    background: ${theme.palette.mode === "dark" ? "#0330ab" : "#0330ab"};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    color: ${theme.palette.mode === "dark" ? "#fff" : "#fff"};
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  
    &:hover {
      background: ${theme.palette.mode === "dark" ? "#00227F" : "#00227F"};
      border-color: ${theme.palette.mode === "dark" ? grey[600] : grey[300]};
    }
  
    &:active {
      background: ${theme.palette.mode === "dark" ? grey[700] : grey[100]};
    }
  
    &:focus-visible {
      box-shadow: 0 0 0 4px ${
        theme.palette.mode === "dark" ? blue[300] : blue[200]
      };
      outline: none;
    }
    `
);
