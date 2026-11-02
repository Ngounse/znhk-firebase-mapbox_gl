import React, { useState, useEffect, useRef } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db } from 'src/firebase';

export default function useFecthProduct() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({});
  const [products, setProducts] = useState([]);

  const { currentUser } = useAuth();

  useEffect(() => {
    async function fetchProduct() {
      try {
        console.log('currentUser():::', currentUser);
        const docRef = doc(db, 'products', 'rJecaLMocd9Z2TyH3xZA');
        const docSnap = await getDoc(docRef);
        console.log('fetchProduct docSnap:::', docSnap.data());

        if (docSnap.exists()) {
          setProducts(docSnap.data().products);
        } else {
          setProducts([]);
          // doc.data() will be undefined in this case
          console.log('No such document!');
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, []);

  return { loading, error, products, setProducts };
}
