import Controls from "@components/controls"
import { DialogContent, Grid, DialogActions } from "@mui/material"
import { useFormik } from "formik"
import { ParametreGlobalInterface } from "../model/ParametreGlobalInterface";
import { ConstanteParamGlob } from "@utils/Constantes";
import { EtablissementInterface } from "../model/EtablissementInterface";
import { useCallback, useEffect, useState } from "react";
import { apiClient } from "app-api/api";
import { toast } from "react-toastify";

interface viewProp {
    cycle?: ParametreGlobalInterface;
    onClose: ()=>void;
    reload? : ()=>void;
  }
  
  interface viewStateI {
    etablissement: EtablissementInterface,
  }

const AddUpdateCycle:React.FC<viewProp> = ({cycle,onClose, reload})=> {

    const [state,setState] = useState<viewStateI>({
        etablissement: {} as EtablissementInterface,
    })

    const getData = useCallback(async () => {
        const etabresponse = await apiClient.parametrage.fetchActiveEtablissement();
    
        setState((prevState) => ({
          ...prevState,
          etablissement: etabresponse.data as EtablissementInterface,
        }));
      }, []);
    
      useEffect(() => {
        getData();
      }, []);

    const formik = useFormik({
        initialValues:{
            id:cycle?.id || 0,
            libelle: cycle?.libelleParam || "",
            code: cycle?.codeParam || ConstanteParamGlob.PARAMG_CYCLE_ETUDE,
            paramEtab: cycle?.paramEtab || state.etablissement,
            libelleCourt: cycle?.libelleCourt || "",

        },
        validationSchema:"",
        onSubmit(values, formikHelpers) {
            let cycleParam: ParametreGlobalInterface ={
                id: values.id,
                libelleParam: values.libelle,
                codeParam: values.code,
                paramEtab: cycle?.paramEtab || state.etablissement!,
                libelleCourt: values.libelleCourt,
            }
            alert(JSON.stringify(cycleParam))
            apiClient.parametrage.createUpdateParam(cycleParam).
            then((res)=> {
                let result = cycle?.id !=0? "Cycle modifiée avec succès!" :"Cycle crée avec succès!";
                toast.success(result);
                if (reload) reload();
                onClose();
            }).catch((error)=> {
                toast.error("Une erreur lors de l'opérarion");
                console.log(error)
            })
        },
    })
    return(
        <form className="" onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid className="flex flex-col justify-center ">
          <Controls.TextFieldComponent
              label="Etablissement"
              size="small"
              value={state.etablissement.nomEtablissement}
              disabled={true}
            />

          <Controls.TextFieldComponent
              label="Code"
              size="small"
              name="code"
              value={formik.values.code}
              disabled
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
              label="libelle abbrégé"
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
          />
        </DialogActions>
      </form>
    )

}
export default AddUpdateCycle;