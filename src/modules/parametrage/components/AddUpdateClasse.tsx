import { useFormik } from "formik";
import * as Yup from "yup";
import { ClasseInterface } from "../model/ClasseInterface";
import Controls from "@components/controls";
import {
  Grid,
  Button,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import dayjs from "dayjs";
import { apiClient } from "app-api/api";
import { EtablissementInterface } from "../model/EtablissementInterface";
import { useEffect, useState } from "react";
import { NiveauEtudeInterface } from "../model/NiveauInterface";

interface viewFormI {
  id?: number;
  libelleClasse: string;
  code: string;
  niveauEtude: number;
}

interface viewProp {
  classe?: ClasseInterface;
  onClose: ()=>void;
}

interface viewStateI {
  etablissement:EtablissementInterface,
}

const AddUpdateClasse: React.FC<viewProp> = ({ classe, onClose }) => {

  const [state, setState]= useState<viewStateI>({
    etablissement: {} as EtablissementInterface,
  })
  const validateSchema = Yup.object().shape({
    libelleClasse: Yup.string().required("veuillez renseigner le libelle !"),
    code: Yup.string().required("veuillez renseigner le code !"),
    codeClasse: Yup.string()
      .matches(
        /^[A-Z]{1,2}[0-9]{3}$/,
        "Le code de classe doit commencer par un maximum de deux caractères majuscules suivi de trois chiffres.",
      )
      .required("Le code de classe est obligatoire."),
  });

  const getEtablissement = async()=> {
    
    const etabresponse = await apiClient.parametrage.fetchActiveEtablissement();
    setState((prevState)=>({
      ...prevState,
      etablissement: etabresponse.data as EtablissementInterface,
    }))

  }
  const [initialValues, setInitialValues] = useState({
    id: classe?.id || 0,
    libelleClasse: classe?.libelleClasse || "",
    code: classe?.codeClasse || "",
    niveau: 0,
  })

  const getData = async ()=> {
    const niveauReqResponse = await apiClient.parametrage.fetchNiveaux();

    let firstNiveau = (niveauReqResponse.data as NiveauEtudeInterface[])[0]
    setState((prevState)=>({
      ...prevState,
      niveau: classe?.niveauEtude.id || firstNiveau.id,
    }))
  }

  useEffect(()=> {
    getData()
  }
  )

  const formik = useFormik({
    initialValues,
    validationSchema: validateSchema,
    onSubmit(values, formikHelpers) {
      alert("on a valider");
    },
  });
  return (
    <>
    
        <form className="" onSubmit={formik.handleSubmit}>
      <DialogContent>
          <Grid className="flex flex-col justify-center ">
            <Controls.TextFieldComponent
              label="id"
              size="small"
              value={formik.values.id}
              onChange={formik.handleChange}
              hidden={true}
            />
            <Controls.SelectComponent
              name="niveau"
              onChange={formik.handleChange}
              options={[
                { libelle: "Lycée1", valeur: "M" },
                { libelle: "Lycée2", valeur: "F" },
              ]}
              renderLabel={(item) => item.libelle}
              renderValue={(item) => item.valeur}
              valeur={"M"}
            />

            <Controls.TextFieldComponent
              label="Libelle"
              size="small"
              name="libelleClasse"
              value={formik.values.libelleClasse}
              onChange={formik.handleChange}
              error={
                formik.touched.libelleClasse &&
                Boolean(formik.errors.libelleClasse)
              }
              helperText={
                formik.touched.libelleClasse && formik.errors.libelleClasse
              }
            />

            <Controls.TextFieldComponent
              label="Code"
              size="small"
              name="code"
              value={formik.values.code}
              onChange={formik.handleChange}
              error={formik.touched.code && Boolean(formik.errors.code)}
              helperText={formik.touched.code && formik.errors.code}
            />
          </Grid>
       
      </DialogContent>
      <DialogActions>
        <Controls.CancelButton onCancel={onClose} title="Annuler" />
        <Controls.OnActionButton
          type="submit"
          titre="Valider"
          //onAction={formik.handleSubmit}
        />
      </DialogActions>
      </form>
    </>
  );
};

export default AddUpdateClasse;
