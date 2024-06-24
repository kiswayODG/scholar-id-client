import React from "react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";import { Route, Routes } from "react-router-dom";
import { routes } from "@appConfigs/routes";
import { Box, createTheme, PaletteMode } from "@mui/material";


function App() {
  
const [mode, setMode] = React.useState<PaletteMode>('light');
const defaultTheme = createTheme({ palette: { mode } });
  return (
   <>
    <Routes>
      {routes.map((item) => {
        return <Route path={item.path} element={<item.component />}/>;
      })}
    </Routes>
    <ToastContainer autoClose={8000} />
    </>
  );
}

export default App;
