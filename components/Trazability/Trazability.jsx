import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  TextareaAutosize,
  Grid,
  TextField,
  Paper,
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
}) => {
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

  const handleOpenCategories = () => {
    setShowCategories((prev) => !prev);
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
      {milestones.map((e, i) => {
        const index = milestones.length - 1 - i;
        return (
          <React.Fragment key={i}>
            <Box display="flex" flexDirection="row" key={index} marginY={2}>
              {/* left */}
              <Box
                sx={{
                  borderRadius: '120px 0 0 120px',
                  border: '15px solid',
                  borderColor: 'gray',
                  borderRight: 'none',
                  width: '140px',
                  height: '240px',
                  padding: '20px',
                  display: 'flex',
                  bgcolor: '#e7e7e67a',
                }}
              ></Box>
              {/* center */}
              <Grid
                container
                direction="row"
                gap={4}
                sx={{
                  border: '15px solid',
                  borderColor: 'gray',
                  borderLeft: 'none',
                  borderRight: 'none',
                  width: '100%',
                  height: '240px',
                  bgcolor: '#e7e7e67a',
                }}
              >
                <Grid container alignContent="center" gap={2} direction={'row'}>
                  {/* image */}
                  <Grid
                    item
                    onClick={() => handleImageUpload(index)}
                    borderRadius={4}
                    sx={{
                      ':hover': {
                        cursor: 'pointer',
                      },
                      bgcolor: '#16161526',
                      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                      width: '150px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {fileUri?.length > 0 && fileUri[index] ? (
                      <Image
                        src={fileUri[index]}
                        width={150}
                        height={150}
                        alt={fileUri[index]}
                        style={{ objectFit: 'cover', borderRadius: '20px' }}
                      />
                    ) : (
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}
                      >
                        <ImageIcon
                          sx={{ fontSize: '6rem', color: '#0330ab' }}
                        />
                        {/* <Typography sx={{ color: '#000' }}>
                      Añadir imagen
                    </Typography> */}
                      </Box>
                    )}
                  </Grid>
                  {/* fields */}
                  <Grid
                    item
                    width="150px"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    bgcolor="whitesmoke"
                    borderRadius={4}
                  >
                    {showTextField ? (
                      <CustomTextField
                        borderRadius={4}
                        value={milestones[index].description}
                        onChange={(e) => {
                          const newMilestones = [...milestones];
                          newMilestones[index].description = e.target.value;
                          setMilestones(newMilestones);
                        }}
                      />
                    ) : (
                      <Box
                        onClick={handleTextClick}
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: '#16161526',
                          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                          height: '150px',
                          width: '150px',
                          borderRadius: '20px',
                        }}
                      >
                        <EditNoteOutlinedIcon
                          sx={{
                            fontSize: '3rem',
                            color: '#0330ab',
                            display: 'flex',
                          }}
                        />
                        <Typography sx={{ color: '#000' }}>
                          Añadir descripción
                        </Typography>
                      </Box>
                    )}
                  </Grid>

                  {/* Atatchment */}
                  {showAtachmentFields[index] ? (
                    <Grid
                      item
                      width="150px"
                      height="150px"
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      bgcolor="#16161526"
                      borderRadius="20px"
                      direction="column"
                      // onClick={() => handleFileUpload(index)}
                    >
                      <Paper
                        sx={{ marginTop: 3, height: '5rem', overflowY: 'auto' }}
                      >
                        {milestones[index].atachments.map((e, i) => (
                          <Box key={i} display={'flex'} flexDirection={'row'}>
                            {/* <Box></Box> */}
                            <Typography
                              sx={{
                                color: '#000',
                                fontSize: '12px',
                                textAlign: 'center',
                              }}
                              key={i}
                            >
                              {e.name}
                            </Typography>
                            <Typography
                              key={i}
                              style={{
                                color: 'red',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                marginLeft: '0.2rem',
                                textAlign: 'center',
                              }}
                              // onClick={() => handleRemoveAttachment(index, i)}
                            >
                              x
                            </Typography>
                            {/* <Box> */}

                            {/* <span
                          style={{
                            color: 'red',
                            cursor: 'pointer',
                            marginLeft: '0.2rem',
                            textAlign: 'center',
                          }}
                          // onClick={() => handleRemoveAttachment(index, i)}
                        >
                          x
                        </span> */}
                            {/* </Box> */}
                          </Box>
                        ))}
                      </Paper>

                      <AddBoxIcon
                        onClick={() => handleFileUpload(index)}
                        sx={{
                          color: 'primary.main',
                          ':hover': {
                            cursor: 'pointer',
                          },
                          marginBottom: 2,
                        }}
                      />
                    </Grid>
                  ) : (
                    <Grid
                      item
                      width="150px"
                      height="150px"
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      bgcolor="#16161526"
                      borderRadius="20px"
                      onClick={() => handleClickAtachment(index)}
                    >
                      <AttachmentIcon
                        sx={{ fontSize: '6rem', color: '#0330ab' }}
                      />
                    </Grid>
                  )}

                  {subprocessSelected ? (
                    <Grid
                      item
                      width="150px"
                      height="150px"
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      bgcolor="#16161526"
                      borderRadius="20px"
                      onClick={handleOpenCategories}
                    >
                      <Paper
                        sx={{
                          borderRadius: 4,
                        }}
                      >
                        <Typography
                          sx={{
                            textAlign: 'center',
                            maxWidth: 120,
                            backgroundColor: '#e1e1e1',
                            borderRadius: 4,
                            padding: '5px',
                            fontSize: 12,
                            color: 'primary.main',
                            flex: '1',
                          }}
                        >
                          {subprocessSelected}
                        </Typography>
                      </Paper>
                    </Grid>
                  ) : (
                    <Grid
                      item
                      width="150px"
                      height="150px"
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      bgcolor="#16161526"
                      borderRadius="20px"
                      onClick={handleOpenCategories}
                    >
                      <ClassIcon sx={{ fontSize: '6rem', color: '#0330ab' }} />
                    </Grid>
                  )}
                  {/* card actions */}
                  <Grid
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
                  </Grid>
                </Grid>
              </Grid>

              {/* right */}
              <Box
                sx={{
                  borderRadius: '0 120px 120px 0',
                  border: '15px solid',
                  borderColor: 'gray',
                  borderLeft: 'none',
                  width: '140px',
                  height: '240px',
                  padding: '20px',
                  display: 'flex',
                  bgcolor: '#e7e7e67a',
                }}
              ></Box>
            </Box>
            {milestones.length > 1 && index !== 0 && (
              <Image
                width={50}
                height={50}
                src={'/images/chainlink.svg'}
                alt="Chainlink Logo"
              />
            )}
          </React.Fragment>
        );
      })}
    </Box>
  );
};

