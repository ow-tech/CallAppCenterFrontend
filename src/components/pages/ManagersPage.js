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
  { field: "email", headerName: "Email", width: 150, editable: true },
  {
    field: "kind",
    headerName: "category",
    type: "number",
    width: 130,
  },
];

const ManagersPage = () => {
  const history = useNavigate();
  const [managersData, setManagersData] = useState("");
  const [agentsData, setAgentsData] = useState("");
  const [selectionManagers, setSelectionManagers] = useState([]);
  const [error, setError] = useState("");

  const relatedAgents = async (e) => {
    e.preventDefault();
    let config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };
    try {
      console.log(selectionManagers);
      if (!selectionManagers[0]) {
        // eslint-disable-next-line no-throw-literal
        throw {
          response: {
            data: { message: "please provide a manager" },
          },
        };
      }
      let { data } = await axios.get(
        `/api/relatedagents/${selectionManagers[0]}`,
        config
      );
      setAgentsData(data.data);
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
        const data = await axios.get("/api/managers", config);
        setManagersData(data.data.data);
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
      <Button
        variant="contained"
        endIcon={<SendIcon />}
        style={{
          margin: 5,
        }}
        onClick={relatedAgents}
      >
        show related agents
      </Button>
      {error && (
        <div
          style={{
            backgroundColor: "red",
          }}
        >
          {error}
        </div>
      )}
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
        />
      </div>
    </>
  );
};

export default ManagersPage;
