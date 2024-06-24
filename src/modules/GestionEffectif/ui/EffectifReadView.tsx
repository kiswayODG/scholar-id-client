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

interface viewStateI {
  data: EtudiantInterface[];
  filteredData: EtudiantInterface[];
  classe: ClasseInterface[];
}

const EffectifReadView: React.FC = () => {
  const [state, setState] = useState<viewStateI>({
    data: [],
    filteredData: [],
    classe: [],
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
  },[]);

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
      field: "pere",
      headerName: "Père",
      valueGetter: (params) =>
        params.row.parent?.nom + " " + params.row.parent?.prenom,
    },
    {
      field: "pere",
      headerName: "Mère",
      valueGetter: (params) =>
        params.row.parentbis?.nom + " " + params.row.parentbis?.prenom,
    },
    {
      field: "telUrgence",
      headerName: "Contact parent",
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
      </Layout>
    </>
  );
};

export default EffectifReadView;
