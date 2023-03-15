import { useState } from "react";
import axios from "axios";
import "./RegisterPage.css";

const RegisterScreen = () => {
  const [kind, setKind] = useState("");
  const [username, setUsername] = useState("");
  const [valcomID, setValcomID] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState(null);
  const [error, setError] = useState("");

  const registerHandler = async (e) => {
    e.preventDefault();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };

    if (password !== confirmpassword) {
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setError("");
      }, 5000);
      return setError("Passwords do not match");
    }

    try {
      let { data } = await axios.post(
        "/api/auth/register",
        {
          username,
          email,
          password,
          kind,
          valcomID,
        },
        config
      );
      setMessage(data);
      setTimeout(() => {
        setMessage("");
      }, 5000);
    } catch (error) {
      setError(error.response.data.message);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  return (
    <div className="register-screen">
      <form onSubmit={registerHandler} className="register-screen__form">
        <h3 className="register-screen__title">Register</h3>
        {error && <span className="error-message">{error}</span>}
        <div className="form-group">
          <label htmlFor="name">category:</label>
          <select
            className="select-button"
            name="kind"
            id="kind"
            onChange={(e) => setKind(e.target.value)}
          >
            <option>please select a category</option>
            <option>admin</option>
            <option>manager</option>
            <option>callCenterAgent</option>
            <option>propertyAgent</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="name">Username:</label>
          <input
            type="text"
            required
            id="name"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Valcom ID:</label>
          <input
            type="text"
            id="valcomID"
            placeholder="Enter Valcom ID"
            value={valcomID}
            onChange={(e) => setValcomID(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            required
            id="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            required
            id="password"
            autoComplete="true"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmpassword">Confirm Password:</label>
          <input
            type="password"
            required
            id="confirmpassword"
            autoComplete="true"
            placeholder="Confirm password"
            value={confirmpassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Register
        </button>
        {message && (
          <div
            style={{
              backgroundColor: message.success ? "green" : "red",
              margin: 20,
              color: "black",
            }}
          >
            <b>{message.success.toString()}:</b> {message.message}
          </div>
        )}
      </form>
    </div>
  );
};

export default RegisterScreen;
