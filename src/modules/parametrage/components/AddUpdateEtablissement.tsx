import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { EtablissementInterface } from "../model/EtablissementInterface";
import { VilleInterface } from "../model/VilleInterface";
import { Field, useFormik } from "formik";
import * as Yup from "yup";
import Controls from "@components/controls";
import { useCallback, useEffect, useState } from "react";
import { apiClient } from "app-api/api";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { toast } from "react-toastify";

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
  base64Image: any;
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
    base64Image: etablissement?.imageBase64,
  });

  const validateSchema = Yup.object().shape({
    nomEtab: Yup.string().required(
      "veuillez renseigner le nom de l'établissement !"
    ),
    numeroTel: Yup.string().required(
      "veuillez renseigner le numéro de téléphone !"
    ),
  });

  const formik = useFormik({
    initialValues: {
      idEtab: etablissement?.id || 0,
      nomEtab: etablissement?.nomEtablissement || "",
      numeroTel: etablissement?.numeroTel || "",
      numeroTelBis: etablissement?.numeroTelBis || "",
      villeEtab: etablissement?.villeEtablissement.id || 1,
      logoEtab: etablissement?.logoEtablissement || null,
      adresse: etablissement?.adresse || ",",
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
        imageBase64: state.base64Image,
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
          base64Image: base64,
        }));
      };
    }
    setFileName(file ? file.name : null);
  };

  return (
    <>
      <form className="" onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid className="flex flex-col justify-center ">
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

            <Box className="border-solid ">
              <Button
                variant="contained"
                component="label"
                endIcon={true}
                className="bg-transparent hover:bg-blue-500 text-back font-semibold hover:text-white hover:border-transparent w-72 mt-4"
              >
                Ajouter Logo&nbsp;
                <input
                  type="file"
                  hidden
                  accept={"image/*"}
                  onChange={handleFileChange}
                />
                <CloudUploadIcon />
              </Button>

              {fileName && (
                <>
                  <br />
                  <Typography
                    variant="caption"
                    display="block"
                    style={{ marginTop: "10px" }}
                  >
                    {fileName}
                  </Typography>
                </>
              )}
            </Box>
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
