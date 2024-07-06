import Controls from "@components/controls";
import { VilleInterface } from "@modules/parametrage/model/VilleInterface";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { apiClient } from "app-api/api";
import dayjs from "dayjs";
import { useFormik } from "formik";
import React from "react";
import { useCallback, useEffect, useState } from "react";
import * as Yup from "yup";
import { EtudiantInterface } from "../model/EtudiantInterface";
import { ClasseInterface } from "@modules/parametrage/model/ClasseInterface";
import { EtablissementInterface } from "@modules/parametrage/model/EtablissementInterface";
import AddUpdateEtablissement from "@modules/parametrage/components/AddUpdateEtablissement";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { HttpStatusCode } from "axios";
import { toast } from "react-toastify";

interface FormValues {
  matricule: string;
  nom: string;
  prenom: string;
  sexe: string;
  dateNaiss: Date | string;
  villeNaiss: string;
  telphone: string;
  classe: number;

  etablissement: number;
  nomPere: string;
  prenomPere: string;
  telPere: string;
  nomMere: string;
  prenomMere: string;
  telMere: string;
}

interface viewState {
  villes: VilleInterface[];
  lastMatricule: number;
  classes: ClasseInterface[];
  etab: EtablissementInterface;
  villeSelected: number;
  newMatricule: number;
  base64Image: string;
}

interface viewPropsI {
  onClose: () => void;
  etudiant?: EtudiantInterface;
  reload?: () => void;
}

