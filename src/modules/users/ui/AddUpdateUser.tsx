import {
  Box,
  createTheme,
  CssBaseline,
  Grid,
  Paper,
  ThemeProvider,
} from "@mui/material";
import { UserInterface } from "../model/UserInterface";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { Console } from "console";
import { apiClient } from "app-api/api";
import Controls from "@components/controls";
import { HttpStatusCode } from "axios";

interface viewPropsI {
  user?: UserInterface;
  onCancel?: () => void;
}

interface viewState {}

const AddUpdateUser: React.FC<viewPropsI> = ({ user, onCancel }) => {
  const navigate = useNavigate();

  const validateSchema = Yup.object().shape({
    nom: Yup.string().required("Veuillez renseigner le nom !"),
    prenom: Yup.string().required("Veuillez renseigner le nom !"),

    username: Yup.string().required(
      "veuillez renseigner le nom d'utilisateur !"
    ),
    password: Yup.string().required("veuillez renseigner le mot de passe !"),
    confirmedPassword: Yup.string()
      .required()
      .oneOf(
        [Yup.ref("password"), ""],
        "Les mots de passe ne correspondent pas"
      ),
    adresse: Yup.string().required("veuillez renseigner la localité !"),
    telephone: Yup.string()
      .required("Veuillez renseigner le téléphone !")
      .matches(
        /^\d{8}$/,
        "Le numéro de téléphone doit contenir exactement 8 chiffres"
      ),
  });

  const formik = useFormik({
    initialValues: {
      id: user?.id || 0,
      nom: user?.nom || "",
      prenom: user?.prenom || "",
      sexe: user?.sexe || null,
      username: user?.username || "",
      password: "",
      telephone: user?.telephone || "",
      dateNaiss: user?.dateNaissance || "",
      adresse: user?.adresse || "",
      confirmedPassword: "",
    },
    validationSchema: validateSchema,

    async onSubmit(values, formikHelpers) {
      let userToregister: UserInterface = {
        id: values.id,
        nom: values.nom,
        prenom: values.prenom,
        username: values.username,
        password: values.password,
        sexe: values.sexe,
        telephone: values.telephone,
        dateNaissance: values.dateNaiss,
      };
      // toast.promise(
      await apiClient.users
        .createUser(userToregister)
        .then((res) => {
          if (res.status == HttpStatusCode.Ok) {
            navigate("/login");
          }
        })
        .catch((error) => {
          console.log(error);
        });
      //     {
      //       pending: 'Demande en traitement',
      //       success: 'Utilisateur créé avec succès !',
      //       error: 'Une erreur lors du traitement !'
      //     }
      // )
    },
  });

  const defaultTheme = createTheme();

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <Grid container component="main" sx={{ height: "100vh" }}>
          <CssBaseline />
          <Grid
            item
            xs={12}
            sm={8}
            md={7}
            component={Paper}
            elevation={6}
            square
          >
            <Box
              sx={{
                mt: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Controls.TextFieldComponent
                label="Nom"
                name="nom"
                onChange={formik.handleChange}
                value={formik.values.nom}
                helperText={formik.touched.nom && formik.errors.nom}
                error={formik.touched.nom && Boolean(formik.errors.nom)}
                required
                size="small"
                className="w-3/5"
              />

              <Controls.TextFieldComponent
                label="Prénom"
                name="prenom"
                onChange={formik.handleChange}
                value={formik.values.prenom}
                helperText={formik.touched.prenom && formik.errors.prenom}
                error={formik.touched.prenom && Boolean(formik.errors.prenom)}
                size="small"
                className="w-3/5"
              />

              <Controls.TextFieldComponent
                label="No. Telephone"
                name="telephone"
                onChange={formik.handleChange}
                value={formik.values.telephone}
                helperText={formik.touched.telephone && formik.errors.telephone}
                error={
                  formik.touched.telephone && Boolean(formik.errors.telephone)
                }
                required
                size="small"
                className="w-3/5"
              />

              <Controls.TextFieldComponent
                label="Nom d'utilisateur"
                name="username"
                onChange={formik.handleChange}
                value={formik.values.username}
                helperText={formik.touched.username && formik.errors.username}
                error={
                  formik.touched.username && Boolean(formik.errors.username)
                }
                required
                size="small"
                className="w-3/5"
              />

              <Controls.TextFieldComponent
                label="Mot de passe"
                name="password"
                type="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                helperText={formik.touched.password && formik.errors.password}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                required
                size="small"
                className="w-3/5"
              />

              <Controls.TextFieldComponent
                label="Confirmer Mot de passe"
                name="confirmedPassword"
                type="password"
                onChange={formik.handleChange}
                value={formik.values.confirmedPassword}
                helperText={
                  formik.touched.confirmedPassword &&
                  formik.errors.confirmedPassword
                }
                error={
                  formik.touched.confirmedPassword &&
                  Boolean(formik.errors.confirmedPassword)
                }
                required
                size="small"
                className="w-3/5"
              />

              {/* <Controls.TextFieldComponent
                    label="Email"
                    name="email"
                    type="email"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    helperText={formik.touched.email && formik.errors.email}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    size="small"
                    className="w-3/5"
                  /> */}

              <Controls.TextFieldComponent
                label="Localité"
                name="adresse"
                onChange={formik.handleChange}
                value={formik.values.adresse}
                helperText={formik.touched.adresse && formik.errors.adresse}
                error={formik.touched.adresse && Boolean(formik.errors.adresse)}
                size="small"
                className="w-3/5"
              />
            </Box>
            <Box className="flex flex-row justify-end space-x-3 mr-40">
              <Controls.CancelButton title="Annuler" href="/" />
              <Controls.OnActionButton
                type="button"
                titre="Valider"
                onAction={formik.handleSubmit}
              />
            </Box>
          </Grid>
          <Grid
            item
            xs={4}
            sm={8}
            md={5}
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
        </Grid>
      </ThemeProvider>
    </>
  );
};
export default AddUpdateUser;
