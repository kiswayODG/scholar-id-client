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
import { ListItem } from "@mui/material";
import { NiveauEtudeInterface } from "@modules/parametrage/model/NiveauInterface";
import { Download, Inbox, InboxOutlined, InputRounded } from "@mui/icons-material";
import { Navigation } from "@appConfigs/Navigation";

interface viewStateI {
  data: EtudiantInterface[];
  filteredData: EtudiantInterface[];
  classe: ClasseInterface[];
  currentRow: EtudiantInterface | undefined;
  rowToDelete: EtudiantInterface | undefined;
  sexeFilter: string;
  classFilter: number;
}

const EffectifReadView: React.FC = () => {
  const [state, setState] = useState<viewStateI>({
    data: [],
    filteredData: [],
    classe: [],
    currentRow: undefined,
    rowToDelete: undefined,
    sexeFilter: "tous",
    classFilter: 0,
  });

  const addUpdateStudentModal = useModal();

  const fetchEtudiantData = async () => {
    const classReq = await apiClient.parametrage.fetchClasses();
    await apiClient.effectifs
      .fetchAllEtudiant()
      .then((res) => {
        setState((prevState) => ({
          ...prevState,
          data: res.data as EtudiantInterface[],
          filteredData: res.data as EtudiantInterface[],
          classe: classReq.data as ClasseInterface[],
        }));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchEtudiantData();
  }, []);

  const handleAddEtudiant = () => {
    setState((prevState) => ({
      ...prevState,
      currentRow: undefined,
    }));
    addUpdateStudentModal.toggle();
  };

  const defaultClasse: ClasseInterface = {
    id: 0,
    codeClasse: "",
    libelleClasse: "Classe",
    niveauEtude: {} as NiveauEtudeInterface,
  };

  const filterComponent = () => {
    return (
      <>
        <Controls.SelectComponent
          onChange={(e) => {
            setState((prevState) => ({
              ...prevState,
              sexeFilter: e,
            }));
          }}
          options={[
            { libelle: "Sexe", valeur: "tous" },
            { libelle: "Masculin", valeur: "Masculin" },
            { libelle: "Feminin", valeur: "Feminin" },
          ]}
          renderLabel={(item) => item.libelle}
          renderValue={(item) => item.valeur}
          valeur={state.sexeFilter}
          width={150}
        />{" "}
        &nbsp;
        <Controls.SelectComponent
          onChange={(e) => {
            setState((prevState) => ({
              ...prevState,
              classFilter: e,
            }));
          }}
          options={[defaultClasse, ...state.classe]}
          renderLabel={(item) => item.libelleClasse}
          renderValue={(item) => item.id}
          valeur={state.classFilter}
          width={150}
        />
        &nbsp;
        <Controls.OnActionButton
        
          type="button"
          onAction={() => {
            handleAddEtudiant();
          }}
          titre="Nvl élève"
          icon={<AddCircleOutlined />}
        />
        &nbsp;
        <Controls.OnActionButton
          type="button"
          onAction={() => handlePrintGlobal(state.filteredData)}
          titre="Générer"
          icon={<BadgeIcon />}
        />
        <Controls.OnActionButton
          type="button"
          href={Navigation.IMPORTATION_DATA}
          titre="Importer"
          icon={<Download />}
          
        />
      </>
    );
  };

  useEffect(() => {
    let data = state.data.filter((item) => {
      let sexeBool = false;
      let classBool = false;
      if (item.sexe == state.sexeFilter || state.sexeFilter == "tous")
        sexeBool = true;
      if (item.classe?.id == state.classFilter || state.classFilter == 0)
        classBool = true;

      return sexeBool && classBool;
    });

    setState((prevState) => {
      return {
        ...prevState,
        filteredData: data,
      };
    });
  }, [state.sexeFilter, state.classFilter]);

  const handleUpdateStudent = (etudiant: EtudiantInterface) => {
    setState((prevState) => ({
      ...prevState,
      currentRow: etudiant,
    }));
    addUpdateStudentModal.toggle();
  };

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

  const handlePrint = async (etudiant: EtudiantInterface) => {
    let buffer: ArrayBuffer = new ArrayBuffer(0);
    await apiClient.effectifs
      .printUniqueCard(etudiant?.id!)
      .then((res) => {
        buffer = res;
      })
      .catch((reason) => console.log(reason));
    if (buffer.byteLength > 0) {
      const blob = new Blob([new Uint8Array(buffer)], {
        type: "application/pdf",
      });
      const fileUrl = URL.createObjectURL(blob);
      window.open(fileUrl, "_blank");
    } else {
      toast.success("Fichier introuvable ou supprimé!");
    }
  };

  const handlePrintGlobal = async (etudiants: EtudiantInterface[]) => {
    let buffer: ArrayBuffer = new ArrayBuffer(0);

    await apiClient.effectifs
      .printCardMulti(etudiants)
      .then((res) => {
        buffer = res;
      })
      .catch((reason) => console.log(reason));
    if (buffer.byteLength > 0) {
      const blob = new Blob([new Uint8Array(buffer)], {
        type: "application/pdf",
      });
      const fileUrl = URL.createObjectURL(blob);
      window.open(fileUrl, "_blank");
    } else {
      toast.success("Fichier introuvable ou supprimé!");
    }
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
      valueGetter: (params) => params.row.classe?.libelleClasse,
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
        <TableActions.printRowCardAction
          onAction={() => handlePrint(params.row)}
        />,
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
          <AddUpdateEtudiant
            onClose={addUpdateStudentModal.toggle}
            etudiant={state.currentRow!}
            reload={fetchEtudiantData}
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

export default EffectifReadView;
