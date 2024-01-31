import { create } from "ipfs-http-client";
import { v4 } from "uuid";
export const agroupMilestones = (product) => {
  const trazabilidadAgrupada = [];
  // Iterar sobre las líneas de trazabilidad
  for (const linea of product.trazability) {
    const etapa = {
      name: linea.name,
      milestones: [],
    };
    // Iterar sobre las etapas de la línea
    for (const etapaItem of linea.line) {
      // Filtrar milestones vacíos
      const milestonesNoVacios = etapaItem.milestones.filter(
        (milestone) => milestone.description.trim() !== ""
      );

      // Agregar etapa solo si tiene milestones no vacíos
      if (milestonesNoVacios.length > 0) {
        etapa.milestones.push({
          path: etapaItem.path,
          name: etapaItem.name,
          milestones: milestonesNoVacios,
        });
      }
    }

    // Agregar etapa solo si tiene milestones no vacíos
    if (etapa.milestones.length > 0) {
      trazabilidadAgrupada.push(etapa);
    }
  }

  return trazabilidadAgrupada;
};

export const uploadIPFS = async (file) => {
  const auth =
    "Basic " +
    Buffer.from(
      process.env.NEXT_PUBLIC_IPFS_API_KEY +
        ":" +
        process.env.NEXT_PUBLIC_IPFS_KEY_SECRET
    ).toString("base64");

  const ipfs = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    apiPath: "/api/v0",
    headers: {
      authorization: auth,
    },
  });
  const fileToIPFS = await ipfs.add(JSON.stringify(file));

  const fileToIPFSURL = `https://trazabilidadideal.infura-ipfs.io/ipfs/${fileToIPFS.path}`;

  return {
    path: fileToIPFS.path,
    url: fileToIPFSURL,
  };
};

export const uplaodImageIPFS = async (file) => {
  try {
    const auth =
      "Basic " +
      Buffer.from(
        process.env.NEXT_PUBLIC_IPFS_API_KEY +
          ":" +
          process.env.NEXT_PUBLIC_IPFS_KEY_SECRET
      ).toString("base64");

    const ipfs = create({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
      apiPath: "/api/v0",
      headers: {
        authorization: auth,
      },
    });
    const fileToIPFS = await ipfs.add(file);

    const fileToIPFSURL = `https://trazabilidadideal.infura-ipfs.io/ipfs/${fileToIPFS.path}`;

    return {
      path: fileToIPFS.path,
      url: fileToIPFSURL,
    };
  } catch (error) {
    console.log(error);
  }
};

export const uploadFileToIpfs = async (file) => {
  const auth =
    "Basic " +
    Buffer.from(
      process.env.NEXT_PUBLIC_IPFS_API_KEY +
        ":" +
        process.env.NEXT_PUBLIC_IPFS_KEY_SECRET
    ).toString("base64");

  const ipfs = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    apiPath: "/api/v0",
    headers: {
      authorization: auth,
    },
  });
  try {
    if (file) {
      const extension = file.name.split(".").pop();
      const uniqueId = v4().substr(0, 8);
      const randomName = `${uniqueId}.${extension}`;

      const result = await ipfs.add(file);
      const ipfsHash = result.path;
      const urlFile = `https://trazabilidadideal.infura-ipfs.io/ipfs/${ipfsHash}`;

      return urlFile;
    }
  } catch (error) {
    console.error("Error al subir el archivo", error);
  }
};
