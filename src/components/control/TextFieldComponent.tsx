import { styled, TextField } from "@mui/material";
import { colors } from "appConfigs/ColorPalette";



export const TextFieldComponent = styled(TextField)(({ theme }) => {

  return {
      margin: "10px 0",
      "& label.Mui-focused": {
          color:  "#A0AAB4",
      },
      "& .MuiInput-underline:after": {
          borderBottomColor: "#B2BAC2",
      },
      "& .MuiOutlinedInput-root": {
          "& fieldset": {
              borderColor:  "#E0E3E7",
          },
          "&:hover fieldset": {
            borderColor: colors.primary[100],
          },
          "&.Mui-focused fieldset": {
              borderColor: colors.primary[100],
          },
          
      },
      
  };
});
