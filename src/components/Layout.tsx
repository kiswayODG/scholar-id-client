import React, { ReactNode } from 'react';
import { Header } from './menus/Header';
import { Footer } from './menus/Footer';
import { Section } from './menus/Section';
import { ThemeProvider } from '@emotion/react';
import { createTheme, Box, PaletteMode } from '@mui/material';
import { theme } from 'Theme';
interface LayoutProps {
    className?: string;
    children: ReactNode;
}
const Layout: React.FC<LayoutProps> = ({ className = '', children }) => {
    
    return (
        <ThemeProvider theme={theme}>
        <div className={className} >
            <Header />
            <Section>
            <Box sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
          }}
          >
            {children}
            </Box>
            </Section>
            {/* <Footer /> */}
        </div>
        </ThemeProvider>
    );
};

export default Layout;
