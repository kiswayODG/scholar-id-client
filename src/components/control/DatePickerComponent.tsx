import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { colors } from "appConfigs/ColorPalette";
interface DateProps {
  titre: string;
  onChange: (prop:any) => void;
  value: any;
  width?:string;
  [key: string]: any;
}

export const DatePickerComponent = ({titre,onChange,value,width,...rest}: DateProps) => {
  return (
    <LocalizationProvider adapterLocale="fr" dateAdapter={AdapterDayjs}>
      <DatePicker
        slotProps={{
          textField: {
            size: "small",
            error: false,
          },
        }}
        label={titre}
        value={value}
        format='DD/MM/YYYY'
        onChange={onChange}
        sx={{ width:width,
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
            },}}
            

            {...rest}
      />
    </LocalizationProvider>
  );
};
