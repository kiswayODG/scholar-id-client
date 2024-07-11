import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import * as Yup from "yup";

import { Navigation } from "appConfigs/Navigation";
import { useState } from "react";
import {
  AuthenticationResponse,
  UserInterface,
} from "@modules/users/model/UserInterface";
import { apiClient } from "app-api/api";
import { setToken, setUserConnected } from "utilities/Utils";
import { Navigate, useNavigate } from "react-router";
import { Form, useFormik } from "formik";

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Tout droit reservé - Propriété intellectuelle © "}
      {/* <Link color="inherit" href="https://mui.com/">
        TiqKis
      </Link>{" "} */}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

interface viewStateI {
  username: string;
  password: string;
  error: string;
}

export default function Login() {
  const validateSchema = Yup.object().shape({
    username: Yup.string().required("Veuillez renseigner un username"),
    password: Yup.string().required("veuillez renseigner un mot de passe"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: validateSchema,

    async onSubmit(values, formikHelpers) {
      let user: UserInterface = {
        username: values.username,
        password: values.password,
      };

      await apiClient.users
        .userLogin(user)  
        .then((res) => {
          let result = res.data as AuthenticationResponse;
          
          if (result.logged == true) {
            setToken(result.token);
            setUserConnected(result.user);
            navigate(Navigation.DASHBOARD);
          } else {
            setState((prevState) => ({
              ...prevState,
              error: "Nom d'utilisateur ou mot de passe incorrect !",
            }));
            return;
          }
        })
        .catch((error) => console.log(error));
     },
  });

  const [state, setState] = useState<viewStateI>({
    username: "",
    error: "",
    password: "",
  });

  const navigate = useNavigate();


  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={4}
          sm={8}
          md={7}
          className="bg-blue-200 w-16"
          sx={{
            backgroundImage:
              "url(https://source.unsplash.com/random?wallpapers)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Connexion
            </Typography>
            <label className="errorLabel text-red-600">{state.error}</label>
            <form className="w-3/4" onSubmit={formik.handleSubmit}>
              {" "}
                <TextField
                  margin="normal"
                  size="small"
                  label="Nom d'utilisateur"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  fullWidth
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.username && Boolean(formik.errors.username)
                  }
                  helperText={formik.touched.username && formik.errors.username}
                />

                <br />
                <TextField
                  margin="normal"
                  size="small"
                  name="password"
                  label="Mot de passe"
                  type="password"
                  autoComplete="current-password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                  fullWidth
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  onClick={()=>{formik.handleSubmit()}}
                  sx={{ mt: 3, mb: 2 }}
                  // href={Navigation.DASHBOARD}
                >
                  Se connecter
                </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Mot de passe oublié?
                  </Link>
                </Grid>

                <Grid item>
                  <Link href={Navigation.NEW_USER} variant="body2">
                    {"Nouveau compte"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </form>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
