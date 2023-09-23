import {
  ConnectWallet,
  useAddress,
  useClaimNFT,
  useContract,
} from '@thirdweb-dev/react';
import styles from '../styles/Home.module.css';
import NftGasless from './nftGasless';
import RegisterPage from './RegisterPage';

export default function Home() {
  return (
    <div className={styles.home}>
      {/* <NftGasless /> */}
      <RegisterPage />
    </div>
  );
}
