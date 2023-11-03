import { useEffect, useState } from 'react';
import { Box, Typography, useMediaQuery, Paper, Modal } from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from '@mui/lab/TimelineOppositeContent';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import Image from 'next/image';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
export default function TrazabilityLine({ protocol }) {
  const isMediumScreen = useMediaQuery('(min-width: 600px)');
  const timelineWidth = isMediumScreen ? '1000px' : '500px';

  const [isGrabbing, setIsGrabbing] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedMilestone, setSelectedMilestone] = useState(null);

  const openModal = (milestone) => {
    setSelectedMilestone(milestone);
    setIsModalOpen(true);
    console.log(milestone);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

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
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80vw',
    height: '90vh',
    overflowY: 'auto',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    textAlign: 'center',
  };
  return (
    <>
      <Modal open={isModalOpen} onClose={closeModal}>
        <Box sx={style}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Contenido del Milestone</Typography>

            <Timeline
              sx={{
                [`& .${timelineOppositeContentClasses.root}`]: {
                  flex: 0,
                  padding: 0,
                  margin: 0,
                },
              }}
            >
              {selectedMilestone &&
                selectedMilestone.map((element, index) => {
                  return (
                    <TimelineItem key={index}>
                      <TimelineOppositeContent
                        sx={{ m: 'auto 0' }}
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
                            borderRadius: '10px',
                            border: '1px solid black',
                            width: '100%',
                            height: '100%',
                            padding: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 10,
                            }}
                          >
                            <Box
                              sx={{
                                ':hover': {
                                  cursor: 'pointer',
                                },
                                bgcolor: '#e7e7e6',
                                width: '200px',
                                height: '120px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: 2,
                                padding: 0.5,
                              }}
                            >
                              <Box>
                                {element?.image ? (
                                  <Image
                                    src={element.image}
                                    width={200}
                                    height={150}
                                    alt="image"
                                  />
                                ) : (
                                  <InsertPhotoIcon sx={{ color: '#9f9f9f' }} />
                                )}
                              </Box>
                            </Box>
                          </Box>

                          <Typography>{element.description}</Typography>
                        </Box>
                      </TimelineContent>
                    </TimelineItem>
                  );
                })}
            </Timeline>
          </Paper>
        </Box>
      </Modal>
      <Box
        sx={{
          width: timelineWidth,
          height: '90vh',
          overflow: 'hidden',
          cursor: isGrabbing ? 'grabbing' : 'grab',
        }}
      >
        <Paper
          id="timeline-container"
          sx={{
            height: '100vh',
            overflow: isMediumScreen ? 'hidden' : 'auto',
            backgroundColor: 'beige',
            scrollbarGutter: 'auto',
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
                      display: 'flex',
                      paddingRight: '1rem',
                      fontSize: '20px',
                      fontWeight: '4',
                      transform: 'translateY(-0.2rem)',
                      fontWeight: 'bold',
                    }}
                  >
                    Inicio
                  </Typography>
                </span>
              </TimelineContent>
            </TimelineItem>

            {protocol?.map((stage, stageIndex) => {
              return (
                <TimelineItem key={stage.name} sx={{ marginY: 'auto' }}>
                  <TimelineSeparator>
                    <TimelineDot />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignContent: 'flex-start',
                        transform: 'translateY(-0.5rem)',
                      }}
                    >
                      <Typography
                        sx={{
                          display: 'flex',
                          paddingRight: '1rem',
                          fontSize: '26px',
                          alignSelf: 'center',
                        }}
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
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                              }}
                            >
                              <HorizontalRuleIcon />
                              <CheckCircleOutlineIcon sx={{ color: 'green' }} />

                              <Typography
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  fontSize: '16px',
                                  width: '10rem',
                                  textAlign: 'center',
                                  ':hover': {
                                    cursor: 'pointer',
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
                    display: 'flex',
                    paddingRight: '1rem',
                    fontSize: '20px',
                    fontWeight: '4',
                    transform: 'translateY(-0.2rem)',
                    fontWeight: 'bold',
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
