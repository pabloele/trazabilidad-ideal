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
import { useAuth } from "../../context/AuthContext";
import Image from "next/image";

const Trazability = ({
  product,
  subprocessSelected,
  handleImageUpload,
  fileUri,
}) => {
  return (
    <Box sx={{ padding: 4 }}>
      <Box>
        <Timeline
          sx={{
            [`& .${timelineOppositeContentClasses.root}`]: {
              flex: 0,
              padding: 0,
              margin: 0,
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
                  borderRadius: "10px",
                  border: "1px solid black",
                  width: "100%",
                  height: "100%",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Box
                    onClick={handleImageUpload}
                    sx={{
                      ":hover": {
                        cursor: "pointer",
                      },
                      bgcolor: "#e7e7e6",
                      width: "200px",
                      height: "120px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: 2,
                      padding: 0.5,
                    }}
                  >
                    <Box>
                      {fileUri ? (
                        <Image src={fileUri} width={200} height={150} />
                      ) : (
                        <ImageIcon sx={{ color: "#9f9f9f" }} />
                      )}
                    </Box>

                    <Box>
                      {!fileUri && (
                        <Typography sx={{ color: "#000" }}>
                          Añadir imagen
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  <Box>
                    <EditableField label={"Descripcion"} size={15} />
                  </Box>
                </Box>
                {subprocessSelected && (
                  <Typography
                    sx={{
                      textAlign: "center",
                      maxWidth: 200,
                      backgroundColor: "#e1e1e1",
                      borderRadius: 4,
                      padding: "5px",
                      fontSize: 12,
                      color: "primary.main",
                      flex: "1",
                    }}
                  >
                    {subprocessSelected}
                  </Typography>
                )}
              </Box>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: 3,
        }}
      >
        <Dropdown>
          <MenuButton>Agregar contenido</MenuButton>
          <Menu slots={{ listbox: Listbox }}>
            <MenuItem>
              <ImageIcon /> Imagen
            </MenuItem>
            <MenuItem>
              <FormatAlignLeftIcon /> Texto
            </MenuItem>
            <MenuItem>
              <AttachFileIcon /> Adjuntar
            </MenuItem>
          </Menu>
        </Dropdown>
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
  };

  return (
    <>
      <Box
        sx={{
          color: "primary.main",
          display: "flex",
          gap: 1,
          alignItems: "center",
          marginY: 2,
        }}
      >
        {value == "" && (
          <Typography sx={{ fontSize: size, marginRight: 1 }}>
            {label}
          </Typography>
        )}
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
    </>
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
