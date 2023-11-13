import React, { useState } from "react";
import { Box, Button, Typography, TextareaAutosize } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from "@mui/lab/TimelineOppositeContent";
import Image from "next/image";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DeleteIcon from "@mui/icons-material/Delete";
const Trazability = ({
  subprocessSelected,
  handleImageUpload,
  fileUri,
  milestones,
  setMilestones,
  saveMilestone,
  milestoneBox,
  setMilestoneBox,
}) => {
  const addMilestoneBox = () => {
    setMilestoneBox([...milestoneBox, 1]);
    setMilestones([...milestones, { description: "", image: "" }]);
  };

  const deleteMilestone = (index) => {
    console.log("eskere");
    const updatedMilestones = [...milestones];

    const updateBoxs = [...milestoneBox];

    updateBoxs.splice(index, 1);
    updatedMilestones.splice(index, 1);
    setMilestones(updatedMilestones);
    setMilestoneBox(updateBoxs);
  };

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
          {milestoneBox.map((elemen, index) => (
            <TimelineItem key={index}>
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
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "end",
                      padding: 0,
                      margin: 0,
                      ":hover": {
                        cursor: "pointer",
                      },
                    }}
                  >
                    <DeleteIcon
                      sx={{ color: "red", textAlign: "right" }}
                      onClick={() => deleteMilestone(index)}
                    />
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Box
                      onClick={() => handleImageUpload(index)}
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
                        {fileUri?.length > 0 && fileUri[index] ? (
                          <Image
                            src={fileUri[index]}
                            width={200}
                            height={150}
                            alt="imagen trazabilidad"
                          />
                        ) : (
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                          >
                            <ImageIcon sx={{ color: "#9f9f9f" }} />
                            <Typography sx={{ color: "#000" }}>
                              Añadir imagen
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>

                    <Box>
                      <EditableField
                        label={"Descripcion"}
                        size={15}
                        index={index} // Pasa el índice del milestone actual
                        milestones={milestones}
                        setMilestones={setMilestones}
                      />
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
          ))}
        </Timeline>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <AddBoxIcon
            onClick={addMilestoneBox}
            sx={{
              color: "primary.main",
              ":hover": {
                cursor: "pointer",
              },
            }}
          />
          <Button variant="contained" onClick={saveMilestone}>
            Agregar contenido
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

const EditableField = ({
  label,
  value,
  onSave,
  size = 24,
  milestones,
  setMilestones,
  index,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(value);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setMilestones((prevMilestones) => {
      const newMilestones = [...prevMilestones];
      newMilestones[index].description = editedValue;
      return newMilestones;
    });

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
        {value !== "" && (
          <Typography sx={{ fontSize: size, marginRight: 1 }}>
            {label}
          </Typography>
        )}
        {/* Mostrar el label aquí */}
        {isEditing ? (
          <TextareaAutosize
            minRows={5} // Ajusta este valor al número mínimo de filas deseado
            maxRows={15} // Ajusta este valor al número máximo de filas deseado
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
