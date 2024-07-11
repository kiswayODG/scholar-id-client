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
}

export const ImageInputComponent = (props: ImageInputProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

    props.handleFileChange(event);
  };

  return (
    <Box className="border-solid">
      <Button
        variant="contained"
        component="label"
        endIcon={<CloudUploadIcon />}
        className="bg-transparent hover:bg-blue-500 text-back font-semibold hover:text-white hover:border-transparent w-72 mt-4"
      >
        {props.label}&nbsp;
        <input
          type="file"
          hidden
          accept={props.accept}
          name={props.name}
          onChange={handleFileChange}
        />
      </Button>

      {props.fileName && (
        <>
          <br />
          <Typography
            variant="caption"
            display="block"
            style={{ marginTop: "10px" }}
          >
            {props.fileName}
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
