import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Layout_Auth from "./layout/Layout_Auth";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Verify from "./pages/auth/Verify";
// user
import Layout_user from "./layout/Layout_user";
import Dashboard from "./pages/user/dashboard";
import NotesList from "./pages/user/Notes_Pages";

const App = () => {

  return (

      <Routes>
        <Route path="/auth" element={<Layout_Auth />}>
          <Route index element={<Login />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route path="/verify" element={<Verify />} />
        <Route path="/" element={<Layout_user />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="notes" element={<NotesList />} />
        </Route>
      </Routes>
  );
};


export default App;
