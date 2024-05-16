import { HardhatRuntimeEnvironment } from "hardhat/types";
import hre from "hardhat";

async function main() {
  const { ethers } = hre;

  const productData = {
    lotNumber: "1290",
    protocolName: "agroalimentario",
    name: "Queso rayado",
    status: "realizado",
    ownerUid: "cvczqdnr40QfwFtL9dCVV6CBaDo1",
    linesData:
      '[{"path":"/vino1/produccion-primaria/etapa1","name":"Origen de la producción"},{"path":"/vino1/produccion-primaria/etapa2","name":"Características fenológicas / ciclos"}]',
    milestonesData:
      '[{"image":"https://ipfs.io/ipfs/QmVEGsHtE4EX6UTZXSPeogWZ4W1NsmDbfPYMbht4Jzz62s","description":"Tomando unas buenas copas de vino antes de empezar con la produccion"},{"image":"https://ipfs.io/ipfs/QmYRWtgEsxVQwZxasiRhbL97udpppSVXp9WWSDWcch82ge","description":"Estas son caracteristicas"}]',
  };
  // Dirección del destinatario (usuario que recibirá el nuevo NFT)
  const recipientAddress = "0xCb5751E0bC332373597D5945e2E0E625FAfB1346"; // Reemplaza con la dirección del destinatario

  // URI del token (ubicación del archivo JSON con metadatos)
  const tokenURI =
    "https://ipfs.io/ipfs/QmdPBVeJH7uGKCdqZsgLiM1kkKkwteME7EwLzDcuJcBoiw"; // Reemplaza con el URI deseado

  // Obtén la instancia del contrato
  const Trazability = await ethers.getContractFactory("Trazability");
  const trazability = await Trazability.attach(
    "0x2c659954d12b7765e072508514e42Cbb960d9513" // Reemplaza "CONTRATO_ADDRESS" con la dirección de tu contrato desplegado
  );

  // Mintea un nuevo token asociado al número de lote y establece los datos del producto
  await trazability.safeMint(
    recipientAddress,
    tokenURI,
    productData,
    productData.lotNumber
  );

  console.log("Token minteado con éxito y datos del producto establecidos.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
