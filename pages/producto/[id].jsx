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
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import useProduct from '../../hooks/useProduct';
import { useRouter } from 'next/router';
import Modal from '@mui/material/Modal';
import { AddOutlined, Delete } from '@mui/icons-material';
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
import { useProductStore } from '../../store';
import useModalStore from '../../store/useModalStore';
import styled from 'styled-components';
import { FaEdit } from 'react-icons/fa';
import DeleteIcon from '@mui/icons-material/Delete';
const CustomTextField = styled.textarea`
  width: 30%;
  height: 2rem;
  padding: 8px;
  margin-bottom: 2rem;
  border: 1px solid #cfcdcd28;
  background-color: #cfcdcd28;
  border-radius: 4px;
  outline: none;
  overflow-y: hidden;
  resize: none;
`;

const Producto = () => {
  const address = useAddress();

  const isSmallScreen = useMediaQuery('(min-width: 600px)');
  const router = useRouter();
  const { user } = useAuth();

  const { product, setProductData } = useProductStore();

  const [loading, setLoading] = useState(true);
  const [path, setPath] = useState('');
  const [txHash, setTxHash] = useState();
  const [error, setError] = useState();
  const [isEditingProtocol, setIsEditingProtocol] = useState(false);
  const [editingProtocolScreen, setEditingProtocolScreen] = useState('select');
  const [protocolSnapshot, setProtocolSnapshot] = useState({});

  const {
    DialogModal,
    open: openDialog,
    setOpen: setOpenDialog,
  } = ModalDialog();

  const [qrcode, setQrCode] = useState();

  const ref = useRef(null);

  const [tabActive, setTabActive] = useState(0);
  const [open, setOpen] = useState(false);
  const [boxIndex, setBoxIndex] = useState(0);

  const [milestoneBox, setMilestoneBox] = useState([1]);

  const [subprocessSelected, setSubprocessSelected] = useState();
  const [showCategories, setShowCategories] = useState(false);
  const {
    milestones,
    setMilestones,
    handleImageUpload,
    fileUri,
    setFileUri,
    handleAddMilestone,
    handleFileUpload,
  } = useMilestone();

  const { isOpen, onOpen, onClose } = useModalStore();

  const { setProduct, uploadProduct, uploadQr } = useProduct(router.query.id);

  useEffect(() => {
    if (product.trazability?.length > 1) setShowCustomFirsTime(false);
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('qr-code-styling').then((module) => {
        const QRCodeStyling = module.default;

        const qrCodeInstance = new QRCodeStyling({
          width: 120,
          height: 120,
          image: '/images/cropped-logo-ideal-2.png',
          dotsOptions: { type: 'extra-rounded', color: '#000000' },
          imageOptions: {
            hideBackgroundDots: true,
            imageSize: 0.4,
            margin: 0,
          },
        });

        setQrCode(qrCodeInstance);
        if (product?.qrcode) {
          qrCodeInstance.append(ref.current);
          qrCodeInstance.update({ data: product.qrcode });
        }
      });
    }
  }, [product?.qrcode]);

  const onDownloadClick = () => {
    if (!qrcode) return;
    qrcode.download({
      extension: 'png',
    });
  };

  const handleOpen = () => {
    setTabActive(0);
    setSubprocessSelected(null);
    onOpen();
  };

  const handleClose = () => {
    setIsEditingProtocol(false);
    setAddingStageAndProcess(false);
    setEditingProtocolScreen('select');
    onClose();
  };
  const handleClickSubprocess = ({ name, path }) => {
    const updatedMilestones = [...milestones];

    updatedMilestones[boxIndex] = {
      ...updatedMilestones[boxIndex],
      name: name,
      path: path,
    };

    const subprocess = name;

    setSubprocessSelected(subprocess);
    setPath(path);
    setMilestones([...updatedMilestones]);
    setShowCategories(false);
  };

  const handleChange = (event, newValue) => {
    console.log('event', event.target.value);
    console.log('value', newValue);
    setTabActive(newValue);
  };

  const saveMilestone = async (milestone) => {
    if (
      milestone.image === '' ||
      milestone.description === '' ||
      milestone.name === ''
    ) {
      alert(`Descripción, imagen y/o categoría faltantes`);

      return;
    }

    try {
      const selectedStage = product.trazability[tabActive];
      const selectedSubprocess = selectedStage.line.find(
        (sub) => sub.name === subprocessSelected
      );

      milestones.forEach((element, index) => {
        selectedSubprocess.milestones.push(element);
      });

      const updateProduct = { ...product };

      uploadProduct(updateProduct);

      setMilestoneBox([0]);
      setMilestones([
        {
          description: '',
          image: '',
          path: '',
          milestoneUid: v4(),
          atachments: [],
        },
      ]);
      setFileUri('');
      setSubprocessSelected(null);
      setTabActive(null);
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const uploadToBlockChain = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      if (!address)
        throw new Error(
          'Conecte una billetera para certificar la trazabilidad'
        );

      setLoading(true);
      const trazabilidadAgrupada = agroupMilestones(product);

      const trazability = await uploadIPFS(trazabilidadAgrupada);

      const productToIpfs = await uploadIPFS(product);

      const formatProduct = {
        id: router.query.id,
        name: product.name,
        trazability: trazability.path,
        productReference: productToIpfs.path,
      };

      const formatedDescription = `La trazabilidad del producto  "${product.name}" esta certificado con tecnología blockchain gracias a la plataforma de la Fundacion Ideal`;

      const tokenData = {
        name: product.name,
        description: `La trazabilidad del producto  "${product.name}" esta certificado con tecnología blockchain gracias a la plataforma de la Fundacion Ideal`,

        image: product.productImage,
      };

      const tokenDataIPFS = await uploadIPFS(tokenData);

      const signer = provider.getSigner();

      const network = await provider.getNetwork();

      console.log(network);
      if (network.chainId !== Number(process.env.NEXT_PUBLIC_CHAIN_ID)) {
        throw new Error(
          `No estás en la red correcta, por favor seleccione la red ${process.env.NEXT_PUBLIC_NETWORK_NAME.toString()}`
        );
      }

      const trazabilityContract = new ethers.Contract(
        contractAddress,
        contractAbi,
        signer
      );

      try {
        const response = await trazabilityContract.safeMint(
          address,
          formatProduct,
          1,
          tokenDataIPFS.url
        );

        if (txHash) {
          const updated = await updateProduct(
            router.query.id,
            'realizado',
            txHash
          );
        } else {
          console.error('El valor de txHash es undefined.');
        }
      } catch (error) {
        setError(error.reason);

        console.log(error);
      }
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const createQRcode = async () => {
    qrcode.append(ref.current);

    const QRdata = `${process.env.NEXT_PUBLIC_PAGE_URL}/history/${router.query.id}`;
    qrcode.update({
      data: QRdata,
    });
    const response = await uploadQr(product, QRdata);

    setProductData({ ...product, qrcode: QRdata });
  };

  const handleOpenModal = async () => {
    Swal.fire({
      title:
        '¿Seguro que deseas certificar este proceso productivo en la blockchain?',
      text: 'Esta acción no es reversible y será información pública',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Certificar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        setOpenDialog(true);

        try {
          const response = await uploadToBlockChain();
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  useEffect(() => {
    console.log('render');
  }, []);
  const handleBeginCustomProtocol = async () => {
    const trazability = [
      {
        ...product.trazability[0],
        name: initialMilestoneStageAndProtocol.stage,
        line: [
          { name: initialMilestoneStageAndProtocol.process, milestones: [] },
        ],
      },
    ];

    console.log(trazability);
    const updatedProduct = { ...product, trazability };
    console.log(updatedProduct);
    try {
      uploadProduct(updatedProduct);
      setShowCustomFirsTime(false);
    } catch (error) {
      console.log(error);
    }
  };

  const [showCustomFirstTime, setShowCustomFirsTime] = useState(true);
  const [
    initialMilestoneStageAndProtocol,
    setInitialMilestoneStageAndProtocol,
  ] = useState({ stage: '', protocol: '' });

  const handleChangeMilestoneField = (e) => {
    setInitialMilestoneStageAndProtocol((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEditProtocol = () => {
    setIsEditingProtocol(true);
    onOpen();
  };

  const [addingStageAndProcess, setAddingStageAndProcess] = useState({
    stage: '',
    process: '',
  });

  const handleAddStageAndProcess = (e) => {
    const { name, value } = e.target;

    setAddingStageAndProcess((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [selectedValue, setSelectedValue] = useState('');

  // const handleChangeStages = (e) => {
  //   const { name, value } = e.target;

  //   setAddingStageAndProcess((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  const handleDeleteStage = (stageIndex) => {
    const updatedProduct = setProtocolSnapshot((prevProduct) => {
      const updatedTrazability = [...prevProduct?.trazability];

      updatedTrazability.splice(stageIndex, 1);

      const updatedProduct = {
        ...prevProduct,
        trazability: updatedTrazability,
      };
      try {
        uploadProduct(updatedProduct);
      } catch (error) {
        console.log(error);
      }
    });

    router.reload();
  };

  const handleDeleteProcess = (stageIndex, processIndex) => {
    const updatedProduct = setProtocolSnapshot((prevProduct) => {
      const updatedTrazability = [...prevProduct?.trazability];
      updatedTrazability[stageIndex].line.splice(processIndex, 1);
      const updatedProduct = {
        ...prevProduct,
        trazability: updatedTrazability,
      };
      try {
        uploadProduct(updatedProduct);
      } catch (error) {
        console.log(error);
      }
    });
    router.reload();
  };

  const handleEditProcess = (event, stageIndex, processIndex) => {
    const updatedValue = event.target.value;
    setProtocolSnapshot((prevProduct) => {
      const updatedTrazability = [...prevProduct?.trazability];
      updatedTrazability[stageIndex].line[processIndex].name = updatedValue;
      return { ...prevProduct, trazability: updatedTrazability };
    });
  };

  const handleEditStage = (event, stageIndex) => {
    const updatedValue = event.target.value;
    const updatedTrazability = [...protocolSnapshot?.trazability];
    console.log(updatedValue);
    console.log(protocolSnapshot.trazability[stageIndex]);
    // console.log(protocolSnapshot[stageIndex]);
    // console.log(updatedTrazability[stageIndex].line[processIndex].name);
    updatedTrazability[stageIndex] = updatedValue;
    const updatedProduct = {
      ...protocolSnapshot,
      trazability: updatedTrazability,
    };
    setProtocolSnapshot(updatedProduct);
  };

  const handleSaveNewStageAndProcess = async () => {
    const existingStage = product.trazability.find(
      (stage) => stage.name === addingStageAndProcess.stage
    );

    if (existingStage) {
      const updatedStages = product.trazability.map((stage) => {
        if (stage.name === addingStageAndProcess.stage) {
          const updatedLine = [
            ...stage.line,
            { name: addingStageAndProcess.process, milestones: [] },
          ];
          return { ...stage, line: updatedLine };
        }
        return stage;
      });

      const updatedProduct = { ...product, trazability: updatedStages };
      try {
        uploadProduct(updatedProduct);
      } catch (error) {
        console.log(error);
      }
    } else {
      const newStage = {
        name: addingStageAndProcess.stage,
        line: [{ name: addingStageAndProcess.process, milestones: [] }],
        path: v4(),
      };

      const updatedStages = [...product.trazability, newStage];
      const updatedProduct = { ...product, trazability: updatedStages };
      try {
        uploadProduct(updatedProduct);
      } catch (error) {
        console.log(error);
      }
    }

    setIsEditingProtocol(false);
    onClose();
    router.reload();
  };

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
        <DialogModal txHash={txHash} loading={loading} />

        <Modal open={isOpen} onClose={handleClose} sx={{ width: '100%' }}>
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
                onClick={handleClose}
                sx={{
                  color: 'red',
                  ':hover': {
                    cursor: 'pointer',
                  },
                }}
              />
            </Box>
            {isEditingProtocol && !showCustomFirstTime && (
              <>
                {editingProtocolScreen === 'select' && (
                  <Box justifyContent="center">
                    <Typography
                      sx={{
                        color: 'primary.main',
                        fontSize: 24,
                      }}
                    >
                      Agregar, editar o quitar etapas y procesos a tu
                      trazabilidad.
                    </Typography>
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="center"
                      gap="1rem"
                      marginTop="1rem"
                    >
                      <Button
                        onClick={() => {
                          setEditingProtocolScreen('add');
                        }}
                        style={{
                          fontSize: 20,
                          backgroundColor: '#1D45B0',
                          color: 'whitesmoke',
                        }}
                      >
                        Agregar
                      </Button>
                      <Button
                        onClick={() => {
                          setEditingProtocolScreen('editRemove');
                          setProtocolSnapshot({ ...product });
                        }}
                        style={{
                          fontSize: 20,
                          backgroundColor: '#1D45B0',
                          color: 'whitesmoke',
                        }}
                      >
                        Editar o eliminar
                      </Button>
                    </Box>
                  </Box>
                )}

                {editingProtocolScreen.substring(0, 3) === 'add' && (
                  <>
                    {editingProtocolScreen === 'add' && (
                      <Grid container direction="row" height="100%">
                        {/* left */}
                        <Grid item xs={2}></Grid>
                        {/* center */}
                        <Grid
                          item
                          xs={8}
                          justifyContent="center"
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                        >
                          <Typography
                            sx={{
                              color: 'primary.main',
                              fontSize: 24,
                            }}
                          >
                            Selecciona una etapa existente:
                          </Typography>
                          <Select
                            name="stage"
                            value={addingStageAndProcess.stage}
                            onChange={handleAddStageAndProcess}
                            sx={{
                              minWidth: 200,
                              height: '2.5rem',
                              marginRight: 1,
                            }}
                          >
                            {product?.trazability.map((p) => (
                              <MenuItem key={p.name} value={p.name}>
                                {p.name}
                              </MenuItem>
                            ))}
                          </Select>
                          <Typography
                            sx={{
                              color: 'primary.main',
                              fontSize: 20,
                            }}
                          >
                            O bien, puedes agregar una nueva:
                          </Typography>
                          <CustomTextField
                            borderRadius={4}
                            name="stage"
                            value={addingStageAndProcess.stage}
                            onChange={handleAddStageAndProcess}
                          />
                          <br />
                          <Typography
                            sx={{
                              color: 'primary.main',
                              fontSize: 20,
                            }}
                          >
                            Proceso:
                          </Typography>
                          <CustomTextField
                            borderRadius={4}
                            name="process"
                            value={addingStageAndProcess.process}
                            onChange={handleAddStageAndProcess}
                          />

                          <Button
                            onClick={() => {
                              handleSaveNewStageAndProcess();
                            }}
                            style={{
                              display: 'flex',
                              fontSize: 20,
                              backgroundColor: '#1D45B0',
                              color: 'whitesmoke',
                              width: '10rem',
                            }}
                          >
                            Guardar
                          </Button>
                        </Grid>
                        {/* right */}
                        <Grid item xs={2}></Grid>
                      </Grid>
                    )}
                  </>
                )}
                {editingProtocolScreen === 'editRemove' && (
                  <Box
                    justifyContent="center"
                    justifyItems="center"
                    display={'flex'}
                    flexDirection={'column'}
                  >
                    <Typography
                      sx={{
                        color: 'primary.main',
                        fontSize: 20,
                        bgcolor: '#1e46b471',
                      }}
                    >
                      Editar etapas y procesos
                    </Typography>

                    {protocolSnapshot?.trazability?.map((p, index) => (
                      <Box
                        key={p.name}
                        sx={{ margin: 'auto', display: 'inline-block' }}
                      >
                        <List
                          sx={{
                            marginLeft: '20px',
                            color: 'primary.main',
                            textAlign: 'center',
                          }}
                        >
                          <ListItem>
                            <Typography
                              sx={{
                                color: 'primary.main',
                                fontSize: 20,
                                marginRight: 1,
                              }}
                            >
                              Etapa:
                            </Typography>
                            <Box
                              width="50%"
                              display="flex"
                              justifySelf="center"
                            >
                              <CustomTextField
                                display="flex"
                                borderRadius={4}
                                name={p.name}
                                value={p.name}
                                onChange={handleEditStage}
                                style={{ width: '100%', marginBottom: '16px' }}
                              />
                              <IconButton
                                onClick={() => handleDeleteStage(index)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </ListItem>
                          {p.line.map((l, lineIndex) => (
                            <List
                              key={l.name}
                              sx={{
                                display: 'flex',
                              }}
                            >
                              <Typography
                                sx={{
                                  color: 'primary.main',
                                  fontSize: 20,
                                  marginRight: 1,
                                }}
                              >
                                Proceso:
                              </Typography>
                              <Box
                                width="50%"
                                display="flex"
                                justifySelf="center"
                              >
                                <CustomTextField
                                  display="flex"
                                  borderRadius={4}
                                  name={l.name}
                                  value={l.name}
                                  onChange={(e) =>
                                    handleEditProcess(e, index, lineIndex)
                                  }
                                  style={{ width: '100%', marginBottom: '8px' }}
                                />
                                <IconButton
                                  onClick={() =>
                                    handleDeleteProcess(index, lineIndex)
                                  }
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                            </List>
                          ))}
                        </List>
                        {index !== product.trazability.length - 1 && (
                          <Divider />
                        )}
                      </Box>
                    ))}
                  </Box>
                )}
              </>
            )}
            {showCustomFirstTime && (
              <>
                <Box>
                  <Typography
                    sx={{
                      color: 'primary.main',
                      fontSize: 20,
                    }}
                  >
                    Los hitos productivos se estructuran en etapas y procesos
                    (por ejemplo Etapa: Producción - Proceso: Siembra). <br />{' '}
                    Por favor defina la etapa y proceso de su primer hito
                    productivo para comenzar con su trazabilidad.
                  </Typography>
                  <br />
                  <Typography
                    sx={{
                      color: 'primary.main',
                      fontSize: 20,
                    }}
                  >
                    Etapa
                  </Typography>
                  <CustomTextField
                    borderRadius={4}
                    name="stage"
                    value={initialMilestoneStageAndProtocol.stage}
                    onChange={handleChangeMilestoneField}
                  />
                  <br />
                  <Typography
                    sx={{
                      color: 'primary.main',
                      fontSize: 20,
                    }}
                  >
                    Proceso
                  </Typography>
                  <CustomTextField
                    borderRadius={4}
                    name="process"
                    value={initialMilestoneStageAndProtocol.process}
                    onChange={handleChangeMilestoneField}
                  />
                </Box>
                <Button
                  onClick={handleBeginCustomProtocol}
                  style={{
                    fontSize: 20,
                    backgroundColor: '#1D45B0',
                    color: 'whitesmoke',
                  }}
                >
                  Comenzar
                </Button>
              </>
            )}

            {!showCustomFirstTime && !isEditingProtocol && (
              <Box>
                <Typography
                  sx={{
                    color: 'primary.main',
                    fontSize: 24,
                  }}
                >
                  Clasifica y completa los datos del hito productivo
                </Typography>
                <Trazability />
              </Box>
            )}
          </Box>
        </Modal>

        <Box>
          <Box display="flex" flexDirection="row" alignItems="center">
            <Typography
              sx={{
                color: 'primary.main',
                fontSize: 24,
                marginRight: '1rem',
              }}
            >
              {product.name}
            </Typography>
            <FaEdit
              color="#1d77c0"
              size={24}
              onClick={handleEditProtocol}
              style={{ cursor: 'pointer' }}
            />
          </Box>
          {error && (
            <Typography sx={{ color: '#FF0000', fontSize: 20 }}>
              {error}
            </Typography>
          )}
          <Box sx={{ display: 'flex' }}>
            <TrazabilityLine protocol={product.trazability} />
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: isSmallScreen ? 'row' : 'column',
              alignItems: isSmallScreen ? 'flex-start' : 'center',
              justifyContent: 'space-between',
              gap: 2,
              left: isSmallScreen ? 240 : 25,
              marginTop: isSmallScreen ? '0' : '1rem',
            }}
          >
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyItems: 'flex-start',
              }}
            >
              <Button
                variant="contained"
                onClick={createQRcode}
                disabled={product?.qrcode ? true : false}
                sx={{ height: '2.5rem', marginRight: '1rem' }}
              >
                Crear QR
              </Button>
              <Button
                variant="contained"
                onClick={handleOpenModal}
                // disabled={product?.status !== "en curso"}
                sx={{ height: '2.5rem' }}
              >
                Certificar en blockchain
              </Button>
            </Box>
            {product?.qrcode && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  marginTop: isSmallScreen ? '-8rem' : '0',
                }}
              >
                <Box ref={ref}></Box>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                >
                  <Button onClick={onDownloadClick} sx={{ fontSize: 12 }}>
                    Descargar QR
                  </Button>
                  <Button
                    onClick={() => router.push(`/history/${router.query.id}`)}
                    sx={{ fontSize: 12 }}
                  >
                    Visitar trazabilidad
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
        {/* <Box>
          <IconButton
            size="large"
            sx={{
              color: 'white',
              backgroundColor: 'error.main',
              ':hover': { backgroundColor: 'error.main', opacity: 0.9 },
              position: 'fixed',
              right: isSmallScreen ? 145 : 55,
              top: isSmallScreen ? '48vh' : '40vh',
            }}
            onClick={handleOpen}
          >
            <AddOutlined sx={{ fontSize: 50, color: 'whitesmoke' }} />
          </IconButton>
        </Box> */}

        <Button
          variant="contained"
          sx={{
            position: 'fixed',
            top: '0rem',
            right: '5%',
            marginTop: '5rem',
            // zIndex: 9999,
          }}
          onClick={handleOpen}
        >
          NUEVO HITO
        </Button>
        <Box
          sx={{
            position: 'fixed',

            right: isSmallScreen ? 65 : 25,
            top: '50vh',
          }}
        >
          {/* {product?.qrcode && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}
            >
              <Box ref={ref}></Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Button onClick={onDownloadClick} sx={{ fontSize: 12 }}>
                  Descargar QR
                </Button>
                <Button
                  onClick={() => router.push(`/history/${router.query.id}`)}
                  sx={{ fontSize: 12 }}
                >
                  Visitar trazabilidad
                </Button>
              </Box>
            </Box>
          )} */}
        </Box>
      </HomeLayout>
    );
  }
};

export default Producto;
