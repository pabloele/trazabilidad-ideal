import React, { useState, useEffect, useRef } from 'react';
import TrazabilityLine from '../../components/TrazabilityLine/TrazabilityLine';
import { HomeLayout } from '../../layout';
import {
  Box,
  Typography,
  IconButton,
  Tab,
  Tabs,
  Button,
  Grid,
  useMediaQuery,
} from '@mui/material';
import useProduct from '../../hooks/useProduct';
import { useRouter } from 'next/router';
import Modal from '@mui/material/Modal';
import { AddOutlined } from '@mui/icons-material';
import Trazability from '../../components/Trazability/Trazability';
import TabPanel from '../../components/TabPanel/TabPanel';
import useMilestone from '../../hooks/useMilestone';
import { ethers } from 'ethers';
import { contractAddress, contractAbi } from '../../contract/contract';
import { useAuth } from '../../context/AuthContext';
import { agroupMilestones, uploadIPFS } from '../../contract/toBlockChain';
import ModalDialog from '../../components/Modals/ModalDialog';
import Spinner from '../../components/Spinner/Spinner';
import Swal from 'sweetalert2';
import { useAddress } from '@thirdweb-dev/react';
import { updateProduct } from '../../firebase/controllers/firestoreControllers';
import { v4 } from 'uuid';
import CloseIcon from '@mui/icons-material/Close';
import { productsStore } from '../../store';

const Product = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { product, setProduct, uploadProduct, uploadQr } = useProduct(
    router.query.id
  );
  const { fetchUserProducts, products } = productsStore();

  useEffect(() => {
    const getProducts = async () => {
      if (user && user.uid) {
        const response = await fetchUserProducts(user.uid);
        console.log(response);
      }
    };
    getProducts();
  }, [user]);

  const currentProduct = products.find(
    (product) => product.id === router.query.id
  );

  const [open, setOpen] = useState(false);
  const isSmallScreen = useMediaQuery('(min-width: 600px)');
  const handleClose = () => setOpen(false);
  const handleOpen = () => {
    // setTabActive(0);
    // setSubprocessSelected(null);
    setOpen(true);
  };
  const {
    DialogModal,
    open: openDialog,
    setOpen: setOpenDialog,
  } = ModalDialog();

  if (!product) {
    return (
      <HomeLayout>
        <Box
          container
          sx={{
            height: '90vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Spinner />
        </Box>
      </HomeLayout>
    );
  } else {
    return (
      <HomeLayout>
        {/* <DialogModal txHash={txHash} loading={loading} /> */}

        <Modal open={open} onClose={handleClose} sx={{ width: '100%' }}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: isSmallScreen ? '95%' : '95%',
              height: '90vh',
              overflowY: 'auto',
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              margin: isSmallScreen ? '0' : 'auto',
              textAlign: 'center',
              justifyContent: 'center',
              p: 4,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <CloseIcon
                onClick={() => setOpen(false)}
                sx={{
                  color: 'red',
                  ':hover': {
                    cursor: 'pointer',
                  },
                }}
              />
            </Box>
          </Box>
        </Modal>

        <Box>
          <Typography
            sx={{
              color: 'primary.main',
              fontSize: 24,
            }}
          >
            Cadena de produccion para : {product.name}
            {products}
          </Typography>
          {/* {error && (
            <Typography sx={{ color: '#FF0000', fontSize: 20 }}>
              {error}
            </Typography>
          )} */}
          <Box sx={{ display: 'flex' }}>
            <TrazabilityLine protocol={product.trazability} />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              // onClick={createQRcode}
              // disabled={product?.qrcode ? true : false}
            >
              Crear QR
            </Button>
            <Button
              variant="contained"
              // onClick={handleOpenModal}
              // disabled={product?.status !== "en curso"}
            >
              Certificar en blockchain
            </Button>
          </Box>
        </Box>

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
          onClick={handleOpen}
        >
          <AddOutlined sx={{ fontSize: 30 }} />
        </IconButton>
      </HomeLayout>
    );
  }
};

export default Product;
