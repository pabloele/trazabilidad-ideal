import React from 'react';
import { HomeLayout } from '../../../layout';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Button,
  TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import useProducts from '../../../hooks/useProducts';
import LaunchIcon from '@mui/icons-material/Launch';
import { useRouter } from 'next/router';
import { useAuth } from '../../../context/AuthContext';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { deleteProduct } from '../../../firebase/controllers/firestoreControllers';
const Products = () => {
  const { user } = useAuth();

  const { products, setProducts } = useProducts();
  const ownerProducts = products.filter(
    (product) => product.ownerUid === user.uid
  );

  const handleDelete = (id) => {
    Swal.fire({
      title: '¿Estas seguro de eliminar este producto?',
      text: 'Esta opcion no se puede revertir',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Estoy seguro',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const productFiltter = products.filter((product) => product.id !== id);

        try {
          await deleteProduct(id);

          setProducts(productFiltter);

          Swal.fire({
            title: 'Producto eliminado',

            icon: 'success',
          });
        } catch (error) {}
      }
    });
  };

  const router = useRouter();
  return (
    <HomeLayout>
      <Box sx={{ height: '90vh' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ color: 'primary.main', fontSize: 24 }}>
            Productos pendientes
          </Typography>

          <Button
            variant="contained"
            onClick={() => router.push('/nueva-produccion')}
          >
            Agregar producto
          </Button>
        </Box>

        <Box>
          <TextField
            label="Buscar"
            variant="outlined"
            size="small"
            sx={{ width: '20%', marginTop: '2rem', marginBottom: '1rem' }}
          />
        </Box>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nro lote</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Protocolo</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ownerProducts &&
              ownerProducts?.map((product) => {
                if (product.status === 'en curso') {
                  return (
                    <TableRow key={product.id}>
                      <TableCell>{product.lotNumber}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.protocolName}</TableCell>
                      <TableCell>{product.status}</TableCell>

                      <TableCell>
                        <IconButton onClick={() => handleDelete(product.id)}>
                          <DeleteIcon />
                        </IconButton>

                        <IconButton
                          onClick={() => router.push(`/producto/${product.id}`)}
                        >
                          <LaunchIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                }
              })}
          </TableBody>
        </Table>
      </Box>
    </HomeLayout>
  );
};

export default Products;
