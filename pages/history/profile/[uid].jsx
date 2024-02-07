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

import { HomeLayout } from '../../../layout';
import { useRouter } from 'next/router';
import useUser from '../../../hooks/useUser';
import EditIcon from '@mui/icons-material/Edit';
import { RichText, toolbarOptionsFull, viewOnly } from '../../../components';
import { MdOutlineCancel, MdOutlineSave } from 'react-icons/md';
import { IoTextSharp } from 'react-icons/io5';
import { useAuth } from '../../../context/AuthContext';
import BackButton from '../../../components/Buttons/BackButton';
import UserNavBar from '../../../components/NavBar/UserNavBar';
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
    <Grid
      container
      justifyContent="center"
      direction={'column'}
      bgcolor="secondary.main"
    >
      <Grid item>
        <UserNavBar />
      </Grid>
      <Grid container padding={6}>
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
          >
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
                  >
                    <Avatar
                      alt="Foto de perfil"
                      src={`${
                        user?.data?.profileImg
                          ? user.data.profileImg
                          : '/images/defaultProfile.webp'
                      }`}
                      sx={{
                        width: '150px',
                        height: '150px',
                        marginLeft: '25%',

                        boxShadow: '0px 0px 10px rgba(0, 1, 0, 1)',
                      }}
                    />
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
                {/* </Paper> */}
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
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography variant="h5" color="textSecondary">
                {user?.data?.description
                  ? user.data.description
                  : 'Sin descripción'}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        {/* Módulos con datos */}
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
                    <IoTextSharp size="4rem" />
                  </Box>
                )}
              </Typography>
              <Box display="flex" justifyContent="center">
                {user.data.history && (
                  <IconButton onClick={handleToggleEditHistory}>
                    <EditIcon />
                  </IconButton>
                )}
              </Box>
            </>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Profile;
