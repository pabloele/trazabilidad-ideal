import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Typography } from '@mui/material';
import Spinner from '../Spinner/Spinner';
import Link from 'next/link';
const ModalDialog = () => {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const DialogModal = ({ uploadToBlockChain, loading, txHash }) => {
    return (
      <Box>
        {loading && (
          <Dialog open={open}>
            <DialogTitle>Certificando con tecnologia blockchain</DialogTitle>

            <DialogContent>
              <DialogContentText></DialogContentText>
              <Box
                sx={{
                  height: 200,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
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
