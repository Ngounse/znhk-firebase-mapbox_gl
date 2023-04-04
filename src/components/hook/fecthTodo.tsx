import React, { useState, useEffect, useRef } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../Context/AuthContext";
import { db } from "../../../firebase";

export default function useFecthTodo() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({});
  const [todos, setTodos] = useState(null);

  const { currentUser } = useAuth();

  useEffect(() => {
    async function fetchTodo() {
      try {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log("docSnap:::", docSnap.data());
          setTodos(docSnap.data().todos);
        } else {
          setTodos({});
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    fetchTodo();
  }, []);

  return { loading, error, todos, setTodos };
}
