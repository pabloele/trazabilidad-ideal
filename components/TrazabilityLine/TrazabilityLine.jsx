import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  useMediaQuery,
  Paper,
  Tab,
  Tabs,

} from "@mui/material";
import Timeline from "@mui/lab/Timeline";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

export default function TrazabilityLine({ protocol }) {
  const isMediumScreen = useMediaQuery('(min-width: 600px)');
  const timelineWidth = isMediumScreen ? '1000px' : '500px';

  const [isGrabbing, setIsGrabbing] = useState(false);




  const handleMouseDown = () => {
    setIsGrabbing(true);
  };

  const handleMouseUp = () => {
    setIsGrabbing(false);
  };

  const handleMouseMove = (e) => {
    if (isGrabbing) {
      const timelineContainer = document.getElementById('timeline-container');
      timelineContainer.scrollLeft -= e.movementX;
      timelineContainer.scrollTop -= e.movementY;
    }
  };

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isGrabbing]);

 

  return (
    <>
      
      <Box
        sx={{
          width: timelineWidth,
          height: "90vh",
          overflow: "hidden",
          cursor: isGrabbing ? "grabbing" : "grab",
        }}
      >
        <Paper
          id="timeline-container"
          sx={{
            height: "100vh",
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

            {protocol?.map((stage, stageIndex) => (
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
                    }}
                  >
                    <Typography
                      sx={{
                        display: "flex",
                        paddingRight: "1rem",
                        fontSize: "26px",
                        alignSelf: "center",
                      }}
                    >
                      {stage.name}
                    </Typography>
                    {stage.line.map((item, index) => {
                      if (item.milestones.length > 0) {
                        return (
                          <Box
                            key={stage.name + item.name}
                            sx={{
                              display: "flex",
                              alignItems: "center",
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
                              {/* todo map multiple milestones*/}
                              {item.name}
                            </Typography>
                          </Box>
                        );
                      } else {
                        return (
                          <Box
                            key={item.name}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <HorizontalRuleIcon />
                            <HighlightOffIcon sx={{ color: "red" }} />

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
                              {/* todo map multiple milestones*/}
                              {item.name}
                            </Typography>
                          </Box>
                        );
                      }
                    })}
                  </Box>
                </TimelineContent>
              </TimelineItem>
            ))}

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
