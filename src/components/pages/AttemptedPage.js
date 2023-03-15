import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";

import { useSelector } from "react-redux";

import "./AttemptedPage.css";

const columns = [
  { field: "_id", headerName: "ID", width: 220 },
  { field: "username", headerName: "Username", width: 130, editable: true },
  { field: "Email", headerName: "Email", width: 220, editable: true },
  {
    field: "Mobile_Number",
    headerName: "Mobile_Number",
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
    field: "Unit_Number",
    headerName: "Unit_Number",
    width: 130,
  },
];

const AttemptedPage = () => {
  const history = useNavigate();
  let userId = useSelector((state) => state.id);

  const [selectedLead, setSelectedLead] = useState(null);
  const [error, setError] = useState("");

  const [leadsData, setLeadsData] = useState("");

  const handleClick = async () => {
    let config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };
    try {
      if (!selectedLead || (selectedLead.length !== 1)) {
        // eslint-disable-next-line no-throw-literal
        throw "please select only one contact";
      }
      const { data } = await axios.put(`/api/leads/notanswered/${selectedLead[0]}`,{}, config);

      if(data.success){
        history("/dashboard/calls");
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

  const fetchLeadsData = async () => {
    let config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };

    try {
      const { data } = await axios.get(`/api/leads/notanswered`, config);

      setLeadsData(data.data);
    } catch (error) {
      setError("there was an error");
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      history("/login");
    }
    fetchLeadsData();
  }, [history]);

  return (
    <div>
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
          onSelectionModelChange={(item) => {
            setSelectedLead(item);
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
        sx={{
          margin: 2,
        }}
        onClick={handleClick}
      >
        Click to edit
      </Button>
    </div>
  );
};

export default AttemptedPage;

/*<DataGrid
rows={leadsData}
columns={columns}
pageSize={7}
rowsPerPageOptions={[7]}
checkboxSelection
getRowId={(row) => row._id}
onSelectionModelChange={(item) => {
  setSelectionLeads(item);
}}
/>*/

/*      {leadsData
        ? leadsData.map((elem) => {
            return (
              <div className="attempted-element">
                <div>id: {elem.id}</div>
                <div>Phone_Number: {elem.Phone_Number}</div>
                <div>Mobile_Number: {elem.Mobile_Number}</div>
                <div>Secondary_Number: {elem.Secondary_Number}</div>
                <button onClick={() => handleClick(elem.id)}>edit</button>
              </div>
            );
          })
        : "dddddd"}*/
