import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import "../styles/globals.css";
import { ThemeProvider } from "@emotion/react";
import { AuthContextProvider } from "../context/AuthContext";
import CssBaseline from "@mui/material/CssBaseline";
import { idealTheme } from "../theme";
import { Box } from "@mui/material";
// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.
import { OptimismGoerli } from "@thirdweb-dev/chains";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={idealTheme}>
      <ThirdwebProvider
        activeChain={OptimismGoerli}
        clientId={process.env.NEXT_PUBLIC_CLIENT_ID}
      >
        <AuthContextProvider>
          <Component {...pageProps} />
        </AuthContextProvider>
      </ThirdwebProvider>
    </ThemeProvider>
  );
}

export default MyApp;
