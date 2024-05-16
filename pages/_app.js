import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import "../styles/globals.css";
import { ThemeProvider } from "@emotion/react";
import { AuthContextProvider } from "../context/AuthContext";
import { idealTheme } from "../theme";
import "../styles/fonts.css";
import { OptimismGoerli, Mumbai, OpSepoliaTestnet } from "@thirdweb-dev/chains";

import { Open_Sans } from "next/font/google";

const inter = Open_Sans({ subsets: ["latin"], weight: "400" });

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={idealTheme}>
      <ThirdwebProvider
        activeChain={OpSepoliaTestnet}
        clientId={process.env.NEXT_PUBLIC_CLIENT_ID}
      >
        <AuthContextProvider>
          <main className={inter.className}>
            <Component {...pageProps} />
          </main>
        </AuthContextProvider>
      </ThirdwebProvider>
    </ThemeProvider>
  );
}

export default MyApp;
