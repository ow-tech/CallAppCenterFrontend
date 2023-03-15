import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import SendIcon from "@mui/icons-material/Send";

const columns = [
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

const AgentsPage = () => {
  const history = useNavigate();
  const [selectionAgents, setSelectionAgents] = useState([]);
  const [selectionManagers, setSelectionManagers] = useState([]);
  const [agentsData, setAgentsData] = useState("");
  const [managersData, setManagersData] = useState("");
  const [error, setError] = useState("");

  const bindAgents = async (e) => {
    e.preventDefault();
    let config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };
    let agentsDataFormated = selectionAgents.map((elem) => {
      return { id: elem };
    });
    try {
      if (!selectionManagers[0] || !selectionAgents[0]) {
        // eslint-disable-next-line no-throw-literal
        throw {
          response: {
            data: { message: "please provide a manager and agents" },
          },
        };
      }
      let data = await axios.put(
        `/api/bindagent/${selectionManagers[0]}`,
        agentsDataFormated,
        config
      );
      if(data.data.success){
        alert("agents added to manager successfully")
      }
    } catch (error) {
      setError(error.response.data.message);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

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
        const data2 = await axios.get("/api/managers", config);
        setManagersData(data2.data.data);

        const { data } = await axios.get("/api/agents", config);
        setAgentsData(data.data);
      } catch (error) {
        setError("there was an error");

      }
    };

    fetchAgentsData();
  }, [history]);
  return (
    <>
      <Typography
        sx={{ flex: "1 1 100%", textAlign: "center" }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        Agents
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
          columns={columns}
          pageSize={7}
          rowsPerPageOptions={[7]}
          checkboxSelection
          disableSelectionOnClick
          getRowId={(row) => row._id}
          onSelectionModelChange={(item) => {
            setSelectionAgents(item);
          }}
        />
      </div>
      <Typography
        sx={{ flex: "1 1 100%", textAlign: "center" }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        Managers
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
          rows={managersData}
          columns={columns}
          pageSize={7}
          rowsPerPageOptions={[7]}
          checkboxSelection
          disableSelectionOnClick
          getRowId={(row) => row._id}
          onSelectionModelChange={(item) => {
            setSelectionManagers(item);
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
      <Button
        variant="contained"
        endIcon={<SendIcon />}
        style={{
          margin: 5,
        }}
        onClick={bindAgents}
      >
        Bind agents to Manager
      </Button>
    </>
  );
};

export default AgentsPage;
