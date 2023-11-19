import React, { useEffect, useState } from "react";
import { collection, query, getDocs } from "firebase/firestore/lite";
import { db } from "../firebase/config";

const useProtocols = () => {
  const [protocols, setProtocols] = useState();
  const [loading, setLoading] = useState(false);

  const fetchProtocols = async () => {
    try {
      setLoading(true);
      const protocols = collection(db, "protocols");

      const q = query(protocols);

      const response = await getDocs(q);

      console.log(response.docs);
      const protocolData = [];

      response.forEach((doc) => {
        protocolData.push(doc.data());
      });

      setProtocols(protocolData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProtocols();
  }, []);
  return {
    protocols,
    loading,
  };
};

export default useProtocols;
