import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react';
import '../styles/globals.css';
import { ThemeProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { idealTheme } from '../theme';
import { Box } from '@mui/material';
// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.
const activeChain = 'mumbai';

function MyApp({ Component, pageProps }) {
  //   console.log('////////////////////////', process.env.NEXT_PUBLIC_CLIENT_ID);
  return (
    <ThemeProvider theme={idealTheme}>
      <ThirdwebProvider
        //   desiredChainId={ChainId.Mumbai}
        activeChain={activeChain}
        clientId="76a577527cae1a95e65997c5845985ff"
        //   clientId={process.env.NEXT_PUBLIC_CLIENT_ID}
        sdkOptions={{
          gasless: {
            openzeppelin: {
              relayerUrl:
                'https://api.defender.openzeppelin.com/autotasks/e93fe8bf-b212-4e64-88b9-9c1dcea04dcd/runs/webhook/fcb2348b-21c8-4da0-aa82-27d0ef1af91b/UDBD2WW6xNsb9Lnx1dBihB',
              // relayerUrl: process.env.NEXT_PUBLIC_OPENZEPPELIN_RELAYER_URL,
            },
          },
        }}
        // activeChain={activeChain}
        //   clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
      >
        <Component {...pageProps} />
      </ThirdwebProvider>
    </ThemeProvider>
  );
}

export default MyApp;
