import { useEffect } from "react";
import {
  Alert,
  Button,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { Google } from "@mui/icons-material";
import { AuthLayout } from "../../layout";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { createUser } from "../../firebase/controllers/firestoreControllers";
import { FirebaseAuth } from "../../firebase/config";
import { getRedirectResult } from "firebase/auth";
import { useForm } from "../../hooks/useForm";

const initialForm = {
  email: "",
  password: "",
};

const formValidations = {
  email: [(value) => value.includes("@"), "Proporcione un email válido."],
  password: [
    (value) => value.length >= 6,
    "La contraseña debe tener más de seis caracteres.",
  ],
};

const LoginPage = () => {
  const { loginWithGoogle, login } = useAuth();
  const router = useRouter();

  const [logingIn, setLogingIn] = useState(false);
  const [error, setError] = useState("");

  const [showErrors, setShowErrors] = useState(false);

  const {
    password,
    email,
    onInputChange,
    formState,
    passwordValid,
    emailValid,
    usernameValid,
    isFormValid,
  } = useForm(initialForm, formValidations);

  const onUserEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const onUserPasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      setShowErrors(true);
      return;
    }

    try {
      const response = await login(email, password);

      console.log(response);
      console.log("Login successful: ", response);
    } catch (error) {
      setError("Usuario o contraseña incorrectos");

      setTimeout(() => {
        setError("");
      }, 3000);
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
        router.push("/home");
      }
    });
  };

  const handleRedirectResult = async () => {
    try {
      const result = await getRedirectResult(FirebaseAuth);

      if (result.user) {
        router.push("/home");
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
            {error && (
              <Typography
                sx={{
                  textAlign: "center",
                  width: "100%",
                  color: "#FF3E3E",
                }}
              >
                {error}
              </Typography>
            )}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <TextField
                label="Correo"
                type="email"
                placeholder="correo@google.com"
                fullWidth
                name="email"
                onChange={onInputChange}
                error={showErrors && emailValid}
                helperText={showErrors && emailValid}
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
                onChange={onInputChange}
                value={password}
                error={showErrors && passwordValid}
                helperText={showErrors && passwordValid}
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
