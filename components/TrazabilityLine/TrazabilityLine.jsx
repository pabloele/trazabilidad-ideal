import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  useMediaQuery,
  Paper,
  Modal,
  Grid,
} from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from '@mui/lab/TimelineOppositeContent';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import Image from 'next/image';
import Link from 'next/link';
export default function TrazabilityLine({ protocol }) {
  const isMediumScreen = useMediaQuery('(min-width: 600px)');
  const timelineWidth = isMediumScreen ? '900px' : '500px';

  const [isGrabbing, setIsGrabbing] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedMilestone, setSelectedMilestone] = useState(null);

  const openModal = (milestone) => {
    setSelectedMilestone(milestone);
    setIsModalOpen(true);
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
    height: '100%',
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
            {/* <Typography variant="h6">Contenido del Milestone</Typography> */}

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
                        <Box>
                          <Typography
                            sx={{
                              fontSize: 24,
                              textAlign: 'center',
                              marginBottom: 2,
                              color: 'primary.main',
                            }}
                          >
                            {element.name}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            borderRadius: '10px',
                            background: `linear-gradient(to right, #55555545, #0330ab28)`,
                            width: '100%',
                            height: '100%',
                            padding: '20px',
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 2,
                          }}
                        >
                          <Grid
                            container
                            direction={'row'}
                            width={'100%'}
                            spacing={2}
                          >
                            <Grid item xs={4} sm={4} md={4} lg={4}>
                              <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                height="100%"
                              >
                                <Image
                                  src={element.image}
                                  width={200}
                                  height={200}
                                  alt="image"
                                  style={{
                                    objectFit: 'cover',
                                    borderRadius: '10px',
                                  }}
                                />
                              </Box>
                            </Grid>
                            <Grid item xs={1} sm={1} md={1} lg={1}></Grid>
                            <Grid item xs={6} sm={6} md={6} lg={6}>
                              <Typography
                                variant="body1"
                                fontSize={20}
                                color="BlackText"
                              >
                                {element.description}
                              </Typography>

                              {element.atachments && (
                                <>
                                  <Typography
                                    variant="body1"
                                    fontSize={18}
                                    color="BlackText"
                                  >
                                    Archivos adjuntos
                                  </Typography>
                                  {element.atachments.map((element, index) => (
                                    <React.Fragment key={index}>
                                      <Link
                                        target="_blank"
                                        rel="noopener noreferrer "
                                        href={element.url}
                                      >
                                        {element.name}
                                      </Link>
                                    </React.Fragment>
                                  ))}
                                </>
                              )}
                              {/* </Paper> */}
                            </Grid>
                          </Grid>
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
          height: '100%',
          width: timelineWidth,
          overflow: 'hidden',
          cursor: isGrabbing ? 'grabbing' : 'grab',
        }}
      >
        <Paper
          id="timeline-container"
          sx={{
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

                        userSelect: 'none',
                      }}
                    >
                      <Typography
                        sx={{
                          display: 'flex',
                          paddingRight: '1rem',
                          fontSize: '26px',
                          alignSelf: 'center',
                          userSelect: 'none',
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
                                userSelect: 'none',
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
