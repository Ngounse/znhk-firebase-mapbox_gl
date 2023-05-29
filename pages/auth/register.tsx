import Head from 'next/head';
import {Box, Button, Grid, Stack, Typography} from '@mui/material';
import {useState} from 'react';
import {useAuth} from 'src/context/AuthContext';
import {useRouter} from 'next/router';
import {RedditTextField} from 'src/components/ZNHKField';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const {signup} = useAuth();
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

  const handleRegister = async () => {
    if (!email || !password) {
      setError(true);
      setErrorMessage('Please enter email and password');
      return;
    }
    try {
      return await signup(email, password);
    } catch (error) {
      const errMessage = error?.message;

      if (errMessage.includes('email-already-in-use')) {
        setErrorMessage('Email already in use');
      }
      if (errMessage.includes('weak-password')) {
        setErrorMessage('Password is too weak (minimum 6 characters)');
      }
      if (errMessage.includes('invalid-email')) {
        setErrorMessage('Invalid email address');
      }
      setError(true);
    }
  };

  const handlelogin = () => {
    router.push('/auth/login');
    setErrorMessage('');
  };

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <Grid container spacing={2} justifyContent={'center'}>
        <Grid item lg={4} md={4} sm={6} xs={12}>
          <Box gap={2} display={'flex'} flexDirection={'column'}>
            <Typography variant="h4">Register</Typography>
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
            <Button variant="outlined" onClick={handleRegister}>
              Register
            </Button>

            <Stack flexDirection={'row'} justifyContent={'flex-end'}>
              <Typography variant="subtitle2">
                Already have an account
              </Typography>
              <Typography
                onClick={handlelogin}
                variant="subtitle2"
                color={'#0ff'}
                pl={1}
                sx={{
                  cursor: 'pointer',
                }}>
                Login
              </Typography>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
