import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore/lite";
import { useProductStore } from "../store";
import { productUpdate } from "../firebase/controllers/firestoreControllers"

const useProduct = (productId) => {
  const { setProductData, product } = useProductStore();

  const getProduct = async () => {
    try {
      const productRef = doc(db, "products", productId);

      const response = await getDoc(productRef);

      if (response.exists()) {
        const productData = response.data();

        setProductData({ ...productData, id: productId });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const uploadQr = async (product, qrcode) => {
    const productRef = doc(db, "products", productId);

    const productWithQr = { ...product, qrcode };

    const response = await setDoc(productRef, productWithQr, { merge: true });

    console.log(response);
  };

  const uploadProduct = async (updateProduct) => {
    try {
      const productRef = doc(db, "products", productId);

      const response = await setDoc(productRef, updateProduct, { merge: true });

      updateProduct(updateProduct);
    } catch (error) {
      console.log(error);
    }
  };

  const updateProductById  = async (updatedProduct) => {
    try {
      productUpdate(productId, updatedProduct);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProduct();
  }, [productId]);

  return { product, uploadProduct, uploadQr, setProductData, updateProductById};
};

export default useProduct;
