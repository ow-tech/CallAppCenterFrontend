import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { DataGrid } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";

const columns = [
  { field: "_id", headerName: "ID", width: 220, editable: true },
  { field: "Answered", headerName: "Answered", width: 130, editable: true },
  { field: "Assigned", headerName: "Assigned", width: 220, editable: true },
  {
    field: "Agent_In_Charge_Id",
    headerName: "Agent_In_Charge_Id",
    width: 220,
    editable: true,
  },
  {
    field: "Attempted",
    headerName: "Attempted",
    width: 130,
    editable: true,
  },
  {
    field: "Call_Back_Later",
    headerName: "Call_Back_Later",
    width: 130,
    editable: true,
  },
  {
    field: "Call_Duration",
    headerName: "Call_Duration",
    width: 130,
    editable: true,
  },
  {
    field: "Call_End_Time",
    headerName: "Call_End_Time",
    width: 130,
    editable: true,
  },
  {
    field: "Call_Start_Time",
    headerName: "Call_Start_Time",
    width: 130,
    editable: true,
  },
  {
    field: "Is_Owner",
    headerName: "Is_Owner",
    width: 130,
    editable: true,
  },
  {
    field: "Lead_id",
    headerName: "Lead_id",
    width: 220,
    editable: true,
  },
  {
    field: "No_Answer",
    headerName: "No_Answer",
    width: 130,
    editable: true,
  },
  {
    field: "Not_Disturb",
    headerName: "Not_Disturb",
    width: 130,
    editable: true,
  },
  {
    field: "Note",
    headerName: "Note",
    width: 130,
    editable: true,
  },
  {
    field: "Property_Available",
    headerName: "Property_Available",
    width: 130,
    editable: true,
  },
];

const ReportPage = () => {
  const history = useNavigate();
  const [leadsData, setLeadsData] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      history("/login");
    }

    const fetchAttemptedLeads = async () => {
      let config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };
      try {
        let { data } = await axios.get("/api/leads/attempted", config);
        setLeadsData(data.data);
      } catch (error) {
        setError(error.response.data.message);
        setTimeout(() => {
          setError("");
        }, 5000);
      }
    };
    fetchAttemptedLeads();
  }, [history]);

  return (
    <>
      <Typography
        sx={{ flex: "1 1 100%", textAlign: "center" }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        Attempted Leads
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
          disableSelectionOnClick
          getRowId={(row) => row._id}
          onSelectionModelChange={(item) => {}}
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
    </>
  );
};

export default ReportPage;
