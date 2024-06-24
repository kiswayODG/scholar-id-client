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
import { Sexe } from "commonDomain/Sexe";
import AddUpdateEtablissement from "@modules/parametrage/components/AddUpdateEtablissement";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";


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
  villeSelected: number
}

interface viewPropsI {
  onClose: () => void;
  etudiant?: EtudiantInterface;
}

const AddUpdateEtudiant: React.FC<viewPropsI> = ({ onClose, etudiant }) => {
  const [state, setState] = useState<viewState>({
    villes: [],
    lastMatricule: 0,
    classes: [],
    etab: {} as EtablissementInterface,
    villeSelected : 1
  });

  const getVille = useCallback(async () => {
    const classeResponse = await apiClient.parametrage.fetchClasses();
    const villeResponse = await apiClient.parametrage.fetchAllVille();
    const etabresponse = await apiClient.parametrage.fetchActiveEtablissement();

    setState((prevState) => ({
      ...prevState,
      villes: villeResponse.data as VilleInterface[],
      classes: classeResponse.data as ClasseInterface[],
      etab: etabresponse.data as EtablissementInterface,
    }));
  }, []);

  useEffect(() => {
    getVille();
  }, []);

  const validateSchema = Yup.object().shape({
    nom: Yup.string().required("Veuillez renseigner le nom"),
    prenom: Yup.string().required("veuillez renseigner le prénom"),
    matricule: Yup.string().required("Entrez un matricule valide!"),
    sexe: Yup.string().required("Entrez un matricule valide!"),
    dateNaiss: Yup.string().required("Entrez un matricule valide!"),
    telphone: Yup.string().required("Entrez un numero valide!"),
  });

  const formik = useFormik({
    initialValues: {
      matricule: "",
      nom: "",
      prenom: "",
      sexe: "",
      dateNaiss: "",
      villeNaiss: 1,
      telphone: "",
      classe: 0,
      etablissement: 0,

      nomPere: "",
      prenomPere: "",
      telPere: "",
      nomMere: "",
      prenomMere: "",
      telMere: "",
    },
    validationSchema: validateSchema,
    onSubmit(values, formikHelpers) {
      let etudiant: EtudiantInterface = {
        nom: values.nom,
        prenom: values.prenom,
        classe: state.classes.filter((item) => item.id == values.classe)[0],
        dateNaissance: values.dateNaiss,
        matricule: values.matricule,
        sexe: values.sexe == "M" ? Sexe.Masculin : Sexe.Feminin,
        etablissement: state.etab,
        lieuNaiss: state.villes.filter(
          (item) => item.id == values.villeNaiss
        )[0],
      };
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
        <form className="" onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Grid className="flex flex-col justify-center ">
              <Grid className="space-x-4">
                <Controls.TextFieldComponent
                  size="small"
                  name="Etablissement"
                  disabled={true}
                  value={state.etab.nomEtablissement}
                />

                <Controls.TextFieldComponent
                  label="Matricule"
                  size="small"
                  value={formik.values.matricule}
                  disabled={true}
                />
              </Grid>

              <Grid className="space-x-4">
                <Controls.TextFieldComponent
                  size="small"
                  label="Nom"
                  name="nom"
                  onChange={formik.handleChange}
                  value={formik.values.nom}
                  error={formik.touched.nom && Boolean(formik.errors.nom)}
                  helperText={formik.touched.nom || formik.errors.nom}
                  inputProps={{
                    pattern: "[A-Za-z ]+",
                  }}
                />

                <Controls.TextFieldComponent
                  size="small"
                  label="Prénom"
                  name="prenom"
                  onChange={formik.handleChange}
                  value={formik.values.prenom}
                  helperText={
                    formik.errors.prenom ? formik.errors.prenom : null
                  }
                />
              </Grid>

              <Grid className="space-x-4 mb-6">
                <Controls.SelectComponent
                  name="sexe"
                  onChange={formik.handleChange}
                  options={[
                    { libelle: "Masculin", valeur: "M" },
                    { libelle: "Feminin", valeur: "F" },
                  ]}
                  renderLabel={(item) => item.libelle}
                  renderValue={(item) => item.valeur}
                  valeur={"M"}
                />

                <Controls.SelectComponent
                  name="classe"
                  onChange={formik.handleChange}
                  options={state.classes}
                  renderLabel={(item) => item.libelleClasse}
                  renderValue={(item) => item.id}
                  valeur={formik.values.classe}
                />
              </Grid>
              <Grid className="space-x-4">
                <Controls.DatePickerComponent
                  name="dateNaiss"
                  onChange={() => {}}
                  titre="Date de naiss."
                  value={dayjs(new Date())}
                  width="200px"
                />
                <Controls.SelectComponent
                  name="villeNaiss"
                  label="Lieu de naissance"
                  onChange={(e)=>{
                    setState((prevState)=>({
                      ...prevState,
                      villeSelected:e
                    }))
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
                  onChange={formik.handleChange}
                  value={formik.values.telphone}
                  helperText={
                    formik.errors.telphone ? formik.errors.telphone : null
                  }
                />
                <Box className="border-solid ">
                  <Button
                    variant="contained"
                    component="label"
                    endIcon={true}
                    className="bg-transparent hover:bg-blue-500 text-back font-semibold hover:text-white hover:border-transparent w-52 mt-3"
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
              </Grid>
              <Button
              fullWidth
                  className="pointer-events-auto"
                  sx={{ margin: "10px" }}
                >
                  Informations parents
                  <NavigateNextIcon />
                </Button>
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
