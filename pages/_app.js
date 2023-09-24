import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react';
import '../styles/globals.css';
import { ThemeProvider } from '@emotion/react';
import { AuthContextProvider } from '../context/AuthContext';
import CssBaseline from '@mui/material/CssBaseline';
import { idealTheme } from '../theme';
import { Box } from '@mui/material';
// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.
const activeChain = 'mumbai';

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={idealTheme}>
      <ThirdwebProvider
        activeChain={activeChain}
        clientId={process.env.NEXT_PUBLIC_CLIENT_ID}
        sdkOptions={{
          gasless: {
            openzeppelin: {
              relayerUrl: process.env.NEXT_PUBLIC_OPENZEPPELIN_RELAYER_URL,
            },
          },
        }}
      >
        <AuthContextProvider>
          <Component {...pageProps} />
        </AuthContextProvider>
      </ThirdwebProvider>
    </ThemeProvider>
  );
}

export default MyApp;
