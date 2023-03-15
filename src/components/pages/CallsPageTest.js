import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import "./CallsPage.css";

import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";

import { createTheme, ThemeProvider } from "@mui/material/styles";

import AgentAssignLead from "./AgentAssignLead";

const themecall = createTheme({
  typography: {
    fontSize: 15,
    fontWeightBold: 900,
  },
  palette: {
    hotcolor: {
      main: "#ff0000",
    },
    greencolor: {
      main: "#1eff00",
    },
  },
});

const CallsPage = () => {
  const history = useNavigate();

  const [open, setOpen] = useState(false);
  const [leadsData, setLeadsData] = useState("");
  const [note, setNote] = useState(null);
  const [time, setTime] = useState(null);
  const [hourSet, setHourSet] = useState(null);

  let defaultForm = {
    Is_Owner: null,
    Call_Back_Later: null,
    Answered: null,
    Busy: null,
    Interested: null,
    Property_Available: null,
    Not_Disturb: null,
    Invalid_Number: null,
    Intersted_For: null,
    anotherProperty: null,
    anotherPropertyOwner: null,
    leadType: null,
  };
  const [formData, setFormData] = useState(defaultForm);
  const [validNumber, setValidNumber] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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

      if (data.data[0].Call_Data.Note) {
        setNote(data.data[0].Call_Data.Note);
      }
      switch (data.data[0].Call_Data.attemptedCount) {
        case 0:
          setHourSet(48);
          break;
        case 1:
          setHourSet(48);
          break;
        case 2:
          setHourSet(168);
          break;
        default:
          setHourSet("noanswer");
      }
    } catch (error) {
      console.log(error);
      setError("there was an error");
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  const updateLeadFunction = async (e) => {
    e.preventDefault();
    let config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };

    try {
      //validation
      if (!formData.Answered) {
        // eslint-disable-next-line no-throw-literal
        throw "please answer the questions";
      }
      if (!note) {
        // eslint-disable-next-line no-throw-literal
        throw "please write a note";
      }
      if (note.length < 10) {
        // eslint-disable-next-line no-throw-literal
        throw "please write at least 10 letters";
      }
      if (formData.Answered === "true" && !validNumber) {
        // eslint-disable-next-line no-throw-literal
        throw "please select a valid number";
      }
      if (formData.Call_Back_Later === "true") {
        // eslint-disable-next-line no-throw-literal
        throw "please schedule a callback";
      }
      setLoading(true);

      let body = {
        ...formData,
        id: leadsData[0]._id,
        Note: note,
        validNumber,
        Call_Back_Later: null,
      };

      let response = await axios.put(`/api/profile/leads/update`, body, config);

      // setting lead data back to default

      setNote(null);
      setLeadsData("");
      setValidNumber(null);
      setFormData(defaultForm);
      setTime(null);

      if (response.data.success) {
        setLoading(false);
        fetchLeadsData();
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

  const callBackLaterFunction = async () => {
    let config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };

    try {
      if (
        moment(time).utcOffset(4).valueOf() < moment().utcOffset(4).valueOf()
      ) {
        // eslint-disable-next-line no-throw-literal
        throw "please put a valid time";
      }
      if (!time) {
        // eslint-disable-next-line no-throw-literal
        throw "please put a time";
      }
      if (!note) {
        // eslint-disable-next-line no-throw-literal
        throw "please write a note";
      }
      if (note.length < 10) {
        // eslint-disable-next-line no-throw-literal
        throw "please write at least 10 letters";
      }
      if (formData.Invalid_Number === "false" && !validNumber) {
        // eslint-disable-next-line no-throw-literal
        throw "please select a valid number";
      }

      let body = {
        id: leadsData[0]._id,
        time: time,
        Note: note,
      };
      let response = await axios.put(
        `/api/profile/leads/callback`,
        body,
        config
      );

      setNote(null);
      setLeadsData("");
      setValidNumber(null);
      setFormData(defaultForm);
      setTime(null);

      if (response.data.success) {
        fetchLeadsData();
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

  const callBackAfterHoursFunction = async (hour) => {
    let config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };

    try {
      let thisTime;
      if (hour) {
        thisTime = moment().utcOffset(4).add(hour, "hours").format();
      } else {
        thisTime = null;
      }
      if (formData.Invalid_Number === "false" && !validNumber) {
        // eslint-disable-next-line no-throw-literal
        throw "please select a valid number";
      }
      if (!note) {
        // eslint-disable-next-line no-throw-literal
        throw "please write a note";
      }
      if (note.length < 10) {
        // eslint-disable-next-line no-throw-literal
        throw "please write at least 10 letters";
      }
      let body = {
        id: leadsData[0]._id,
        time: thisTime,
        Note: note,
        fixed: true,
      };
      let response = await axios.put(
        `/api/profile/leads/callback`,
        body,
        config
      );
      setNote(null);
      setLeadsData("");
      setValidNumber(null);
      setFormData(defaultForm);
      setTime(null);

      if (response.data.success) {
        fetchLeadsData();
      }
    } catch (error) {
      console.log(error);
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
    if (!localStorage.getItem("authToken")) {
      history("/login");
    }
    fetchLeadsData();
  }, [history]);
  let buttonx;
  if (formData.Answered === "false" && formData.Invalid_Number === "false") {
    buttonx = (
      <Button
        variant="contained"
        endIcon={<SendIcon />}
        sx={{
          margin: 2,
        }}
        onClick={(e) => {
          if (hourSet !== "noanswer") {
            callBackAfterHoursFunction(hourSet);
          } else {
            updateLeadFunction(e);
          }
        }}
      >
        {hourSet !== "noanswer" ? (
          <>Click to call back after {hourSet} hour</>
        ) : (
          <>this is the 4th attempt click to not call again</>
        )}
      </Button>
    );
  } else {
    buttonx = !loading ? (
      <Button
        variant="contained"
        href="/dashboard/calls"
        endIcon={<SendIcon />}
        sx={{
          margin: 2,
        }}
        onClick={updateLeadFunction}
      >
        Submit
      </Button>
    ) : (
      <div className="loading">
        <Box sx={{ display: "flex" }}>
          <CircularProgress />
        </Box>
      </div>
    );
  }

  return leadsData ? (
    leadsData.map((elem) => {
      return (
        <div className="calls-page-main">
          <div className="calls-page-details" key={elem._id}>
            <h2>contact details</h2>
            <table>
              <tbody>
                <tr>
                  <td className="table-name">No:</td>
                  <td>{elem.No}</td>
                </tr>
                <tr>
                  <td className="table-name">Name:</td>
                  <td>{elem.Name}</td>
                </tr>
                <tr>
                  <td className="table-name">
                    {" "}
                    <input
                      type="radio"
                      id="Phone_Number"
                      name="valid_number"
                      value="Phone_Number"
                      onClick={(e) => {
                        setValidNumber(elem.Phone_Number);
                      }}
                    ></input>{" "}
                    Phone_Number:
                  </td>
                  <td>{elem.Phone_Number}</td>
                </tr>
                <tr>
                  <td className="table-name">
                    {" "}
                    <input
                      type="radio"
                      id="Mobile_Number"
                      name="valid_number"
                      value="Mobile_Number"
                      onClick={(e) => {
                        setValidNumber(elem.Mobile_Number);
                      }}
                    ></input>{" "}
                    Mobile_Number:
                  </td>
                  <td>{elem.Mobile_Number}</td>
                </tr>
                <tr>
                  <td className="table-name">
                    {" "}
                    <input
                      type="radio"
                      id="Secondary_Number"
                      name="valid_number"
                      value="Secondary_Number"
                      onClick={(e) => {
                        setValidNumber(elem.Secondary_Number);
                      }}
                    ></input>{" "}
                    Secondary_Number:
                  </td>
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

          <div className="calls-page-questions">
            <ThemeProvider theme={themecall}>
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  is the call answered?
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={formData.Answered}
                  onClick={(e) =>
                    setFormData({ ...defaultForm, Answered: e.target.value })
                  }
                >
                  <FormControlLabel
                    value={true}
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel
                    value={false}
                    control={<Radio />}
                    label="No"
                  />
                </RadioGroup>
              </FormControl>
              {formData.Answered === "false" && (
                <FormControl>
                  <FormLabel id="demo-row-radio-buttons-group-label">
                    invalid number?
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    onChange={(e) =>
                      setFormData({
                        ...defaultForm,
                        Answered: "false",
                        Invalid_Number: e.target.value,
                      })
                    }
                  >
                    <FormControlLabel
                      value={true}
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value={false}
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </FormControl>
              )}
              {formData.Answered === "true" && (
                <FormControl
                  onChange={(e) =>
                    setFormData({
                      ...defaultForm,
                      Answered: "true",
                      leadType: e.target.checked ? "Potential" : null,
                    })
                  }
                >
                  <FormControlLabel
                    control={<Checkbox color="greencolor" />}
                    label="Potential Lead?"
                    sx={{
                      color: "#1eff00",
                    }}
                  />
                </FormControl>
              )}
              {formData.Answered === "true" &&
                formData.leadType !== "Potential" && (
                  <>
                    {formData.Answered === "true" && (
                      <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label">
                          is Owner?
                        </FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="row-radio-buttons-group"
                          value={formData.Is_Owner}
                          onChange={(e) =>
                            setFormData({
                              ...defaultForm,
                              Answered: "true",
                              Is_Owner: e.target.value,
                            })
                          }
                        >
                          <FormControlLabel
                            value={true}
                            control={<Radio />}
                            label="Yes"
                          />
                          <FormControlLabel
                            value={false}
                            control={<Radio />}
                            label="No"
                          />
                        </RadioGroup>
                      </FormControl>
                    )}
                    {formData.Answered === "true" && (
                      <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label">
                          is Busy?
                        </FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="row-radio-buttons-group"
                          value={formData.Busy}
                          onChange={(e) =>
                            setFormData({
                              ...defaultForm,
                              Answered: "true",
                              Is_Owner: formData.Is_Owner,
                              Busy: e.target.value,
                            })
                          }
                        >
                          <FormControlLabel
                            value={true}
                            control={<Radio />}
                            label="Yes"
                          />
                          <FormControlLabel
                            value={false}
                            control={<Radio />}
                            label="No"
                          />
                        </RadioGroup>
                      </FormControl>
                    )}
                    {formData.Answered === "true" && formData.Busy === "true" && (
                      <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label">
                          Call again?
                        </FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="row-radio-buttons-group"
                        >
                          <FormControlLabel
                            value={true}
                            control={<Radio />}
                            label="Yes"
                            onChange={(e) =>
                              setFormData({
                                ...defaultForm,
                                Answered: "true",
                                Is_Owner: formData.Is_Owner,
                                Busy: "true",
                                Call_Back_Later: "true",
                              })
                            }
                          />
                          <FormControlLabel
                            value={false}
                            control={<Radio />}
                            label="Not Interested"
                            onChange={(e) =>
                              setFormData({
                                ...defaultForm,
                                Answered: "true",
                                Is_Owner: formData.Is_Owner,
                                Busy: "true",
                                Not_Disturb: "true",
                              })
                            }
                          />
                        </RadioGroup>
                      </FormControl>
                    )}
                    {formData.Call_Back_Later === "true" && (
                      <>
                        <Button
                          variant="outlined"
                          onClick={handleClickOpen}
                          sx={{ margin: 2 }}
                        >
                          Click to schedule a Callback
                        </Button>
                        <Dialog
                          open={open}
                          onClose={handleClose}
                          aria-labelledby="alert-dialog-title"
                          aria-describedby="alert-dialog-description"
                        >
                          <DialogTitle id="alert-dialog-title">
                            please choose a date/time
                          </DialogTitle>
                          <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                              <TextField
                                id="datetime-local"
                                label="Next Call On"
                                type="datetime-local"
                                defaultValue="2022-01-01T10:30"
                                sx={{ width: 250, margin: 10 }}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                onChange={(e) => setTime(e.target.value)}
                              />
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={handleClose}>Close</Button>
                            <Button
                              onClick={() => {
                                callBackLaterFunction();
                                handleClose();
                              }}
                              autoFocus
                            >
                              Submit
                            </Button>
                          </DialogActions>
                        </Dialog>
                      </>
                    )}
                    {formData.Busy === "false" && formData.Is_Owner === "true" && (
                      <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label">
                          is interested?
                        </FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="row-radio-buttons-group"
                          onChange={(e) =>
                            setFormData({
                              ...defaultForm,
                              Answered: "true",
                              Is_Owner: "true",
                              Busy: "false",
                              Interested: e.target.value,
                            })
                          }
                        >
                          <FormControlLabel
                            value={true}
                            control={<Radio />}
                            label="Yes"
                          />
                          <FormControlLabel
                            value={false}
                            control={<Radio />}
                            label="No"
                          />
                        </RadioGroup>
                      </FormControl>
                    )}
                    {formData.Interested === "true" &&
                      formData.Is_Owner === "true" && (
                        <FormControl
                          onChange={(e) =>
                            setFormData({
                              ...defaultForm,
                              Answered: "true",
                              Is_Owner: "true",
                              Busy: "false",
                              Interested: "true",
                              leadType: e.target.checked ? "Hot" : null,
                            })
                          }
                        >
                          <FormControlLabel
                            control={<Checkbox color="hotcolor" />}
                            label="Hot Lead?"
                            sx={{
                              color: "#ff0000",
                            }}
                          />
                        </FormControl>
                      )}
                    {formData.Interested === "false" &&
                      formData.Busy === "false" &&
                      formData.Is_Owner === "true" && (
                        <FormControl>
                          <FormLabel id="demo-row-radio-buttons-group-label">
                            why not interested?
                          </FormLabel>
                          <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                          >
                            <FormControlLabel
                              value={true}
                              control={<Radio />}
                              label="Do not Call Again"
                              onChange={(e) =>
                                setFormData({
                                  ...defaultForm,
                                  Answered: "true",
                                  Is_Owner: "true",
                                  Busy: "false",
                                  Interested: "false",
                                  Not_Disturb: "true",
                                  Property_Available: null,
                                })
                              }
                            />
                            <FormControlLabel
                              value={false}
                              control={<Radio />}
                              label="Property Busy"
                              onChange={(e) =>
                                setFormData({
                                  ...defaultForm,
                                  Answered: "true",
                                  Is_Owner: "true",
                                  Busy: "false",
                                  Interested: "false",
                                  Not_Disturb: null,
                                  Property_Available: "Property Busy",
                                })
                              }
                            />
                          </RadioGroup>
                        </FormControl>
                      )}
                    {formData.Busy === "false" &&
                      formData.Is_Owner === "false" && (
                        <FormControl>
                          <FormLabel id="demo-row-radio-buttons-group-label">
                            another property?
                          </FormLabel>
                          <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            onChange={(e) =>
                              setFormData({
                                ...defaultForm,
                                Answered: "true",
                                Is_Owner: "false",
                                Busy: "false",
                                anotherProperty: e.target.value,
                              })
                            }
                          >
                            <FormControlLabel
                              value={true}
                              control={<Radio />}
                              label="Yes"
                            />
                            <FormControlLabel
                              value={false}
                              control={<Radio />}
                              label="No"
                            />
                          </RadioGroup>
                        </FormControl>
                      )}
                    {formData.anotherProperty === "true" &&
                      formData.Is_Owner === "false" && (
                        <FormControl>
                          <FormLabel id="demo-row-radio-buttons-group-label">
                            Owner?
                          </FormLabel>
                          <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            onChange={(e) =>
                              setFormData({
                                ...defaultForm,
                                Answered: "true",
                                Is_Owner: "false",
                                Busy: "false",
                                anotherProperty: "true",
                                anotherPropertyOwner: e.target.value,
                              })
                            }
                          >
                            <FormControlLabel
                              value={true}
                              control={<Radio />}
                              label="Yes"
                            />
                            <FormControlLabel
                              value={false}
                              control={<Radio />}
                              label="No"
                            />
                          </RadioGroup>
                        </FormControl>
                      )}
                    {formData.Busy === "false" &&
                      formData.anotherPropertyOwner === "true" && (
                        <FormControl>
                          <FormLabel id="demo-row-radio-buttons-group-label">
                            is interested?
                          </FormLabel>
                          <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            onChange={(e) =>
                              setFormData({
                                ...defaultForm,
                                Answered: "true",
                                Is_Owner: "false",
                                Busy: "false",
                                anotherProperty: "true",
                                anotherPropertyOwner: "true",
                                Interested: e.target.value,
                              })
                            }
                          >
                            <FormControlLabel
                              value={true}
                              control={<Radio />}
                              label="Yes"
                            />
                            <FormControlLabel
                              value={false}
                              control={<Radio />}
                              label="No"
                            />
                          </RadioGroup>
                        </FormControl>
                      )}
                    {formData.Interested === "true" &&
                      formData.anotherPropertyOwner === "true" && (
                        <FormControl>
                          <FormLabel id="demo-row-radio-buttons-group-label">
                            Sell or Lease?
                          </FormLabel>
                          <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            onChange={(e) =>
                              setFormData({
                                ...defaultForm,
                                Answered: "true",
                                Is_Owner: "false",
                                Busy: "false",
                                anotherProperty: "true",
                                anotherPropertyOwner: "true",
                                Interested: "true",
                                Intersted_For: e.target.value,
                              })
                            }
                          >
                            <FormControlLabel
                              value={"Sell"}
                              control={<Radio />}
                              label="Sell"
                            />
                            <FormControlLabel
                              value={"Lease"}
                              control={<Radio />}
                              label="Lease"
                            />
                          </RadioGroup>
                        </FormControl>
                      )}
                    {formData.Interested === "false" &&
                      formData.anotherPropertyOwner === "true" && (
                        <FormControl>
                          <FormLabel id="demo-row-radio-buttons-group-label">
                            why not interested?
                          </FormLabel>
                          <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                          >
                            <FormControlLabel
                              value={true}
                              control={<Radio />}
                              label="Do not Call Again"
                              onChange={(e) =>
                                setFormData({
                                  ...defaultForm,
                                  Answered: "true",
                                  Is_Owner: "false",
                                  Busy: "false",
                                  anotherProperty: "true",
                                  anotherPropertyOwner: "true",
                                  Interested: "false",
                                  Not_Disturb: "true",
                                  Property_Available: null,
                                })
                              }
                            />
                            <FormControlLabel
                              value={false}
                              control={<Radio />}
                              label="Property Busy"
                              onChange={(e) =>
                                setFormData({
                                  ...defaultForm,
                                  Answered: "true",
                                  Is_Owner: "false",
                                  Busy: "false",
                                  anotherProperty: "true",
                                  anotherPropertyOwner: "true",
                                  Interested: "false",
                                  Not_Disturb: null,
                                  Property_Available: "Property Busy",
                                })
                              }
                            />
                          </RadioGroup>
                        </FormControl>
                      )}
                    {formData.Interested === "true" &&
                      formData.anotherProperty === "false" && (
                        <FormControl>
                          <FormLabel id="demo-row-radio-buttons-group-label">
                            Sell or Lease?
                          </FormLabel>
                          <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            onChange={(e) =>
                              setFormData({
                                ...defaultForm,
                                Answered: "true",
                                Is_Owner: "false",
                                Busy: "false",
                                anotherProperty: "true",
                                anotherPropertyOwner: "true",
                                Interested: "true",
                                Intersted_For: e.target.value,
                              })
                            }
                          >
                            <FormControlLabel
                              value={"Sell"}
                              control={<Radio />}
                              label="Sell"
                            />
                            <FormControlLabel
                              value={"Lease"}
                              control={<Radio />}
                              label="Lease"
                            />
                          </RadioGroup>
                        </FormControl>
                      )}
                    {formData.anotherProperty === "false" && (
                      <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label">
                          interested to buy or rent a property?
                        </FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="row-radio-buttons-group"
                        >
                          <FormControlLabel
                            value={"Buy"}
                            control={<Radio />}
                            label="Buy"
                            onClick={(e) =>
                              setFormData({
                                ...defaultForm,
                                Answered: "true",
                                Is_Owner: "false",
                                Busy: "false",
                                anotherProperty: "false",
                                Intersted_For: "Buy",
                              })
                            }
                          />
                          <FormControlLabel
                            value={"Rent"}
                            control={<Radio />}
                            label="Rent"
                            onClick={(e) =>
                              setFormData({
                                ...defaultForm,
                                Answered: "true",
                                Is_Owner: "false",
                                Busy: "false",
                                anotherProperty: "false",
                                Intersted_For: "Rent",
                              })
                            }
                          />
                          <FormControlLabel
                            value={"Not Interested"}
                            control={<Radio />}
                            label="Not Interested"
                            onClick={(e) =>
                              setFormData({
                                ...defaultForm,
                                Answered: "true",
                                Is_Owner: "false",
                                Busy: "false",
                                anotherProperty: "false",
                                Intersted_For: null,
                                Interested: false,
                              })
                            }
                          />
                        </RadioGroup>
                      </FormControl>
                    )}
                    {formData.Interested === "true" &&
                      formData.anotherProperty === "true" && (
                        <FormControl
                          onChange={(e) =>
                            setFormData({
                              ...defaultForm,
                              Answered: "true",
                              Is_Owner: "false",
                              Busy: "false",
                              anotherProperty: "true",
                              anotherPropertyOwner: "true",
                              Interested: "true",
                              Intersted_For: formData.Intersted_For,
                              leadType: e.target.checked ? "Hot" : null,
                            })
                          }
                        >
                          <FormControlLabel
                            checked={formData.leadType}
                            control={<Checkbox color="hotcolor" />}
                            label="Hot Lead?"
                            sx={{
                              color: "#ff0000",
                            }}
                          />
                        </FormControl>
                      )}
                  </>
                )}
              <TextField
                id="filled-multiline-static"
                label="Note"
                value={note}
                multiline
                rows={8}
                placeholder="please take a note here"
                variant="filled"
                sx={{ width: "90%", margin: 1 }}
                onChange={(e) => setNote(e.target.value)}
              />
              {error && (
                <div
                  style={{
                    backgroundColor: "red",
                    padding: 5,
                  }}
                >
                  {error}
                </div>
              )}{" "}
              {buttonx}
              <Button
                variant="outlined"
                onClick={handleClickOpen}
                sx={{ margin: 2 }}
              >
                Click to schedule a Callback
              </Button>
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  please choose a date/time
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    <TextField
                      id="datetime-local"
                      label="Next Call On"
                      type="datetime-local"
                      defaultValue="2022-01-01T10:30"
                      sx={{ marginRight: 30 }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={(e) => setTime(e.target.value)}
                    />
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Close</Button>
                  <Button
                    onClick={() => {
                      callBackLaterFunction();
                      handleClose();
                    }}
                    autoFocus
                  >
                    Submit
                  </Button>
                </DialogActions>
              </Dialog>
            </ThemeProvider>
            <AgentAssignLead leadsData={leadsData} fetchLeadsData={fetchLeadsData} />
          </div>
        </div>
      );
    })
  ) : (
    <div>{error}</div>
  );
};

export default CallsPage;
