import { useEffect, useState } from 'react';
import { Box, Typography, useMediaQuery, Paper } from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';

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
      timelineContainer.scrollLeft += e.movementX;
      timelineContainer.scrollTop += e.movementY;
    }
  };

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGrabbing]);

  return (
    <Box
      sx={{
        width: timelineWidth,
        height: '350px',
        overflow: 'hidden',
        cursor: isGrabbing ? 'grabbing' : 'grab',
      }}
    >
      <Paper
        id="timeline-container"
        sx={{
          height: '100%',
          overflow: 'auto',
          backgroundColor: 'beige',
        }}
      >
        <Timeline
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
          {/* intermedios */}
          {protocol?.map((protocolItem) => (
            <TimelineItem key={Object.keys(protocolItem)[0]}>
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
                    {Object.keys(protocolItem)[0]}
                  </Typography>
                  {protocolItem[Object.keys(protocolItem)[0]].map(
                    (item, index) => (
                      <Box
                        key={item}
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignContent: 'start',
                        }}
                      >
                        <HorizontalRuleIcon
                          sx={{ transform: 'translateY(0.5rem)' }}
                        />
                        <Typography
                          key={index}
                          sx={{
                            display: 'flex',
                            paddingX: '1rem',
                            height: '30px',
                            fontSize: '26px',
                          }}
                        >
                          {item}
                        </Typography>
                      </Box>
                    )
                  )}
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
  );
}
