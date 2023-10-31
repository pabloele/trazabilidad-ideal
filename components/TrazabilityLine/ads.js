<Paper
  id="timeline-container"
  sx={{
    height: '100%',
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
    {/* intermedios */}
    {protocol?.map((protocolItem) => (
      <TimelineItem key={Object.keys(protocolItem)[0].name}>
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
              {Object.keys(protocolItem)[0].name}
            </Typography>
            {protocolItem[Object.keys(protocolItem)[0].line].map(
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
                    {/* todo map multiple milestones*/}
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
</Paper>;
