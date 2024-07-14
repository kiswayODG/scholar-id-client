import { Navigation } from "@appConfigs/Navigation";
import Controls from "@components/controls";
import * as XLSX from "xlsx";
import { EtudiantInterface } from "@modules/GestionEffectif/model/EtudiantInterface";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Grid,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import { DropzoneArea } from "react-mui-dropzone";
import ChoixEnTete from "./etapes/ChoixEnTete";
import MappageColonne from "./etapes/MappageColonne";
import { EtudiantImportationInterface } from "./EtudiantImportInterface";
import { toast } from "react-toastify";
import { VilleInterface } from "@modules/parametrage/model/VilleInterface";
import { apiClient } from "app-api/api";
import levenshtein from "js-levenshtein";
import { ClasseInterface } from "@modules/parametrage/model/ClasseInterface";
import { convertExcelDateToJSDate, parseDate } from "@utils/Utils";
import { useNavigate } from "react-router-dom";
import { Check, Height } from "@mui/icons-material";
import NavigateNext from "@mui/icons-material/NavigateNext";
import PhotoSelection from "./etapes/PhotoSelection";

interface viewStateI {
  fileSheet: File | null;
  sheetnameSelected: string;
  headLine: number;
  save: boolean;
  villes: VilleInterface[];
  classes: ClasseInterface[];
}
const fields: { key: keyof EtudiantInterface; label: string }[] = [
  { key: "matricule", label: "Matricule" },
  { key: "nom", label: "Nom" },
  { key: "prenom", label: "Prénom" },
  { key: "telephone", label: "Tel. urgence" },
  { key: "prenom", label: "Prénom" },
  { key: "adresse", label: "Adresse" },
  { key: "dateNaissance", label: "Date naiss." },
  { key: "lieuNaiss", label: "Lieu naiss." },
  { key: "sexe", label: "Sexe(Masculin ou Feminin)" },
  { key: "classe", label: "Classe" },
];
const steps = [
  "Selection fichier",
  "Choix entete",
  "correspondance col",
  "Selection photos",
];

