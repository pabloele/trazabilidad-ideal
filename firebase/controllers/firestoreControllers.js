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

export const getUserProducts = async (uid) => {
  const id = await getDocId(uid);

  try {
    const userDocumentRef = doc(db, "users", id);
    const userDocumentSnapshot = await getDoc(userDocumentRef);

    if (userDocumentSnapshot.exists()) {
      const userData = userDocumentSnapshot.data();
      const userProducts = userData.products || [];
      return userProducts;
    } else {
      console.log("User document does not exist.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching user products:", error);
    return [];
  }
};

export const addProtocol = async () => {
  const protocolRef = collection(db, "protocols");

  await addDoc(protocolRef, {
    name: "Protocolo Ambiental",
    trazability: [
      {
        path:"",
        name: "Localización Geográfica",
        line: [
          {
            name: "Ubicación real",
            milestones: [],
          },
          {
            name: "Áreas de influencia",
            milestones: [],
          },
          {
            name: "Áreas para compensación",
            milestones: [],
          },
          {
            name: "Áreas de control",
            milestones: [],
          },
        ],
      },

      {
        name: "Requerimientos y Habilitaciones",
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
      },

      {
        name: "Normativa Ambiental",
        line: [
          {
            name: "Normas y otros requisitos",
            milestones: [],
          },
          {
            name: "Auditorías externas",
            milestones: [],
          },
        ],
      },

      {
        name: "Recepción y Almacenamiento de Materias Primas e Insumos - Subcontratación de Servicios",
        line: [
          {
            name: "Requisitos ambientales de compra o contratación",
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
      },
      {
        name: "Almacenamiento de Subproductos o Productos Finales",
        line: [
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
      },
      {
        name: "Despacho y Distribución de Subproductos o Productos Finales",
        line: [
          {
            name: "Requisitos ambientales de venta o transporte",
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
      },

      {
        name: "Comercialización de   Productos y/o Servicios",
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
      },

      {
        name: "Sistemas de Apoyo y Servicios Auxiliares",
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
      },

      {
        name: "Tratamiento, Transporte y/o Disposición Final de Residuos",
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
      },

      {
        name: "Evaluación de Desempeño",
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
      },
      {
        name: "Mejora Continua",
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
