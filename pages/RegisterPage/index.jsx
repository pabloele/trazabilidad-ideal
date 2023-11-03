import { useState } from 'react';

import {
  Alert,
  Button,
  Grid,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { AuthLayout } from '../../layout';
import styles from './RegisterPage.module.css';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useForm } from '../../hooks/useForm';

const initialForm = {
  username: '',
  email: '',
  password: '',
};

const formValidations = {
  email: [(value) => value.includes('@'), 'Proporcione un email válido.'],
  password: [
    (value) => value.length >= 6,
    'La contraseña debe tener más de seis caracteres.',
  ],
  username: [(value) => value.length >= 1, 'El nombre es obligatorio'],
};

const RegisterPage = () => {
  const { user, loginWithGoogle, logout, error, login, signup } = useAuth();
  const router = useRouter();
  const [showErrors, setShowErrors] = useState(false);
  const {
    username,
    password,
    email,
    onInputChange,
    formState,
    passwordValid,
    emailValid,
    usernameValid,
    isFormValid,
  } = useForm(initialForm, formValidations);

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      setShowErrors(true);
      return;
    }
    try {
      const response = await signup(email, password);
      console.log(response);
      router.push('/home');
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <AuthLayout title="Registro">
      <form
        onSubmit={handleSignUp}
        className={`animate__animated animate__fadeIn animate__faster ${styles.form}`}
      >
        <Grid container>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              label="Nombre completo"
              type="text"
              placeholder="Nombre completo"
              fullWidth
              name="username"
              value={username}
              onChange={onInputChange}
              error={showErrors && usernameValid}
              helperText={showErrors && usernameValid}
            />
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              label="Correo"
              type="email"
              placeholder="correo@google.com"
              fullWidth
              name="email"
              value={email}
              onChange={onInputChange}
              error={showErrors && emailValid}
              helperText={showErrors && emailValid}
            />
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              label="Contraseña"
              type="password"
              placeholder="Contraseña"
              fullWidth
              name="password"
              value={password}
              onChange={onInputChange}
              error={showErrors && passwordValid}
              helperText={showErrors && passwordValid}
            />
          </Grid>
        </Grid>
        <Grid
          //   display={!!errorMessage ? '' : 'none'}
          container
          spacing={2}
          sx={{ mb: 2, mt: 1 }}
        >
          <Grid item xs={12}>
            {/* <Alert severity="error">{errorMessage}</Alert>{' '} */}
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" fullWidth>
              <Typography sx={{ ml: 1 }}>Crear cuenta</Typography>
            </Button>
          </Grid>
        </Grid>
      </form>
      <Grid container direction="row" justifyContent="end">
        <Typography sx={{ ml: 1, mr: 1, color: 'secondary.black' }}>
          ¿Ya tenés una cuenta?
        </Typography>
        <Link href="/LoginPage">
          <Typography sx={{ ml: 1, mr: 1, color: 'crypto.main' }}>
            Ingresar
          </Typography>
        </Link>
      </Grid>
    </AuthLayout>
  );
};

export default RegisterPage;
