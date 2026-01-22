import { v4 } from "uuid";
import { pinFileToIpfs, pinJsonToIpfs } from "../utils/ipfs";
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
  const result = await pinJsonToIpfs(file);

  return {
    path: result.path,
    url: result.url,
  };
};

export const uplaodImageIPFS = async (file) => {
  try {
    const fileToIPFS = await pinFileToIpfs(file);

    return {
      path: fileToIPFS.path,
      url: fileToIPFS.url,
    };
  } catch (error) {
    console.log(error);
  }
};

export const uploadFileToIpfs = async (file) => {
  try {
    if (file) {
      const extension = file.name.split(".").pop();
      const uniqueId = v4().substr(0, 8);
      const randomName = `${uniqueId}.${extension}`;

      const result = await pinFileToIpfs(file, {
        fileName: randomName,
        metadata: { name: randomName },
      });

      return result.url;
    }
  } catch (error) {
    console.error("Error al subir el archivo", error);
  }
};
