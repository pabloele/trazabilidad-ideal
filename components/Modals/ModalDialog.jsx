<<<<<<< HEAD
import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box } from '@mui/material';
import Spinner from '../Spinner/Spinner';
import Link from 'next/link';

const ModalDialog = () => {
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
=======
import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Typography } from "@mui/material";
import Spinner from "../Spinner/Spinner";
import Link from "next/link";
const ModalDialog = () => {
  const [open, setOpen] = React.useState(true); // Cambiado de openDialog a open
>>>>>>> b67a5fe858bd213a49373f2f7650130ff741d4bb

  const handleClose = () => {
    setOpen(false);
  };
  const DialogModal = ({ uploadToBlockChain, loading, txHash }) => {
    return (
      <Box>
        {loading && (
          <Dialog open={true}>
            <DialogTitle>Certificando con tecnologia blockchain</DialogTitle>

            <DialogContent>
              <DialogContentText></DialogContentText>
              <Box
                sx={{
                  height: 200,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Spinner />
              </Box>
            </DialogContent>
          </Dialog>
        )}

        {txHash && (
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="draggable-dialog-title"
          >
            <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
              La transaccion se esta procesando
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                <Typography>
                  Puedes revisar el estado de la trazabilidad en el explorador
                  de bloques:
                </Typography>
                <Link
                  target="_blank"
                  rel="noopener noreferrer "
                  href={`https://goerli-optimism.etherscan.io/tx/${txHash}#eventlog`}
                >
                  Mas informacion
                </Link>
              </DialogContentText>
            </DialogContent>
          </Dialog>
<<<<<<< HEAD
        ) : (
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="draggable-dialog-title"
          >
            <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
              ¿Seguro que deseas certificar este proceso productivo en la
              blockchain?
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Este proceso no podra ser modificado, una vez ejecutado la
                acción las etapas de la produccion seran públicas e inmutables,
                asegurate de realizar bien la trazabilidad del producto
              </DialogContentText>

              {loading && (
                <Box
                  sx={{ display: 'flex', justifyContent: 'center', marginY: 5 }}
                >
                  <Spinner />
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="contained" onClick={uploadToBlockChain}>
                Certificar
              </Button>
            </DialogActions>
          </Dialog>
=======
>>>>>>> b67a5fe858bd213a49373f2f7650130ff741d4bb
        )}
      </Box>
    );
  };

  return {
    open,
    setOpen,
    DialogModal,
  };
};

export default ModalDialog;
