import { SaveOutlined } from '@mui/icons-material';
import {
  Button,
  Grid,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import mintImg from '../../public/images/nft_8146034.png';
import Image from 'next/image';

import Trazabilityline from '../TrazabilityLine/TrazabilityLine';

// const protocol = [

//   { Prod_pria: ['plantado', 'riego', 'etcétera'] },
//   { Elaboracion: ['11/11/2022'] },
//   { Despacho: ['asduyuyutfs', 'saduifsdf', 'sadfiiiiiisdf'] },
//   {
//     Compercializacion: [
//       'asiiiiidfs',
//       'sadfsdiiiiif',
//       'sadfsiiiiiidf',
//       'sadfsidf',

//     ],
//   },
// ];

export const TrazabilityContent = ({ protocol }) => {
  const isMediumScreen = useMediaQuery('(min-width: 600px)');

  return (
    <Grid
      container
      spacing={0}
      justifyContent="center"
      sx={{
        minHeight: 'calc(100vh - 110px)',
        backgroundColor: 'beige',
        borderRadius: 3,
      }}
    >
      <Grid
        container
        direction="column"
        justifyContent="space-between"
        alignItems="flex-start"
        backgroundColor="beige"
        sx={{ mb: 1, height: '100%' }}
      >
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          backgroundColor="beige"
          sx={{ mb: 1, height: '100%' }}
        >
          <Grid item>
            <Typography
              fontSize={isMediumScreen ? 20 : 18}
              fontWeight="light"
              sx={{ padding: '1rem', color: 'secondary.black' }}
            >
              Trazabilidad
            </Typography>
          </Grid>
          <Grid item padding={1}>
            <Button
              sx={{
                padding: 2,
                backgroundColor: 'crypto.main',
                color: 'white.main',
              }}
            >
              <Image
                src={mintImg}
                alt="Mint icon"
                style={{ height: '30px', width: '30px', paddingRight: 3 }}
              />
              {isMediumScreen ? 'Mintear' : ''}
            </Button>
          </Grid>
        </Grid>

        <Grid item>
          <Trazabilityline protocol={protocol} />
        </Grid>
      </Grid>
    </Grid>
  );
};
