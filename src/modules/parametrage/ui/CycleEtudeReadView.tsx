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

interface viewStateI {
  data: ParametreGlobalInterface[];
  filteredData: ParametreGlobalInterface[];
  addUpdateOperation: string;
  currentCycle: ParametreGlobalInterface;
  loading: boolean;
}

const CycleEtudeReadView: React.FC = () => {
  const [state, setState] = useState<viewStateI>({
    data: [],
    filteredData: [],
    loading: true,
    addUpdateOperation: "",
    currentCycle: {} as ParametreGlobalInterface,
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
        <TableActions.detailAction onAction={() => {}} />,
        <TableActions.updateAction onAction={()=>handleUpdateCycle(params.row)} />,
        <TableActions.deleteAction onAction={() => {}} />,
       
      ],
    },
  ];

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
        {state.loading ? (
          <Box className="flex justify-center items-center h-screen">
            {" "}
            <CircularProgress />{" "}
          </Box>
        ) : (
          <Grid container spacing={0} style={{ height: "100%" }}>
            <Grid item xs={6}>
              Cycle
              <div className="bg-green-500 w-full"></div>
              <TableComponent
                columns={column}
                rows={state.filteredData}
                toolBarChildren={filterComponent()}
              />
            </Grid>
            <Grid item xs={6}>
              <Paper className="h-full mx-6">Droite</Paper>
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
      </Layout>
    </>
  );
};

export default CycleEtudeReadView;
