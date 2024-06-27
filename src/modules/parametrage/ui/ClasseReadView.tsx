import Controls from "@components/controls";
import Layout from "../../../components/Layout";
import AddCircleOutlined from "@mui/icons-material/AddCircleOutlined";
import { GridColDef } from "@mui/x-data-grid";
import TableComponent from "@components/TableComponent";
import BadgeIcon from "@mui/icons-material/Badge";
import { ClasseInterface } from "../model/ClasseInterface";
import useModal from "hooks/useModal";
import AddUpdateClasse from "../components/AddUpdateClasse";
import FormDialog from "components/modals/FormDialogComponent";
import { NiveauEtudeInterface } from "../model/NiveauInterface";
import { useEffect, useState } from "react";
import { apiClient } from "app-api/api";
import { TableActions } from "@components/TableAction/TableActions";
import { Box, CircularProgress } from "@mui/material";
import ConfirmComponent from "@components/modals/ConfirmComponent";
import { HttpStatusCode } from "axios";
import { toast } from "react-toastify";

interface viewStateI {
  data : ClasseInterface[],
  filteredData : ClasseInterface[],
  niveauxListe : NiveauEtudeInterface[],
  currentModel: ClasseInterface | undefined,
  updaddOp: string,
  rowToDelete:  ClasseInterface | undefined,
  loading: boolean,
}

const ClasseReadView: React.FC = () => {

  const[state, setState] = useState<viewStateI>({
    data : [],
    filteredData : [],
    niveauxListe : [],
    currentModel: {} as ClasseInterface,
    updaddOp:"",
    loading: true,
    rowToDelete : undefined,
  })

const fetchtableData = async()=> {
  await apiClient.parametrage.fetchClasses()
  .then((res)=>{
    setState((prevState)=>({
      ...prevState,
      data : res.data as ClasseInterface[],
      filteredData : res.data as ClasseInterface[],
      loading: false,
    }))
  })
}

  const addClassModal = useModal();

  const handleAddClasse = () => {
    setState((prevState)=>({
      ...prevState,
      currentModel: undefined,
      updaddOp:"Nouvelle classe"
    }))
    addClassModal.toggle();
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
        <Controls.SelectComponent
          onChange={() => {}}
          options={[]}
          renderLabel={() => ""}
          renderValue={() => ""}
          valeur={""}
          width={200}
        />
        &nbsp;
        <Controls.OnActionButton
        type="button"
          onAction={handleAddClasse}
          titre="Classe"
          icon={<AddCircleOutlined />}
        />
      </>
    );
  };

  const handleUpdateClasse = (model: ClasseInterface)=> {
    setState((prevState)=>({
      ...prevState,
      currentModel: model,
      updaddOp: "Edition classe",
    }))
    addClassModal.toggle();
  }

  const confirmDeleteModal = useModal();

  const handleWarningDelete = (model: ClasseInterface) => {
    confirmDeleteModal.toggle();
    setState((prevState) => ({
      ...prevState,
      rowToDelete: model,
    }));
  };

  const deleteConfirmedAction = async (model: ClasseInterface) => {
    await apiClient.parametrage
      .deleteClasse(model.id)
      .then((r) => {
        if(r.status==HttpStatusCode.Ok) {
        toast.success("Niveau supprimé avec succès !");
        fetchtableData();
      }
      if(r.status==HttpStatusCode.Conflict)
        toast.warning("Ce cycle contient des niveau, suppression impossible !");
      })
      .catch((error) => {
      
        toast.error("Erreur lors de la suppession!");
      });
  };

  const column: GridColDef<ClasseInterface>[] = [
    {
      field: "id",
      headerName: "id",
    },
    {
      field: "libelleClasse",
      headerName: "Libelle",
    },
    {
      field: "codeClasse",
      headerName: "Code",
    },
    {
      field: "niveauEtude",
      headerName: "Niveau",
      valueGetter: (param) => param.row.niveauEtude.libelleNiveauEtude,
    },
    {
      field: "actions",
      headerName: "Action(s)",
      type: "actions",
      width: 150,
      getActions: (params) => [
        <TableActions.detailAction onAction={() => {}} />,
        <TableActions.updateAction onAction={()=>handleUpdateClasse(params.row)} />,
        <TableActions.deleteAction onAction={() => handleWarningDelete(params.row)} />,
       
      ],
    },

  ];
  useEffect(()=>{
    fetchtableData();
  },[])

  return (
    <>
      <Layout>
        Classe
        <div className="bg-green-500 w-full"></div>
        {state.loading ? (
          <Box className="flex justify-center items-center h-screen">
            {" "}
            <CircularProgress />{" "}
          </Box>
        ) :<TableComponent
          columns={column}
          rows={state.filteredData}
          toolBarChildren={filterComponent()}
        />}
        <FormDialog
          isOpen={addClassModal.isOpen}
          onClose={addClassModal.toggle}
          title={state.updaddOp}
        >
          <AddUpdateClasse reload={fetchtableData} onClose={addClassModal.toggle} classe={state.currentModel}/>
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

export default ClasseReadView;
