import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const columns = [
  { field: "username", headerName: "Username", width: 150 },
  { field: "email", headerName: "Email", width: 220 },
  { field: "_id", headerName: "ID", width: 220 },
];

const AgentAssignLead = ({ leadsData , fetchLeadsData}) => {
  const history = useNavigate();
  const [agentsData, setAgentsData] = useState("");

  const [selectionAgents, setSelectionAgents] = useState([]);

  const [error, setError] = useState("");
  const [open, setOpen] = React.useState(false);
  
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickOpen = () => {
    setOpen(true);
    setSelectionAgents([]);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectionAgents([]);
  };

  const bindAgents = async (e) => {
    e.preventDefault();
    let config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };
    
    try {
      if (selectionAgents.length !== 1) {
        // eslint-disable-next-line no-throw-literal
        throw "please provide agent";
      }
      let body = {
        agent: selectionAgents[0],
        leadsID: leadsData[0]._id
      };

      let data = await axios.post(`/api/leads/agenttoagent`, body, config);
      if (data.data.success) {
        handleClose();
        alert("assigned successfully");
        window.location.reload(false);
      }
    } catch (error) {
      if (error.message) {
        setError(error.message);
      } else {
        setError(error);
      }

      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  useEffect(() => {
    const fetchAgentsData = async () => {
      let config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };

      try {
        const { data } = await axios.get("/api/leads/agents", config);
        setAgentsData(data.data);
      } catch (error) {
        setError("there was an error");
      }
    };

    fetchAgentsData();
  }, [leadsData]);

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen}>
        Assign to another Agent
      </Button>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Assign to another Agent"}
        </DialogTitle>
        <DialogContent>
          <div
            style={{
              height: 400,
              width: 450,
              backgroundColor: "white",
              margin: 2,
            }}
          >
            <DataGrid
              rows={agentsData}
              columns={columns}
              pageSize={7}
              rowsPerPageOptions={[7]}
              getRowId={(row) => row._id}
              onSelectionModelChange={(item) => {
                console.log(item)
                setSelectionAgents(item);
              }}
            />
          </div>
          <DialogContentText>
            please select one agent and click on submit.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={bindAgents} autoFocus>
            Submit
          </Button>
        </DialogActions>
        {error && (
          <div
            style={{
              backgroundColor: "red",
            }}
          >
            {error}
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default AgentAssignLead;
