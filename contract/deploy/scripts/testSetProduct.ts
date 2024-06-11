import hre from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
async function main() {
  // Obtén la dirección del propietario o del remitente que realizará la transacción
  const [owner] = await hre.ethers.getSigners();

  // Proporciona los datos del producto que deseas establecer
  const lotNumber = "12345";
  const productData = {
    productName: "Producto de ejemplo",
    producer: "Productor de ejemplo",
    origin: "Origen de ejemplo",
    productionDate: 1636252800, // Fecha Unix en segundos (ejemplo: 01/11/2021)
    expirationDate: 1679740800, // Fecha Unix en segundos (ejemplo: 01/03/2023)
  };

  // Obtén la instancia del contrato
  const Trazability = await hre.ethers.getContractFactory("Trazability");
  const trazability = await Trazability.attach(
    "0xca1DB79971161CC4e0A5185c80Ec004E7F25Eb02"
  ); // Reemplaza "CONTRATO_ADDRESS" con la dirección de tu contrato desplegado

  // Establece los datos del producto
  await trazability.connect(owner).setProductData(lotNumber, productData);

  console.log("Datos del producto establecidos con éxito.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
