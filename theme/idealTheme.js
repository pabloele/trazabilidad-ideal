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
      main: '#0330AC',
    },
    yelow: {
      main: '#F4DE71',
    },
    orange: {
      main: 'F4924A',
    },
    lightBlue: {
      main: '#3BCED6',
    },
    lilac: {
      main: '#BA67F4',
    },
    secondary: {
      main: '#f9faff',
      black: '#000',
    },
    crypto: {
      main: '#8A2BE2',
    },

    white: {
      main: '#ffffff',
    },
    error: {
      main: red.A400,
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
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
