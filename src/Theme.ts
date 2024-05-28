import { createTheme } from '@mui/material/styles';
import { blue, green, purple } from '@mui/material/colors';

export const theme = createTheme({
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
    },
    palette: {
        primary: {
            main: blue[500],
        },
        secondary: {
            main: green[500],
        },
    },
    components: {

        MuiButtonBase: {
            defaultProps: {
                disableRipple: true, 
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    color: "#000000",
                    fontWeight: "bold",
                    fontSize:"1rem",
                    textTransform: 'none',
                },
            },
        },
    }
});
