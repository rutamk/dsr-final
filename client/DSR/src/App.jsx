import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import DSR from "../pages/DSR";
import "./index.css";
import AddEditDepartment from "../components/AddEditDepartment";

const routes = (
  <Router>
    <Routes>
      <Route path="/login" exact element={<Login />} />
      <Route path="/home" exact element={<Home />} />
      <Route path="/dsr" exact element={<DSR />} />
      <Route path="" exact element={<Login />} />
    </Routes>
  </Router>
);

const App = () => {
  return <div>{routes}</div>;
};

export default App;
