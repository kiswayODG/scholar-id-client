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
import { toast } from "react-toastify";

interface viewFormI {
  id?: number;
  libelleClasse: string;
  code: string;
  niveauEtude: number;
}

interface viewProp {
  classe?: ClasseInterface;
  onClose: ()=>void;
  reload?: ()=> void;
}

interface viewStateI {
  etablissement:EtablissementInterface,
  niveauList: NiveauEtudeInterface[],
}

const AddUpdateClasse: React.FC<viewProp> = ({ classe, onClose,reload }) => {

  const [state, setState]= useState<viewStateI>({
    etablissement: {} as EtablissementInterface,
    niveauList : []
  })

  const [initialValues, setInitialValues] = useState({
    id: classe?.id || 0,
    libelleClasse: classe?.libelleClasse || "",
    codeClasse: classe?.codeClasse || "",
    niveau: 0,
  })

  const getData = async()=> {
    const etabresponse = await apiClient.parametrage.fetchActiveEtablissement();
    const niveauReqResponse = await apiClient.parametrage.fetchNiveaux();
    let firstNiveau = (niveauReqResponse.data as NiveauEtudeInterface[])[0];
    
    setState((prevState)=>({
      ...prevState,
      etablissement: etabresponse.data as EtablissementInterface,
      niveauList : niveauReqResponse.data as NiveauEtudeInterface[],
    }))

    setInitialValues((prevState)=>({
      ...prevState,
      niveau: classe?.niveauEtude.id || firstNiveau.id,
    }))
  }

  useEffect(()=> {
    getData()
  },[])

  const validateSchema = Yup.object().shape({
    libelleClasse: Yup.string().required("veuillez renseigner le libelle !"),
    codeClasse: Yup.string()
      .matches(
        /^[A-Z]{1,2}[0-9]{3}$/,
        "Deux caractères majuscules suivi de trois chiffres.",
      )
      .required("Le code de classe est obligatoire."),
  });




  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: validateSchema,
    onSubmit(values, formikHelpers) {
      let classToSave: ClasseInterface = {
        codeClasse: values.codeClasse,
        id: values.id,
        libelleClasse: values.libelleClasse,
        niveauEtude: state.niveauList.filter((item)=>item.id==values.niveau)[0]
      }
      
      let result = classToSave.id !==0? "Mise à jour réussie !": "Classe créee avec succès!"
      let error =  classToSave.id !==0? "Échec mise à jour de la classe !": "Échec de la création de la classe!"
      toast.promise(apiClient.parametrage.createUpdateClasse(classToSave).then(
        (res)=>{
          if(reload) reload()
          onClose();
        }
      ), {
        pending: "En traitement ...",
        success: result,
        error: error,
      });

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
              onChange={option => formik.setFieldValue("niveau", option)}
              options={state.niveauList}
              renderLabel={(item) => item.libelleNiveauEtude}
              renderValue={(item) => item.id}
              valeur={formik.values.niveau}
              width={300}
            />
            
            <Controls.TextFieldComponent
              label="Libelle"
              size="small"
              name="libelleClasse"
              value={formik.values.libelleClasse}
              onChange={formik.handleChange}
              sx={{width:300}}
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
              name="codeClasse"
              value={formik.values.codeClasse}
              onChange={formik.handleChange}
              error={formik.touched.codeClasse && Boolean(formik.errors.codeClasse)}
              helperText={formik.touched.codeClasse && formik.errors.codeClasse}
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
