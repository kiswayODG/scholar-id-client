import { TextField } from "@mui/material";
import { ChangeEvent } from "react";

interface InputProps {
  className?: string;
  name?: string;
  label?: string;
  value: string;
  width?: string|number;
  onChange: (value?: string, name?: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string | null;
}

export const InputComponent: React.FC<InputProps> = ({
  name,
  label,
  value,
  error,
  onChange,
  className,
  width,
}) => {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value, event.target.name);
  };
  return (
    <TextField
      className={className}
      variant="outlined"
      label={label}
      name={name}
      value={value}
      sx={{width:width!}}
      onChange={handleInputChange}
      {...(error && { error: true, helperText: error })}
    />
  );
};
