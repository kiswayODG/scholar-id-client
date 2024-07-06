import React, { useState, useEffect } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Grid,
} from "@mui/material";
import * as XLSX from "xlsx";
import { EtudiantImportationInterface } from "../EtudiantImportInterface";
import { toast } from "react-toastify";

interface ViewProps {
  fichier: File;
  sheetname: string;
  headLine: number;
  onCreateEtudiants: (
    sheetData: any[][],
    mappings: { [key: string]: string }
  ) => EtudiantImportationInterface[];
  validate: () => void;
}

const etudiantFields: Array<keyof EtudiantImportationInterface> = [
  "nom",
  "prenom",
  "adresse",
  "sexe",
  "telephoneUrgence",
  "dateNaissance",
  "lieuNaiss",
  "matricule",
  "classe",
  "photo",
];

const MappageColonne: React.FC<ViewProps> = ({
  fichier,
  sheetname,
  headLine,
  onCreateEtudiants,
  validate,
}) => {
  const [sheetData, setSheetData] = useState<string[]>([]);
  const [mappings, setMappings] = useState<{ [key: string]: string }>({});
  const [donnees, setDonnees] = useState<any[][]>([]);

  useEffect(() => {
    const loadSheetData = async () => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[sheetname];

        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
        });
        setDonnees(XLSX.utils.sheet_to_json(worksheet, { header: 1 }));

        setSheetData(jsonData[headLine]);
      };
      reader.readAsArrayBuffer(fichier);
    };

    if (fichier) {
      loadSheetData();
    }
  }, [fichier, sheetname, headLine]);

  const handleMappingChange = (
    field: keyof EtudiantImportationInterface,
    column: string
  ) => {
    setMappings((prevMappings) => ({
      ...prevMappings,
      [field]: column,
    }));
  };

  const handleCreate = () => {
    const etudiants = onCreateEtudiants(donnees, mappings);

    if (!areAllFieldsUnDefined(etudiants)) {
      validate();
      toast.info(
        "Données sauvées ! Veuillez finaliser l'opération en cliquant sur Finir!"
      );
    } else toast.warning("Veuillez bien faire correspondre les colonnes");

    
  };

  const areAllFieldsUnDefined = (
    etudiants: EtudiantImportationInterface[]
  ): boolean => {
    return etudiants.every((etudiant) => {
      return Object.values(etudiant).every(
        (field) => field === "" || field === undefined
      );
    });
  };
  return (
    <Grid
      display="flex"
      flexDirection={"row"}
      flexWrap={"wrap"}
      className="mt-16 mx-8"
    >
      {etudiantFields.map((field, index) => (
        <>
          <Grid>
            <FormControl className="mr-6">
              <InputLabel>{field}</InputLabel>
              <Select
                value={mappings[field] || ""}
                onChange={(e) =>
                  handleMappingChange(field, e.target.value as string)
                }
                label={field}
                size="small"
                sx={{ width: "230px" }}
              >
                {sheetData &&
                  sheetData.map((column, index) => (
                    <MenuItem key={index} value={column}>
                      {column}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          {(index + 1) % 4 == 0 ? (
            <Grid className="w-full ">
              {" "}
              <br />{" "}
            </Grid>
          ) : null}
        </>
      ))}

      <Button variant="contained" color="primary" onClick={handleCreate}>
        Enregistrer
      </Button>
    </Grid>
  );
};

export default MappageColonne;
