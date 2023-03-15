import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const columns = [
  { field: "_id", headerName: "ID", width: 220 },
  { field: "No", headerName: "No", width: 100 },
  { field: "Call_Data.Agent_In_Charge_Id", headerName: "Username", width: 130, editable: true, valueFormatter: (params) => {console.log(params);return params.row?.Call_Data.Agent_In_Charge_Id}  },
  { field: "Email", headerName: "Email", width: 220, editable: true },
  {
    field: "Area",
    headerName: "Area",
    width: 130,
  },
  {
    field: "Bedrooms",
    headerName: "Bedrooms",
    width: 130,
  },
  {
    field: "Building_Name",
    headerName: "Building_Name",
    width: 130,
  },
  {
    field: "City",
    headerName: "City",
    width: 130,
  },
  {
    field: "Country",
    headerName: "Country",
    width: 130,
  },
  {
    field: "Country_Code",
    headerName: "Country_Code",
    width: 130,
  },
  {
    field: "Master_Project",
    headerName: "Master_Project",
    width: 130,
  },
  {
    field: "Mobile_Number",
    headerName: "Mobile_Number",
    width: 130,
  },
  {
    field: "Name",
    headerName: "Name",
    width: 130,
  },
  {
    field: "Project",
    headerName: "Project",
    width: 130,
  },
  {
    field: "Phone_Number",
    headerName: "Phone_Number",
    width: 130,
  },
  {
    field: "Secondary_Number",
    headerName: "Secondary_Number",
    width: 130,
  },
  {
    field: "Unit_Number",
    headerName: "Unit_Number",
    width: 130,
  },
];

const agentsColumns = [
  { field: "_id", headerName: "ID", width: 220 },
  { field: "username", headerName: "Username", width: 130, editable: true },
  { field: "email", headerName: "Email", width: 220, editable: true },
  {
    field: "kind",
    headerName: "category",
    type: "number",
    width: 130,
  },
];

const LeadsPage = () => {
  const history = useNavigate();
  const [leadsData, setLeadsData] = useState("");
  const [agentsData, setAgentsData] = useState("");
  const [selectionAgents, setSelectionAgents] = useState([]);
  const [selectionLeads, setSelectionLeads] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      history("/login");
    }

    const fetchAgentsData = async () => {
      let config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };

      try {
        const { data } = await axios.get("/api/agents", config);
        setAgentsData(data.data);
      } catch (error) {
        setError("there was an error");
      }
    };
    fetchAgentsData();
  }, [history]);

  const fetchLeadsData = async () => {
    let config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };
    try {
      setLoading(true);
      let { data } = await axios.get("/api/leads/all", config);

      if (data.success) {
        setLoading(false);
      }
      setLeadsData(data.data);
      console.log(data.data)
    } catch (error) {
      setError(error.response.data.message);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  const fetchUnassignedLeads = async (e) => {
    e.preventDefault();
    let config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };
    try {
      setLoading(true);

      let { data } = await axios.get("/api/leads/unassigned", config);
      if (data.success) {
        setLoading(false);
      }
      setLeadsData(data.data);
    } catch (error) {
      setError(error.response.data.message);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  const assignLeads = async (e) => {
    e.preventDefault();
    let config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };
    try {
      setLoading(true);

      let { data } = await axios.put(
        `/api/leads/assign/${selectionAgents}`,
        selectionLeads,
        config
      );
      if (data.success) {
        setLoading(false);
      }
      console.log(data);
      setSuccess(data.message);
      setTimeout(() => {
        setSuccess("");
      }, 5000);
    } catch (error) {
      setError("error");
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };
  return (
    <>
      <Typography
        sx={{ flex: "1 1 100%", textAlign: "center" }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        All Leads
      </Typography>
      <div
        style={{
          height: 500,
          width: "95%",
          backgroundColor: "white",
          margin: 10,
        }}
      >
        <DataGrid
          rows={leadsData}
          columns={columns}
          pageSize={7}
          rowsPerPageOptions={[7]}
          checkboxSelection
          getRowId={(row) => row._id}
          onSelectionModelChange={(item) => {
            setSelectionLeads(item);
          }}
        />
      </div>
      {error && (
        <div
          style={{
            backgroundColor: "red",
          }}
        >
          {error}
        </div>
      )}
      {!loading ? (
        <Button
          variant="contained"
          style={{
            margin: 5,
          }}
          onClick={fetchLeadsData}
        >
          get all leads
        </Button>
      ) : (
        <div className="loading">
          <Box sx={{ display: "flex" }}>
            <CircularProgress />
          </Box>
        </div>
      )}
      {!loading ? (
        <Button
          variant="contained"
          style={{
            margin: 5,
          }}
          onClick={fetchUnassignedLeads}
        >
          get unassigned leads
        </Button>
      ) : (
        <div className="loading">
          <Box sx={{ display: "flex" }}>
            <CircularProgress />
          </Box>
        </div>
      )}
      <Typography
        sx={{ flex: "1 1 100%", textAlign: "center" }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        All Agents
      </Typography>
      <div
        style={{
          height: 500,
          width: "95%",
          backgroundColor: "white",
          margin: 10,
        }}
      >
        <DataGrid
          rows={agentsData}
          columns={agentsColumns}
          pageSize={7}
          rowsPerPageOptions={[7]}
          checkboxSelection
          getRowId={(row) => row._id}
          onSelectionModelChange={(item) => {
            setSelectionAgents(item);
          }}
        />
      </div>
      {error && (
        <div
          style={{
            backgroundColor: "red",
          }}
        >
          {error}
        </div>
      )}
      {success && (
        <div
          style={{
            backgroundColor: "green",
            color: "black",
          }}
        >
          {success}
        </div>
      )}
      please select only one agent
      {!loading ? (
        <Button
          variant="contained"
          style={{
            margin: 5,
          }}
          onClick={assignLeads}
        >
          assign leads to agent
        </Button>
      ) : (
        <div className="loading">
          <Box sx={{ display: "flex" }}>
            <CircularProgress />
          </Box>
        </div>
      )}
    </>
  );
};

export default LeadsPage;
