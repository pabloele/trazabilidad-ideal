import {
  ConnectWallet,
  useAddress,
  useClaimNFT,
  useContract,
} from '@thirdweb-dev/react';
import React from 'react';
import styles from '../../styles/Home.module.css';
const NftGasless = () => {
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_OPENZEPPELIN_DROP_ADDRESS,
    'nft-drop'
  );
  const { mutateAsync: claim, isLoading } = useClaimNFT(contract);
  const address = useAddress();

  const claimNFT = async () => {
    try {
      const data = await claim({ quantity: 1 });
      alert('Claim exitoso!!! :)     token ID:', data[0].id.toString());
    } catch (error) {
      console.error('error');
      alert('No se pudo mintear el NFT :(');
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <h1>Nft Drop</h1>

        <div style={{ width: '200px' }}>
          <ConnectWallet />
        </div>
        {address && (
          <div>
            {
              <button onClick={claimNFT} disabled={isLoading}>
                {' '}
                Claim NFT!!!!{' '}
              </button>
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default NftGasless;
