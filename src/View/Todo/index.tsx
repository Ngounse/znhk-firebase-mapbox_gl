import {useEffect, useState} from 'react';
import TodoCard from 'src/View/Todo/TodoCard';
import TextField from '@mui/material/TextField';
import {FOOT_NAV_HEIGHT, TOP_NAV_HEIGHT} from 'components/Layout';
import {useAuth} from 'src/context/AuthContext';
import {Box, Button, Grid, Stack, Typography} from '@mui/material';
import {doc, setDoc, deleteField} from 'firebase/firestore';
import {db} from 'src/firebase';
import useFecthTodo from 'src/hook/fecthTodo';
import {CardList} from 'src/View/Todo/CardLoading';
import {useRouter} from 'next/router';

export default function TodosPage() {
  const {userInfo, currentUser} = useAuth();
  const [edit, setEdit] = useState(null);
  const [todo, setTodo] = useState('');
  const [edittedValue, setEdittedValue] = useState('');
  const {todos, setTodos, loading, error} = useFecthTodo();
  const [addTodo, setAddTodo] = useState(false);
  const router = useRouter();

  if (currentUser === null) {
    router.push('/auth/login');
    return null;
  }

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

  async function handelAddTodo() {
    if (!todo) return;

    const newKey =
      Object.keys(todos).length === 0 ? 1 : Math.max(...Object.keys(todos)) + 1;
    setTodos({...todos, [newKey]: todo});
    const userRef = doc(db, 'users', currentUser.uid);
    await setDoc(userRef, {todos: {...todos, [newKey]: todo}}, {merge: true});
    setTodo('');
  }

  function handleAddEdit(todoKey) {
    return () => {
      setEdit(todoKey);
      setEdittedValue(todos[todoKey]);
    };
  }

  async function handleEditTodo() {
    if (!edittedValue) {
      return;
    }
    const newKey = edit;
    setTodos({...todos, [newKey]: edittedValue});
    const userRef = doc(db, 'users', currentUser.uid);
    await setDoc(
      userRef,
      {
        todos: {
          [newKey]: edittedValue,
        },
      },
      {merge: true},
    );
    setEdit(null);
    setEdittedValue('');
  }

  const isObject = Object.keys == undefined;
  console.log('isObject::', isObject);

  function handleDelete(todoKey: any) {
    return async () => {
      const tempObj = {...todos};
      delete tempObj[todoKey];
      setTodos(tempObj);
      const userRef = doc(db, 'users', currentUser.uid);
      const a = await setDoc(
        userRef,
        {
          todos: {
            [todoKey]: deleteField(),
          },
        },
        {merge: true},
      );
    };
  }

  return (
    <>
      <Grid container spacing={2} justifyContent={'center'} flex={1}>
        <Grid item lg={8} sm={10} xs={12}>
          <Box gap={2} display={'flex'} flexDirection={'column'}>
            <Typography variant={'h4'}>Todo List</Typography>
            {!addTodo && (
              <Button onClick={handleAddTodo} variant="outlined">
                Add Todo
              </Button>
            )}
            {!!addTodo && (
              <Box
                display={'flex'}
                flex={1}
                sx={{
                  border: '1px solid #e2e2e1',
                  borderRadius: 1,
                  backgroundColor: '#cacaca',
                  overflow: 'auto',
                }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={todo}
                  onChange={handleTodoChange}
                  size="small"
                />
                <Button
                  onClick={handelAddTodo}
                  variant="contained"
                  color="success">
                  Add
                </Button>
              </Box>
            )}
            {!!loading && (
              <>
                <CardList />
              </>
            )}
            {!loading && (
              <Stack
                gap={1}
                overflow={'auto'}
                sx={{
                  maxHeight: `calc(100vh - ${TOP_NAV_HEIGHT}px - ${FOOT_NAV_HEIGHT}px - 120px)`,
                }}>
                {Object?.keys(todos).map((todo, index) => {
                  return (
                    <TodoCard
                      key={index}
                      edit={edit}
                      todoKey={todo}
                      handleDelete={handleDelete}
                      edittedValue={edittedValue}
                      handleAddEdit={handleAddEdit}
                      handleEditTodo={handleEditTodo}
                      setEdittedValue={setEdittedValue}>
                      {todos[todo]}
                    </TodoCard>
                  );
                })}
              </Stack>
            )}
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
