import { createTheme } from '@mui/material';
import { red } from '@mui/material/colors';
import NextLink from 'next/link';
import { forwardRef } from 'react';

const LinkBehaviour = forwardRef(function LinkBehaviour(props, ref) {
  return <NextLink ref={ref} {...props} />;
});

export const idealTheme = createTheme({
  palette: {
    primary: {
      main: '#F1EDE2',
      // main: '#EEEEEE',
    },
    secondary: {
      main: '#543884',
    },
    crypto: {
      main: '#8A2BE2',
    },

    white: {
      main: 'white',
    },
    error: {
      main: red.A400,
    },
  },
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehaviour,
      },
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehaviour,
      },
    },
  },
});
