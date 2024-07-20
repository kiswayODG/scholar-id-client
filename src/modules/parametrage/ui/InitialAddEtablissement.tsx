import { useEffect, useState } from "react";
import { VilleInterface } from "../model/VilleInterface";
import * as Yup from "yup";
import Controls from "@components/controls";
import { useFormik } from "formik";
import { EtablissementInterface } from "../model/EtablissementInterface";
import { apiClient } from "app-api/api";
import { toast } from "react-toastify";
import {
  Box,
  CircularProgress,
  DialogActions,
  DialogContent,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { ImageInputComponent } from "@components/control/ImageInputComponent";
import Layout from "@components/Layout";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@appConfigs/Navigation";
import { Title } from "@modules/dashboard/MainDashboard";
import { CachetIcon } from "@components/icons/CachetIcon";
import { SignatureSVG } from "@components/icons/SignatureSVG";

interface viewState {
  villes: VilleInterface[];
  logoB64: any;
  cachetRespoB64: any;
  signatureRespoB64: any;
  logoB64Name: string | null;
  signatureRespoB64Name: string | null;
  cachetRespoB64Name: string | null;
  loading: boolean;
}

interface viewState {
  villes: VilleInterface[];
}

const InitialAddEtablissement: React.FC = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<viewState>({
    villes: [],
    logoB64: "",
    cachetRespoB64: "",
    signatureRespoB64: "",
    signatureRespoB64Name: null,
    cachetRespoB64Name: null,
    logoB64Name: null,
    loading: true,
  });

  useEffect(() => {
    apiClient.parametrage
      .fetchActiveEtablissement()
      .then((res) => {
        if (res.data != null) navigate(Navigation.DASHBOARD);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const validateSchema = Yup.object().shape({
    nomEtab: Yup.string().required(
      "veuillez renseigner le nom de l'établissement !"
    ),
    numeroTel: Yup.string().required(
      "veuillez renseigner le numéro de téléphone !"
    ),
    anneeScolaire: Yup.string()
      .matches(
        /^\d{4}-\d{4}$/,
        'L\'année scolaire doit être au format "YYYY-YYYY"'
      )
      .required("L'année scolaire est requise"),
  });

  const formik = useFormik({
    initialValues: {
      idEtab: 0,
      nomEtab: "",
      numeroTel: "",
      numeroTelBis: "",
      villeEtab: 1,
      logoEtab: null,
      cachet: null,
      signatureRespo: null,
      adresse: "",
      anneeScolaire: "",
    },
    validationSchema: validateSchema,
    async onSubmit(values, formikHelpers) {
      let etabToSend: EtablissementInterface = {
        id: values.idEtab,
        logoEtablissement: values.logoEtab,
        nomEtablissement: values.nomEtab,
        numeroTel: values.numeroTel,
        numeroTelBis: values.numeroTelBis,
        adresse: values.adresse,
        villeEtablissement: state.villes.filter(
          (item) => item.id == values.villeEtab
        )[0],
        imageBase64: state.logoB64,
        cachetimageBase64: state.cachetRespoB64,
        signatureRespoImageBase64: state.signatureRespoB64,
        anneeScolaire: values.anneeScolaire,
      };

      await apiClient.parametrage
        .createUpdateEtab(etabToSend)
        .then(() => {
          navigate(Navigation.DASHBOARD);
          toast.success("Etablissement créé/mis à jour avec succès 👌");
        })
        .catch((error) => {
          toast.error("Une erreur s'est produite");
          console.log(error);
        });
    },
  });

  const getVille = async () => {
    const villeResponse = await apiClient.parametrage.fetchAllVille();

    setState((prevState) => ({
      ...prevState,
      villes: villeResponse.data as VilleInterface[],
      loading: false,
    }));
  };

  useEffect(() => {
    getVille();
  }, []);

  const [fileName, setFileName] = useState<string | null>(null);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files
      ? event.currentTarget.files[0]
      : null;
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let base64 = reader.result as string;
        // Remove metadata prefix
        base64 = base64.replace(/^data:image\/[a-z]+;base64,/, "");
        setState((prevState) => ({
          ...prevState,
          [event.target.name]: base64,
          [event.target.name + "Name"]: file ? file.name : null,
        }));
      };
    }
  };

  return (
    <>
      {" "}
      {state.loading ? (
        <Box className="flex justify-center items-center h-screen">
          {" "}
          <CircularProgress />{" "}
        </Box>
      ) : (
        <Layout>
          <Box>
            <h1 className="text-center text-2xl font-extrabold pt-8">
              Votre établissement !
            </h1>
          </Box>
          <Typography className="text-center mt-1 text-md">
            Veuillez renseigner les informations de votre établissement pour
            continuer !
          </Typography>
          <form className="" onSubmit={formik.handleSubmit}>
            <DialogContent>
              <div>
              <Grid
                className="flex flex-col justify-between  lg:flex-row lg:space-x-4 space-y-4"
               
              > <div></div>
                <Paper className="flex flex-1 flex-col space-y-8  p-2 ">
                  <Controls.TextFieldComponent
                    label="Année scolaire *"
                    name="anneeScolaire"
                    size="small"
                    value={formik.values.anneeScolaire}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.anneeScolaire &&
                      Boolean(formik.errors.anneeScolaire)
                    }
                    helperText={
                      formik.touched.anneeScolaire &&
                      formik.errors.anneeScolaire
                    }
                  />
                  <Controls.TextFieldComponent
                    label="Nom établissement"
                    name="nomEtab"
                    size="small"
                    value={formik.values.nomEtab}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.nomEtab && Boolean(formik.errors.nomEtab)
                    }
                    helperText={formik.touched.nomEtab && formik.errors.nomEtab}
                  />

                  <Controls.TextFieldComponent
                    label="Numero telephone"
                    size="small"
                    name="numeroTel"
                    value={formik.values.numeroTel}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.numeroTel &&
                      Boolean(formik.errors.numeroTel)
                    }
                    helperText={
                      formik.touched.numeroTel && formik.errors.numeroTel
                    }
                  />

                  <Controls.TextFieldComponent
                    label="Numero telephone bis"
                    size="small"
                    name="numeroTelBis"
                    value={formik.values.numeroTelBis}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.numeroTelBis &&
                      Boolean(formik.errors.numeroTelBis)
                    }
                    helperText={
                      formik.touched.numeroTelBis && formik.errors.numeroTelBis
                    }
                  />
                </Paper>
                <Paper className="flex flex-1 flex-col space-y-8  p-2">
                  <Controls.SelectComponent
                    name="villeEtab"
                    onChange={(option) =>
                      formik.setFieldValue("villeEtab", option)
                    }
                    options={state.villes}
                    renderLabel={(item) => item.nomVille}
                    renderValue={(item) => item.id}
                    valeur={formik.values.villeEtab}
                    className="w-full"
                  />

                  <Controls.TextFieldComponent
                    label="Adresse"
                    size="small"
                    name="adresse"
                    value={formik.values.adresse}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.adresse && Boolean(formik.errors.adresse)
                    }
                    helperText={formik.touched.adresse && formik.errors.adresse}
                  />

                  <ImageInputComponent
                    fileName={state.logoB64Name!}
                    handleFileChange={handleFileChange}
                    fullwidth={true}
                    label="Ajouter le logo"
                    name="logoB64"
                    accept="image/*"
                  />
                  {state?.logoB64 && (
                    <img
                      className=" max-w-28 max-h-28 w-auto h-auto m-auto"
                      src={`data:image/png;base64,${state?.logoB64}`}
                    />
                  )}
                  {!state?.logoB64 && (
                    <div className=" w-28 h-28 m-auto border-2 bg-white" />
                  )}
                </Paper>

                <Paper  className="flex flex-1 flex-col space-y-2  p-2 pb-8">
                  <ImageInputComponent
                    fileName={state.cachetRespoB64Name!}
                    handleFileChange={handleFileChange}
                    label="Ajouter le cachet"
                    name="cachetRespoB64"
                    accept="image/*"
                    fullwidth={true}
                  />

                  {state?.cachetRespoB64 && (
                    <img
                      className=" max-w-28 max-h-28 w-auto m-auto"
                      src={`data:image/png;base64,${state?.cachetRespoB64}`}
                    />
                  )}

                  {!state?.cachetRespoB64 && (
                    <div className=" max-w-28 max-h-28 m-auto">
                      <CachetIcon size={120} />
                    </div>
                  )}

                  <ImageInputComponent
                    fileName={state.signatureRespoB64Name!}
                    handleFileChange={handleFileChange}
                    label="Signature du responsable"
                    name="signatureRespoB64"
                    accept="image/*"
                    fullwidth={true}
                  />
                  {state?.signatureRespoB64 && (
                    <img
                      className=" max-w-28 max-h-28 m-auto"
                      src={`data:image/png;base64,${state?.signatureRespoB64}`}
                    />
                  )}

                  {!state?.signatureRespoB64 && (
                    <div className=" max-w-28 max-h-28 m-auto">
                      <SignatureSVG size={120} />
                    </div>
                  )}
                </Paper>
                <div></div>
                </Grid>
                <Controls.OnActionButton
                type="submit"
                titre="Valider"
                className=" md:flex md:justify-center md:m-auto md:mt-4 w-full md:w-64"
              />
              </div>
            </DialogContent>
            <DialogActions className="">
             
            </DialogActions>
          </form>
        </Layout>
      )}
    </>
  );
};

export default InitialAddEtablissement;
