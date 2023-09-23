import { useEffect, useState } from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { Box, Typography, useMediaQuery } from '@mui/material';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';

export default function TrazabilityLine({ protocol }) {
  const isMediumScreen = useMediaQuery('(min-width: 500px)');
  const timelineWidth = isMediumScreen ? '1000px' : '500px';

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(null);
  const [startY, setStartY] = useState(null);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(
      e.pageX - document.getElementById('timeline-container').offsetLeft
    );
    setStartY(
      e.pageY - document.getElementById('timeline-container').offsetTop
    );
    setScrollLeft(document.getElementById('timeline-container').scrollLeft);
    setScrollTop(document.getElementById('timeline-container').scrollTop);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const x =
      e.pageX - document.getElementById('timeline-container').offsetLeft;
    const y = e.pageY - document.getElementById('timeline-container').offsetTop;
    const walkX = (x - startX) * 2;
    const walkY = (y - startY) * 2;
    document.getElementById('timeline-container').scrollLeft =
      scrollLeft - walkX;
    document.getElementById('timeline-container').scrollTop = scrollTop - walkY;
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, startX, startY, scrollLeft, scrollTop]);

  return (
    <div
      id="timeline-container"
      style={{
        width: timelineWidth,
        height: '100%',
        overflow: 'auto',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleMouseDown}
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
            <span>INICIO </span>
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
              <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <Typography
                  sx={{
                    display: 'flex',
                    paddingRight: '1rem',
                    fontSize: '26px',
                  }}
                >
                  {Object.keys(protocolItem)[0]}
                </Typography>
                {protocolItem[Object.keys(protocolItem)[0]].map(
                  (item, index) => (
                    <>
                      {<HorizontalRuleIcon />}
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
                    </>
                  )
                )}
              </Box>
            </TimelineContent>
          </TimelineItem>
        ))}

        {/* ** */}
        {/* <TimelineItem>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>Sleep</TimelineContent>
      </TimelineItem> */}
        {/* fin */}
        {/* <TimelineItem>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>Sleep</TimelineContent>
      </TimelineItem> */}

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
            {/* <TimelineConnector /> */}
          </TimelineSeparator>
          <TimelineContent>FIN</TimelineContent>
        </TimelineItem>
      </Timeline>
    </div>
  );
}
