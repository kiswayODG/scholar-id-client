import FolderIcon from "@components/icons/FolderIcon";
import { Title } from "@modules/dashboard/MainDashboard";
import { Box, Button, Typography } from "@mui/material";
import { useRef, useState } from "react";

interface PhotoSelectionProps {
  handleFolderChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PhotoSelection: React.FC<PhotoSelectionProps> = ({ handleFolderChange }) => {
  const folderInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<FileList | null>(null);

  const handleButtonClick = () => {
    if (folderInputRef.current) {
      folderInputRef.current.click(); // Simule le clic sur l'input type file
    }
  };

  const handleFolderInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setSelectedFolder(files);
    handleFolderChange(event);
  };

  const countImageFiles = () => {
    if (!selectedFolder) return 0;
    let imageCount = 0;
    for (let i = 0; i < selectedFolder.length; i++) {
      const file = selectedFolder[i];
      if (file.type.startsWith('image/')) {
        imageCount++;
      }
    }
    return imageCount;
  };

  return (
    <Box className="flex flex-col items-center  justify-center mt-16">
      <Title>
      <div  className="mb-6">
        Veuillez choisir le répertoire contenant les photos des élèves/étudiants.
      </div>
      </Title>
      <input
        type="file"
        onChange={handleFolderInputChange}
        ref={(node) => {
          folderInputRef.current = node;

          if (node) {
            ["webkitdirectory", "directory", "mozdirectory"].forEach((attr) => {
              node.setAttribute(attr, "");
            });
          }
        }}
        style={{ display: "none" }} // Cacher l'input type file par défaut
      />
      <Button
        variant="contained"
        className="bg-transparent hover:bg-blue-500 text-back font-semibold hover:text-white 
        hover:border-transparent w-72 mt-4
        flex justify-between"
        onClick={handleButtonClick}
        style={{ marginTop: '10px' }}
    
      >

        <span>Ouvrir un répertoire</span>
      <FolderIcon size={60}/>
        
      </Button>
      {selectedFolder && (
        <Typography variant="body2" style={{ marginTop: '10px' }}>
          Répertoire sélectionné : {selectedFolder[0].webkitRelativePath.split('/').slice(0, -1).join('/')}
          <br />
          Nombre de fichiers images : {countImageFiles()}
        </Typography>
      )}
    </Box>
  );
};

export default PhotoSelection;
