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

const LoginPage = () => {
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
              <Button variant="contained" fullWidth>
                <Google />
                <Typography sx={{ ml: 1 }}>Google</Typography>
              </Button>
            </Grid>
          </Grid>
        </form>
        <Grid container direction="row" justifyContent="end">
          <Link color="secondary.main" href="/RegisterPage">
            Crear una cuenta
          </Link>
        </Grid>
      </AuthLayout>
    </>
  );
};

export default LoginPage;
