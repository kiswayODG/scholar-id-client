import { LocalizationProvider, MobileTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { colors } from "appConfigs/ColorPalette";

interface DateProps {
    label: string;
    onChange: (prop: any) => void;
    value: any;
    width?: string;
}

export const TimePickerComponent = ({label,onChange,value,width}: DateProps) => {

    return (<>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='fr'>
            <MobileTimePicker
                sx={{
                    // ".MuiFormLabel-root": {
                    //     color: colors.primary[100],
                    // },
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
                    
                }}
                value={value}
                label={label}
                ampm={false}
                onChange={onChange}
                localeText={{
                    cancelButtonLabel: 'Annuler',
                    okButtonLabel: "OK",
                    toolbarTitle: 'Choisir une heure'
                }}
            />
        </LocalizationProvider>
    </>)
}