const AddUpdateEtudiant: React.FC<viewPropsI> = ({
  onClose,
  etudiant,
  reload,
}) => {
  const [state, setState] = useState<viewState>({
    villes: [],
    lastMatricule: 0,
    classes: [],
    etab: {} as EtablissementInterface,
    villeSelected: 1,
    newMatricule: 0,
    base64Image: "",
  });

  const getVille = useCallback(async () => {
    const newMAtriculereq = await apiClient.effectifs.fetchnouveauMatricule();
    const classeResponse = await apiClient.parametrage.fetchClasses();
    const villeResponse = await apiClient.parametrage.fetchAllVille();
    const etabresponse = await apiClient.parametrage.fetchActiveEtablissement();

    setState((prevState) => ({
      ...prevState,
      villes: villeResponse.data as VilleInterface[],
      classes: classeResponse.data as ClasseInterface[],
      etab: etabresponse.data as EtablissementInterface,
      newMatricule: newMAtriculereq.data as number,
    }));
  }, []);

  useEffect(() => {
    getVille();
  }, []);

  const validateSchema = Yup.object().shape({
    nom: Yup.string().required("Veuillez renseigner le nom"),
    prenom: Yup.string().required("veuillez renseigner le prénom"),
    telphone: Yup.string().required("Entrez un numero valide!"),
    dateNaiss: Yup.string().required("Veuillez renseigner une date valide"),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: etudiant?.id || 0,
      matricule:
        etudiant?.matricule || "M" + `0000${state.newMatricule}`.slice(-4),
      nom: etudiant?.nom || "",
      prenom: etudiant?.prenom || "",
      sexe: etudiant?.sexe || "Masculin",
      dateNaiss: etudiant?.dateNaissance || "",
      villeNaiss: etudiant?.lieuNaiss?.id || state.villes[0]?.id!,
      telphone: etudiant?.telephone || "",
      classe: etudiant?.classe?.id || state.classes[0]?.id!,
      etablissement: etudiant?.etablissement?.id || state.etab.id,
      adresse: etudiant?.adresse || "",

      nomPere: etudiant?.parent?.nom || "",
      prenomPere: etudiant?.parent?.prenom || "",
      telPere: etudiant?.parent?.telephone || "",
      nomMere: etudiant?.parentbis?.nom || "",
      prenomMere: etudiant?.parentbis?.prenom || "",
      telMere: etudiant?.parentbis?.telephone || "",
    },
    validationSchema: validateSchema,
    onSubmit(values, formikHelpers) {
      let etudiant: EtudiantInterface = {
        id: values.id,
        nom: values.nom.toUpperCase(),
        prenom: values.prenom.toUpperCase(),
        classe: state.classes.filter((item) => item.id == values.classe)[0],
        dateNaissance: new Date(values.dateNaiss).toISOString().split("T")[0],
        matricule: values.matricule,
        sexe: values.sexe,
        telephone: values.telphone,
        etablissement: state.etab,
        lieuNaiss: state.villes.filter(
          (item) => item.id == values.villeNaiss
        )[0],
        adresse: formik.values.adresse,
        imageBase64: state.base64Image,
      };

      console.log(etudiant);
      apiClient.effectifs
        .createOrUpdateStudent(etudiant)
        .then((res) => {
          let result = etudiant.id!=0 ?"Etudiant modifié avec succès !" : "Etudiant créé avec succès !"
          if (res.status == HttpStatusCode.Ok)
            toast.success(result);
          if (reload) reload();
          onClose();
        })
        .catch((error) => {
          toast.error("Une erreur s'est produite lors l'opération");
          console.log(error);
        });
    },
  });

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
      {state.etab == null ? (
        <AddUpdateEtablissement onClose={onClose} />
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <DialogContent> {etudiant?.sexe}
            <Grid className="flex flex-col justify-center ">
              <Grid className="space-x-4">
                <Controls.TextFieldComponent
                sx={{width:208}}
                  size="small"
                  name="Etablissement"
                  disabled={true}
                  value={state.etab.nomEtablissement}
                />

                <Controls.TextFieldComponent
                  label="Matricule"
                  size="small"
                  sx={{width:208}}
                  value={formik.values.matricule}
                  disabled={true}
                />
              </Grid>

              <Grid className="space-x-4">
                <Controls.TextFieldComponent
                  size="small"
                  label="Nom"
                  name="nom"
                  sx={{width:208}}
                  onChange={formik.handleChange}
                  value={formik.values.nom.toUpperCase()}
                  error={formik.touched.nom && Boolean(formik.errors.nom)}
                  helperText={formik.touched.nom && formik.errors.nom}
                />

                <Controls.TextFieldComponent
                  size="small"
                  label="Prénom"
                  name="prenom"
                  sx={{width:208}}
                  onChange={formik.handleChange}
                  value={formik.values.prenom.toUpperCase()}
                  error={formik.touched.prenom && Boolean(formik.errors.prenom)}
                  helperText={formik.touched.prenom && formik.errors.prenom}
                />
              </Grid>

              <Grid className="space-x-4 mb-6">
                <Controls.SelectComponent
                  name="sexe"
                  onChange={option => formik.setFieldValue("sexe",option)}
                  width="208px"
                  options={[
                    { libelle: "Masculin", valeur: "Masculin" },
                    { libelle: "Feminin", valeur: "Feminin" },
                  ]}
                  renderLabel={(item) => item.libelle}
                  renderValue={(item) => item.valeur}
                  valeur={formik.values.sexe}
                />

                <Controls.SelectComponent
                  name="classe"
                  onChange={(option) => formik.setFieldValue("classe", option)}
                  width="208px"
                  options={state.classes}
                  renderLabel={(item) => item.libelleClasse}
                  renderValue={(item) => item.id}
                  valeur={formik.values.classe}
                />
              </Grid>
              <Grid className="space-x-4">
                <Controls.DatePickerComponent
                
                  name="dateNaiss"
                  onChange={(value) => formik.setFieldValue("dateNaiss", value)}
                  titre="Date de naiss."
                  value={dayjs(formik.values.dateNaiss)}
                  width="208px"
                  error={
                    formik.touched.dateNaiss && Boolean(formik.errors.dateNaiss)
                  }
                  helperText={
                    formik.touched.dateNaiss && formik.errors.dateNaiss
                  }
                />
                <Controls.SelectComponent
                  name="villeNaiss"
                  label="Lieu de naissance"
                  width={208}
                  onChange={(e) => {
                    setState((prevState) => ({
                      ...prevState,
                      villeSelected: e,
                    }));
                  }}
                  options={state.villes}
                  renderLabel={(item) => item.nomVille}
                  renderValue={(item) => item.id}
                  valeur={state.villeSelected}
                />
              </Grid>
              <Grid className="space-x-4 flex justify-items-center">
                <Controls.TextFieldComponent
                  size="small"
                  label="Téléphone d'urgence"
                  name="telphone"
                  sx={{width:208}}
                  onChange={formik.handleChange}
                  value={formik.values.telphone}
                  error={
                    formik.touched.telphone && Boolean(formik.errors.telphone)
                  }
                  helperText={formik.touched.telphone && formik.errors.telphone}
                />

                <Controls.TextFieldComponent
                  size="small"
                  label="Adresse"
                  name="adresse"
                  sx={{width:208}}
                  onChange={formik.handleChange}
                  value={formik.values.adresse}
                  error={
                    formik.touched.adresse && Boolean(formik.errors.adresse)
                  }
                  helperText={formik.touched.adresse && formik.errors.adresse}
                />
              </Grid>
              <Grid className="space-x-4 flex flex-row justify-items-center">
                <Box className="border-solid ">
                  <Button
                    variant="contained"
                    component="label"
                    endIcon={true}
                    className="bg-transparent hover:bg-blue-500 text-back font-semibold hover:text-white hover:border-transparent 
                    w-52 mt-3"
                  >
                    Ajouter photo&nbsp;
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
                <Button
                  fullWidth
                  className="pointer-events-auto"
                  sx={{ margin: "10px",width:208,height:40 }}
                  size="small"
                >
                  Informations parents
                  <NavigateNextIcon />
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Controls.CancelButton onCancel={onClose} title="Annuler" />
            <Controls.OnActionButton type="submit" titre="Valider" />
          </DialogActions>
        </form>
      )}
    </>
  );
};

export default AddUpdateEtudiant;
