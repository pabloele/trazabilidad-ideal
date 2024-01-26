import {
  addDoc,
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  query,
  where,
} from "firebase/firestore/lite";
import { db } from "../config";
import { v4 as uuidv4 } from "uuid";

export const usersCollectionRef = collection(db, "users");

export const deleteProduct = async (uid) => {
  try {
    const productDoc = doc(db, "products", uid);

    const docSnapshot = await getDoc(productDoc);

    if (docSnapshot.exists()) {
      await deleteDoc(productDoc);
      console.log("Documento eliminado correctamente.");
    } else {
      console.log("El documento no existe en la base de datos.");
    }
  } catch (error) {
    console.error("Error al intentar eliminar el documento:", error.message);
  }
};

export const getUsers = async () => {
  try {
    const data = await getDocs(usersCollectionRef);
    const users = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    return users;
  } catch (error) {
    console.log(error);
  }
};

export const getUserByUid = async (uid) => {
  try {
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const userSnapshot = await getDocs(q);

    if (!userSnapshot.empty) {
      // Solo debería haber un usuario con un UID único, pero puedes manejar múltiples resultados si es necesario
      const userData = {
        ...userSnapshot.docs[0].data(),
        id: userSnapshot.docs[0].id,
      };
      return userData;
    } else {
      console.log("No se encontró ningún usuario con el UID proporcionado.");
      return null;
    }
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    throw error;
  }
};

export const createUser = async (payload) => {
  const { uid } = payload;

  // Verificar si el usuario ya existe en la colección de usuarios
  const usersQuery = query(usersCollectionRef, where("uid", "==", uid));
  const userDocs = await getDocs(usersQuery);

  if (userDocs.empty) {
    // El usuario no existe, entonces podemos crearlo
    await addDoc(usersCollectionRef, { ...payload });
    console.log("Usuario creado exitosamente.");
  } else {
    // El usuario ya existe, muestra un mensaje de error o realiza alguna otra acción
    console.log("El usuario ya existe en la base de datos.");
  }
};

