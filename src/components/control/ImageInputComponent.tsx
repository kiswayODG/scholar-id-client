import { Button } from "@mui/material";
import "./imageInputComponent.scss";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

interface imageInputProps {
  onChange: (event: any) => void;
  width?: string;
  accept: string;
}

export const ImageInputComponent = (props: imageInputProps) => {
  return (
    <Button variant="contained" component="label" endIcon={true}>
      Choisir un fichier
      <input
        type="file"
        hidden
        accept={props.accept}
        onChange={props.onChange}
      />
      <CloudUploadIcon />
    </Button>
  );
};