// const EditableField = ({
//   label,
//   value,
//   onSave,
//   size = 24,
//   milestones,
//   setMilestones,
//   index,
// }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedValue, setEditedValue] = useState(value);

//   const handleEditClick = () => {
//     setIsEditing(true);
//   };

//   const handleSaveClick = () => {
//     setMilestones((prevMilestones) => {
//       const newMilestones = [...prevMilestones];
//       newMilestones[index].description = editedValue;
//       return newMilestones;
//     });

//     setIsEditing(false);
//   };

//   return (
//     <>
//       <Box
//         sx={{
//           color: 'primary.main',
//           display: 'flex',
//           gap: 1,
//           alignItems: 'center',
//           marginY: 2,
//         }}
//       >
//         {value !== '' && (
//           <Typography sx={{ fontSize: size, marginRight: 1 }}>
//             {label}
//           </Typography>
//         )}
//         {/* Mostrar el label aquí */}
//         {isEditing ? (
//           <TextareaAutosize
//             minRows={5}
//             maxRows={15}
//             value={editedValue}
//             onChange={(e) => setEditedValue(e.target.value)}
//           />
//         ) : (
//           <Typography sx={{ fontSize: size }}>{editedValue}</Typography>
//         )}
//         {isEditing ? (
//           <Button variant="contained" onClick={handleSaveClick}>
//             Guardar
//           </Button>
//         ) : (
//           <ModeEditIcon
//             sx={{ fontSize: size, cursor: 'pointer' }}
//             onClick={handleEditClick}
//           />
//         )}
//       </Box>
//     </>
//   );
// };

export default Trazability;
