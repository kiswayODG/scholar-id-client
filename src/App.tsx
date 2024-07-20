import React, { useEffect } from "react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";import { Route, Routes } from "react-router-dom";
import { routes } from "@appConfigs/routes";
import { Box, createTheme, PaletteMode } from "@mui/material";
import { GlobalDebug } from "@utils/Utils";


function App() {
  
const [mode, setMode] = React.useState<PaletteMode>('light');
const defaultTheme = createTheme({ palette: { mode } });

useEffect(() => {
  (process.env.NODE_ENV === "production" ||
   process.env.REACT_APP_ENV === "STAGING") &&
    GlobalDebug(false);
}, []);
  return (
   <>
    <Routes>
      {routes.map((item,index) => {
        return <Route key={index}  path={item.path} element={<item.component />}/>;
      })}
    </Routes>
    <ToastContainer autoClose={8000} />
    </>
  );
}

export default App;
