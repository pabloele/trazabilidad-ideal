import React from 'react';
import { useRouter } from 'next/router';
import useProduct from '../../hooks/useProduct';
import { HomeLayout } from '../../layout';
import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import Image from 'next/image';
import { Typography } from '@mui/material';
const ViewProduct = () => {
  const router = useRouter();
  const { product } = useProduct(router.query.id);

  return (
    <HomeLayout>
      <Typography sx={{color:"primary.main", fontSize:24}}>
        Conoce la historia
      </Typography>
      <Timeline
        sx={{
          [`& .${timelineOppositeContentClasses.root}`]: {
            flex: 0,
            padding: 0,
            margin: 0,
          },
        }}
      >
        {product &&
          product.trazability.map((trazability, index) => {
            const hasMilestones = trazability.line.some(
              (line) => line.milestones.length > 0
            );

            if (hasMilestones) {
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
                  <TimelineContent
                    sx={{ backgroundColor: '#fff', color: 'primary.main' }}
                  >
                    <h1>{trazability.name}</h1>
                    <ul>
                      {trazability.line.map((line, lineIndex) => {
                        if (line.milestones.length > 0) {
                          return (
                            <li key={lineIndex}>
                              <h2>{line.name}</h2>
                              <ul>
                                {line.milestones.map(
                                  (milestone, milestoneIndex) => (
                                    <li key={milestoneIndex}>
                                      <Image
                                      width={200}
                                      height={200}
                                        src={milestone.image}
                                        alt={milestone.description}
                                      />
                                      <p>{milestone.description}</p>
                                    </li>
                                  )
                                )}
                              </ul>
                            </li>
                          );
                        }
                        return null;
                      })}
                    </ul>
                  </TimelineContent>
                </TimelineItem>
              );
            }
            return null;
          })}
      </Timeline>
    </HomeLayout>
  );
};

export default ViewProduct;
