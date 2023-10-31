import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore/lite";
import { db } from "../firebase/config";

const useRawMaterials = () => {
  const [materias, setMaterias] = useState([]);

  const fetchRawMaterials = async () => {
    const materials = collection(db, "materia_prima");
    const q = query(materials);
    const response = await getDocs(q);

    const materiaData = [];
    response.forEach((doc) => {
      materiaData.push(doc.data());
    });

    console.log(response);
    setMaterias(materiaData); // Actualiza el estado con los datos de la consulta
  };

  useEffect(() => {
    fetchRawMaterials();
  }, []);

  return { materias };
};

export default useRawMaterials;