export const getDocId = async (uid) => {
  try {
    const users = await getUsers();
    const user = users.find((user) => user.uid === uid);
    if (user) {
      const { id } = user;
      return id;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
  }
};

export const addUserProduct = async (uid, product) => {
  try {
    const productsCollection = collection(db, "products");
    console.log(product);
    const docRef = await addDoc(productsCollection, {
      ...product,
      ownerUid: uid,
    });
    console.log("Documento agregado con éxito", docRef.id);

    return docRef.id;
  } catch (error) {
    console.log(error);
  }
};

export const addMilestone = async (uid, path, milestone) => {
  const milestoneId = uuidv4();
  const id = await getDocId(uid);
  const userDocumentRef = await doc(db, "users", id);
  const documentSnapshot = await getDoc(userDocumentRef);
  const userData = await documentSnapshot.data();

  let trazabilityIndex;
  let stageIndex;
  let productIndex;
  let p = 0;

  while (p < userData.products.length) {
    for (let i = 0; i < userData.products[p].trazability.length; i++) {
      const trazability = userData.products[p].trazability[i];

      for (let j = 0; j < trazability.line.length; j++) {
        if (trazability.line[j].path === path) {
          trazabilityIndex = j;
          stageIndex = i;
          productIndex = p;
        }
      }
    }
    p++;
  }

  const entry =
    userData.products[productIndex].trazability[trazabilityIndex].line[
      stageIndex
    ];
  const milestones = [...entry.milestones, { ...milestone, milestoneId }];
  const newEntry = { ...entry, milestones: milestones };

  const newUserData = { ...userData };
  newUserData.products[productIndex].trazability[trazabilityIndex].line[
    stageIndex
  ] = newEntry;

  await updateDoc(userDocumentRef, { ...newUserData });
};

export const deleteUserDoc = async (uid) => {
  const id = await getDocId(uid);
  const userDoc = doc(db, "users", id);
  await deleteDoc(userDoc);
};

export const getProducts = async () => {
  try {
    const productsCollection = collection(db, "products");

    const querySnapshot = await getDocs(productsCollection);

    const productsArray = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(productsArray);
    return productsArray;
  } catch (error) {
    console.error("Error obteniendo los productos:", error);
    return [];
  }
};

export const getUserProducts = async (uid) => {
  try {
    const allProducts = await getProducts();

    const userProducts = allProducts.filter(
      (product) => product.ownerUid === uid
    );

    console.log(userProducts);
    return userProducts;
  } catch (error) {
    console.error("Error obteniendo los productos del usuario:", error);
    return [];
  }
};

export const addProtocol = async () => {
  const protocolRef = collection(db, "protocols");

  await addDoc(protocolRef, {
    name: "Protocolo Ambiental",
    trazability: [
      {
        path: "location",
        line: [
          {
            name: "Ubicación real",
            milestones: [],
          },
          {
            path: "influenceAreas",
            name: "Áreas de influencia",
            milestones: [],
          },
          {
            path: "compensationAreas",
            name: "Áreas para compensación",
            milestones: [],
          },
          {
            path: "controlAreas",
            name: "Áreas de control",
            milestones: [],
          },
        ],
        name: "Localización Geográfica",
      },
      {
        path: "habilitations",
        line: [
          {
            name: "Declaración de Impacto Ambiental",
            milestones: [],
          },
          {
            name: "Estudios específicos de impacto o de sensibilidad ambiental",
            milestones: [],
          },
          {
            name: "Habilitaciones locales o regionales",
            milestones: [],
          },
        ],
        name: "Requerimientos y Habilitaciones",
      },
      {
        path: "requirements",
        line: [
          {
            name: "Normas y otros requisitos",
            milestones: [],
          },
          {
            path: "audit",
            name: "Auditorías externas",
            milestones: [],
          },
        ],
        name: "Normativa Ambiental",
      },
      {
        path: "rawMaterials",
        line: [
          {
            name: "Requisitos ambientales de compra o contratación",
            milestones: [],
          },
          {
            path: "environmentAspects",
            name: "Aspectos ambientales y sus impactos asociados",
            milestones: [],
          },
          {
            path: "goodPractices",
            name: "Buenas Prácticas Ambientales",
            milestones: [],
          },
          {
            path: "abnormalConditions",
            name: "Condiciones anormales o situaciones de emergencia previsibles",
            milestones: [],
          },
          {
            path: "preventionPlans",
            name: "Planes de prevención, contingencia y/o mitigación",
            milestones: [],
          },
        ],
        name: "Recepción y Almacenamiento de Materias Primas e Insumos - Subcontratación de Servicios",
      },
      {
        path: "storage",
        line: [
          {
            name: "Aspectos ambientales y sus impactos asociados",
            milestones: [],
          },
          {
            path: "goodPracticesEnv",
            name: "Buenas Prácticas Ambientales",
            milestones: [],
          },
          {
            path: "abnormalOrEmergency",
            name: "Condiciones anormales o situaciones de emergencia previsibles",
            milestones: [],
          },
          {
            path: "preventionContingencyMitigate",
            name: "Planes de prevención, contingencia y/o mitigación",
            milestones: [],
          },
        ],
        name: "Almacenamiento de Subproductos o Productos Finales",
      },
      {
        path: "distribution",
        line: [
          {
            name: "Requisitos ambientales de venta o transporte",
            milestones: [],
          },
          {
            path: "environmentAspectsAndImpact",
            name: "Aspectos ambientales y sus impactos asociados",
            milestones: [],
          },
          {
            path: "goodPracticesDist",
            name: "Buenas Prácticas Ambientales",
            milestones: [],
          },
          {
            path: "abnormalOrEmergencyDist",
            name: "Condiciones anormales o situaciones de emergencia previsibles",
            milestones: [],
          },
          {
            path: "preventionPlanDist",
            name: "Planes de prevención, contingencia y/o mitigación",
            milestones: [],
          },
        ],
        name: "Despacho y Distribución de Subproductos o Productos Finales",
      },
      {
        path: "commerce",
        line: [
          {
            name: "Requisitos ambientales de comercialización",
            milestones: [],
          },
          {
            name: "Aspectos ambientales y sus impactos asociados",
            milestones: [],
          },
          {
            name: "Buenas Prácticas Ambientales",
            milestones: [],
          },
          {
            name: "Condiciones anormales o situaciones de emergencia previsibles",
            milestones: [],
          },
          {
            name: "Planes de prevención, contingencia y/o mitigación",
            milestones: [],
          },
        ],
        name: "Comercialización de   Productos y/o Servicios",
      },
      {
        path: "support",
        line: [
          {
            name: "Aspectos ambientales y sus impactos asociados",
            milestones: [],
          },
          {
            name: "Criterios de operación de los procesos",
            milestones: [],
          },
          {
            name: "Procedimientos de control de los procesos",
            milestones: [],
          },
          {
            name: "Buenas Prácticas Ambientales",
            milestones: [],
          },
          {
            name: "Condiciones anormales o situaciones de emergencia previsibles",
            milestones: [],
          },
          {
            name: "Planes de prevención, contingencia y/o mitigación",
            milestones: [],
          },
        ],
        name: "Sistemas de Apoyo y Servicios Auxiliares",
      },
      {
        path: "treatment",
        line: [
          {
            name: "Aspectos ambientales y sus impactos asociados",
            milestones: [],
          },
          {
            name: "Requisitos ambientales de los procesos e instalaciones",
            milestones: [],
          },
          {
            name: "Buenas Prácticas Ambientales",
            milestones: [],
          },
          {
            name: "Condiciones anormales o situaciones de emergencia previsibles",
            milestones: [],
          },
          {
            name: "Planes de prevención, contingencia y/o mitigación",
            milestones: [],
          },
        ],
        name: "Tratamiento, Transporte y/o Disposición Final de Residuos",
      },
      {
        path: "performance",
        line: [
          {
            name: "Estrategias y resultados",
            milestones: [],
          },
          {
            name: "Auditorías ambientales internas",
            milestones: [],
          },
          {
            name: "Personal afectado por la gestión ambiental",
            milestones: [],
          },
        ],
        name: "Evaluación de Desempeño",
      },
      {
        path: "kaizen",
        line: [
          {
            name: "Plan de mejora continua",
            milestones: [],
          },
          {
            name: "Concientización y/o capacitación del personal",
            milestones: [],
          },
          {
            name: "Programas específicos de relacionamiento comunitario",
            milestones: [],
          },
        ],
        name: "Mejora Continua",
      },
    ],
  });
};

export const updateProduct = async (id, status, txHash) => {
  try {
    const productRef = doc(db, "products", id);

    const response = await updateDoc(productRef, {
      status: status,
      txHash: txHash,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateDescription = async (id, description) => {
  try {
    const userRef = doc(db, "users", id);

    const userDoc = await getDoc(userRef);

    console.log(userDoc.data());

    const updatedData = {
      ...userDoc.data().data,
      description: description,
    };

    await updateDoc(userRef, {
      data: updatedData,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateProfileImage = async (id, url) => {
  try {
    const userRef = doc(db, "users", id);

    // Obtén el documento actual
    const userDoc = await getDoc(userRef);

    // Actualiza solo la propiedad 'profileImg' dentro de 'data'
    const updatedData = {
      ...userDoc.data().data, // Mantén las demás propiedades dentro de 'data'
      profileImg: url,
    };

    // Actualiza el documento con la nueva información
    await updateDoc(userRef, {
      data: updatedData,
    });
  } catch (error) {
    console.error("Error updating profile image:", error);
  }
};

export const updateWallpaperImg = async (id, url) => {
  try {
    const userRef = doc(db, "users", id);

    // Obtén el documento actual
    const userDoc = await getDoc(userRef);

    // Actualiza solo la propiedad 'profileImg' dentro de 'data'
    const updatedData = {
      ...userDoc.data().data, // Mantén las demás propiedades dentro de 'data'
      wallpaperImg: url,
    };

    // Actualiza el documento con la nueva información
    await updateDoc(userRef, {
      data: updatedData,
    });
  } catch (error) {
    console.error("Error updating wallpaper image:", error);
  }
};

export const productUpdate = async (id, updatedProduct) => {
  try {
    const productRef = doc(db, "products", id);

    // Obtén el documento actual
    const productDoc = await getDoc(productRef);


    console.log(updatedProduct.productImagePlacementData);
    const response = await updateDoc(productRef, {
      productImagePlacementData: updatedProduct.productImagePlacementData,
    });
    console.log(response);
  } catch (error) {
    console.error("Error updating product:", error);
  }
};

export const switchNetwork = async (userProvider) => {
  const chainId = process.env.NEXT_PUBLIC_CHAIN_ID;
  await userProvider.send("eth_requestAccounts", []);

  const userNetwork = await userProvider.getNetwork();

  const networkToAdd = {
    chainId: process.env.NEXT_PUBLIC_NETWORK_TARGET_ID,
    chainName: process.env.NEXT_PUBLIC_NETWORK_NAME,
    rpcUrls: [process.env.NEXT_PUBLIC_NETWORK_RPC] /* ... */,
  };

  if (userNetwork.chainId !== Number(chainId)) {
    // El usuario no está en la red correcta, esperar cambio de red
    await userProvider.send("wallet_addEthereumChain", [networkToAdd]);
  } else {
    // El proveedor está listo, cambiar de red si es necesario
    await userProvider.send("wallet_switchEthereumChain", [
      { chainId: process.env.NEXT_PUBLIC_NETWORK_TARGET_ID },
    ]);
  }
};
