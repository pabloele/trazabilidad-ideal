import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { Box, Typography } from '@mui/material';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';

export default function TrazabilityLine({ protocol }) {
  const isMediumScreen = useMediaQuery('(min-width: 500px)');
  return (
    <div
      style={{
        width: {isMediumScreen? '100%': '500px'},
        height: '500px',
        overflow: 'auto',
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
