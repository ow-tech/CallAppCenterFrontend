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
  { field: "_id", headerName: "ID", width: 220 },
  { field: "username", headerName: "Username", width: 130 },
  {
    field: "kind",
    headerName: "category",
    type: "number",
    width: 130,
  },
  { field: "email", headerName: "Email", width: 220 },
];

const EditGroup = () => {
  const history = useNavigate();
  const [agentsData, setAgentsData] = useState("");

  const [selectionAgents, setSelectionAgents] = useState([]);
  const [selectedName, setSelectedName] = useState(null);

  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [names, setNames] = useState(null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const getGroupDetails = async () => {
    let config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };

    try {
      if (!selectedName || selectedName === "please select a Group") {
        // eslint-disable-next-line no-throw-literal
        throw "please select groupName";
      }
      let body = {
        groupName: selectedName,
      };
      let users = await axios.get("/api/agents", config);
      let { data } = await axios.post(`/api/groups/find`, body, config);


      setAgentsData(users.data.data);
      setSelectionAgents(data.ids[0].members);
    } catch (error) {
      if (error.message) {
        setError(error.message);
      } else {
        setError(error);
      }

      setTimeout(() => {
        setError("");
      }, 2000);
    }
  };



  const handleClickOpen = () => {
    setOpen(true);
    setSelectedName(null);
    setAgentsData("");
    setSelectionAgents([]);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedName(null);
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
      if (selectionAgents.length === 0 || !selectedName) {
        // eslint-disable-next-line no-throw-literal
        throw "please provide agents and groupName";
      }
      let body = {
        groupName: selectedName,
        members: selectionAgents,
      };

      let data = await axios.post(`/api/groups/edit`, body, config);

      if (data.data.success) {
        handleClose();
        alert("group updated successfully");
      }
    } catch (error) {
      setSelectedName(null);     
      setAgentsData("");
      setSelectionAgents([]);
      if (error.message) {
        setError(error.message);
      } else {
        setError(error);
      }

      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  useEffect(() => {
    getGroupDetails();
  }, [selectedName]);

  useEffect(() => {
    const fetchGroupData = async () => {
      let config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };

      try {
        const { data } = await axios.get("/api/groups/names", config);
        setNames(data.data);
      } catch (error) {
        setError("there was an error");
      }
    };

    fetchGroupData();
  }, [open, history]);

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen}>
        Edit Existing Group
      </Button>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{"Edit Group"}</DialogTitle>
        <DialogContent>
          <div className="form-group">
            <label htmlFor="name">category:</label>
            <select
              className="select-button"
              name="category"
              id="category"
              onChange={(e) => setSelectedName(e.target.value)}
            >
              <option>please select a Group</option>
              {names &&
                names.map((elem, index) => {
                  return <option value={elem}>{elem}</option>;
                })}
            </select>
          </div>
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
              height: 400,
              width: "95%",
              backgroundColor: "white",
              margin: 2,
            }}
          >
            <DataGrid
              rows={agentsData}
              columns={columns}
              pageSize={7}
              rowsPerPageOptions={[7]}
              checkboxSelection
              getRowId={(row) => row._id}
              selectionModel={selectionAgents}
              onSelectionModelChange={(item) => {
                setSelectionAgents(item);
              }}
            />
          </div>
          <DialogContentText>
            select a group name then select agents. and click on submit.
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

export default EditGroup;
