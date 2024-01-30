import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import useProtocols from '../../hooks/useProtocols';
import { HomeLayout } from '../../layout';
import ImageIcon from '@mui/icons-material/Image';
import { create } from 'ipfs-http-client';
import Image from 'next/image';
import { addUserProduct } from '../../firebase/controllers/firestoreControllers';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/Spinner/Spinner';
import { Dropdown } from '@mui/base/Dropdown';
import { Menu } from '@mui/base/Menu';
import { MenuButton as BaseMenuButton } from '@mui/base/MenuButton';
import { MenuItem as BaseMenuItem, menuItemClasses } from '@mui/base/MenuItem';
import { styled } from '@mui/system';
import EditNoteIcon from '@mui/icons-material/EditNote';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import {
  uplaodImageIPFS,
  uploadFileToIpfs,
  uploadIPFS,
} from '../../contract/toBlockChain';
import Swal from 'sweetalert2';

const ProtocolPage = () => {
  const router = useRouter();

  const { protocols } = useProtocols();
  const { user } = useAuth();
  const [protocolSelected, setProtocolSelected] = useState();
  const [productName, setProductName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [fileUri, setFileUri] = useState('');
  const [loading, setLoading] = useState(false);
  const [missingFields, setMissingFields] = useState([]);
  const [loadingImage, setLoadingImage] = useState(false);
  const [loadingFile, setLoadingFile] = useState(false);
  const [dynamicFields, setDynamicFields] = useState([]);

  const [error, setError] = useState('');

  const handleFieldChange = (index, value) => {
    setDynamicFields((prevFields) => {
      const updatedFields = [...prevFields];
      updatedFields[index] = { ...updatedFields[index], value: value };
      return updatedFields;
    });
  };

  const handleAddField = (type) => {
    // Solicitar al usuario el nombre del campo

    Swal.fire({
      title: 'Ingrese el nombre del campo',
      text: 'Por ejemplo, certificado, nombre de empresa, etc',
      input: 'text',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Agregar',
      cancelButtonText: 'Cancelar',
      preConfirm: async (fieldName) => {
        if (fieldName !== '') {
          // Crear el nuevo campo
          let newField;
          switch (type) {
            case 'text':
              newField = { type: 'text', value: '', name: fieldName };
              break;
            case 'image':
              newField = { type: 'image', value: '', name: fieldName };
              break;
            case 'file':
              newField = { type: 'file', value: '', name: fieldName };
              break;
            default:
              break;
          }

          if (newField) {
            setDynamicFields((prevFields) => [...prevFields, newField]);
          }
        } else {
          setError('Por favor ingrese el nombre del campo');

          setTimeout(() => {
            setError('');
          }, 3000);
        }
      },
    });
  };

  const handleImageChange = (index, event) => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';

      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
          try {
            const image = await uplaodImageIPFS(file);

            setDynamicFields((prevFields) => {
              const updatedFields = [...prevFields];
              updatedFields[index] = {
                ...updatedFields[index],
                value: image.url,
              };
              return updatedFields;
            });

            console.log(dynamicFields);
          } catch (error) {
            console.error('Error al subir la imagen a IPFS:', error);
          } finally {
            setLoadingImage(false);
          }
        }
      };

      input.click();
    } catch (error) {
      console.error('Error al subir la imagen:', error);
    }
  };

  const handleRemoveField = (index) => {
    setDynamicFields((prevFields) => {
      const updatedFields = [...prevFields];
      updatedFields.splice(index, 1);
      return updatedFields;
    });
  };

  const handleFileChange = async (index, event) => {
    const files = event.target.files;
    const file = files[0];
    try {
      setLoading(true);
      const result = await uploadFileToIpfs(file);

      setDynamicFields((prevFields) => {
        const updatedFields = [...prevFields];
        updatedFields[index] = { ...updatedFields[index], value: result };
        return updatedFields;
      });
    } catch (error) {
      console.log(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (protocols) {
      const findProtocol = protocols.find(
        (protocol) => protocol.name === router.query.protocol
      );

      setProtocolSelected(findProtocol);
    }
  }, [protocols]);

  const validateFields = () => {
    const missing = [];

    if (!productName.trim()) {
      missing.push('Nombre del producto');
    }

    if (!companyName.trim()) {
      missing.push('Empresa');
    }

    if (fileUri === '') {
      missing.push('Imagen del producto');
    }

    setMissingFields(missing);

    setTimeout(() => {
      setMissingFields([]);
    }, 3000);

    return missing.length === 0;
  };

  const handleImageUpload = async () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';

      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
          try {
            setLoadingImage(true);

            const result = await uplaodImageIPFS(file);
            setFileUri(result.url);
          } catch (error) {
            console.error('Error al subir la imagen a IPFS:', error);
          } finally {
            setLoadingImage(false);
          }
        }
      };

      input.click();
    } catch (error) {
      console.error('Error al subir la imagen:', error);
    }
  };

  const handleChange = (field, value) => {
    switch (field) {
      case 'productName':
        setProductName(value);
        break;
      case 'company':
        setCompanyName(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async () => {
    const isValid = validateFields();

    if (isValid) {
      //setLoading(true);

      console.log({
        name: productName,
        trazability: protocolSelected.trazability,
        status: 'en curso',
        protocolName: protocolSelected.name,
        productImage: fileUri,
        company: companyName,
        additionalFields: dynamicFields,
      });
      try {
        const docRef = await addUserProduct(user.uid, {
          name: productName,
          trazability: protocolSelected.trazability,
          status: 'en curso',
          protocolName: protocolSelected.name,
          productImage: fileUri,
          company: companyName,
          additionalFields: dynamicFields,
          firstTime: true,
        });
        router.push(`/producto/${docRef}`);
      } catch (error) {
        console.error('Error al agregar el documento', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const [open, setOpen] = useState(true);
  const handleClose = () => setOpen(false);

  return (
    <HomeLayout>
      <Box sx={{ color: 'primary.main', width: '90%', marginX: 'auto' }}>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignContent="center"
        >
          <Typography sx={{ fontSize: 24, marginY: 2, fontWeight: 'bold' }}>
            Crea tu producto
          </Typography>
          <Typography
            sx={{
              color: 'primary.main',
              fontSize: 20,
              textAlign: 'center',
              marginY: 2,
            }}
          >
            Protocolo seleccionado:
            <span
              style={{
                fontWeight: 'bold',
                marginLeft: '1rem',
                fontSize: '24',
                backgroundColor: '#091492',
                color: 'whitesmoke',
                padding: '1rem',
              }}
            >
              {protocolSelected?.name}
            </span>
          </Typography>
        </Box>

        {missingFields.length > 0 && (
          <Typography sx={{ color: 'error.main', fontSize: 16 }}>
            Por favor, completa los siguientes campos:
            {missingFields.join(', ')}
          </Typography>
        )}

        {error && (
          <Typography sx={{ color: 'error.main', fontSize: 16 }}>
            {error}
          </Typography>
        )}

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ marginTop: 2, marginRight: '2rem' }}>
            <Typography sx={{ color: 'primary.main', fontSize: 20 }}>
              Nombre del producto:
            </Typography>
            <TextField
              size="small"
              autoComplete="off"
              label="Nombre"
              value={productName}
              onChange={(e) => handleChange('productName', e.target.value)}
            />
          </Box>

          <Box sx={{ marginTop: 2 }}>
            <Typography sx={{ color: 'primary.main', fontSize: 20 }}>
              Productor/a:
            </Typography>
            <TextField
              size="small"
              autoComplete="off"
              label="Empresa"
              value={companyName}
              onChange={(e) => handleChange('company', e.target.value)}
            />
          </Box>
        </Box>
        <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}>
          {/* <Typography sx={{ color: 'primary.main', fontSize: 20 }}>
            Imagen del producto
          </Typography> */}
          <Box
            onClick={handleImageUpload}
            sx={{
              backgroundColor: '#e1e1e1',
              width: 480,
              height: 240,
              color: '#000',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              marginTop: 2,
            }}
          >
            {fileUri ? (
              <img
                src={fileUri}
                alt="Uploaded Image"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : loadingImage ? (
              <Spinner />
            ) : (
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignContent="center"
              >
                <Box display="flex" justifyContent="center">
                  <ImageIcon />
                </Box>
                <Typography>Selecciona una imágen</Typography>
              </Box>
            )}
          </Box>

          <Box>
            {dynamicFields.map((field, index) => (
              <Box key={index}>
                {/* Mostrar el nombre del campo */}
                <Typography
                  sx={{ color: 'primary.main', fontSize: 20, marginY: 2 }}
                >
                  {field.name}
                </Typography>

                {/* Renderizar el campo según el tipo */}
                {field.type === 'text' && (
                  <TextField
                    placeholder={field.name}
                    type="text"
                    value={field.value}
                    onChange={(e) => handleFieldChange(index, e.target.value)}
                  />
                )}
                {field.type === 'image' && (
                  <Box
                    onClick={() => handleImageChange(index)}
                    sx={{
                      backgroundColor: '#e1e1e1',
                      width: 240,
                      height: 120,
                      color: '#000',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 2,
                    }}
                  >
                    {field.value ? (
                      <img
                        src={fileUri}
                        alt="Uploaded Image"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : loadingImage ? (
                      <Spinner />
                    ) : (
                      <>
                        <ImageIcon />
                        <Typography>Selecciona una imágen</Typography>
                      </>
                    )}
                  </Box>
                )}
                {field.type === 'file' && (
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(index, e)}
                    style={{ color: 'red', backgroundColor: 'lightgray' }}
                  />
                )}

                <Button
                  sx={{ marginTop: 1, marginLeft: 1 }}
                  variant="contained"
                  color="error"
                  onClick={() => handleRemoveField(index)}
                >
                  Eliminar Campo
                </Button>
              </Box>
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 8,
            marginTop: 4,
            justifyContent: 'space-between',
          }}
        >
          <Dropdown>
            <MenuButton>Agregar un nuevo campo</MenuButton>
            <Menu slots={{ listbox: Listbox }}>
              <MenuItem
                onClick={() => handleAddField('text')}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                Texto <EditNoteIcon />
              </MenuItem>
              <MenuItem
                onClick={() => handleAddField('image')}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                Imagen <ImageIcon />
              </MenuItem>
              <MenuItem
                onClick={() => handleAddField('file')}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                Archivo <AttachFileIcon />
              </MenuItem>
            </Menu>
          </Dropdown>
          <Button variant="contained" onClick={handleSubmit} disabled={loading}>
            Comenzar la trazabilidad
          </Button>
        </Box>
      </Box>
    </HomeLayout>
  );
};
const blue = {
  50: '#F0F7FF',
  100: '#C2E0FF',
  200: '#99CCF3',
  300: '#66B2FF',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E6',
  700: '#0059B3',
  800: '#004C99',
  900: '#003A75',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const Listbox = styled('ul')(
  ({ theme }) => `
    font-family: IBM Plex Sans, sans-serif;
    font-size: 0.875rem;
    box-sizing: border-box;
    padding: 6px;
    margin: 12px 0;
    min-width: 200px;
    border-radius: 12px;
    overflow: auto;
    outline: 0px;
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    box-shadow: 0px 4px 30px ${
      theme.palette.mode === 'dark' ? grey[900] : grey[200]
    };
    z-index: 1;
    `
);

const MenuItem = styled(BaseMenuItem)(
  ({ theme }) => `
    list-style: none;
    padding: 8px;
    border-radius: 8px;
    cursor: default;
    user-select: none;
  
    &:last-of-type {
      border-bottom: none;
    }
  
    &.${menuItemClasses.focusVisible} {
      outline: 3px solid ${
        theme.palette.mode === 'dark' ? blue[600] : blue[200]
      };
      background-color: ${
        theme.palette.mode === 'dark' ? grey[800] : grey[100]
      };
      color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    }
  
    &.${menuItemClasses.disabled} {
      color: ${theme.palette.mode === 'dark' ? grey[700] : grey[400]};
    }
  
    &:hover:not(.${menuItemClasses.disabled}) {
      background-color: ${theme.palette.mode === 'dark' ? blue[900] : blue[50]};
      color: ${theme.palette.mode === 'dark' ? blue[100] : blue[900]};
    }

    &:hover {
      cursor:pointer;
    }
    `
);

const MenuButton = styled(BaseMenuButton)(
  ({ theme }) => `
    font-family: IBM Plex Sans, sans-serif;
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1.5;
    padding: 8px 16px;
    color: white;
    transition: all 150ms ease;
    cursor: pointer;
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? blue[700] : blue[700]};
    color: ${theme.palette.mode === 'dark' ? grey[200] : grey[900]};
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  
    &:hover {
      background: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
      border-color: ${theme.palette.mode === 'dark' ? grey[600] : grey[300]};
    }
  
    &:active {
      background: ${theme.palette.mode === 'dark' ? grey[700] : grey[100]};
    }
  
    &:focus-visible {
      box-shadow: 0 0 0 4px ${
        theme.palette.mode === 'dark' ? blue[300] : blue[200]
      };
      outline: none;
    }
    `
);

export default ProtocolPage;
