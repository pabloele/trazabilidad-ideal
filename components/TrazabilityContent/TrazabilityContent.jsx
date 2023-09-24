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

const protocol = [
  { siembra: ['plantado', 'riego', 'etcétera'] },
  { cosecha: ['11/11/2022'] },
  { estrujado: ['asduyuyutfs', 'saduifsdf', 'sadfiiiiiisdf'] },
  {
    maceración: ['asiiiiidfs', 'sadfsdiiiiif', 'sadfsiiiiiidf', 'sadfsidf'],
  },
  { descube: ['asdfhhs'] },
  { crianza: ['asdfgggs', 'sadfsjjjjdf', 'sadfsllllldf'] },
  {
    embotellado: [
      'asdfssdsssss',
      'sadfffffffffsdf',
      'saggggggfsdf',
      'asdfjjjjs',
    ],
  },
  // {
  //   embotellado: [
  //     'asdfs',
  //     'sadfsdf',
  //     'sadfsdf',
  //     // 'asdfs',
  //     // 'sadfsdf',
  //     // 'asdfs',
  //     // 'sadfsdf',
  //     // 'asdfs',
  //     // ,
  //     // 'sadfsdf',
  //     // 'asdfs',
  //     // ,
  //     // 'sadfsdf',
  //     // 'asdfs',
  //     // ,
  //     // 'sadfsdf',
  //     // 'asdfs',
  //     // ,
  //     // 'sadfsdf',
  //     // 'asdfs',
  //     // ,
  //     // 'sadfsdf',
  //     // 'asdfs',
  //     // ,
  //     // 'sadfsdf',
  //     // 'asdfs',
  //   ],
  // },
  {
    embotellado2: ['asdfs767', 'sadf76sdf', 'sad68fsdf', 'asd00fs'],
  },
  {
    embotellado3: ['asdf6s', 'sadfskjkjdf', 'sadfsoidf', 'askjldfs'],
  },
  {
    embotellado4: ['asdfus', 'sadfsddszff', 'sadfsdf', 'asdfs'],
  },
  {
    embotellado5: ['asdf78996878s', 'sadfsdghhff', 'sadfsdfd', 'asdgffs'],
  },
  {
    embotellado6: [
      '0asdfs',
      '1sadfsdf',
      '2sadfsdf',
      '3asdfs',
      '4sadfsdf',
      '5sadfsdf',
      '6asdfs',
      ,
      '7sadfsdf',
      '8sadfsdf',
      '9asdfs',
      ,
      '01sadfsdf',
      'asdsadfsdf',
      'sssasdfs',
      ,
      'sadsfsdf',
      'sadfssdf',
      'asdfsss',
      ,
      'sadfsdf',
      'sadfsd555f',
      'asdfsttt',
      ,
      'sadfsdftt',
      'sadfsdff',
      'asdfds',
      ,
      'sad0fsdf',
      'sadf0sdf',
      'asdfs0',
      ,
      'sadfsd0f',
      'sadfsdf0',
      'asñññdfs',

      'sadfscdf',
      'sadfscccdf',
      'asdf3s',
      ,
      'tjsadfsdf',
      'saddfsdf',
      'asdfbs',
    ],
  },
];

export const TrazabilityContent = () => {
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
              fontSize={isMediumScreen ? 36 : 24}
              fontWeight="light"
              sx={{ padding: '1rem' }}
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
