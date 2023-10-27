
import { IconButton, useMediaQuery, 
  Typography,
  Button,
  Grid,
  TextField,
  useMediaQuery,
  Box,} from "@mui/material";
import { AddOutlined, Image, MailOutlined } from "@mui/icons-material";
import { HomeLayout } from "../../layout";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import Welcome from "../../components/Welcome/Welcome";

import { AddOutlined, Image, MailOutlined } from '@mui/icons-material';
import { HomeLayout } from '../../layout';
import { TrazabilityContent } from '../../components/';
import mintImg from '../../public/images/nft_8146034.png';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import {
  addDoc,
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore/lite';

import {
  createUser,
  deleteUserDoc,
  getUsers,
  updateUser,
} from '../../firebase/controllers/firestoreControllers';

const protocol = [
  { Prod_pria: ['Hasta Mañana', 'riego', 'etcétera'] },
  { Elaboracion: ['11/11/2022'] },
  { Despacho: ['asduyuyutfs', 'saduifsdf', 'sadfiiiiiisdf'] },
  {
    Compercializacion: [
      'asiiiiidfs',
      'sadfsdiiiiif',
      'sadfsiiiiiidf',
      'sadfsidf',
    ],
  },
];


const HomePage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersDocs = await getUsers();
      setUsers(usersDocs);
    };

    fetchUsers();
  }, []);

  const { user, logout } = useAuth();

  const router = useRouter();
  user ? console.log("USER    :", user) : console.log("Not logged in");

  useEffect(() => {
    if (!user) router.push("/");
  }, [user]);

  const isMediumScreen = useMediaQuery("(min-width: 600px)");
  return (
    <HomeLayout>

      <Welcome />
      {/* <TrazabilityContent /> */}
     

      <button
        onClick={() => {
          createUser({ uid: user.uid, data: protocol });
        }}
      >
        CREAR USUARIO CON EL ARRAY
      </button>

      <button
        onClick={() => {
          updateUser(user.uid, protocol);
        }}
      >
        actualizar USUARIO
      </button>

      <button
        onClick={() => {
          const uid = '1';
          deleteUserDoc(uid);
        }}
      >
        borrar USUARIO
      </button>
      <TrazabilityContent />
      <IconButton
        size="large"
        sx={{
          color: 'white',
          backgroundColor: 'error.main',
          ':hover': { backgroundColor: 'error.main', opacity: 0.9 },
          position: 'fixed',
          right: 50,
          bottom: 50,
        }}
        onClick={() => router.push('/AddMilestone')}
      >
        <AddOutlined sx={{ fontSize: 30 }} />
      </IconButton>

    </HomeLayout>
  );
};

export default HomePage;
