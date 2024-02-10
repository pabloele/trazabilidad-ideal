import { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Avatar,
  Typography,
  Box,
  IconButton,
  Button,
  TextField,
  InputAdornment,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { HomeLayout } from '../../layout';
import { useRouter } from 'next/router';
import useUser from '../../hooks/useUser';
import EditIcon from '@mui/icons-material/Edit';
import { RichText, toolbarOptionsFull, viewOnly } from '../../components';
import { MdOutlineCancel, MdOutlineSave } from 'react-icons/md';
import { IoTextSharp } from 'react-icons/io5';
const Profile = () => {
  const router = useRouter();
  const { user: userAuth } = useAuth();

  const {
    user,
    handleEditImage,
    handleSaveDescription,
    handleSaveHistory,
    handleEditWallpaper,
  } = useUser(router.query.uid);

  const [isHovered, setIsHovered] = useState(false);

  const [isHoveredWallpaper, setIsHoveredWallpaper] = useState(false);
  const [descriptionIsHovered, setDescriptionIsHovered] = useState(false);

  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingHistory, setIsEditingHistory] = useState(false);

  const [description, setDescription] = useState(user?.data?.description);
  const [history, setHistory] = useState(user?.data?.history);

  const handleToggleEditHistory = () => {
    setHistory(user?.data?.history);
    setIsEditingHistory(true);
  };

  const handleSaveWallpaper = async () => {
    await handleEditWallpaper();
  };

  const saveHistory = async () => {
    const sanitizedContent = history.replace(/<[^>]*>/g, '').trim();

    if (sanitizedContent === '') {
      setHistory('');
      handleSaveHistory('');
    } else {
      handleSaveHistory(history);
    }

    setIsEditingHistory(false);
  };

  const handleEditDescription = () => {
    setIsEditingDescription(true);
  };

  const handleCancelEditDescription = () => {
    setIsEditingDescription(false);
    setDescription(user?.data?.description);
  };
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value.slice(0, 140));
  };
  const saveDescription = () => {
    handleSaveDescription(description);
    setIsEditingDescription(false);
  };

  if (!user) {
    return (
      <>
        <HomeLayout>
          <Typography>No se encontro el usuario</Typography>
        </HomeLayout>
      </>
    );
  }

  return (
    <HomeLayout>
      <Container>
        <Grid container>
          {/* Portada */}
          <Grid item xs={12}>
            <Paper
              elevation={3}
              sx={{
                margin: 0,
                padding: 0,
                paddingLeft: 0,
                marginLeft: 0,
                bgcolor: 'purple',
                textAlign: 'center',
                position: 'relative',
                backgroundImage: `url(${user?.data?.wallpaperImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                width: '100%',
                height: '50vh',
              }}
              onMouseEnter={() => setIsHoveredWallpaper(true)}
              onMouseLeave={() => setIsHoveredWallpaper(false)}
            >
              {isHoveredWallpaper && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    width: '100%',
                    height: '50vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    '&:hover': {
                      opacity: 1,
                    },
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ color: '#fff', cursor: 'pointer' }}
                    onClick={handleSaveWallpaper}
                  >
                    Editar
                  </Typography>
                </Box>
              )}
              <Grid container direction="column">
                <Grid
                  item
                  xs={6}
                  display="flex"
                  justifyItems="flex-start"
                  alignItems="flex-start"
                >
                  <Box bgcolor="primary.main" height="20vh"></Box>
                </Grid>
                <Grid
                  item
                  xs={6}
                  display="flex"
                  justifyItems="flex-start"
                  alignItems="flex-start"
                >
                  <Box height="25vh"></Box>

                  <Box
                    sx={{
                      textAlign: 'center',
                      position: 'absolute',
                      bottom: 0,
                      left: '10%',
                      marginBottom: '1rem',
                      backgroundColor: 'rgba(255, 255, 255, 0)',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        position: 'relative',
                      }}
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      <Avatar
                        alt="Foto de perfil"
                        src={
                          user?.data?.profileImg
                            ? user.data.profileImg
                            : '/images/defaultProfile.webp'
                        }
                        sx={{
                          width: '150px',
                          height: '150px',
                          marginLeft: '25%',
                          boxShadow: '0px 0px 10px rgba(0, 1, 0, 1)',
                        }}
                      />

                      {isHovered && user?.uid === userAuth?.uid && (
                        <>
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 0,
                              width: '150px',
                              height: '150px',
                              borderRadius: '50%',
                              marginLeft: '25%',
                              backgroundColor: 'rgba(0, 0, 0, 0.5)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              opacity: 0,
                              transition: 'opacity 0.3s ease',
                              '&:hover': {
                                opacity: 1,
                              },
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              sx={{ color: '#fff', cursor: 'pointer' }}
                              onClick={handleEditImage}
                            >
                              Editar
                            </Typography>
                          </Box>
                        </>
                      )}
                    </Box>

                    <Typography
                      variant="h3"
                      sx={{
                        marginTop: '10px',
                        color: 'whitesmoke',
                        fontWeight: 'bold',
                        textShadow: '2px 2px 4px rgba(1, 1, 1, 1)',
                      }}
                    >
                      {user?.data?.name}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Descripción */}

          <Grid item xs={12} marginTop={2}>
            <Paper
              elevation={3}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                margin: 0,
                padding: 0,
                paddingLeft: 0,
                marginLeft: 0,
                bgcolor: 'whitesmoke',
                textAlign: 'center',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                width: '100%',
                height: 'auto',
                minHeight: '4rem',
              }}
            >
              {isEditingDescription ? (
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <TextField
                    multiline
                    rows={3}
                    fullWidth
                    value={description}
                    onChange={handleDescriptionChange}
                  />
                  <Typography variant="body2" color="textSecondary">
                    {description?.length}/140
                  </Typography>
                  <Box display="flex" flexDirection="row">
                    <IconButton onClick={saveDescription}>
                      <MdOutlineSave />
                    </IconButton>
                    <IconButton onClick={handleCancelEditDescription}>
                      <MdOutlineCancel />
                    </IconButton>
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onMouseEnter={() => setDescriptionIsHovered(true)}
                  onMouseLeave={() => setDescriptionIsHovered(false)}
                >
                  <Typography variant="h5" color="textSecondary">
                    {user?.data?.description
                      ? user.data.description
                      : 'Sin descripción'}
                  </Typography>
                  {descriptionIsHovered && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        width: '100%',
                        height: '4rem',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        '&:hover': {
                          opacity: 1,
                        },
                      }}
                    >
                      <Box
                        display="flex"
                        marginTop="1rem"
                        flexDirection="column"
                        alignContent="center"
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{
                            color: '#fff',
                            cursor: 'pointer',
                            width: '100%',
                            height: '3rem',
                            textAlign: 'center',
                          }}
                          onClick={handleEditDescription}
                        >
                          Editar
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
              )}
            </Paper>
          </Grid>
          {/* Módulo con datos */}
          <Grid item xs={12} marginTop={2}>
            <Paper
              elevation={3}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                margin: 0,
                padding: 0,
                paddingLeft: 0,
                marginLeft: 0,
                bgcolor: 'whitesmoke',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                width: '100%',
                height: 'auto',
                minHeight: '10rem',
              }}
            >
              {isEditingHistory ? (
                <>
                  <RichText
                    toolbarOptions={toolbarOptionsFull}
                    value={history}
                    setValue={setHistory}
                  />
                  <Box display="flex" justifyContent="end" marginTop="1rem">
                    <Button
                      variant="contained"
                      onClick={saveHistory}
                      maxWidth="9rem"
                      sx={{ marginRight: '2rem', marginBottom: '1rem' }}
                    >
                      Guardar
                    </Button>
                  </Box>
                </>
              ) : (
                <>
                  <Typography variant="body2" color="textSecondary">
                    {user?.data?.history ? (
                      <Grid bgcolor="white">
                        <Typography
                          variant="body1"
                          component="div"
                          style={{
                            backgroundColor: 'whitesmoke',
                            color: 'black',
                            padding: '16px',
                          }}
                          dangerouslySetInnerHTML={{
                            __html: user?.data?.history,
                          }}
                        />
                      </Grid>
                    ) : (
                      <Box display="flex" justifyContent="center">
                        <IoTextSharp
                          cursor="pointer"
                          size="4rem"
                          onClick={handleToggleEditHistory}
                        />
                      </Box>
                    )}
                  </Typography>
                  <Box display="flex" justifyContent="center">
                    {user.data.history && !isEditingHistory && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          width: '100%',
                          height: '100%',
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                          '&:hover': {
                            opacity: 1,
                          },
                        }}
                      >
                        <Box
                          display="flex"
                          marginTop="1rem"
                          flexDirection="column"
                          alignContent="center"
                        >
                          <Typography
                            variant="subtitle1"
                            sx={{
                              color: '#fff',
                              cursor: 'pointer',
                              width: '100%',
                              height: '3rem',
                              textAlign: 'center',
                            }}
                            onClick={handleToggleEditHistory}
                          >
                            Editar
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </HomeLayout>
  );
};

export default Profile;
