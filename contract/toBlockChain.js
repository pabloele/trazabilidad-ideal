import { create } from "ipfs-http-client";

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
    headers: {
      authorization: auth,
    },
  });
  const fileToIPFS = await ipfs.add(JSON.stringify(file));

  const fileToIPFSURL = `https://ipfs.io/ipfs/${fileToIPFS.path}`;

  return {
    path: fileToIPFS.path,
    url: fileToIPFSURL,
  };
};