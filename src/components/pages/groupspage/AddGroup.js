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

const AddGroup = () => {
  const history = useNavigate();
  const [agentsData, setAgentsData] = useState("");

  const [selectionAgents, setSelectionAgents] = useState([]);

  const [error, setError] = useState("");
  const [open, setOpen] = React.useState(false);
  const [groupName, setGroupName] = useState(null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickOpen = () => {
    setOpen(true);
    setGroupName(null);
    setSelectionAgents([]);
  };

  const handleClose = () => {
    setOpen(false);
    setGroupName(null);
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
      if (selectionAgents.length === 0 || !groupName) {
        // eslint-disable-next-line no-throw-literal
        throw "please provide agents and groupName";
      }
      let body = {
        groupName,
        members: selectionAgents,
      };

      let data = await axios.post(`/api/groups/add`, body, config);
      if (data.data.success) {
        handleClose();
        alert("group created successfully");
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
        const { data } = await axios.get("/api/agents", config);
        setAgentsData(data.data);
      } catch (error) {
        setError("there was an error");
      }
    };

    fetchAgentsData();
  }, [history]);

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen}>
        Create new Group
      </Button>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Create new Group"}
        </DialogTitle>
        <DialogContent>
          <div className="form-group">
            <label htmlFor="name">Group Name:</label>
            <input
              type="text"
              required
              id="Group"
              placeholder="Enter a Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
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
              onSelectionModelChange={(item) => {
                setSelectionAgents(item);
              }}
            />
          </div>
          <DialogContentText>
            add a group name then select agents. and click on submit.
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

export default AddGroup;
