import { useEffect } from 'react';
import {
  Alert,
  Button,
  Grid,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { Google } from '@mui/icons-material';
import { AuthLayout } from '../../layout';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { createUser } from '../../firebase/controllers/firestoreControllers';
import { FirebaseAuth } from '../../firebase/config';
import { getRedirectResult } from 'firebase/auth';
const LoginPage = () => {
  const { loginWithGoogle, login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [logingIn, setLogingIn] = useState(false);

  const onUserEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const onUserPasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e) => {
    try {
      const response = await login(email, password);
      console.log('Login successful: ', response);
      router.push('/home');
    } catch (error) {
      console.log(error);
    }
  };

  const handleLoginWithGoogle = (e) => {
    setLogingIn(true);
    loginWithGoogle().then((res) => {
      console.log(res.user.uid);

      createUser({
        uid: res.user.uid,
        data: { name: res.user.displayName, email: res.user.email },
        products: [],
      });
      if (res.user) {
        router.push('/home');
      }
    });
  };

  const handleRedirectResult = async () => {
    try {
      const result = await getRedirectResult(FirebaseAuth);

      if (result.user) {
        router.push('/home');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    handleRedirectResult();
  }, []);

  return (
    <>
      <AuthLayout title="Login" logingIn={logingIn}>
        <form
          // onSubmit={handleLogin}
          className="animate__animated animate__fadeIn animate__faster"
        >
          <Grid container>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <TextField
                label="Correo"
                type="email"
                placeholder="correo@google.com"
                fullWidth
                name="email"
                onChange={onUserEmailChange}
                value={email}
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <TextField
                label="Contraseña"
                type="password"
                placeholder="Contraseña"
                fullWidth
                name="password"
                onChange={onUserPasswordChange}
                value={password}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
            {/* <Grid item xs={12} display={!!errorMessage ? '' : 'none'}>
            <Alert severity="error">{errorMessage}</Alert>{' '}
          </Grid> */}

            <Grid item xs={12} sm={6}>
              <Link color="secondary.main" href="/home">
                <Button
                  onClick={handleLogin}
                  type="submit"
                  variant="contained"
                  fullWidth
                >
                  <Typography sx={{ ml: 1 }}>Login</Typography>
                </Button>
              </Link>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleLoginWithGoogle}
              >
                <Google />
                <Typography sx={{ ml: 1 }}>Google</Typography>
              </Button>
            </Grid>
          </Grid>
        </form>
        <Grid container direction="row" justifyContent="end">
          <Link color="secondary.black" href="/RegisterPage">
            Crear una cuenta
          </Link>
        </Grid>
      </AuthLayout>
    </>
  );
};

export default LoginPage;
