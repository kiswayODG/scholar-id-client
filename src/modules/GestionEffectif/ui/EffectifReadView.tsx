import TableComponent from "../../../components/TableComponent";
import Layout from "../../../components/Layout";
import { GridColDef } from "@mui/x-data-grid";
import Controls from "@components/controls";
import AddCircleOutlined from "@mui/icons-material/AddCircleOutlined";
import BadgeIcon from "@mui/icons-material/Badge";
import CoPresentIcon from "@mui/icons-material/CoPresent";
import { EtudiantInterface } from "../model/EtudiantInterface";
import { ClasseInterface } from "@modules/parametrage/model/ClasseInterface";
import { useEffect, useState } from "react";
import { apiClient } from "app-api/api";
import useModal from "../../../hooks/useModal";
import FormDialog from "@components/modals/FormDialogComponent";
import AddUpdateEtudiant from "../components/AddUpdateEtudiant";
import { TableActions } from "@components/TableAction/TableActions";
import { HttpStatusCode } from "axios";
import { toast } from "react-toastify";
import ConfirmComponent from "@components/modals/ConfirmComponent";

interface viewStateI {
  data: EtudiantInterface[];
  filteredData: EtudiantInterface[];
  classe: ClasseInterface[];
  rowToDelete: EtudiantInterface | undefined;
}

const EffectifReadView: React.FC = () => {
  const [state, setState] = useState<viewStateI>({
    data: [],
    filteredData: [],
    classe: [],
    rowToDelete: undefined,
  });

  const addUpdateStudentModal = useModal();

  const fetchEtudiantData = async () => {
    await apiClient.effectifs
      .fetchAllEtudiant()
      .then((res) => {
        setState((prevState) => ({
          ...prevState,
          data: res.data as EtudiantInterface[],
          filteredData: res.data as EtudiantInterface[],
        }));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchEtudiantData();
  }, []);

  const handleAddUpdateEtudiant = () => {
    addUpdateStudentModal.toggle();
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
          onAction={() => {
            handleAddUpdateEtudiant();
          }}
          titre="Nvl élève"
          icon={<AddCircleOutlined />}
        />
        &nbsp;
        <Controls.OnActionButton
          type="button"
          onAction={() => {}}
          titre="Générer"
          icon={<BadgeIcon />}
        />
      </>
    );
  };

  const handleUpdateStudent = (etudiant: EtudiantInterface) => {};

  const confirmDeleteModal = useModal();

  const handleWarningDelete = (model: EtudiantInterface) => {
    confirmDeleteModal.toggle();
    setState((prevState) => ({
      ...prevState,
      rowToDelete: model,
    }));
  };

  const deleteConfirmedAction = async (model: EtudiantInterface) => {
    model.deleteFlag = "O";
    await apiClient.effectifs
      .deleteEtudiant(model)
      .then((r) => {
        if (r.status == HttpStatusCode.Ok) {
          toast.success("Etudiant supprimé avec succès !");
          fetchEtudiantData();
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

  const column: GridColDef<EtudiantInterface>[] = [
    {
      field: "matricule",
      headerName: "NMatricule",
    },
    {
      field: "nom",
      headerName: "Nom",
      valueGetter: (params) => params.row.nom,
    },
    {
      field: "prenom",
      headerName: "Prénom",
      valueGetter: (params) => params.row.prenom,
    },
    {
      field: "sexe",
      headerName: "Genre",
      valueGetter: (params) => params.row.sexe,
    },
    {
      field: "classe",
      headerName: "Classe",
      valueGetter: (params) => params.row.classe.libelleClasse,
    },
    {
      field: "telephone",
      headerName: "Tel. urgence",
    },
    {
      field: "adresse",
      headerName: "Adresse",
    },
    {
      field: "actions",
      headerName: "Action(s)",
      type: "actions",
      width: 170,
      getActions: (params) => [
        <TableActions.detailAction onAction={() => {}} />,
        <TableActions.updateAction
          onAction={() => handleUpdateStudent(params.row)}
        />,
        <TableActions.printRowCardAction onAction={() => {}} />,
        <TableActions.deleteAction
          onAction={() => handleWarningDelete(params.row)}
        />,
      ],
    },
  ];

  return (
    <>
      <Layout>
        Effectif
        <div className="bg-green-500 w-full"></div>
        <TableComponent
          columns={column}
          rows={state.filteredData}
          toolBarChildren={filterComponent()}
        />
        <FormDialog
          isOpen={addUpdateStudentModal.isOpen}
          onClose={addUpdateStudentModal.toggle}
        >
          <AddUpdateEtudiant onClose={addUpdateStudentModal.toggle} />
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

export default EffectifReadView;
