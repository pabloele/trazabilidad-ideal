import React, { useState, useEffect, useRef, useCallback } from 'react';
import TrazabilityLine from '../../components/TrazabilityLine/TrazabilityLine';
import { HomeLayout } from '../../layout';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Grid,
  useMediaQuery,
  Select,
  MenuItem,
  Divider,
  TextField,
  Tooltip,
} from '@mui/material';
import useProduct from '../../hooks/useProduct';
import { useRouter } from 'next/router';
import Modal from '@mui/material/Modal';
import Trazability from '../../components/Trazability/Trazability';
import { ethers } from 'ethers';
import { contractAddress, contractAbi } from '../../contract/contract';
import { agroupMilestones, uploadIPFS } from '../../contract/toBlockChain';
import ModalDialog from '../../components/Modals/ModalDialog';
import Spinner from '../../components/Spinner/Spinner';
import Swal from 'sweetalert2';
import { useAddress } from '@thirdweb-dev/react';
import {
  addProtocol,
  updateProduct,
} from '../../firebase/controllers/firestoreControllers';
import { v4 } from 'uuid';
import CloseIcon from '@mui/icons-material/Close';
import { useProductStore } from '../../store';
import useModalStore from '../../store/useModalStore';
import { FaEdit } from 'react-icons/fa';
import DeleteIcon from '@mui/icons-material/Delete';
import useAddModalStore from '../../store/useAddModalStore';
import EditIcon from '@mui/icons-material/Edit';
import EditProduct from '../../components/Modals/EditProduct';
import { CustomTextField } from '../../styledComponents/styledComponents';

