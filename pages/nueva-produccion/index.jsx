import { Grid, Box, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import mintImg from '../../public/images/milestone.png';
import { HomeLayout } from '../../layout';
import Protocols from '../../components/Protocols';
import Link from 'next/link';
import HelpIcon from '@mui/icons-material/Help';
import { getUserLimit } from '../../firebase/controllers/firestoreControllers';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';

const AddMilestone = () => {
  const router = useRouter();
  const { user } = useAuth();
useEffect(() => {
  const checkLimit = async () => {
    
    const limit = await getUserLimit(user.uid)
    
   
       if (!limit>0) {
   alert("Ha alcanzado el límite de trazabilidades disponibles");
         router.push("/productos")
         return
       }
  }
  checkLimit()
  return

}, []);
    
    
 
  return (
    <HomeLayout>
      <Box sx={{ color: 'primary.main', width: '90%', marginX: 'auto' }}>
        <Typography sx={{ fontSize: 24, marginY: 2, fontWeight: 'bold' }}>
          ¿Qué vas a producir?
        </Typography>
        <Typography sx={{ fontSize: 20 }}>
          Solo se muestran los protocolos guardados
        </Typography>

        <Grid
          alignItems="center"
          justifyContent="center"
          justifySelf="center"
          height="90vh"
          width="100%px"
          spacing={4}
        >
          <Protocols />
        </Grid>
      </Box>
    </HomeLayout>
  );
};

export default AddMilestone;
