// RS

import React from "react";
import "./App.css";
import {
  FormWorkspace,
  Landing,
  Login,
  Register,
  Workspace,
  Form,
  Response,
  Setting,
} from "./pages";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route path="/" element={<Landing />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/workspace" element={<Workspace />}></Route>
          <Route path="/setting" element={<Setting />}></Route>
          <Route
            path="/workspace/:folderID/forms/:formID"
            element={<FormWorkspace />}
          ></Route>
          <Route path="/form/:folderID/:formID" element={<Form />} />
          <Route path="/response/:folderID/:formID" element={<Response />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App;
