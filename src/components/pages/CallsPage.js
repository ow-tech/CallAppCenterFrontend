import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CallsPage.css";

import TextField from "@mui/material/TextField";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Checkbox from '@mui/material/Checkbox';

const CallsPage = () => {
  const history = useNavigate();

  const [leadsData, setLeadsData] = useState("");
  const [answerState, setAnswerState] = useState(null);
  const [invalidNumber, setInvalidNumber] = useState(null);
  const [interestedState, setInterestedState] = useState(null);
  const [interestedFor, setInterestedFor] = useState(null);
  const [available, setAvailable] = useState(null);
  const [owner, setOwner] = useState(null);
  const [anotherProperty, setAnotherProperty] = useState(null);
  const [anotherPropertyOwner, setAnotherPropertyOwner] = useState(null)
  const [busy, setBusy] = useState(null);
  const [note, setNote] = useState(null)

  const [error, setError] = useState("");

  const updateLeadFunction = async (e) => {
    e.preventDefault();
    let config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };
    
    try {
      if(!note){
        // eslint-disable-next-line no-throw-literal
        throw "please write a note";
      }
      let body =   {
        "id": leadsData[0]._id,
        "Note": note,
        "Is_Owner": owner,
        "Call_Back_Later": false,
        "Answered": answerState,
        "Interested": interestedState,
        "Property_Available": available,
        "Not_Disturb": busy,
        "Invalid_Number": invalidNumber,
        "Intersted_For": interestedFor,
    }
      /*let response = await axios.put(
        `/api/profile/leads/update`,
        body,
        config
      );*/
      console.log(body)
      // setting lead data back to default
      setNote(null)
      setInvalidNumber(null)
      setAnswerState(null)
      setLeadsData("")

    } catch (error) {
      setError(error);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      history("/login");
    }
    const fetchLeadsData = async () => {
      let config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };

      try {
        const { data } = await axios.get("/api/profile/leads", config);
        setLeadsData(data.data);
      } catch (error) {
        setError("there was an error");
        setTimeout(() => {
          setError("");
        }, 5000);
      }
    };

    fetchLeadsData();
  }, [leadsData]);
  return leadsData ? (
    leadsData.map((elem) => {
      return (
        <div className="calls-page-main">
          <div className="calls-page" key={elem._id}>
            <h2>contact details</h2>
            <table>
            <tbody>
              <tr>
                <td className="table-name">ID:</td>
                <td>{elem._id}</td>
              </tr>
              <tr>
                <td className="table-name">Name:</td>
                <td>{elem.Name}</td>
              </tr>
              <tr>
                <td className="table-name">Phone_Number:</td>
                <td>{elem.Phone_Number}</td>
              </tr>
              <tr>
                <td className="table-name">Mobile_Number:</td>
                <td>{elem.Mobile_Number}</td>
              </tr>
              <tr>
                <td className="table-name">Secondary_Number:</td>
                <td>{elem.Secondary_Number}</td>
              </tr>
              <tr>
                <td className="table-name">Email:</td>
                <td>{elem.Email}</td>
              </tr>
              <tr>
                <td className="table-name">Unit_Number:</td>
                <td>{elem.Unit_Number}</td>
              </tr>
              <tr>
                <td className="table-name">Building_Name:</td>
                <td>{elem.Building_Name}</td>
              </tr>
              <tr>
                <td className="table-name">Area:</td>
                <td>{elem.Area}</td>
              </tr>
              <tr>
                <td className="table-name">Bedrooms:</td>
                <td>{elem.Bedrooms}</td>
              </tr>
              <tr>
                <td className="table-name">City:</td>
                <td>{elem.City}</td>
              </tr>
              <tr>
                <td className="table-name">Country:</td>
                <td>{elem.Country}</td>
              </tr>
              <tr>
                <td className="table-name">Country_Code:</td>
                <td>{elem.Country_Code}</td>
              </tr>
              <tr>
                <td className="table-name">Master_Project:</td>
                <td>{elem.Master_Project}</td>
              </tr>
              <tr>
                <td className="table-name">Project:</td>
                <td>{elem.Project}</td>
              </tr>
              </tbody>
            </table>
          </div>
          <div className="calls-page">
    <FormControl>
      <FormLabel id="demo-row-radio-buttons-group-label">is the call answered?</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
      >
        <FormControlLabel value={true} control={<Radio />} label="Yes" onChange={(e) => setAnswerState(true)} />
        <FormControlLabel value={false} control={<Radio />} label="No" onClick={(e) => setAnswerState(false)}/>
      </RadioGroup>
    </FormControl>
    
    {answerState === false && <FormControl>
      <FormLabel id="demo-row-radio-buttons-group-label">invalid number?</FormLabel>
      <RadioGroup
        row        
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        onChange={(e) => setInvalidNumber(e.target.value)}
      >
        <FormControlLabel value={true} control={<Radio />} label="Yes" />
        <FormControlLabel value={false} control={<Radio />} label="No" />
        
      </RadioGroup>
    </FormControl>}
          {answerState === true && <FormControl>
      <FormLabel id="demo-row-radio-buttons-group-label">is Owner?</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
      >
        <FormControlLabel value={true} control={<Radio />} label="Yes" onClick={(e) => setOwner(true)} />
        <FormControlLabel value={false} control={<Radio />} label="No" onClick={(e) => setOwner(false)}/>
      </RadioGroup>
    </FormControl>}
    {answerState === true && <FormControl>
      <FormLabel id="demo-row-radio-buttons-group-label">is Busy?</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
      >
        <FormControlLabel value={true} control={<Radio />} label="Yes" onClick={(e) => setBusy(true)} />
        <FormControlLabel value={false} control={<Radio />} label="No" onClick={(e) => setBusy(false)}/>
      </RadioGroup>
    </FormControl>}
    {busy === false && owner === false && <FormControl>
      <FormLabel id="demo-row-radio-buttons-group-label">another property?</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
      >
        <FormControlLabel value={true} control={<Radio />} label="Yes" onClick={(e) => setAnotherProperty(true)} />
        <FormControlLabel value={false} control={<Radio />} label="No" onClick={(e) => setAnotherProperty(false)}/>
      </RadioGroup>
    </FormControl>}
    {anotherProperty === true && owner === false &&  <FormControl>
      <FormLabel id="demo-row-radio-buttons-group-label">Owner?</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
      >
        <FormControlLabel value={true} control={<Radio />} label="Yes" onClick={(e) => setAnotherPropertyOwner(true)} />
        <FormControlLabel value={false} control={<Radio />} label="No" onClick={(e) => setAnotherPropertyOwner(false)}/>
      </RadioGroup>
    </FormControl>}
    {((busy === false && owner === true) || anotherPropertyOwner === true) && <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">is interested?</FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
            >
              <FormControlLabel value={true} control={<Radio />} label="Yes" onClick={(e) => setInterestedState(true)} />
              <FormControlLabel value={false} control={<Radio />} label="No" onClick={(e) => setInterestedState(false)}/>
            </RadioGroup>
          </FormControl>}
    {interestedState === false && <FormControl>
      <FormLabel id="demo-row-radio-buttons-group-label">why not interested?</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
      >
        <FormControlLabel value={true} control={<Radio />} label="Do not Call Again" onClick={(e) => setAvailable("Do not Call Again")}  />
        <FormControlLabel value={false} control={<Radio />} label="Property Busy" onClick={(e) => setAvailable("Property Busy")}/>
      </RadioGroup>
    </FormControl>}
    {interestedState === true && <FormControl>
      <FormLabel id="demo-row-radio-buttons-group-label">Sell or Lease?</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
      >
        <FormControlLabel value={true} control={<Radio />} label="Sell" onClick={(e) => setInterestedFor("Sell")} />
        <FormControlLabel value={false} control={<Radio />} label="Lease" onClick={(e) => setInterestedFor("Lease")}/>
      </RadioGroup>
    </FormControl>}
    {anotherProperty === false && <FormControl>
      <FormLabel id="demo-row-radio-buttons-group-label">interested to buy or rent a property?</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
      >
        <FormControlLabel value={"Buy"} control={<Radio />} label="Buy" onClick={(e) => setInterestedFor("Buy")}/>
        <FormControlLabel value={"Rent"} control={<Radio />} label="Rent" onClick={(e) => setInterestedFor("Rent")} />
        <FormControlLabel value={"Not"} control={<Radio />} label="Not Interested" onClick={(e) => setInterestedState("false")}  />
      </RadioGroup>
    </FormControl>}

            <TextField
              id="filled-multiline-static"
              label="Note"
              value={null}
              multiline
              rows={8}
              placeholder="please take a note here"
              variant="filled"
              sx={{ width: "50ch", margin: 1 }}
              onChange={((e) =>setNote(e.target.value))}
            />
            <button onClick={updateLeadFunction}>diiis</button>
            {error && (
        <div
          style={{
            backgroundColor: "red",
            padding: 5
          }}
        >
          {error}
        </div>
      )}
          </div>
        </div>
      );
    })
  ) : (
    <div>{error}</div>
  );
};

export default CallsPage;
