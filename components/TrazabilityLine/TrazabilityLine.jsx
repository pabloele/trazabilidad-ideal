import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  useMediaQuery,
  Paper,
  Modal,
  Grid,
} from "@mui/material";
import Timeline from "@mui/lab/Timeline";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Trazability from "../Trazability/Trazability";
import { FaLink } from "react-icons/fa";
import styled from "styled-components";
import useAddModalStore from "../../store/useAddModalStore";

const VerticalLine = styled("div")({
  width: "10px",
  height: "2rem",
  background: "purple",
});

export default function TrazabilityLine({ protocol }) {
  const isMediumScreen = useMediaQuery("(min-width: 600px)");
  const timelineWidth = isMediumScreen ? "900px" : "500px";

  const [isGrabbing, setIsGrabbing] = useState(false);

  const {
    onOpen: onOpenMilestoneModal,
    onClose: onCloseMilestoneModal,
    isOpen: isOpenMilestoneModal,
    setTabActive,
    tabActive,
  } = useAddModalStore();

  const [open, setOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);

  const openModal = (milestone) => {
    setOpen(true);
    setSelectedMilestone(milestone);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const handleMouseDown = () => {
    setIsGrabbing(true);
  };

  const handleMouseUp = () => {
    setIsGrabbing(false);
  };

  const handleMouseMove = (e) => {
    if (isGrabbing) {
      const timelineContainer = document.getElementById("timeline-container");
      timelineContainer.scrollLeft -= e.movementX;
      timelineContainer.scrollTop -= e.movementY;
    }
  };

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isGrabbing]);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "95%",
    height: "90vh",
    overflowY: "auto",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    textAlign: "center",
  };

  const handleClickProcess = (value) => {
    onOpenMilestoneModal();

    setTabActive(value);

    console.log(value);
  };

  return (
    <>
      <Modal open={open} onClose={closeModal}>
        <Box sx={style}>
          <Paper sx={{ p: 2 }}>
            {/* <Typography variant="h6">Contenido del Milestone</Typography> */}

            {selectedMilestone &&
              selectedMilestone.map((element, index) => {
                return (
                  <Box
                    key={index}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    paddingY={2}
                  >
                    <Trazability
                      initialMilestone={element}
                      closeModal={closeModal}
                    />
                    {selectedMilestone.length &&
                      selectedMilestone.length - 1 > index && (
                        <Box
                          display={"flex"}
                          flexDirection={"column"}
                          alignItems={"center"}
                          marginY={3}
                        >
                          {/* <VerticalLine /> */}
                          <FaLink
                            fontSize="2rem"
                            style={{
                              backgroundColor: "#524cff",
                              borderRadius: "100%",
                              marginBottom: 2,
                            }}
                          />
                          {/* <VerticalLine /> */}
                        </Box>
                      )}
                  </Box>
                );
              })}
          </Paper>
        </Box>
      </Modal>

      <Box
        sx={{
          height: "100%",
          width: timelineWidth,
          overflow: "hidden",
          cursor: isGrabbing ? "grabbing" : "grab",
        }}
      >
        <Paper
          id="timeline-container"
          sx={{
            overflow: isMediumScreen ? "hidden" : "auto",
            backgroundColor: "beige",
            scrollbarGutter: "auto",
          }}
        >
          <Timeline
            onMouseDown={handleMouseDown}
            sx={{
              [`& .${timelineItemClasses.root}:before`]: {
                flex: 0,
                padding: 0,
              },
            }}
          >
            {/* inicio */}
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <span>
                  <Typography
                    sx={{
                      display: "flex",
                      paddingRight: "1rem",
                      fontSize: "20px",
                      fontWeight: "4",
                      transform: "translateY(-0.2rem)",
                      fontWeight: "bold",
                    }}
                  >
                    Inicio
                  </Typography>
                </span>
              </TimelineContent>
            </TimelineItem>

            {protocol?.map((stage, stageIndex) => {
              return (
                <TimelineItem key={stage.name} sx={{ marginY: "auto" }}>
                  <TimelineSeparator>
                    <TimelineDot />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignContent: "flex-start",
                        transform: "translateY(-0.5rem)",
                        userSelect: "none",
                      }}
                    >
                      <Typography
                        sx={{
                          ":hover": {
                            cursor: "pointer",
                          },
                          display: "flex",
                          paddingRight: "1rem",
                          fontSize: "26px",
                          alignSelf: "center",
                          userSelect: "none",
                        }}
                        onClick={() => handleClickProcess(stageIndex)}
                      >
                        {stage.name}
                      </Typography>
                      {stage.line.map((item, index) => {
                        if (item.milestones.length > 0) {
                          return (
                            <Box
                              onClick={() => openModal(item.milestones)}
                              key={stage.name + item.name}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                userSelect: "none",
                                gap: 1,
                              }}
                            >
                              <HorizontalRuleIcon />
                              <CheckCircleOutlineIcon sx={{ color: "green" }} />

                              <Typography
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  fontSize: "16px",
                                  width: "10rem",
                                  textAlign: "center",
                                  ":hover": {
                                    cursor: "pointer",
                                  },
                                }}
                              >
                                {item.name}
                              </Typography>
                            </Box>
                          );
                        }
                      })}
                    </Box>
                  </TimelineContent>
                </TimelineItem>
              );
            })}

            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot />
                {/* <TimelineConnector /> */}
              </TimelineSeparator>
              <TimelineContent>
                <Typography
                  sx={{
                    display: "flex",
                    paddingRight: "1rem",
                    fontSize: "20px",
                    fontWeight: "4",
                    transform: "translateY(-0.2rem)",
                    fontWeight: "bold",
                  }}
                >
                  Fin
                </Typography>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </Paper>
      </Box>
    </>
  );
}
