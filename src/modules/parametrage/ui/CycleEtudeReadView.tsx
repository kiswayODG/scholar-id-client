import TableComponent from "@components/TableComponent";
import Layout from "../../../components/Layout";
import { GridColDef } from "@mui/x-data-grid";
import Controls from "@components/controls";
import AddCircleOutlined from "@mui/icons-material/AddCircleOutlined";
import BadgeIcon from "@mui/icons-material/Badge";
import { Box, CircularProgress, Grid, Paper } from "@mui/material";
import AddUpdateCycle from "../components/AddUpdateCycle";
import useModal from "@hooks/useModal";
import FormDialog from "@components/modals/FormDialogComponent";
import { ParametreGlobalInterface } from "../model/ParametreGlobalInterface";
import { useEffect, useState } from "react";
import { apiClient } from "app-api/api";
import { Constante, ConstanteParamGlob } from "@utils/Constantes";
import { TableActions } from "@components/TableAction/TableActions";
import { HttpStatusCode } from "axios";
import { toast } from "react-toastify";
import ConfirmComponent from "@components/modals/ConfirmComponent";
import DetailView from "../components/DetailView";

interface viewStateI {
  data: ParametreGlobalInterface[];
  filteredData: ParametreGlobalInterface[];
  addUpdateOperation: string;
  currentCycle: ParametreGlobalInterface | undefined;
  rowToDelete : ParametreGlobalInterface | undefined;
  loading: boolean;
}

const CycleEtudeReadView: React.FC = () => {
  const [state, setState] = useState<viewStateI>({
    data: [],
    filteredData: [],
    rowToDelete: undefined,
    loading: true,
    addUpdateOperation: "",
    currentCycle: undefined,
  });

  const fetchData = () => {
    apiClient.parametrage
      .fetchParamByCode(ConstanteParamGlob.PARAMG_CYCLE_ETUDE)
      .then((res) => {
        setState((prevState) => ({
          ...prevState,
          data: res.data as ParametreGlobalInterface[],
          filteredData: res.data as ParametreGlobalInterface[],
          loading: false,
        }));
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addUpdateCycleModal = useModal();

  const handleAdd = () => {
    setState((prevState) => ({
      ...prevState,
      addUpdateOperation: "Nouveau Cycle",
      currentCycle: {} as ParametreGlobalInterface,
    }));
    addUpdateCycleModal.toggle();
  };

  const filterComponent = () => {
    return (
      <>
        &nbsp;
        <Controls.OnActionButton
          type="button"
          onAction={handleAdd}
          titre="Cycle"
          icon={<AddCircleOutlined />}
        />
      </>
    );
  };

  const confirmDeleteModal = useModal();

  const handleWarningDelete = (model: ParametreGlobalInterface) => {
    confirmDeleteModal.toggle();
    setState((prevState) => ({
      ...prevState,
      rowToDelete: model,
    }));
  };


  const deleteConfirmedAction = async (model: ParametreGlobalInterface) => {
    await apiClient.parametrage
      .deleteParamGlobal(model.id)
      .then((r) => {
        if(r.status==HttpStatusCode.Ok) {
        toast.success("Niveau supprimé avec succès !");
        fetchData();
      }
      if(r.status==HttpStatusCode.Conflict)
        toast.warning("Ce cycle contient des niveau, suppression impossible !");
      })
      .catch((error) => {
      
        toast.error("Erreur lors de la suppession!");
      });
  };

  const column: GridColDef<ParametreGlobalInterface>[] = [
    {
      field: "id",
      headerName: "ID",
      width:10
    },
    // {
    //   field: "codeParam",
    //   headerName: "Code",
    // },
    {
      field: "libelleParam",
      headerName: "Libelle",
    },
    {
      field: "libelleCourt",
      headerName: "Abbréviation",
    },
    {
      field: "actions",
      headerName: "Action(s)",
      type: "actions",
      width: 150,
      getActions: (params) => [
        <TableActions.detailAction onAction={() => handleDisplayDetialCycle(params.row)} />,
        <TableActions.updateAction onAction={()=>handleUpdateCycle(params.row)} />,
        <TableActions.deleteAction onAction={() => handleWarningDelete(params.row)} />,
       
      ],
    },
  ];

  const handleDisplayDetialCycle = (cycle: ParametreGlobalInterface) => {
    setState((prevState)=>({
      ...prevState,
      currentCycle:cycle
    }))
  }

  const handleUpdateCycle = (cycle: ParametreGlobalInterface) => {
    setState((prevState) => ({
      ...prevState,
      currentCycle: cycle,
      addUpdateOperation: "Edition cycle",
    }));
    addUpdateCycleModal.toggle();
  };
  return (
    <>
      <Layout>
        Cycle
        {state.loading ? (
          <Box className="flex justify-center items-center h-screen">
            {" "}
            <CircularProgress />{" "}
          </Box>
        ) : (
          <Grid container spacing={2}>
             <Grid item xs={7.5}>
              
              <TableComponent
                columns={column}
                rows={state.filteredData}
                toolBarChildren={filterComponent()}
              />
            </Grid>
            <Grid item xs={4}>
            <Paper className="h-5/6 flex items-center justify-center mt-12">
                {/* <DetailView model={state.currentCycle}/> */}
                Vue détail
              </Paper>
            </Grid>
          </Grid>
        )}
        <FormDialog
          isOpen={addUpdateCycleModal.isOpen}
          onClose={addUpdateCycleModal.toggle}
          title={state.addUpdateOperation}
        >
          <AddUpdateCycle
            onClose={addUpdateCycleModal.toggle}
            reload={fetchData}
            cycle={state.currentCycle}
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

export default CycleEtudeReadView;