const ChargementFichier: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());
  const [etudiants, setEtudiants] = useState<EtudiantInterface[]>([]);
  const [etudiantsImport, setEtudiantImport] = useState<
    EtudiantImportationInterface[]
  >([]);

  const [state, setState] = useState<viewStateI>({
    fileSheet: null,
    headLine: 0,
    sheetnameSelected: "",
    save: false,
    villes: [],
    classes: [],
  });

  const fetchData = async () => {
    const villeResponse = await apiClient.parametrage.fetchAllVille();
    const classReq = await apiClient.parametrage.fetchClasses();

    setState((prevState) => ({
      ...prevState,
      villes: villeResponse.data as VilleInterface[],
      classes: classReq.data as ClasseInterface[],
    }));
  };

  useEffect(() => {
    fetchData();
  }, []);
  const handleReset = () => {
    setActiveStep(0);
  };

  const handleCreateEtudiants = (
    sheetData: any[][],
    mappings: { [key: string]: string }
  ) => {
    console.log(sheetData);
    if (!sheetData.length) return [];

    const newEtudiants = sheetData.slice(state.headLine + 1).map((row) => {
      const etudiant: EtudiantImportationInterface = {
        nom: "",
        matricule: "",
        prenom: "",
        lieuNaiss: "",
        dateNaissance: "",
        photo: "",
        sexe: "",
        telephoneUrgence: "",
        adresse: "",
        classe: "",
      };

      Object.keys(mappings).forEach((field) => {
        const columnIndex = sheetData[state.headLine].indexOf(
          mappings[field as keyof EtudiantInterface]
        );
        const fieldPath = field.split(".");
        let current: any = etudiant;

        for (let i = 0; i < fieldPath.length - 1; i++) {
          if (!current[fieldPath[i]]) {
            current[fieldPath[i]] = {};
          }
          current = current[fieldPath[i]];
        }

        current[fieldPath[fieldPath.length - 1]] = row[columnIndex];
      });

      return etudiant;
    });

    console.log(newEtudiants);
    setEtudiantImport(newEtudiants);

    return newEtudiants;
  };
  const findClosestCity = (
    city: string,
    villeList: VilleInterface[]
  ): VilleInterface => {
    let closestCity = villeList[0];
    let minDistance = levenshtein(city, closestCity.nomVille);

    villeList.forEach((currentCity) => {
      const distance = levenshtein(city, currentCity.nomVille);
      if (distance < minDistance) {
        minDistance = distance;
        closestCity = currentCity;
      }
    });

    return closestCity;
  };

  const findClosestClass = (
    className: string,
    classList: ClasseInterface[]
  ): ClasseInterface => {
    let closestClass = classList[0];
    let minDistance = levenshtein(className, closestClass.libelleClasse);

    classList.forEach((currentClass) => {
      const distance = levenshtein(className, currentClass.libelleClasse);
      if (distance < minDistance) {
        minDistance = distance;
        closestClass = currentClass;
      }
    });

    return closestClass;
  };

  const navigate = useNavigate();

  const handleFolderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|webp|tiff)$/i;

    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (imageExtensions.test(file.name)) {
        const matricule = file.name.split(".")[0];

        const studentIndex = etudiantsImport.findIndex(
          (student) => student.matricule === matricule
        );

        if (studentIndex !== -1) {
          const updatedStudents = [...etudiants];

          const reader = new FileReader();
          reader.onloadend = () => {
            updatedStudents[studentIndex].imageBase64 =
              reader.result?.toString().split(",")[1] || "";
            setEtudiants(updatedStudents); // Update state with the updated students array
          };
          reader.readAsDataURL(file);
        }
      }
    });
  };

  const handleFinishMappingData = () => {
    let studentsTosend = etudiantsImport.map((item) => {
      const closestCity = findClosestCity(item.lieuNaiss, state.villes);
      const closestClass = findClosestClass(item.classe, state.classes);

      let etudiant: EtudiantInterface = {
        nom: item.nom,
        prenom: item.prenom,
        sexe:
          item.sexe.length > 1
            ? item.sexe.toLowerCase().includes("ma")
              ? "Masculin"
              : "Feminin"
            : item.sexe.toLowerCase().includes("m")
            ? "Masculin"
            : "Feminin",
        dateNaissance:
          convertExcelDateToJSDate(Number(item.dateNaissance)) != null
            ? convertExcelDateToJSDate(Number(item.dateNaissance))!
                .toISOString()
                .split("T")[0]
            : "",
        lieuNaiss: closestCity,
        matricule: item.matricule,
        adresse: item.adresse,
        id: 0,
        telephone: item.telephoneUrgence,
        imageBase64: "",
        classe: closestClass,
      };
      return etudiant;
    });

    setEtudiants(studentsTosend);
  };

  const handleFinish = async () => {
    await apiClient.effectifs
      .createMultipleStudent(etudiants)
      .then((res) => {
        if (res.data == true) {
          toast.success("Importation réalisée avec succès !");
        } else {
          toast.error("Une erreur s'est produite lors de l'opération");
        }
      })
      .catch((error) => {
        console.log(error);
      });

    navigate(Navigation.EFFECTIF);
  };

  const valider = () => {
    setState((prevState) => ({
      ...prevState,
      save: true,
    }));
  };

  // const isStepOptional = (step: number) => {
  //     return step === 1;
  //   };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    if (activeStep == 0 && state.fileSheet == null) {
      toast.warning(
        "Veuillez bien choisir un fichier de données, avant de poursuivre !"
      );
      return;
    }

    if (activeStep === steps.length - 1) handleFinishMappingData();

    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleHeadlineChange = (newHeadline: number) => {
    setState((prevState) => ({
      ...prevState,
      headLine: newHeadline,
    }));
  };

  const handleSheetnameChange = (newSheetname: string) => {
    setState((prevState) => ({
      ...prevState,
      sheetnameSelected: newSheetname,
    }));
  };

  const onDrop = (acceptedFiles: File[]) => {
    setState((prevState) => ({
      ...prevState,
      fileSheet: acceptedFiles[0],
    }));
  };

  return (
    <Box sx={{ width: "100%" }} className="mt-6">
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};

          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            Toutes les étapes ont été complétées!
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          {activeStep == 0 ? (
            <Grid sx={{ marginX: "5rem" }}>
              <Typography className="text-center text-xl text-green-600 mt-4 mb-1">
                Il est souhaitable d'avoir un fichier excel de la forme
              </Typography>

              <div className="border-t border-l border-r border-solid border-black flex">
                {fields.map((field, index) => (
                  <div
                    key={field.key as string}
                    className={`flex-1 flex items-center justify-center ${
                      index < fields.length - 1
                        ? "border-r border-solid border-black"
                        : ""
                    }`}
                  >
                    <span className="text-center">{field.label}</span>
                  </div>
                ))}
              </div>
              <DropzoneArea
                acceptedFiles={[".xlsx", ".xls"]}
                showFileNames
                dropzoneText="Veuillez charger un fichier excel ici !"
                onChange={onDrop}
              />
            </Grid>
          ) : activeStep == 1 ? (
            <ChoixEnTete
              fichier={state.fileSheet!}
              onHeadlineChange={handleHeadlineChange}
              onSheetnameChange={handleSheetnameChange}
            />
          ) : activeStep == 2 ? (
            <MappageColonne
              fichier={state.fileSheet!}
              headLine={state.headLine}
              sheetname={state.sheetnameSelected}
              onCreateEtudiants={handleCreateEtudiants}
              validate={valider}
            />
          ) : activeStep == 3 ? (
            <PhotoSelection handleFolderChange={handleFolderChange} />
          ) : null}

          <Box
            sx={{ pt: 2 }}
            className="flex  justify-between mx-4 self-end mt-auto"
          >
            {/* <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button> */}

            <Controls.CancelButton
              startIcon={<CloseIcon />}
              title="Annuler"
              href={Navigation.EFFECTIF}
            />



            {activeStep !== steps.length - 1 &&
            activeStep !== steps.length - 2 ? (
              <Controls.OnActionButton
                onAction={handleNext}
                titre={activeStep === steps.length - 1 ? "Terminer" : "Suivant"}
                type="button"
                iconEnd={
                  activeStep === steps.length - 1 ? <Check /> : <NavigateNext />
                }
                style={{ height: "35px" }}
              />
            ) : state.save && activeStep == steps.length - 2 ? (
              <Controls.OnActionButton
                onAction={handleNext}
                titre={activeStep === steps.length - 1 ? "Terminer" : "Suivant"}
                type="button"
                iconEnd={
                  activeStep === steps.length - 1 ? <Check /> : <NavigateNext />
                }
                style={{ height: "35px" }}
              />
            ) : state.save && activeStep === steps.length - 1 ? (
              <Controls.OnActionButton
                onAction={handleFinish}
                iconEnd={<Check />}
                titre={"Terminer"}
                type="button"
              />
            ) : null}
          </Box>
        </React.Fragment>
      )}
    </Box>
  );

  //   return (

  //   );
};
export default ChargementFichier;
