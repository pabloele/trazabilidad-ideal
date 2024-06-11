const { ethers } = require("hardhat");

async function main() {
  try {
    const hre = require("hardhat");

    // Proporciona el número de lote del producto que deseas recuperar
    const id = "MgZ9sMNEGxIcgSZGDOeK"; // Reemplaza con el número de lote deseado

    // Obtén la instancia del contrato
    const Trazability = await hre.ethers.getContractFactory("Trazability");
    const trazability = await Trazability.attach(
      "0xDaDE6b608A256587B936Cc8f85125e3Fad018b4A" // Reemplaza con la dirección de tu contrato desplegado
    );

    const productData = await trazability.getProductData(id);

    // Accede a los datos de las líneas usando los índices
    console.log(productData);
  } catch (error) {
    console.error(error);
  }
}

// Utiliza await para asegurarte de que todas las promesas se resuelvan antes de salir
(async () => {
  await main();
  process.exit(0);
})();
