import Controls from "@components/controls";
import TableComponent from "@components/TableComponent";
import AddCircleOutlined from "@mui/icons-material/AddCircleOutlined";
import { GridColDef } from "@mui/x-data-grid";
import Layout from "../../../components/Layout";
import BadgeIcon from "@mui/icons-material/Badge";
import { Box, CircularProgress, Grid, Paper } from "@mui/material";
import useModal from "@hooks/useModal";
import AddUpdateNiveau from "../components/AddUpdateNiveau";
import FormDialog from "@components/modals/FormDialogComponent";
import { NiveauEtudeInterface } from "../model/NiveauInterface";
import { ParametreGlobalInterface } from "../model/ParametreGlobalInterface";
import { useEffect, useState } from "react";
import { apiClient } from "app-api/api";
import { ConstanteParamGlob } from "@utils/Constantes";
import { TableActions } from "@components/TableAction/TableActions";
import ConfirmComponent from "@components/modals/ConfirmComponent";
import { toast } from "react-toastify";
import { HttpStatusCode } from "axios";
import { EtablissementInterface } from "../model/EtablissementInterface";

interface viewStateI {
  data: NiveauEtudeInterface[];
  filteredData: NiveauEtudeInterface[];
  cycleList: ParametreGlobalInterface[];
  addUpdateOperation: string;
  currentRow: NiveauEtudeInterface | undefined;
  rowToDelete: NiveauEtudeInterface | undefined;
  loading: boolean;
  filteredCycleSelected: number,
}
const NiveauEtudeReadView: React.FC = () => {
  const addUpdateNiveauModal = useModal();

  const [state, setState] = useState<viewStateI>({
    data: [],
    filteredData: [],
    cycleList: [],
    addUpdateOperation: "",
    loading: true,
    currentRow: undefined,
    rowToDelete: undefined,
    filteredCycleSelected:0,
  });

  const [activeDetail, setDetail] = useState<boolean>(false);

  const getData = async () => {
    const niveauReqResponse = await apiClient.parametrage.fetchNiveaux();
    const cycleReqResponse = await apiClient.parametrage.fetchParamByCode(
      ConstanteParamGlob.PARAMG_CYCLE_ETUDE
    );

    setState((prevState) => ({
      ...prevState,
      cycleList: cycleReqResponse.data as ParametreGlobalInterface[],
      data: niveauReqResponse.data as NiveauEtudeInterface[],
      filteredData: niveauReqResponse.data as NiveauEtudeInterface[],
      loading: false,
    }));
  };
  const defaultCycle: ParametreGlobalInterface = {
    codeParam: ConstanteParamGlob.PARAMG_CYCLE_ETUDE,
    id: 0,
    libelleCourt: "",
    libelleParam: "Cycle d'étude",
    paramEtab: {} as EtablissementInterface,
  };
  const handleAddNiveau = () => {
    setState((prevState) => ({
      ...prevState,
      addUpdateOperation: "Nouveau niveau",
      currentRow: undefined,
    }));
    addUpdateNiveauModal.toggle();
  };

  const handleUpdateNiveau = (model: NiveauEtudeInterface) => {
    setState((prevState) => ({
      ...prevState,
      addUpdateOperation: "Edition niveau",
      currentRow: model,
    }));
    addUpdateNiveauModal.toggle();
  };

  useEffect(()=>{
    let newDataFiltered = state.data.filter((item)=>{
      let cycleBool = false;
      if(state.filteredCycleSelected==0)
        cycleBool=true;
      else 
        cycleBool= item.cycleEtude.id==state.filteredCycleSelected
      
        return cycleBool;
    })

    setState((prevState)=>({
      ...prevState,
      filteredData:newDataFiltered
    }))
  },[state.filteredCycleSelected])

  const filterComponent = () => {
    return (
      <>
        <Controls.SelectComponent
          onChange={(newValue) => {
            setState((prevState)=>({
              ...prevState,
              filteredCycleSelected:newValue
            }))
          }}
          options={[defaultCycle,...state.cycleList]}
          renderLabel={(item) => item.libelleParam}
          renderValue={(item) => item.id}
          valeur={state.filteredCycleSelected}
          width={150}
        />{" "}
        &nbsp;
        <Controls.OnActionButton
          type="button"
          onAction={handleAddNiveau}
          titre="Niveau"
          icon={<AddCircleOutlined />}
        />
      </>
    );
  };

  const confirmDeleteModal = useModal();

  const handleWarningDelete = (model: NiveauEtudeInterface) => {
    confirmDeleteModal.toggle();
    setState((prevState) => ({
      ...prevState,
      rowToDelete: model,
    }));
  };

  const deleteConfirmedAction = async (model: NiveauEtudeInterface) => {
    await apiClient.parametrage
      .deleteNiveau(model.id)
      .then((r) => {
        if (r.status == HttpStatusCode.Ok) {
          toast.success("Niveau supprimé avec succès !");
          getData();
        }
        if (r.status == HttpStatusCode.Conflict)
          toast.warning(
            "Ce niveau contient des classes, suppression impossible !"
          );
      })
      .catch((error) => {
        toast.error("Erreur lors de la suppession!");
      });
  };

  const column: GridColDef<NiveauEtudeInterface>[] = [
    {
      field: "id",
      headerName: "ID",
    },
    {
      field: "libelleNiveauEtude",
      headerName: "Libelle",
    },
    {
      field: "codeNiveauEtude",
      headerName: "Code",
    },
    {
      field: "cycle",
      headerName: "Cycle",
      valueGetter:(params) =>
        params.row.cycleEtude.libelleParam
      ,
    },
    {
      field: "actions",
      headerName: "Action(s)",
      type: "actions",
      width: 150,
      getActions: (params) => [
        <TableActions.detailAction onAction={() => {}} />,
        <TableActions.updateAction
          onAction={() => handleUpdateNiveau(params.row)}
        />,
        <TableActions.deleteAction
          onAction={() => handleWarningDelete(params.row)}
        />,
      ],
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Layout>
        Niveau
        <Grid container spacing={2}>
          <Grid item xs={7.5}>
            {state.loading ? (
              <Box className="flex justify-center items-center h-screen">
                {" "}
                <CircularProgress />{" "}
              </Box>
            ) : (
              <TableComponent
                columns={column}
                rows={state.filteredData}
                toolBarChildren={filterComponent()}
              />
            )}
          </Grid>
          <Grid item xs={4}>
            <Paper className="h-5/6 flex items-center justify-center mt-12">
              Vue détail
            </Paper>
          </Grid>
        </Grid>
        <FormDialog
          isOpen={addUpdateNiveauModal.isOpen}
          onClose={addUpdateNiveauModal.toggle}
          title={state.addUpdateOperation}
        >
          <AddUpdateNiveau
            onClose={addUpdateNiveauModal.toggle}
            niveau={state.currentRow}
            reload={getData}
          />
        </FormDialog>
        <ConfirmComponent
          isOpen={confirmDeleteModal.isOpen}
          title={"Attention!!!"}
          onClose={confirmDeleteModal.toggle}
          message="Etes vous certain de procéder à la supression ?"
          onAction={() => deleteConfirmedAction(state.rowToDelete!)}
        />
      </Layout>
    </>
  );
};

export default NiveauEtudeReadView;
