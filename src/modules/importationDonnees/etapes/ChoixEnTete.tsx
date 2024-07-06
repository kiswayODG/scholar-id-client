import { Box, FormControl, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import * as XLSX from 'xlsx';


interface viewProps {
    fichier : File,
    getData? : (...T:any[])=> any,
    headLine?:number,
    sheetnameSelected?:string,
    //--
    onHeadlineChange: (newHeadline: number) => void;
    onSheetnameChange: (newSheetname: string) => void;
}

const ChoixEnTete:React.FC<viewProps> = ({ fichier, headLine, onHeadlineChange, getData,onSheetnameChange})=> {
    const [selectedSheet, setSelectedSheet] = useState<string>('');
    const [sheetNames, setSheetNames] = useState<string[]>([]);
    const [sheetData, setSheetData] = useState<any[][]>([]);
    const [headerRowIndex, setHeaderRowIndex] = useState<number>(0);

    


    const fileReader = ()=> {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetNames = workbook.SheetNames;
            setSheetNames(sheetNames);
            if (sheetNames.length === 1) {
                const worksheet = workbook.Sheets[sheetNames[0]];
                const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false, defval: "" });
                setSheetData(jsonData);
                setSelectedSheet(sheetNames[0]);
                onSheetnameChange(sheetNames[0]);
              } 
        };

        reader.readAsArrayBuffer(fichier);
      };
    useEffect(()=> {
        fileReader();
    },[])

    const handleSheetSelect = (event: SelectChangeEvent<string>) => {
        const sheetName = event.target.value as string;
        setSelectedSheet(sheetName);
        onSheetnameChange(sheetName);
    
        if (fichier) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[sheetName];
            const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false, defval: "" });
            setSheetData(jsonData);
          };
          reader.readAsArrayBuffer(fichier);
        }
      };

      const handleHeaderRowChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value);
        if (value >= 0) {
          setHeaderRowIndex(value);
        }
      };

      const handleRowClick = (rowIndex: number) => {
        onHeadlineChange(rowIndex);
        setHeaderRowIndex(rowIndex);
      };

    return (
        <>
        {sheetNames.length > 1 && (
        <Box className="mt-4">
          <FormControl fullWidth>
            <InputLabel id="sheet-select-label">Sélectionnez une feuille</InputLabel>
            <Select
              labelId="sheet-select-label"
              value={selectedSheet}
              onChange={handleSheetSelect}
            >
              {sheetNames.map((sheetName) => (
                <MenuItem key={sheetName} value={sheetName}>
                  {sheetName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

{/* {sheetData.length > 0 && (
        <Box className="mt-4 mx-4">
          <Typography >Données de la Feuille Sélectionnée</Typography>
          <TextField
            type="number"
            label="Numéro de la ligne d'en-tête"
            value={headerRowIndex}
            onChange={handleHeaderRowChange}
            size="small"
            className="mt-2 w-2/6"

          />
          <TableContainer component={Paper} className="mt-4 h-4/6" style={{height:"60vh"}}>
            <Table>
              <TableHead>
                <TableRow>
                  {sheetData[headerRowIndex].map((cell, index) => (
                    <TableCell key={index} className="border-t border-l border-r">
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {sheetData.slice(headerRowIndex + 1).map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <TableCell key={cellIndex} className="border-l border-r">
                        {cell}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )} */}

{sheetData.length > 0 && (
        <Box className="mt-4">
          <Typography variant="h6">Données de la Feuille Sélectionnée : <span style={{color:"red"}}>
            Veuillez choisir la ligne d'entête</span></Typography>

          <TableContainer component={Paper} className="mt-4" sx={{ height:"60vh"}}>
            <Table>
              {/* <TableHead>
                <TableRow>
                  {sheetData[headerRowIndex].map((cell, index) => (
                    <TableCell key={index} className="border-t border-l border-r">
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead> */}
              <TableBody>
                {sheetData.map((row, rowIndex) => (
                  <TableRow
                    key={rowIndex}
                    onClick={() => handleRowClick(rowIndex)}
                    className={`cursor-pointer ${headerRowIndex === rowIndex ? 'bg-blue-300' : ''}`}
                   
                  >
                    {row.map((cell, cellIndex) => (
                      <TableCell key={cellIndex} className="border-l border-r"  sx={{padding:"0"}}>
                        {cell}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
        </>
    )
}

export default ChoixEnTete;