import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore/lite";

const useProduct = (productId) => {
  const [product, setProduct] = useState();

  const getProduct = async () => {
    try {
      const productRef = doc(db, "products", productId);

      const response = await getDoc(productRef);

      if (response.exists()) {
        const productData = response.data();
        setProduct(productData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProduct();
  }, [productId]);

  return { product };
};

export default useProduct;
