import { useCallback, useEffect, useState } from "react";
import { EtablissementInterface } from "../model/EtablissementInterface";
import { NiveauEtudeInterface } from "../model/NiveauInterface";
import { apiClient } from "app-api/api";
import Controls from "@components/controls";
import { DialogContent, Grid, DialogActions } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { ParametreGlobalInterface } from "../model/ParametreGlobalInterface";
import { ConstanteParamGlob } from "@utils/Constantes";

interface viewPropsI {
  niveau?: NiveauEtudeInterface;
  onClose: () => void;
  reload?: ()=> void;
}

interface viewState {
  etab: EtablissementInterface;
  cyclesList: ParametreGlobalInterface[];
}

const AddUpdateNiveau: React.FC<viewPropsI> = ({ niveau, onClose, reload }) => {
  const [state, setState] = useState<viewState>({
    etab: {} as EtablissementInterface,
    cyclesList: [],
  });

  const [initialValues, setInitialValues] = useState({
    id: niveau?.id || 0,
    libelle: niveau?.libelleNiveauEtude || "",
    code: niveau?.codeNiveauEtude || "",
    cycle: 0,
    libelleCourt: niveau?.libelleCourt || "",
  });

  const getData = async () => {
    const etabresponse = await apiClient.parametrage.fetchActiveEtablissement();
    const cycleresponse = await apiClient.parametrage.fetchParamByCode(
      ConstanteParamGlob.PARAMG_CYCLE_ETUDE
    );
    const firstItem = cycleresponse.data[0] as ParametreGlobalInterface;
    setState((prevState) => ({
      ...prevState,
      etab: etabresponse.data as EtablissementInterface,
      cyclesList: cycleresponse.data as ParametreGlobalInterface[],
    }));

    setInitialValues((prevValues) => ({
      ...prevValues,
      cycle: niveau?.cycleEtude.id || firstItem.id,
    }));
  };
  

  useEffect(() => {
    getData();
  }, []);

  const validateSchema = Yup.object().shape({
    libelle: Yup.string().required(
      "veuillez renseigner le libelle du niveau !"
    ),
    code: Yup.string().required("veuillez renseigner le code !"),
  });

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: validateSchema,
    onSubmit(values, formikHelpers) {
      let niveauToSend: NiveauEtudeInterface = {
        id: values.id,
        libelleNiveauEtude: values.libelle,
        codeNiveauEtude: values.code,
        etablissement: niveau?.etablissement || state?.etab,
        libelleCourt: values.libelleCourt,
        cycleEtude: state.cyclesList.filter(
          (item) => item.id == values.cycle
        )[0],
      };
      let result = niveau?.id !=0? "Mise à jour réussie !": "Niveau crée avec succès!"
      let error =  niveau?.id !=0? "Échec mise à jour du niveau !": "Échec de la création du niveau!"
      toast.promise(apiClient.parametrage.createUpdateNiveau(niveauToSend).then(
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
              size="small"
              name="etab"
              value={
                niveau?.etablissement.nomEtablissement ||
                state?.etab.nomEtablissement
              }
              disabled={true}
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
            <Controls.SelectComponent
              name="cycle"
              onChange={(option) => formik.setFieldValue("cycle", option)}
              options={state.cyclesList}
              renderLabel={(item) => item.libelleParam}
              renderValue={(item) => item.id}
              valeur={formik.values.cycle}
              width={"18rem"}
            />
            <Controls.TextFieldComponent
              label="libelle"
              name="libelle"
              size="small"
              value={formik.values.libelle}
              onChange={formik.handleChange}
              error={formik.touched.libelle && Boolean(formik.errors.libelle)}
              helperText={formik.touched.libelle && formik.errors.libelle}
            />

            <Controls.TextFieldComponent
              label="Libellé court"
              size="small"
              name="libelleCourt"
              value={formik.values.libelleCourt}
              onChange={formik.handleChange}
              error={formik.touched.libelleCourt && Boolean(formik.errors.libelleCourt)}
              helperText={formik.touched.libelleCourt && formik.errors.libelleCourt}
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

export default AddUpdateNiveau;
