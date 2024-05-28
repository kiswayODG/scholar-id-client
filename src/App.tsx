import React from "react";
import Home from "./Home";
import { Route, Routes } from "react-router-dom";
import { routes } from "./config/routes";

function App() {
  return (
    <Routes>
      {routes.map((item) => {
        return <Route path={item.path} element={<item.component />}/>;
      })}
    </Routes>
  );
}

export default App;
