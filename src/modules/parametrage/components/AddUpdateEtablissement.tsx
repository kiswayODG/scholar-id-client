import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  Grid,
} from "@mui/material";
import { EtablissementInterface } from "../model/EtablissementInterface";
import { VilleInterface } from "../model/VilleInterface";
import { useFormik } from "formik";
import * as Yup from "yup";
import Controls from "@components/controls";
import { useEffect, useState } from "react";
import { apiClient } from "app-api/api";
import { toast } from "react-toastify";
import { ImageInputComponent } from "@components/control/ImageInputComponent";

interface viewPropsI {
  etablissement?: EtablissementInterface;
  onClose: () => void;
  reload?: () => void;
}

interface FormValues {
  idEtab: number;
  nomEtab: string;
  logoEtab: string;
  numeroTel: string;
  numeroTelBis: string;
  villeEtab: number;
}

interface viewState {
  villes: VilleInterface[];
  logoB64: any;
  cachetRespoB64: any;
  signatureRespoB64: any;
  
  logoB64Name: string | null;
  signatureRespoB64Name: string |null;
  cachetRespoB64Name: string | null;
}

interface viewState {
  villes: VilleInterface[];
}

const AddUpdateEtablissement: React.FC<viewPropsI> = ({
  etablissement,
  onClose,
  reload,
}) => {
  const [state, setState] = useState<viewState>({
    villes: [],
    logoB64: etablissement?.imageBase64,
    cachetRespoB64: etablissement?.cachetimageBase64,
    signatureRespoB64: etablissement?.signatureRespoImageBase64,
    signatureRespoB64Name:null,
    cachetRespoB64Name:null,
    logoB64Name:null,
  });

  const validateSchema = Yup.object().shape({
    nomEtab: Yup.string().required(
      "veuillez renseigner le nom de l'établissement !"
    ),
    numeroTel: Yup.string().required(
      "veuillez renseigner le numéro de téléphone !"
    ),
    anneeScolaire: Yup.string()
    .matches(/^\d{4}-\d{4}$/, 'L\'année scolaire doit être au format "YYYY-YYYY"')
    .required('L\'année scolaire est requise'),
  });

  const formik = useFormik({
    initialValues: {
      idEtab: etablissement?.id || 0,
      nomEtab: etablissement?.nomEtablissement || "",
      numeroTel: etablissement?.numeroTel || "",
      numeroTelBis: etablissement?.numeroTelBis || "",
      villeEtab: etablissement?.villeEtablissement.id || 1,
      logoEtab: etablissement?.logoEtablissement || null,
      cachet: etablissement?.cachet || null,
      signatureRespo: etablissement?.signatureRespo || null,
      adresse: etablissement?.adresse || "",
      anneeScolaire: etablissement?.anneeScolaire || "",
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
          if (reload) reload();
          onClose();
          toast.success("Etablissement créé/mis à jour avec succès 👌");
        })
        .catch((error) => {
          toast.error("Une erreur s'est produite");
          console.log(error)
        });
    },
  });

  const getVille = async () => {
    const villeResponse = await apiClient.parametrage.fetchAllVille();

    setState((prevState) => ({
      ...prevState,
      villes: villeResponse.data as VilleInterface[],
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
          [event.target.name+'Name']:file ? file.name : null
        }));
      };
    }

  };

  return (
    <>
      <form className="" onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid className="flex flex-col justify-center ">
          <Controls.TextFieldComponent
              label="Année scolaire"
              name="anneeScolaire"
              size="small"
              value={formik.values.anneeScolaire}
              onChange={formik.handleChange}
              error={formik.touched.anneeScolaire && Boolean(formik.errors.anneeScolaire)}
              helperText={formik.touched.anneeScolaire && formik.errors.anneeScolaire}
            />
            <Controls.TextFieldComponent
              label="Nom établissement"
              name="nomEtab"
              size="small"
              value={formik.values.nomEtab}
              onChange={formik.handleChange}
              error={formik.touched.nomEtab && Boolean(formik.errors.nomEtab)}
              helperText={formik.touched.nomEtab && formik.errors.nomEtab}
            />

            <Controls.TextFieldComponent
              label="Numero telephone"
              size="small"
              name="numeroTel"
              value={formik.values.numeroTel}
              onChange={formik.handleChange}
              error={
                formik.touched.numeroTel && Boolean(formik.errors.numeroTel)
              }
              helperText={formik.touched.numeroTel && formik.errors.numeroTel}
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

            <Controls.SelectComponent
              name="villeEtab"
              onChange={(option) => formik.setFieldValue("villeEtab", option)}
              options={state.villes}
              renderLabel={(item) => item.nomVille}
              renderValue={(item) => item.id}
              valeur={formik.values.villeEtab}
              width={"18rem"}
            />

            <Controls.TextFieldComponent
              label="Adresse"
              size="small"
              name="adresse"
              value={formik.values.adresse}
              onChange={formik.handleChange}
              error={formik.touched.adresse && Boolean(formik.errors.adresse)}
              helperText={formik.touched.adresse && formik.errors.adresse}
            />


            <ImageInputComponent 
            fileName={state.logoB64Name!}
            handleFileChange={handleFileChange}
            label="Ajouter le logo"
            name="logoB64"
            accept="image/*"/>

            <ImageInputComponent 
            fileName={state.cachetRespoB64Name!}
            handleFileChange={handleFileChange}
            label="Ajouter le cachet"
            name="cachetRespoB64"
            accept="image/*"/>

            <ImageInputComponent 
            fileName={state.signatureRespoB64Name!}
            handleFileChange={handleFileChange}
            label="Ajouter la signature"
            name="signatureRespoB64"
            accept="image/*"/>

          </Grid>
        </DialogContent>
        <DialogActions>
          <Controls.CancelButton onCancel={onClose} title="Annuler" />
          <Controls.OnActionButton type="submit" titre="Valider" />
        </DialogActions>
      </form>
    </>
  );
};

export default AddUpdateEtablissement;
