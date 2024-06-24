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
import { useState } from "react";
import { apiClient } from "app-api/api";
import { ConstanteParamGlob } from "@utils/Constantes";
import { TableActions } from "@components/TableAction/TableActions";


interface viewStateI {
  data: NiveauEtudeInterface[];
  filteredData : NiveauEtudeInterface[];
  cycleList : ParametreGlobalInterface[];
  addUpdateOpération: string;
  currentRow: NiveauEtudeInterface;
  loading : boolean;
}
const NiveauEtudeReadView: React.FC = () => {
  const addUpdateNiveauModal = useModal();

const [state,setState] = useState<viewStateI>({
  data:[],
  filteredData:[],
  cycleList:[],
  addUpdateOpération: "",
  loading: true,
  currentRow: {} as NiveauEtudeInterface,
})

const [activeDetail, setDetail] = useState<boolean>(false);

  const getData = async ()=> {
    const niveauReqResponse = await apiClient.parametrage.fetchNiveaux();
    const cycleReqResponse = await apiClient.parametrage.fetchParamByCode(ConstanteParamGlob.PARAMG_CYCLE_ETUDE);

    setState((prevState)=>({
      ...prevState,
      cycleList: cycleReqResponse.data as ParametreGlobalInterface[],
      data: niveauReqResponse.data as NiveauEtudeInterface[],
      filteredData:  niveauReqResponse.data as NiveauEtudeInterface[],
      loading:false
    }))
  }
  const handleAddNiveau = () => {
    setState((prevState)=>({
      ...prevState,
      addUpdateOpération:"Nouveau niveau",
      currentRow: {} as NiveauEtudeInterface,
    }))
    addUpdateNiveauModal.toggle();
  };

  const handleUpdateNiveau = (model: NiveauEtudeInterface) => {
    setState((prevState)=>({
      ...prevState,
      addUpdateOpération:"Edition niveau",
      currentRow: model,
    }))
    addUpdateNiveauModal.toggle();
  };
  
  const filterComponent = () => {
    return (
      <>
        <Controls.SelectComponent
          onChange={() => {}}
          options={[]}
          renderLabel={() => ""}
          renderValue={() => ""}
          valeur={""}
          width={200}
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

  const column: GridColDef[] = [
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
      field: "actions",
      headerName: "Action(s)",
      type: "actions",
      width: 150,
      getActions: (params) => [
        <TableActions.detailAction onAction={() => {}} />,
        <TableActions.updateAction onAction={()=>handleUpdateNiveau(params.row)} />,
        <TableActions.deleteAction onAction={() => {}} />,
       
      ],
    },
  ];

  return (
    <>
      <Layout>
        <Grid container spacing={2}>
          <Grid item xs={7.5}>
          {state.loading ? (
          <Box className="flex justify-center items-center h-screen">
            {" "}
            <CircularProgress />{" "}
          </Box>
        ) :  <TableComponent
              columns={column}
              rows={state.filteredData}
              toolBarChildren={filterComponent()}
            />}
          </Grid>
          <Grid item xs={4}>
            <Paper className="h-5/6 flex items-center justify-center mt-12">
              Detail view
            </Paper>
          </Grid>
        </Grid>

        <FormDialog
          isOpen={addUpdateNiveauModal.isOpen}
          onClose={addUpdateNiveauModal.toggle}
        >
          <AddUpdateNiveau onClose={addUpdateNiveauModal.toggle} reload={getData}/>
        </FormDialog>
      </Layout>
    </>
  );
};

export default NiveauEtudeReadView;
