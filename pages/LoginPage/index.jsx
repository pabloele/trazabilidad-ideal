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

const handleLogin = async () => {
  try {
    await login(email, password);
    console.log('Login successful');
    router.push('/protected');
  } catch (error) {
    console.log(error);
  }
};

const LoginPage = () => {
  const { user, loginWithGoogle, logout, error, loginWithEmail } = useAuth();

  const router = useRouter();
  // const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // try {
    //   await login(email, password);
    //   console.log('Login successful');
    //   router.push('/protected');
    // } catch (error) {
    //   console.log(error);
    // }
  };

  const handleLoginWithGoogle = (e) => {
    loginWithGoogle().then((res) => {
      console.log(res.user);

      // createUser({
      //   uid: user.uid,
      //   data: { name: user.displayName, email: user.email },
      //   products: [],
      // });
      if (res.user) router.push('/HomePage');
    });
  };
  return (
    <>
      <AuthLayout title="Login">
        <form
          // onSubmit={onSubmit}
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
                //   onChange={onInputChange}
                //   value={email}
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <TextField
                label="Contraseña"
                type="password"
                placeholder="Contraseña"
                fullWidth
                name="password"
                //   onChange={onInputChange}
                //   value={password}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
            {/* <Grid item xs={12} display={!!errorMessage ? '' : 'none'}>
            <Alert severity="error">{errorMessage}</Alert>{' '}
          </Grid> */}

            <Grid item xs={12} sm={6}>
              <Link color="secondary.main" href="/HomePage">
                <Button type="submit" variant="contained" fullWidth>
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
