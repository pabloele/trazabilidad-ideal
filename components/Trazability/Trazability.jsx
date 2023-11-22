import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  Paper,
  useMediaQuery,
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import Image from 'next/image';
import AddBoxIcon from '@mui/icons-material/AddBox';
import AttachmentIcon from '@mui/icons-material/Attachment';
import styled from 'styled-components';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import ClassIcon from '@mui/icons-material/Class';
import { v4 } from 'uuid';
import HighlightOffSharpIcon from '@mui/icons-material/HighlightOffSharp';
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
  handleImageUpload,
  fileUri,
  milestones,
  setMilestones,
  saveMilestone,
  milestoneBox,
  setMilestoneBox,
  handleFileUpload,
  setShowCategories,
  setBoxIndex,
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

  const handleOpenCategories = (index) => {
    setShowCategories(true);
    setBoxIndex(index);
  };
  const isSmallScreen = useMediaQuery('(min-width: 600px)');

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
          {milestones?.map((e, i) => {
            const index = milestones.length - 1 - i;
            return (
              <React.Fragment key={i}>
                <Box display="flex" flexDirection="row" alignItems="center">
                  <Box
                    display="flex"
                    flexDirection={isSmallScreen ? 'row' : 'column'}
                    key={index}
                    marginY={2}
                  >
                    {/* left */}
                    <Box
                      sx={{
                        borderRadius: isSmallScreen
                          ? '120px 0 0 120px'
                          : '120px 120px 0 0',
                        border: '15px solid',
                        borderColor: 'gray',
                        borderBottom: isSmallScreen ? '' : 'none',
                        borderRight: isSmallScreen ? 'none' : '',
                        height: isSmallScreen ? '240px' : '140px',
                        width: isSmallScreen ? '140px' : '240px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px',
                        display: 'flex',
                        bgcolor: '#e7e7e67a',
                      }}
                    >
                      {/* card actions */}
                      {!isSmallScreen && (
                        <Grid
                          item
                          sx={{
                            padding: 0,
                            margin: 0,
                            alignItems: 'center',
                            justifyContent: 'center',
                            ':hover': {
                              cursor: 'pointer',
                            },
                          }}
                        >
                          <HighlightOffSharpIcon
                            sx={{
                              color: '#c55052',
                              textAlign: 'right',
                              paddingLeft: 1,
                              fontSize: '2.5rem',
                            }}
                            onClick={() => deleteMilestone(index)}
                          />
                        </Grid>
                      )}
                    </Box>
                    {/* center */}
                    <Grid
                      container
                      direction={isSmallScreen ? 'row' : 'column'}
                      gap={4}
                      sx={{
                        border: '15px solid',
                        borderColor: 'gray',
                        borderLeft: isSmallScreen ? 'none' : '',
                        borderRight: isSmallScreen ? 'none' : '',
                        borderTop: isSmallScreen ? '' : 'none',
                        borderBottom: isSmallScreen ? '' : 'none',
                        height: isSmallScreen ? '240px' : '100%',
                        width: isSmallScreen ? '100%' : '240px',
                        bgcolor: '#e7e7e67a',
                      }}
                    >
                      <Grid
                        container
                        alignContent="center"
                        gap={2}
                        direction={isSmallScreen ? 'row' : 'column'}
                        sx={isSmallScreen ? { justifyContent: 'center' } : {}}
                      >
                        {/* image */}
                        <Grid
                          item
                          onClick={() => handleImageUpload(index)}
                          borderRadius={4}
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
                          {fileUri?.length > 0 && fileUri[index] ? (
                            <Image
                              src={fileUri[index]}
                              width={150}
                              height={150}
                              alt={fileUri[index]}
                              style={{
                                objectFit: 'cover',
                                borderRadius: '20px',
                              }}
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
                                newMilestones[index].description =
                                  e.target.value;
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
                                  fontSize: '6rem',
                                  color: '#0330ab',
                                  display: 'flex',
                                }}
                              />
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
                              sx={{
                                marginTop: 3,
                                height: '5rem',
                                overflowY: 'auto',
                              }}
                            >
                              {milestones[index].atachments.map((e, i) => (
                                <Box
                                  key={i}
                                  display={'flex'}
                                  flexDirection={'row'}
                                >
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

                        {milestones[index].name ? (
                          <Grid
                            item
                            width="150px"
                            height="150px"
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            bgcolor="#16161526"
                            borderRadius="20px"
                            onClick={() => handleOpenCategories(index)}
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
                                {milestones[index].name}
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
                            onClick={() => handleOpenCategories(index)}
                          >
                            <ClassIcon
                              sx={{ fontSize: '6rem', color: '#0330ab' }}
                            />
                          </Grid>
                        )}
                      </Grid>
                    </Grid>

                    {/* right */}
                    <Box
                      sx={{
                        borderRadius: isSmallScreen
                          ? '0 120px 120px 0'
                          : '0 0 120px  120px',
                        border: '15px solid',
                        borderColor: 'gray',
                        borderTop: isSmallScreen ? '' : 'none',
                        borderLeft: isSmallScreen ? 'none' : '',
                        height: isSmallScreen ? '240px' : '140px',
                        width: isSmallScreen ? '140px' : '240px',
                        padding: '20px',
                        display: 'flex',
                        bgcolor: '#e7e7e67a',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {/* card actions */}
                      {isSmallScreen && (
                        <Grid
                          item
                          sx={{
                            padding: 0,
                            margin: 0,
                            alignItems: 'center',
                            justifyContent: 'center',
                            ':hover': {
                              cursor: 'pointer',
                            },
                          }}
                        >
                          <HighlightOffSharpIcon
                            sx={{
                              color: '#c55052',
                              textAlign: 'right',
                              paddingLeft: 1,
                              fontSize: '2.5rem',
                            }}
                            onClick={() => deleteMilestone(index)}
                          />
                        </Grid>
                      )}
                    </Box>
                  </Box>
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
      </Box>
    </Box>
  );
};

export default Trazability;
