import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  TextareaAutosize,
  Grid,
  TextField,
  Paper,
  useMediaQuery,
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from '@mui/lab/TimelineOppositeContent';
import Image from 'next/image';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachmentIcon from '@mui/icons-material/Attachment';
import styled from 'styled-components';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import ClassIcon from '@mui/icons-material/Class';
import { v4 } from 'uuid';

const CustomTextField = styled.textarea`
  width: 100%;
  height: 150px;
  padding: 8px;
  border: 1px solid #cfcdcd28;
  background-color: #cfcdcd28;
  border-radius: 4px;
  outline: none;
  overflow-y: auto;
  resize: none;
`;

const Trazability = ({
  subprocessSelected,
  path,
  handleImageUpload,
  fileUri,
  milestones,
  setMilestones,
  saveMilestone,
  milestoneBox,
  setMilestoneBox,
  handleAddMilestone,
  handleFileUpload,
  showCategories,
  setShowCategories,
  boxIndex,
  setBoxIndex,
}) => {
  const isSmallScreen = useMediaQuery('(max-width: 600px)');
  const isMediumScreen = useMediaQuery('(max-width: 800px)');

  const addMilestoneBox = () => {
    setMilestones([
      ...milestones,
      {
        description: '',
        image: '',
        path: '',
        milestoneUid: v4(),
        atachments: [],
      },
    ]);
  };

  // useEffect(() => {}, [subprocessSelected, path]);}

  const deleteMilestone = (index) => {
    console.log('eskere');
    const updatedMilestones = [...milestones];

    const updateBoxs = [...milestoneBox];

    updateBoxs.splice(index, 1);
    updatedMilestones.splice(index, 1);
    setMilestones(updatedMilestones);
    setMilestoneBox(updateBoxs);
  };

  const [showTextField, setShowTextField] = useState(false);

  const handleTextClick = () => {
    setShowTextField(true);
  };

  const [showAtachmentFields, setShowAtachmentFields] = useState([]);

  const handleClickAtachment = (index) => {
    setShowAtachmentFields((prevAttachmentFields) => {
      const updatedFields = [...prevAttachmentFields];
      updatedFields[index] = true;
      return updatedFields;
    });
    handleFileUpload(index);
  };

  const [description, setDescription] = useState('');

  const handleSaveClick = () => {
    setMilestones((prevMilestones) => {
      const newMilestones = [...prevMilestones];
      newMilestones[index].description = description;
      return newMilestones;
    });
  };

  const handleOpenCategories = (index) => {
    setShowCategories(true);
    setBoxIndex(index);
  };

  return (
    <Box sx={{ padding: 4 }} width="100%">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: 3,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            marginBottom: 2,
            gap: 2,
          }}
        >
          <Button variant="contained" onClick={saveMilestone}>
            Agregar contenido
          </Button>

          <AddBoxIcon
            onClick={addMilestoneBox}
            sx={{
              color: 'primary.main',
              ':hover': {
                cursor: 'pointer',
              },
            }}
          />
        </Box>
      </Box>

      {milestones?.map((e, i) => {
        const index = milestones.length - 1 - i;
        return (
          <Box
            key={i}
            sx={{ display: 'flex', alignContent: 'stretch', marginY: 2 }}
          >
            <Grid
              container
              direction="row"
              alignContent="center"
              justifyContent="space-between"
              marginY={2}
            >
              {/* center */}
              <Grid
                container
                direction="row"
                // xs={12}
                gap={4}
                sx={{
                  backgroundImage: 'url("/images/milestoneBackground.png")',
                  backgroundSize: '100% 100%',
                  alignItems: 'stretch',
                  justifyContent: 'stretch',
                  bgcolor: 'purple',
                }}
              >
                <Grid
                  item
                  xs={1}
                  bgcolor={'purple'}
                  sx={{
                    height: isMediumScreen ? '160px' : '200px',
                  }}
                ></Grid>

                <Grid item xs={1}></Grid>
              </Grid>

              {/* right */}
              {/* 
              <Grid
                container
                xs={1}
                height={'100%'}
                sx={{
                  borderRadius: '0 120px 120px 0',
                  border: '10px solid',
                  borderColor: 'gray',
                  borderLeft: 'none',
                  width: '50vh',
                  marginLeft: '-4px',
                  bgcolor: '#e7e7e67a',
                }}
              > */}
              {/* <Grid
                item
                sx={{
                  padding: 0,
                  margin: 0,
                  ':hover': {
                    cursor: 'pointer',
                  },
                }}
              >
                <DeleteIcon
                  sx={{ color: 'black', textAlign: 'right' }}
                  onClick={() => deleteMilestone(index)}
                />
              </Grid> */}
              {/* </Grid> */}
            </Grid>

            {/* {milestones.length > 1 && index !== 0 && (
              <Image
                width={50}
                height={50}
                src={'/images/chainlink.svg'}
                alt="Chainlink Logo"
              />
            )} */}
          </Box>
        );
      })}
    </Box>
  );
};

export default Trazability;
