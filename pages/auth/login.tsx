import Head from 'next/head';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  Grid,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {useState} from 'react';
import {useAuth} from 'src/context/AuthContext';
import {useRouter} from 'next/router';
import {RedditTextField} from 'src/components/ZNHKField';
import {Copyright} from '@mui/icons-material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const {login} = useAuth();
  const {currentUser} = useAuth();
  const router = useRouter();

  if (!!currentUser) {
    router.push('/dashboard');
    return null;
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError(true);
      setErrorMessage('Please enter email and password');
      return;
    }
    try {
      await login(email, password);
      setErrorMessage('Successfully logged in');
      setError(false);
      router.push('/dashboard');
    } catch (error) {
      const errMessage = error?.message;

      if (errMessage.includes('user-not-found')) {
        setErrorMessage('User does not exist');
      }
      if (errMessage.includes('wrong-password')) {
        setErrorMessage('Invalid password');
      }
      setError(true);
    }
    return;
  };

  const handleRegister = () => {
    router.push('/auth/register');
    setErrorMessage('');
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <Grid container spacing={2} justifyContent={'center'}>
        <Grid item lg={4} md={4} sm={6} xs={12}>
          <Box gap={2} display={'flex'} flexDirection={'column'}>
            <Typography variant="h4">Login</Typography>
            <Typography color={error ? '#f00' : '#0ff'} variant="subtitle2">
              {errorMessage}
            </Typography>
            <RedditTextField
              label="Email"
              variant="filled"
              value={email}
              onChange={handleEmailChange}
            />
            <RedditTextField
              type="password"
              label="Password"
              variant="filled"
              value={password}
              onChange={handlePasswordChange}
            />
            <Button variant="outlined" onClick={handleLogin}>
              Login
            </Button>

            <Stack flexDirection={'row'} justifyContent={'flex-end'}>
              <Typography variant="subtitle2">
                Don't have an account?
              </Typography>
              <Typography
                onClick={handleRegister}
                variant="subtitle2"
                color={'#0ff'}
                pl={1}
                sx={{
                  cursor: 'pointer',
                }}>
                Register
              </Typography>
            </Stack>
          </Box>
        </Grid>
      </Grid>
      {/* <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{mt: 3, mb: 2}}>
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{mt: 8, mb: 4}} />
      </Container> */}
    </>
  );
}
