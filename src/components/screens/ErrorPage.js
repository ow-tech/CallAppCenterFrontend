import React from "react";
import "./ErrorPage.css";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const history = useNavigate();
  return <div className="error-screen" onClick={() => history("/login")}>ERROR 404! PAGE NOT FOUND</div>;
};
export default ErrorPage;
