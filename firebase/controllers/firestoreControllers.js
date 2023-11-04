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
} from 'firebase/firestore/lite';
import { db } from '../config';
import { v4 as uuidv4 } from 'uuid';

export const usersCollectionRef = collection(db, 'users');

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
  const usersQuery = query(usersCollectionRef, where('uid', '==', uid));
  const userDocs = await getDocs(usersQuery);

  if (userDocs.empty) {
    // El usuario no existe, entonces podemos crearlo
    await addDoc(usersCollectionRef, { ...payload });
    console.log('Usuario creado exitosamente.');
  } else {
    // El usuario ya existe, muestra un mensaje de error o realiza alguna otra acción
    console.log('El usuario ya existe en la base de datos.');
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
    const productsCollection = collection(db, 'products');

    const docRef = await addDoc(productsCollection, product);
    console.log('Documento agregado con éxito', docRef.id);

    return docRef.id;
  } catch {
    console.log(error);
  }
};
export const addMilestone = async (uid, path, milestone) => {
  const milestoneId = uuidv4();
  const id = await getDocId(uid);
  const userDocumentRef = await doc(db, 'users', id);
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
  const userDoc = doc(db, 'users', id);
  await deleteDoc(userDoc);
};

export const getUserProducts = async (uid) => {
  const id = await getDocId(uid);

  try {
    const userDocumentRef = doc(db, 'users', id);
    const userDocumentSnapshot = await getDoc(userDocumentRef);

    if (userDocumentSnapshot.exists()) {
      const userData = userDocumentSnapshot.data();
      const userProducts = userData.products || [];
      return userProducts;
    } else {
      console.log('User document does not exist.');
      return [];
    }
  } catch (error) {
    console.error('Error fetching user products:', error);
    return [];
  }
};

export const addProtocol = async () => {
  const protocolRef = collection(db, 'protocols');

  await addDoc(protocolRef, {
    name: 'agroalimentario',
    trazability: [
      {
        name: 'Producción',
        line: [
          {
            name: 'Origen de la producción',
            milestones: [],
            path: '/vino1/produccion-primaria/etapa1',
          },
          {
            name: 'Características fenológicas / ciclos',
            milestones: [],
            path: '/vino1/produccion-primaria/etapa2',
          },
          {
            name: 'Métodos de cultivo / cría',
            milestones: [],
            path: '/vino1/produccion-primaria/etapa3',
          },
          {
            name: 'Registros fitosanitarios / sanidad',
            milestones: [],
            path: '/vino1/produccion-primaria/misc',
          },
          {
            name: 'Caracteristicas adicionales',
            milestones: [],
            path: '/vino1/produccion-primaria/misc',
          },
        ],
      },
      {
        name: 'Elaboracion / Procesamiento',
        line: [
          {
            name: 'Procesos de elaboración',
            milestones: [],
            path: '/vino1/elaboracion/etapa1',
          },
          {
            name: 'Etiquetado y empaque',
            milestones: [],
            path: '/vino1/elaboracion/etapa2',
          },
          {
            name: 'Normativa aplicable',
            milestones: [],
            path: '/vino1/elaboracion/etapa3',
          },
          {
            name: 'Capacitación del personal',
            milestones: [],
            path: '/vino1/elaboracion/misc',
          },
          {
            name: 'Auditorías y verificaciones',
            milestones: [],
            path: '/vino1/elaboracion/misc',
          },
          {
            name: 'Caracteristicas adicionales',
            milestones: [],
            path: '/vino1/produccion-primaria/misc',
          },
        ],
      },
      {
        name: 'Despacho / Distribución',
        line: [
          {
            name: 'Transporte',
            milestones: [],
            path: '/vino1/despacho/etapa1',
          },
          {
            name: 'Almacenamiento',
            milestones: [],
            path: '/vino1/despacho/etapa2',
          },
          {
            name: 'Caracteristicas adicionales',
            milestones: [],
            path: '/vino1/produccion-primaria/misc',
          },
        ],
      },
      {
        name: 'Comercialización',
        line: [
          {
            name: 'Trazabilidad del producto',
            milestones: [],
            path: '/vino1/comercializacion/etapa1',
          },
          {
            name: 'Caracteristicas adicionales',
            milestones: [],
            path: '/vino1/produccion-primaria/misc',
          },
        ],
      },
    ],
  });
};
