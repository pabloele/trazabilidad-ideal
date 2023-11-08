import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/router';
import { addUserProduct } from '../../firebase/controllers/firestoreControllers';
import { useAuth } from '../../context/AuthContext';
import useProtocols from '../../hooks/useProtocols';

const Protocols = () => {
  const { user } = useAuth();

  const { protocols } = useProtocols();

  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [productName, setProductName] = useState('');
  const [protocolSelected, setProtocolSelected] = useState();
  const [loading, setLoading] = useState(false);

  const [trazabilitySelected, setTrazability] = useState();

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    textAlign: 'center',
  };

  const handleClose = () => setOpen(false);

  const handleClickProtocol = async (event) => {
    const nameProtocol = event.target.getAttribute('name');

    const trazability = protocols.find(
      (protocol) => protocol.name === nameProtocol
    );

    setTrazability(trazability.trazability);

    setProtocolSelected(nameProtocol);
    setOpen(true);
  };

  const handleSaveProduct = async () => {
    setLoading(true);

    try {
      const docRef = await addUserProduct(user.uid, {
        name: productName,
        trazability: trazabilitySelected,
        status: 'en curso',
        protocolName: protocolSelected,
      });
      router.push(`/producto/${docRef}`);
    } catch (error) {
      console.error('Error al agregar el documento', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    setProductName(event.target.value);
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Box
            sx={{
              color: '#000',
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: 2,
            }}
          >
            <CloseIcon
              sx={{
                ':hover': {
                  cursor: 'pointer',
                },
              }}
              onClick={handleClose}
            />
          </Box>

          <Box>
            <Typography sx={{ color: 'primary.main' }}>
              Seleccionaste el protocolo:
            </Typography>

            <Typography
              sx={{
                color: 'primary.main',
                marginY: 1,
                fontWeight: 'bold',
                textTransform: 'capitalize',
              }}
            >
              {protocolSelected}
            </Typography>

            <Typography sx={{ color: 'primary.main' }}>
              Ingrese el nombre del producto
            </Typography>
          </Box>

          <Box sx={{ marginY: 2, display: 'flex', flexDirection: 'column' }}>
            <TextField value={productName} onChange={handleInputChange} />

            <Button
              disabled={loading}
              variant="contained"
              sx={{ marginY: 2 }}
              onClick={handleSaveProduct}
            >
              Guardar
            </Button>
          </Box>
        </Box>
      </Modal>
      <Box
        sx={{
          marginTop: 5,
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box sx={{ marginBottom: 2 }}>
          <Typography>Seleccione un protocolo</Typography>
        </Box>

        <Box>
          <Box container sx={{ display: 'flex', gap: 2 }}>
            {protocols?.map((protocol, index) => (
              <Box
                data={protocol.trazability}
                key={index}
                name={protocol.name}
                onClick={handleClickProtocol}
                item
                sx={{
                  backgroundColor: '#e1e1e1',
                  padding: 2,
                  width: 200,
                  height: 100,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': {
                    cursor: 'pointer',
                    color: '#fff',
                    backgroundColor: 'primary.main',
                  },
                  transition: 'all ease .3s',
                }}
              >
                <Typography
                  sx={{ textTransform: 'capitalize' }}
                  name={protocol.name}
                  data={protocol.trazability}
                >
                  {protocol.name}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Protocols;
