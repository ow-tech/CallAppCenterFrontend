import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";

import jwt from "jwt-decode";
import { useDispatch } from "react-redux";
import { changeKind, saveId } from "../../state/actions";

import "./DashboardPage.css";
import ResponsiveAppBar from "../NavBar";
import ProfilePage from "./ProfilePage";
import AgentsPage from "./AgentsPage";
import ManagersPage from "./ManagersPage";
import UploadPage from "./UploadPage";
import RegisterPage from "./RegisterPage";
import LeadsPage from "./LeadsPage";
import ReportPage from "./ReportPage";
import CallsPage from "./CallsPageTest";
import AttemptedPage from "./AttemptedPage";
import GroupsPage from "./groupspage/GroupsPage";

const DashboardPage = () => {
  const history = useNavigate();

  const dispatch = useDispatch();
  const [kind, setkind] = useState(null);
  const [id, setId] = useState(null)
  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      setkind(jwt(localStorage.getItem("authToken")).kind);
      dispatch(changeKind(kind));

      setId(jwt(localStorage.getItem("authToken")).id);
      dispatch(saveId(id));

    }
  }, [kind,id,dispatch]);

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      history("/login");
    }

    const fetchPrivateData = async () => {
      let config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };

      try {
        await axios.get("/api/private", config);
      } catch (error) {
        if (!error.response.data.success) {
          localStorage.removeItem("authToken");
          history("/login");
        }
      }
    };

    fetchPrivateData();
  }, [history]);
  return (
    <>
      <ResponsiveAppBar />
      <Routes>
        <Route path="/" element={<ProfilePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/agents" element={<AgentsPage />} />
        <Route path="/managers" element={<ManagersPage />} />
        <Route path="/leads" element={<LeadsPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/calls" element={<CallsPage />} />
        <Route path="/attempted" element={<AttemptedPage />} />
      </Routes>
    </>
  );
};

export default DashboardPage;
