import { useEffect, useState } from 'react';
import {
  IconButton,
  useMediaQuery,
  Typography,
  Button,
  Grid,
  TextField,
  Box,
} from '@mui/material';
import { AddOutlined, Image, MailOutlined } from '@mui/icons-material';
import { HomeLayout } from '../../layout';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

import Welcome from '../../components/Welcome/Welcome';

import { TrazabilityContent } from '../../components/';
import mintImg from '../../public/images/nft_8146034.png';

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
  addMilestone,
  addUserProduct,
  createUser,
  deleteUserDoc,
  getUserProducts,
  getUsers,
  updateUser,
} from '../../firebase/controllers/firestoreControllers';

const product = {
  name: 'Vino 1',
  trazability: [
    {
      name: 'Producción primaria',
      line: [
        {
          name: 'Etapa 1',
          milestones: [],
          path: '/vino1/produccion-primaria/etapa1',
        },
        {
          name: 'Etapa 2',
          milestones: [],
          path: '/vino1/produccion-primaria/etapa2',
        },
        {
          name: 'Etapa 3',
          milestones: [],
          path: '/vino1/produccion-primaria/etapa3',
        },
        {
          name: 'Misceláneo',
          milestones: [],
          path: '/vino1/produccion-primaria/misc',
        },
      ],
    },
    {
      name: 'Elaboración',
      line: [
        {
          name: 'Etapa 1',
          milestones: [],
          path: '/vino1/elaboracion/etapa1',
        },
        {
          name: 'Etapa 2',
          milestones: [],
          path: '/vino1/elaboracion/etapa2',
        },
        {
          name: 'Etapa 3',
          milestones: [],
          path: '/vino1/elaboracion/etapa3',
        },
        {
          name: 'Misceláneo',
          milestones: [],
          path: '/vino1/elaboracion/misc',
        },
      ],
    },
    {
      name: 'Despacho',
      line: [
        {
          name: 'Etapa 1',
          milestones: [],
          path: '/vino1/despacho/etapa1',
        },
        {
          name: 'Etapa 2',
          milestones: [],
          path: '/vino1/despacho/etapa2',
        },
        {
          name: 'Etapa 3',
          milestones: [],
          path: '/vino1/despacho/etapa3',
        },
        {
          name: 'Misceláneo',
          milestones: [],
          path: '/vino1/despacho/misc',
        },
      ],
    },
    {
      name: 'Comercialización',
      line: [
        {
          name: 'Etapa 1',
          milestones: [],
          path: '/vino1/comercializacion/etapa1',
        },
        {
          name: 'Etapa 2',
          milestones: [],
          path: '/vino1/comercializacion/etapa2',
        },
        {
          name: 'Etapa 3',
          milestones: [],
          path: '/vino1/comercializacion/etapa3',
        },
        {
          name: 'Misceláneo',
          milestones: [],
          path: '/vino1/comercializacion/misc',
        },
      ],
    },
  ],
};

const activeProduct = 0;

const HomePage = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState();

  const handleGetProducts = async (uid) => {
    const products = await getUserProducts(uid);
    setProducts(products);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const usersDocs = await getUsers();
      setUsers(usersDocs);
    };

    fetchUsers();
  }, []);

  const { user, logout } = useAuth();

  const router = useRouter();
  // user ? console.log('USER    :', user) : console.log('Not logged in');

  useEffect(() => {
    if (!user) router.push('/');
    handleGetProducts(user?.uid);
  }, [user]);

  const isMediumScreen = useMediaQuery('(min-width: 600px)');
  return (
    <HomeLayout>
      <Welcome />
      <button
        onClick={() => {
          createUser({
            uid: user.uid,
            data: { Name: 'Juan Perez', Phone: '1234-1234' },
            products: [],
          });
        }}
      >
        CREAR USUARIO
      </button>
      {/* <button
        onClick={() => {
          updateUser(user.uid, protocol);
        }}
      >
        actualizar USUARIO
      </button> */}
      <button
        onClick={() => {
          addUserProduct(user.uid, product);
        }}
      >
        Agregar producto
      </button>
      <button
        onClick={() => {
          const path = '/vino1/despacho/etapa2';
          const milestone = {
            Description: 'Este es otro proceso hardcodeado',
            image: 'TODO agregar imagen en el storage',
          };
          addMilestone(user.uid, path, milestone);
        }}
      >
        Agregar hito
      </button>
      <button
        onClick={() => {
          handleGetProducts(user.uid);
        }}
      >
        Traer los productos del usuario
      </button>
      <button
        onClick={() => {
          const uid = '1';
          deleteUserDoc(uid);
        }}
      >
        borrar USUARIO
      </button>
      {products && products.length > 0 && (
        <TrazabilityContent protocol={products[activeProduct]?.trazability} />
      )}
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