const Producto = () => {
  const address = useAddress();

  const isSmallScreen = useMediaQuery('(min-width: 600px)');
  const router = useRouter();

  const { product, setProductData } = useProductStore();

  const [oldValue, setOldValue] = useState('');

  const [isEditing, setIsEditing] = useState(false);

  const [openEditModal, setOpenEditModal] = useState(false);

  const {
    onOpen: onOpenMilestoneModal,
    onClose: onCloseMilestoneModal,
    isOpen: isOpenMilestoneModal,
  } = useAddModalStore();

  const [loading, setLoading] = useState(true);
  const [txHash, setTxHash] = useState();
  const [error, setError] = useState();
  const [isEditingProtocol, setIsEditingProtocol] = useState(false);
  const [editingProtocolScreen, setEditingProtocolScreen] = useState('select');
  const [protocolSnapshot, setProtocolSnapshot] = useState({});

  const [editingStates, setEditingStates] = useState(
    Array(protocolSnapshot?.trazability?.length).fill(false)
  );

  const [editingProcess, setEditingProcess] = useState(
    Array(product?.trazability?.map((p) => p.line.length).fill(false))
  );

  const {
    DialogModal,
    open: openDialog,
    setOpen: setOpenDialog,
  } = ModalDialog();

  const [qrcode, setQrCode] = useState();

  const ref = useRef(null);

  const [tabActive, setTabActive] = useState(0);

  const [subprocessSelected, setSubprocessSelected] = useState();

  const { onClose } = useModalStore();

  const {
    uploadProduct,
    uploadQr,
    setProductData: setProduct,
  } = useProduct(router.query.id);

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
    onOpenMilestoneModal();
  };

  const handleClose = () => {
    setIsEditingProtocol(false);
    setAddingStageAndProcess(false);
    setEditingProtocolScreen('select');
    onCloseMilestoneModal();
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
    if (product) {
      if (product.protocolName == 'Diseña tu protocolo' && product.firstTime) {
        setShowCustomFirsTime(true);
      }
    }
  }, [product]);

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

    const updatedProduct = { ...product, trazability, firstTime: false };
    try {
      uploadProduct(updatedProduct);
      setShowCustomFirsTime(false);
    } catch (error) {
      console.log(error);
    }
  };

  const [showCustomFirstTime, setShowCustomFirsTime] = useState(false);

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
    onOpenMilestoneModal();
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

  const handleDeleteStage = (stageIndex) => {
    Swal.fire({
      title: '¿Seguro que deseas eliminar esta etapa?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const updatedProduct = setProtocolSnapshot((prevProduct) => {
          const updatedTrazability = [...prevProduct?.trazability];

          updatedTrazability.splice(stageIndex, 1);

          const updatedProduct = {
            ...prevProduct,
            trazability: updatedTrazability,
          };
          try {
            uploadProduct(updatedProduct);
            setProductData(updatedProduct);
            setEditingProtocolScreen('select');
            onCloseMilestoneModal();
            Swal.fire({
              title: 'Etapa eliminada correctamente!',
              icon: 'success',
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Continuar',
              cancelButtonText: 'Cancelar',
            });
            // onCloseMilestoneModal();
          } catch (error) {
            console.log(error);
          }
        });
      }
    });
  };

  const handleDeleteProcess = (stageIndex, processIndex) => {
    Swal.fire({
      title: '¿Seguro que deseas eliminar este proceso?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const updatedProduct = setProtocolSnapshot((prevProduct) => {
          const updatedTrazability = [...prevProduct?.trazability];
          updatedTrazability[stageIndex].line.splice(processIndex, 1);
          const updatedProduct = {
            ...prevProduct,
            trazability: updatedTrazability,
          };
          try {
            uploadProduct(updatedProduct);
            setProductData(updatedProduct);
            setEditingProtocolScreen('select');

            onCloseMilestoneModal();

            Swal.fire({
              title: 'Proceso eliminado correctamente!',
              icon: 'success',
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Continuar',
              cancelButtonText: 'Cancelar',
            });
            // onCloseMilestoneModal();
          } catch (error) {
            console.log(error);
          }
        });
      }
    });
  };

  const handleEditClick = (index, oldText) => {
    setIsEditing(true);
    const newEditingStates = [...editingStates];
    newEditingStates[index] = true;
    setEditingStates(newEditingStates);

    setOldValue(oldText);
  };

  const handleEditSubprocessClick = (index, lineIndex, oldName) => {
    setIsEditing(true);

    const newEditingProcess = [...editingProcess];

    // Verifica si el array en la posición index existe
    if (!newEditingProcess[index]) {
      newEditingProcess[index] = [];
    }
    newEditingProcess[index][lineIndex] = true;
    setEditingProcess(newEditingProcess);
    setOldValue(oldName);
  };

  const handleEditProcess = (event, stageIndex, processIndex) => {
    // Actualiza el estado local sin afectar el estado global
    const updatedValue = event.target.value;

    setOldValue(updatedValue);
  };

  const handleSaveSubProcessClick = async (index, lineIndex) => {
    try {
      const updatedTrazability = [...protocolSnapshot?.trazability];
      updatedTrazability[index].line[lineIndex].name = oldValue;
      console.log(updatedTrazability[index].line[lineIndex]);
      setProtocolSnapshot((prevSnapshot) => ({
        ...prevSnapshot,
        trazability: updatedTrazability,
      }));
      const response = await uploadProduct({
        ...protocolSnapshot,
        trazability: updatedTrazability,
      });
      const newEditingProcess = [...editingProcess];
      newEditingProcess[index][lineIndex] = false;
      setEditingProcess(newEditingProcess);
      setProductData({ ...product, trazability: updatedTrazability });

      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveProcessClick = async (index, processIndex) => {
    const updatedTrazability = [...protocolSnapshot?.trazability];
    updatedTrazability[index].name = oldValue;

    setProtocolSnapshot((prevSnapshot) => ({
      ...prevSnapshot,
      trazability: updatedTrazability,
    }));

    try {
      const response = await uploadProduct({
        ...product,
        trazability: updatedTrazability,
      });
      setProductData({ ...product, trazability: updatedTrazability });

      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }

    const newEditingStates = [...editingStates];
    newEditingStates[index] = false;
    setEditingStates(newEditingStates);
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
        setProductData(updatedProduct);
        setEditingProtocolScreen('select');
        onCloseMilestoneModal();

        Swal.fire({
          title: 'Agregado correctamente!',
          icon: 'success',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Continuar',
          cancelButtonText: 'Cancelar',
        });
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
        setProductData(updatedProduct);
        setEditingProtocolScreen('select');

        onCloseMilestoneModal();
      } catch (error) {
        console.log(error);
      }
    }

    setIsEditingProtocol(false);
    onClose();
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

        <Modal
          open={isOpenMilestoneModal}
          onClose={handleClose}
          sx={{ width: '100vw', height: '100vh' }}
        >
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
                        bgcolor: 'lightBlue.main',
                      }}
                    >
                      Editar Producto y estructura de etapas y procesos
                    </Typography>

                    {/* <Grid
                      container
                      // display="flex"
                      // flexDirection="column"
                     
                      alignContent="flex-start"
                    > */}

                    {/* <Grid item xs={3.5}></Grid> */}
                    <Grid
                      container
                      xs={12}
                      direction="column"
                      alignItems="center"
                      marginTop="2rem"
                    >
                      <EditProduct
                        isOpen={openEditModal}
                        setIsOpen={setOpenEditModal}
                        product={product}
                        setProductData={setProductData}
                      />
                      {protocolSnapshot?.trazability.map((p, index) => (
                        <>
                          <Grid
                            container
                            key={p.name}
                            direction="row"
                            justifyContent="center"
                            marginY="1rem"
                          >
                            <Grid item>
                              {editingStates[index] ? (
                                <>
                                  <Box key={p.name} sx={{ display: 'flex' }}>
                                    <Typography
                                      sx={{
                                        fontWeight: 'bold',
                                        fontSize: 24,
                                      }}
                                    >
                                      Etapa:
                                    </Typography>
                                    <TextField
                                      label=""
                                      value={oldValue}
                                      onChange={(e) =>
                                        handleEditProcess(e, index)
                                      }
                                    />
                                    <Button
                                      onClick={() =>
                                        handleSaveProcessClick(index)
                                      }
                                    >
                                      Guardar
                                    </Button>
                                  </Box>
                                </>
                              ) : (
                                <>
                                  <Grid
                                    item
                                    key={p.name}
                                    xs={12}
                                    sx={{
                                      display: 'flex',
                                      flexDirection: 'row',
                                      alignContent: 'center',
                                      justifyContent: 'start',
                                      marginY: '1rem',
                                    }}
                                  >
                                    {/* <Typography
                                      sx={{
                                        color: 'primary.main',
                                        fontSize: 20,
                                        marginRight: 1,
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                        alignSelf: 'center',
                                      }}
                                    >
                                      Etapa:
                                    </Typography> */}

                                    <Typography
                                      color="Highlight"
                                      fontSize="20px"
                                      marginTop="0.35rem"
                                      fontWeight="bold"
                                      sx={{
                                        textTransform: 'uppercase',
                                        fontStyle: 'italic',
                                      }}
                                    >
                                      {p.name}
                                    </Typography>
                                    <IconButton
                                      disabled={isEditing}
                                      onClick={() =>
                                        handleEditClick(index, p.name)
                                      }
                                    >
                                      <EditIcon />
                                    </IconButton>
                                    <IconButton
                                      onClick={() => handleDeleteStage(index)}
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </Grid>
                                </>
                              )}
                            </Grid>
                            <Grid
                              container
                              direction="row"
                              // alignContent="center"
                            >
                              <Grid item xs={4}></Grid>
                              <Grid
                                container
                                direction="column"
                                xs={8}
                                alignItems="start"
                              >
                                {p.line.map((l, lineIndex) => (
                                  <Grid
                                    key={l.name}
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}
                                  >
                                    <Typography
                                      sx={{
                                        color: 'primary.main',
                                        fontSize: 20,
                                        marginRight: 1,
                                        fontWeight: 'bold',
                                      }}
                                    >
                                      Proceso:
                                    </Typography>
                                    <Box display="flex" alignItems={'center'}>
                                      {editingProcess[index] &&
                                      editingProcess[index][lineIndex] ? (
                                        <>
                                          <TextField
                                            size="small"
                                            label=""
                                            value={oldValue}
                                            onChange={(e) =>
                                              handleEditProcess(e, l.name)
                                            }
                                          />
                                          <Button
                                            onClick={() =>
                                              handleSaveSubProcessClick(
                                                index,
                                                lineIndex
                                              )
                                            }
                                          >
                                            Guardar
                                          </Button>
                                        </>
                                      ) : (
                                        <>
                                          <Typography color="GrayText">
                                            {l.name}
                                          </Typography>
                                          <IconButton
                                            disabled={isEditing}
                                            onClick={() =>
                                              handleEditSubprocessClick(
                                                index,
                                                lineIndex,
                                                l.name
                                              )
                                            }
                                          >
                                            <EditIcon />
                                          </IconButton>
                                          <IconButton
                                            onClick={() =>
                                              handleDeleteProcess(
                                                index,
                                                lineIndex
                                              )
                                            }
                                          >
                                            <DeleteIcon />
                                          </IconButton>
                                        </>
                                      )}
                                    </Box>
                                  </Grid>
                                ))}
                                {/* </Box> */}
                              </Grid>
                            </Grid>
                            {index !== product.trazability.length - 1 && (
                              <Divider />
                            )}
                          </Grid>
                        </>
                      ))}
                    </Grid>
                    {/* </Grid> */}
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
                {/* <TrazabilityAssistant /> */}
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

            <Tooltip title="Agregar, editar o quitar etapas y procesos">
              <IconButton onClick={handleEditProtocol}>
                <FaEdit
                  color="#1d77c0"
                  size={24}
                  style={{ cursor: 'pointer' }}
                />
              </IconButton>
            </Tooltip>
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
                // disabled={product?.status !== 'en curso'}
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
                  // marginTop: isSmallScreen ? '-8rem' : '0',
                  position: 'fixed',
                  top: '65%',
                  right: 50,
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
                    onClick={() =>
                      window.open(`/history/${router.query.id}`, '_blank')
                    }
                    sx={{ fontSize: 12 }}
                    target="_blank"
                  >
                    Visitar trazabilidad
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Box>

        <Button
          variant="contained"
          sx={{
            position: 'fixed',
            top: '0rem',
            right: '5%',
            marginTop: '5rem',
          }}
          onClick={handleOpen}
        >
          Nuevo Hito
        </Button>

        <Box
          sx={{
            position: 'fixed',

            right: isSmallScreen ? 65 : 25,
            top: '50vh',
          }}
        ></Box>
      </HomeLayout>
    );
  }
};

export default Producto;
