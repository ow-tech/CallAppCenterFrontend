import React from "react";
import axios from "axios";
import Lottie from "lottie-react";
import animationData from "./lotties/done";
import { useState } from "react";

import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import "./UploadPage.css";

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [message, setMessage] = React.useState(null);
  const [loading, setLoading] = useState(false);

  const animationDefaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleUploadSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("xlsx", selectedFile);
    try {
      setLoading(true);
      const { data } = await axios({
        method: "post",
        url: "/api/upload",
        data: formData,
        headers: {
          enctype: "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (data.success) {
        setLoading(false);
      }
      setMessage(data);
      setTimeout(() => {
        setMessage("");
      }, 5000);
    } catch (error) {
      setMessage(error.response.data);
      setLoading(false);
      setTimeout(() => {
        setMessage("");
      }, 5000);
    }
  };

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const downloadDatabse = async (e) => {
    e.preventDefault();
    try {
      await axios({
        url: "/api/download",
        method: "GET",
        responseType: "blob", // important
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "file.xlsx"); //or any other extension
        document.body.appendChild(link);
        link.click();
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="upload-page">
        <form onSubmit={handleUploadSubmit}>
          <input type="file" onChange={handleFileSelect} />
          {!loading ? (
            <button type="submit" className="btn btn-primary">
              Clich Here to Upload The File
            </button>
          ) : (
            <div className="loading">
              <Box sx={{ display: "flex" }}>
                <CircularProgress />
              </Box>
            </div>
          )}
          {message && (
            <div
              style={{
                backgroundColor: message.success ? "" : "red",
                margin: 20,
                color: "black",
              }}
            >
              <b>{message.success.toString()}:</b> {message.message}
              {message.success && (
                <div>
                  <Lottie
                    options={animationDefaultOptions}
                    height={400}
                    width={400}
                  />
                </div>
              )}
            </div>
          )}
        </form>
      </div>
      <div className="box">
        <Button variant="contained" onClick={downloadDatabse}>
          Export Database
        </Button>
      </div>
    </>
  );
};

export default UploadPage;
