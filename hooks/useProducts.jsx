import React, { useEffect, useState } from "react";
import { collection, getDoc, getDocs } from "firebase/firestore/lite";
import { db } from "../firebase/config";
const useProducts = () => {
  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    const productsRef = collection(db, "products");

    const response = await getDocs(productsRef);

    const productsData = [];
    response.forEach((doc) => {
      productsData.push({
        id: doc.id, // Agregar el ID del documento
        ...doc.data(), // Agregar los datos del documento
      });
    });

    setProducts(productsData);
  };

  useEffect(() => {
    getProducts();
  }, []);

  return {
    products,
    setProducts,
  };
};

export default useProducts;
