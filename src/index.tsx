import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import "./fonts/AnekTelugu-Variable.ttf"
import App from './App';
import reportWebVitals from './reportWebVitals';
import { LinearProgress, StyledEngineProvider, ThemeProvider } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { theme } from './Theme';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  
    <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>
    <BrowserRouter>
    <Suspense fallback={<LinearProgress />}>
    <App />
    </Suspense>
    </BrowserRouter>
    </ThemeProvider>
    </StyledEngineProvider>
);

reportWebVitals();
