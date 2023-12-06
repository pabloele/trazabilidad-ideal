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
import { TrazabilityContent } from '../../components';
import {
  addMilestone,
  addUserProduct,
  deleteUserDoc,
  getUserProducts,
  getUsers,
} from '../../firebase/controllers/firestoreControllers';
import Recent from '../../components/recentProducts/Recent';

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

  useEffect(() => {
    if (!user) router.push('/');
    handleGetProducts(user?.uid);
  }, [user, router]);

  const isMediumScreen = useMediaQuery('(min-width: 600px)');
  return (
    <HomeLayout>
      <h1>TODO: SUSCRIPTION </h1>
    </HomeLayout>
  );
};

export default HomePage;
