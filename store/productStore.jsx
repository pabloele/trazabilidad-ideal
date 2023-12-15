// import { create } from 'zustand';
// import { getUserProducts } from '../firebase/controllers/firestoreControllers';

// export const productsStore = create((set) => ({
//   products: [],
//   fetchUserProducts: async (uid) => {
//     console.log(uid);
//     try {
//       const userProducts = await getUserProducts(uid);
//       console.log(userProducts);
//       set({ products: userProducts });
//       return userProducts;
//     } catch (error) {
//       console.error('Error fetching user products:', error);
//       return []; // Return an empty array or handle the error accordingly
//     }
//   },
// }));

import { create } from "zustand";

export const useProductStore = create((set) => ({
  product: [],
  setProductData: (newProductData) => set({ product: newProductData }),
}));
