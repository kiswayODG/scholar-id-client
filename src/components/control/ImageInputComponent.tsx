import { Box, Button, Typography } from "@mui/material";
import "./imageInputComponent.scss";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useState } from "react";

interface ImageInputProps {
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileName: string;
  width?: string;
  accept: string;
  label: string;
  name: string;
  fullwidth?:boolean;
  [key: string]: any;
}

export const ImageInputComponent: React.FC<ImageInputProps> = 
({fileName,width,accept,handleFileChange,label,name,fullwidth,...rest }) => {
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChangeEx = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }

    handleFileChange(event);
  };

  return (
    <Box className="border-solid">
      <Button
        variant="contained"
        component="label"
        endIcon={<CloudUploadIcon />}
        className={fullwidth?"bg-transparent hover:bg-blue-500 text-back font-semibold hover:text-white hover:border-transparent w-full mt-4":
          "bg-transparent hover:bg-blue-500 text-back font-semibold hover:text-white hover:border-transparent w-72 mt-4"} 
      >
        {label}&nbsp;
        <input
          type="file"
          hidden
          accept={accept}
          name={name}
          onChange={handleFileChange}
        />
      </Button>

      {fileName && (
        <>
          <br />
          <Typography
            variant="caption"
            display="block"
            style={{ marginTop: "10px" }}
          >
            {fileName}
          </Typography>
        </>
      )}

      {imagePreview && (
        <Box mt={2}>
          <img
            src={imagePreview}
            alt="Preview"
            style={{ maxWidth: "100px", maxHeight: "100px" }}
          />
        </Box>
      )}
    </Box>
  );
};
