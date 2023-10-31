import { useState } from "react";

import {
  Alert,
  Button,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { AuthLayout } from "../../layout";
import styles from "./RegisterPage.module.css";
const RegisterPage = () => {
  return (
    <AuthLayout title="Registro">
      <form
        // onSubmit={onSubmit}
        className={`animate__animated animate__fadeIn animate__faster ${styles.form}`}
      >
        <Grid container>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              label="Nombre completo"
              type="text"
              placeholder="Juan Perez"
              fullWidth
              name="displayName"
            />
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              label="Correo"
              type="email"
              placeholder="correo@google.com"
              fullWidth
              name="email"
            />
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              label="Contraseña"
              type="password"
              placeholder="Contraseña"
              fullWidth
              name="password"
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
        <Typography sx={{ ml: 1, mr: 1, color: "secondary.black" }}>
          ¿Ya tenés una cuenta?
        </Typography>
        <Link href="/LoginPage">
          <Typography sx={{ ml: 1, mr: 1, color: "crypto.main" }}>
            Ingresar
          </Typography>
        </Link>
      </Grid>
    </AuthLayout>
  );
};

export default RegisterPage;
