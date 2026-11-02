import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAuth } from 'src/context/AuthContext';
import useFecthProduct from 'src/hook/fecthProduct';
import { doc, setDoc, deleteField } from 'firebase/firestore';
import { db } from 'src/firebase';

export default function ProductsPage() {
  const { userInfo, currentUser } = useAuth();
  const [edit, setEdit] = useState(null);
  const [todo, setTodo] = useState('');
  const [edittedValue, setEdittedValue] = useState('');
  const { products, setProducts, loading, error } = useFecthProduct();
  const [addTodo, setAddTodo] = useState(false);
  const router = useRouter();
  const [product, setProduct] = useState({
    price: 0,
    showDis: false,
    disPrice: 0,
    name: ''
  });

  console.log('products:::', products);

  // if (currentUser === null) {
  //   router.push('/auth/login');
  //   return null;
  // }

  const handleAddTodo = () => {
    setAddTodo(true);
  };

  const handleTodoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodo(e.target.value);
  };

  // useEffect(() => {
  //   if (!userInfo || Object.keys(userInfo).length === 0) {
  //     setAddTodo(true);
  //   }
  // }, [userInfo]);

  // async function handelAddTodo() {
  //   if (!todo) return;

  //   const newKey =
  //     Object.keys(products).length === 0 ? 1 : Math.max(...Object.keys(products)) + 1;
  //   setProducts({...products, [newKey]: todo});
  //   const userRef = doc(db, 'users', currentUser.uid);
  //   await setDoc(userRef, {products: {...products, [newKey]: todo}}, {merge: true});
  //   setTodo('');
  // }

  // function handleAddEdit(todoKey) {
  //   return () => {
  //     setEdit(todoKey);
  //     setEdittedValue(products[todoKey]);
  //   };
  // }

  // async function handleEditTodo() {
  //   if (!edittedValue) {
  //     return;
  //   }
  //   const newKey = edit;
  //   setProducts({...products, [newKey]: edittedValue});
  //   const userRef = doc(db, 'users', currentUser.uid);
  //   await setDoc(
  //     userRef,
  //     {
  //       products: {
  //         [newKey]: edittedValue,
  //       },
  //     },
  //     {merge: true},
  //   );
  //   setEdit(null);
  //   setEdittedValue('');
  // }

  const isObject = Object.keys == undefined;
  console.log('isObject::', isObject);

  // function handleDelete(todoKey: any) {
  //   return async () => {
  //     const tempObj = {...products};
  //     delete tempObj[todoKey];
  //     setProducts(tempObj);
  //     const userRef = doc(db, 'users', currentUser.uid);
  //     const a = await setDoc(
  //       userRef,
  //       {
  //         products: {
  //           [todoKey]: deleteField(),
  //         },
  //       },
  //       {merge: true},
  //     );
  //   };
  // }

  async function handleAddProduct(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;

    const newKey = Object.keys(products).length === 0 ? 1 : Math.max(...Object.keys(products)) + 1;
    const userRef = doc(db, 'products', 'rJecaLMocd9Z2TyH3xZA');
    const _products: [] = products;
    _products.push(product);

    await setDoc(
      userRef,
      {
        products: _products,
      },
      { merge: true },
    );

    // setProduct({
    //   price: 0,
    //   showDis: false,
    //   disPrice: 0,
    //   name: ''
    // });
  }

  return (
    <>
      <h1>Products</h1>
      <p>{product.name}</p>
      <p>Price: ${product.price.toFixed(2)}</p>
      {product.showDis && (
        <p>Discounted Price: ${product.disPrice.toFixed(2)}</p>
      )}
      <form onSubmit={(e) => {
        e.preventDefault();
        // Handle form submission logic here
        handleAddProduct(e);
      }}>
        <label>
          Name:
          <input
            type="text"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
          />
        </label>
        <br />
        <label>
          Price:
          <input
            type="number"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) || 0 })}
          />
        </label>
        <br />
        <label>
          Discounted Price:
          <input
            type="number"
            value={product.disPrice}
            onChange={(e) => setProduct({ ...product, disPrice: parseFloat(e.target.value) || 0 })}
          />
        </label>
        <br />
        <label>
          Show Discount:
          <input
            type="checkbox"
            checked={product.showDis}
            onChange={(e) => setProduct({ ...product, showDis: e.target.checked })}
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
      <h2>Products List</h2>
      <ul>
        {products && Object.keys(products).map((key) => (
          <li key={key}>
            {products[key].name} - ${products[key].price.toFixed(2)}
            {/* {products[key].showDis && (
              <span> (Discounted: ${products[key].disPrice.toFixed(2)})</span>
            )} */}
          </li>
        ))}
      </ul>
      {error && <p>Error: {error.message}</p>}
      {loading && <p>Loading...</p>}
      {JSON.stringify(product)}
      {JSON.stringify(products)}
    </>
  );
}
